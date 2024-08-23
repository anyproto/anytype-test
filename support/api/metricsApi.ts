import { getCurrentClient } from "../client";

export function callMetricsSetParameters() {
  console.log(`### calling method "setMetrics"...`);
  const client = getCurrentClient();
  const call = client.metricsSetParameters(
    {
      platform: "test",
      version: "0.0.1",
    },
    (err, value) => {
      if (err) {
        console.log("got err: ", err);
      }
      if (value) {
        console.log("got response message: ", value);
      }
    }
  );

  call.on("metadata", (arg1) => {
    console.log("got response headers: ", arg1);
  });

  return new Promise<void>((resolve) => {
    call.on("status", () => resolve());
  });
}
