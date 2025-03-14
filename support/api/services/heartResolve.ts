import path from "path";
import fs from "fs/promises"; // Import the promises API for the fs module

export async function heartResolve(heartVersion: string) {
  let binPath: string;
  let workingDir: string;

  switch (true) {
    case heartVersion === "default":
      // Construct binPath and workingDir using __dirname to make them relative to the current script's location
      binPath = path.resolve(
        __dirname,
        "../../../mw/anytype-heart/cmd/grpcserver"
      );
      workingDir = path.resolve(__dirname, "../../../mw/anytype-heart");
      break;

    case heartVersion.startsWith("v0"):
      // Extract the version part after "v"
      const versionNumber = heartVersion.slice(1); // "0.33.7"
      const versionFolderPath = path.resolve(
        __dirname,
        `../../../heartsFolder/${versionNumber}`
      );

      // Check if the versionFolderPath exists
      try {
        await fs.access(versionFolderPath);
      } catch (error) {
        throw new Error(
          "Middleware version is not downloaded, checked Folder: " +
            versionFolderPath
        );
      }

      binPath = path.resolve(versionFolderPath, "grpc-server");
      workingDir = path.resolve(versionFolderPath);
      break;

    default:
      throw new Error(`Unknown heart version: ${heartVersion}`);
  }

  return { binPath, workingDir };
}
