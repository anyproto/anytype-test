import { spawn, ChildProcess } from "child_process";
import { store } from "../helpers/store"; // Import your store

class GRPCServerManager {
  constructor(
    private binPath: string,
    private workingDir: string,
    private version: string
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
        output += data.toString();
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
        const logMessage = data.toString();
        // Only log stderr messages that don't come from anytype-doc-indexer
        if (!logMessage.includes('"logger":"anytype-doc-indexer"')) {
          console.error(`stderr: ${logMessage}`);
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
    server.process.kill();
    console.log(`Server process at ${server.address} killed`);
    store.servers.delete(serverNumber);
  } else {
    console.warn(`No server process found for server number ${serverNumber}`);
  }
}

export { GRPCServerManager };
