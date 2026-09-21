export type ConnectionConfig =
  { mode: "demo" } | { mode: "api"; baseUrl: string };

type PublicEnvironment = { mode?: string; apiUrl?: string };

export function readConnectionConfig({
  mode = "demo",
  apiUrl,
}: PublicEnvironment): ConnectionConfig {
  if (mode === "demo") return { mode: "demo" };
  if (mode !== "api") {
    throw new Error("EXPO_PUBLIC_API_MODE must be demo or api.");
  }
  if (!apiUrl?.trim()) {
    throw new Error("Set EXPO_PUBLIC_API_URL to use api mode.");
  }

  let url: URL;
  try {
    url = new URL(apiUrl.trim());
  } catch {
    throw new Error("EXPO_PUBLIC_API_URL must be an absolute HTTP(S) URL.");
  }
  if (
    !["http:", "https:"].includes(url.protocol) ||
    !url.hostname ||
    url.username ||
    url.password ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      "EXPO_PUBLIC_API_URL must use HTTP(S) without credentials, query, or fragment."
    );
  }

  return { mode: "api", baseUrl: url.toString().replace(/\/+$/, "") };
}

export function getConnectionConfig(): ConnectionConfig {
  // Expo only inlines public environment variables accessed with dot notation.
  return readConnectionConfig({
    mode: process.env.EXPO_PUBLIC_API_MODE,
    apiUrl: process.env.EXPO_PUBLIC_API_URL,
  });
}
