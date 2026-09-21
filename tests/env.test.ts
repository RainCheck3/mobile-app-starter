import { readConnectionConfig } from "@/config/env";

test("starts in explicit offline demo mode without configuration", () => {
  expect(readConnectionConfig({})).toEqual({ mode: "demo" });
  expect(readConnectionConfig({ mode: "demo", apiUrl: "ignored" })).toEqual({
    mode: "demo",
  });
});

test("preserves an API base path while normalizing trailing slashes", () => {
  expect(
    readConnectionConfig({ mode: "api", apiUrl: " https://example.com/v1/// " })
  ).toEqual({ mode: "api", baseUrl: "https://example.com/v1" });
});

test("permits HTTP for local development", () => {
  expect(
    readConnectionConfig({ mode: "api", apiUrl: "http://192.168.1.10:8000" })
  ).toEqual({ mode: "api", baseUrl: "http://192.168.1.10:8000" });
});

test.each([undefined, "", "  "])(
  "api mode never silently becomes demo: %s",
  (apiUrl) => {
    expect(() => readConnectionConfig({ mode: "api", apiUrl })).toThrow(
      "Set EXPO_PUBLIC_API_URL"
    );
  }
);

test.each([
  "localhost:8000",
  "/api",
  "ftp://example.com",
  "https://user:secret@example.com",
  "https://example.com?token=secret",
  "https://example.com#fragment",
])("rejects an invalid public API URL: %s", (apiUrl) => {
  expect(() => readConnectionConfig({ mode: "api", apiUrl })).toThrow();
});

test.each(["", "live", "DEMO"])("rejects unsupported mode: %s", (mode) => {
  expect(() => readConnectionConfig({ mode })).toThrow("must be demo or api");
});
