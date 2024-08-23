import { spawn, ChildProcess } from "child_process";

interface ServerInfo {
  process: ChildProcess;
  address: string;
}

class GRPCServerManager {
  private servers: Map<number, ServerInfo> = new Map();

  constructor(private binPath: string, private workingDir: string) {}

  public startServer(): Promise<string> {
    return new Promise((resolve, reject) => {
      const serverProcess = spawn(
        "go",
        ["run", "-tags", "noauth", this.binPath],
        {
          cwd: this.workingDir,
          env: {
            ...process.env,
            ANYTYPE_GRPC_ADDR: "127.0.0.1:0",
            ANYTYPE_GRPCWEB_ADDR: "127.0.0.1:0",
          }, // Ensures dynamic port assignment
        }
      );

      let output = "";

      const onData = (data: Buffer) => {
        output += data.toString();
        const match = output.match(
          /gRPC server started at: (\d+\.\d+\.\d+\.\d+:\d+)/
        );
        if (match) {
          const address = match[1];
          serverProcess.stdout.removeListener("data", onData);
          this.servers.set(serverProcess.pid!, {
            process: serverProcess,
            address,
          });
          resolve(address);
        }
      };

      serverProcess.stdout.on("data", onData);
      serverProcess.stderr.on("data", (data) => {
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

  public stopServer(pid: number): void {
    const serverInfo = this.servers.get(pid);
    if (serverInfo) {
      serverInfo.process.kill();
      this.servers.delete(pid);
    }
  }

  public stopAllServers(): void {
    this.servers.forEach(({ process }) => {
      process.kill();
    });
    this.servers.clear();
  }

  public getServerPidByAddress(address: string): number | undefined {
    for (const [pid, serverInfo] of this.servers.entries()) {
      if (serverInfo.address === address) {
        return pid;
      }
    }
    return undefined;
  }
}

export { GRPCServerManager };
