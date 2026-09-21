import { getConnectionConfig, type ConnectionConfig } from "@/config/env";

export type HealthResult = { status: "ok"; source: "demo" | "api" };

class HealthCheckError extends Error {}

export async function checkHealth(
  config: ConnectionConfig,
  signal?: AbortSignal
): Promise<HealthResult> {
  if (signal?.aborted) throw new Error("Request cancelled.");
  if (config.mode === "demo") return { status: "ok", source: "demo" };

  const controller = new AbortController();
  const cancel = () => controller.abort();
  signal?.addEventListener("abort", cancel, { once: true });
  let timedOut = false;
  const timeout = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, 8000);

  try {
    const response = await fetch(`${config.baseUrl}/health`, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new HealthCheckError(`API returned HTTP ${response.status}.`);
    }
    const body: unknown = await response.json();
    if (
      !body ||
      typeof body !== "object" ||
      !("status" in body) ||
      body.status !== "ok"
    ) {
      throw new HealthCheckError("API returned an unexpected health response.");
    }
    return { status: "ok", source: "api" };
  } catch (error) {
    if (signal?.aborted) throw new Error("Request cancelled.");
    if (timedOut) throw new Error("Connection timed out. Please try again.");
    if (error instanceof HealthCheckError) throw error;
    if (error instanceof SyntaxError) {
      throw new Error("API returned invalid JSON.");
    }
    throw new Error(
      "Could not reach the API. Check your connection and try again."
    );
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener("abort", cancel);
  }
}

export function checkConnection(signal: AbortSignal): Promise<HealthResult> {
  return checkHealth(getConnectionConfig(), signal);
}
