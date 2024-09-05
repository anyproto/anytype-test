import { spawn, ChildProcess } from "child_process";
import { store } from "./helpers/store"; // Import your store

class GRPCServerManager {
  constructor(
    private binPath: string,
    private workingDir: string,
    private version: string
  ) {}

  public async startServer(serverNumber: number): Promise<string> {
    return new Promise((resolve, reject) => {
      let serverProcess: ChildProcess;

      // Conditional command execution based on version
      if (this.version === "default") {
        serverProcess = spawn("go", ["run", "-tags", "noauth", this.binPath], {
          cwd: this.workingDir,
          env: {
            ...process.env,
            ANYTYPE_GRPC_ADDR: "127.0.0.1:0",
            ANYTYPE_GRPCWEB_ADDR: "127.0.0.1:0",
          }, // Ensures dynamic port assignment
        });
      } else {
        serverProcess = spawn("./grpc-server", [], {
          cwd: this.workingDir,
          env: {
            ...process.env,
            // Uncomment for DEBUG
            //ANYTYPE_GRPC_LOG: "3",
            //ANYTYPE_LOG_LEVEL: "info",
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
        console.error(`stderr: ${data}`);
      });

      serverProcess.on("error", (err) => {
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
