import { spawn, ChildProcess } from "child_process";
import { store } from "../helpers/store"; // Import your store

class GRPCServerManager {
  constructor(
    private binPath: string,
    private workingDir: string,
    private version: string,
    private scenarioName: string,
  ) {}

  public async startServer(serverNumber: number): Promise<string> {
    return new Promise((resolve, reject) => {
      let serverProcess: ChildProcess;

      console.log(
        `Starting server ${serverNumber} with version: ${this.version}`
      );
      console.log(`Working directory: ${this.workingDir}`);
      console.log(`Binary path: ${this.binPath}`);

      // Conditional command execution based on version
      if (this.version === "default") {
        console.log("Executing default version command: go run -tags noauth");
        serverProcess = spawn("go", ["run", "-tags", "noauth", this.binPath], {
          cwd: this.workingDir,
          detached: true,
          env: {
            ...process.env,
            // ANYTYPE_GRPC_LOG: "3",
            // ANYTYPE_LOG_LEVEL: "info",
            ANYTYPE_GRPC_ADDR: "127.0.0.1:0",
            ANYTYPE_GRPCWEB_ADDR: "127.0.0.1:0",
          }, // Ensures dynamic port assignment
        });
      } else {
        console.log("Executing non-default version command: ./grpc-server");
        serverProcess = spawn("./grpc-server", [], {
          cwd: this.workingDir,
          env: {
            ...process.env,
            // Uncomment next 2 lines for DEBUG
            // ANYTYPE_GRPC_LOG: "3",
            // ANYTYPE_LOG_LEVEL: "info",
            ANYTYPE_GRPC_ADDR: "127.0.0.1:0",
            ANYTYPE_GRPCWEB_ADDR: "127.0.0.1:0",
          }, // Ensures dynamic port assignment
        });
      }

      let output = "";

      const onData = (data: Buffer) => {
        const text = data.toString();
        console.log(`[${this.scenarioName}] stdout: ${text}`);
        output += text;
        const match = output.match(
          /gRPC server started at: (\d+\.\d+\.\d+\.\d+:\d+)/
        );
        if (match) {
          const address = match[1];
          serverProcess.stdout?.removeListener("data", onData);

          // Store the server information in the store
          store.servers.set(serverNumber, {
            address,
            process: serverProcess,
            version: this.version,
          });

          resolve(address);
        }
      };

      serverProcess.stdout?.on("data", onData);
      serverProcess.stderr?.on("data", (data) => {
        const text = data.toString();
        // Only log stderr messages that don't come from anytype-doc-indexer
        if (!text.includes('"logger":"anytype-doc-indexer"')) {
          console.error(`[${this.scenarioName}, Server ${serverNumber}] stderr: ${text}`);
        }
      });

      serverProcess.on("error", (err) => {
        console.error(`Error starting server ${serverNumber}:`, err);
        reject(err);
      });

      serverProcess.on("close", (code) => {
        if (code !== 0) {
          reject(new Error(`Server process exited with code ${code}`));
        }
      });
    });
  }
}

export function stopServer(serverNumber: number): void {
  const server = store.servers.get(serverNumber);

  if (server && server.process) {
    try {
      // Attempt to gracefully terminate the process
      console.log(`Attempting to stop server process at ${server.address}`);
      if (server.process.pid) {
        console.log("Killing server process with PID:", server.process.pid);
        process.kill(-server.process.pid, "SIGTERM");
      } else {
        console.warn("Server process PID is undefined");
      }

      // Wait for a short period to allow graceful shutdown
      setTimeout(() => {
        if (!server.process.killed) {
          console.warn(`Server process at ${server.address} did not terminate gracefully, forcing shutdown`);
          // Forcefully kill the process if it's still running
          server.process.kill("SIGKILL");
        }
      }, 5000); // Wait 5 seconds before forcing shutdown

      console.log(`Server process at ${server.address} killed`);
      store.servers.delete(serverNumber);
    } catch (error) {
      console.error(`Failed to stop server process at ${server.address}:`, error);
    }
  } else {
    console.warn(`No server process found for server number ${serverNumber}`);
  }
}

export { GRPCServerManager };
