import { getCurrentClient } from "../../helpers/proxy";
import { makeGrpcCall } from "../services/utils";
import {
  Rpc_Initial_SetParameters_Request,
  Rpc_Initial_SetParameters_Response,
  Rpc_Metrics_SetParameters_Request,
  Rpc_Metrics_SetParameters_Response,
} from "../../../pb/pb/protos/commands";
import { store } from "../../helpers/store";

export async function callMetricsSetParameters(): Promise<void> {
  console.log(`### calling method "setMetrics"...`);

  const request: Rpc_Metrics_SetParameters_Request = {
    platform: "test",
    version: "0.0.1",
  };

  try {
    const response = await makeGrpcCall<Rpc_Metrics_SetParameters_Response>(
      getCurrentClient().metricsSetParameters,
      request
    );
    console.log("Metrics parameters set successfully:", response);
  } catch (error) {
    console.error("Failed to set metrics parameters:", error);
    throw error;
  }
}

export async function callInitialSetParameters(): Promise<void> {
  console.log(`### calling method "Initial_SetParameters"...`);
  if (!store.tempDir) {
    throw new Error("store.tempDir is undefined");
  }
  const request: Rpc_Initial_SetParameters_Request = {
    platform: "test",
    version: "0.0.1",
    workdir: store.tempDir,
    logLevel: "INFO",
    doNotSendLogs: true,
    doNotSaveLogs: false,
    doNotSendTelemetry: true,
  };

  try {
    const response = await makeGrpcCall<Rpc_Initial_SetParameters_Response>(
      getCurrentClient().initialSetParameters,
      request
    );
    console.log("Initial parameters set successfully:", response);
  } catch (error) {
    console.error("Failed to set initial parameters:", error);
    throw error;
  }
}
