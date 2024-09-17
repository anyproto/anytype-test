import { getCurrentClient } from "../client";
import { makeGrpcCall } from "../helpers/utils";
import {
  Rpc_Metrics_SetParameters_Request,
  Rpc_Metrics_SetParameters_Response,
} from "../../pb/pb/protos/commands";

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
