"use strict";
const path = require("path");
const childProcess = require("child_process");
const fs = require("fs");

// Set the path to the Go binary based on Homebrew installation
const goBinaryPath = "/opt/homebrew/bin/go"; // or '/usr/local/bin/go' for Intel Macs

const stdoutWebProxyPrefix = "gRPC server started at: ";

class Server {
  constructor() {
    this.isRunning = false;
    this.address = null;
    this.cp = null;
    this.lastErrors = [];
    this.stopTriggered = false;
  }

  start(binPath, workingDir) {
    console.log("[Server] start", binPath, workingDir);

    const env = Object.assign({}, process.env);
    env.PATH = path.dirname(goBinaryPath) + path.delimiter + env.PATH;

    console.log("Current PATH:", env.PATH);

    let maxStdErrChunksBuffer = 10;

    return new Promise((resolve, reject) => {
      this.stop().then(() => {
        this.isRunning = false;

        try {
          // Check if Go binary exists at the specified path
          if (!fs.existsSync(goBinaryPath)) {
            console.error("Go binary not found at:", goBinaryPath);
            reject(new Error("Go binary not found"));
            return;
          }

          // Execute the Go command with the specified binPath in the given workingDir
          this.cp = childProcess.spawn(
            goBinaryPath,
            ["run", "-tags", "noauth", binPath],
            { cwd: workingDir, windowsHide: false, env }
          );
        } catch (err) {
          console.error("[Server] Process start error: ", err.toString());
          reject(err);
        }

        this.cp.on("error", (err) => {
          this.isRunning = false;
          console.error("[Server] Failed to start server: ", err.toString());
          reject(err);
        });

        this.cp.stdout.on("data", (data) => {
          const str = data.toString();

          if (
            !this.isRunning &&
            str &&
            str.indexOf(stdoutWebProxyPrefix) >= 0
          ) {
            const regex = new RegExp(stdoutWebProxyPrefix + "([^\n^s]+)");
            const match = regex.exec(str);

            if (match) {
              this.address = "http://" + match[1];
              this.isRunning = true;
              resolve(true);
            }
          }

          // Do not delete
          console.log(str);
        });

        this.cp.stderr.on("data", (data) => {
          const chunk = data.toString();

          if (chunk.length > 8000) {
            maxStdErrChunksBuffer = 1024;
          }

          if (this.lastErrors.length >= maxStdErrChunksBuffer) {
            this.lastErrors.shift();
          }

          this.lastErrors.push(chunk);
          console.warn(chunk);
        });

        this.cp.on("exit", () => {
          if (this.stopTriggered) {
            return;
          }

          this.isRunning = false;

          const log = path.join(
            workingDir,
            `crash_${new Date().toISOString().replace(/:/g, "-")}.log`
          );
          try {
            fs.writeFileSync(log, this.lastErrors.join("\n"), "utf-8");
          } catch (e) {
            console.log("[Server] Failed to save log file", log);
          }

          console.error("Server crashed. Check log file for details.");
        });
      });
    });
  }

  stop(signal = "SIGTERM") {
    return new Promise((resolve) => {
      if (this.cp && this.isRunning) {
        this.cp.on("exit", () => {
          resolve(true);
          this.isRunning = false;
          this.cp = null;
        });

        this.stopTriggered = true;
        this.cp.kill(signal);
      } else {
        resolve();
      }
    });
  }

  getAddress() {
    return this.address;
  }

  setAddress(address) {
    this.address = address;
  }
}

module.exports = Server;
