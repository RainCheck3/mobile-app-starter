import { checkHealth } from "@/lib/health";

const api = { mode: "api", baseUrl: "https://example.com/v1" } as const;
let fetchMock: jest.SpyInstance;

beforeEach(() => {
  fetchMock = jest.spyOn(globalThis, "fetch");
  // Unexpected requests must fail rather than reaching a real network.
  fetchMock.mockRejectedValue(new Error("Unexpected fetch"));
});

afterEach(() => {
  jest.restoreAllMocks();
  jest.useRealTimers();
});

function response(body: unknown, status = 200) {
  return { ok: status >= 200 && status < 300, status, json: async () => body };
}

test("demo is deterministic and never calls the network", async () => {
  await expect(checkHealth({ mode: "demo" })).resolves.toEqual({
    status: "ok",
    source: "demo",
  });
  expect(fetchMock).not.toHaveBeenCalled();
});

test("accepts the api-starter health contract at the configured base path", async () => {
  fetchMock.mockResolvedValue(response({ status: "ok" }));
  await expect(checkHealth(api)).resolves.toEqual({
    status: "ok",
    source: "api",
  });
  expect(fetchMock).toHaveBeenCalledWith("https://example.com/v1/health", {
    headers: { Accept: "application/json" },
    signal: expect.any(AbortSignal),
  });
});

test("reports an HTTP failure without exposing response content", async () => {
  fetchMock.mockResolvedValue(
    response({ detail: "private server diagnostics" }, 503)
  );
  await expect(checkHealth(api)).rejects.toThrow("API returned HTTP 503.");
});

test.each([null, [], "ok", {}, { status: "down" }])(
  "validates an untrusted API response: %p",
  async (body) => {
    fetchMock.mockResolvedValue(response(body));
    await expect(checkHealth(api)).rejects.toThrow(
      "unexpected health response"
    );
  }
);

test("handles malformed JSON", async () => {
  fetchMock.mockResolvedValue({
    ok: true,
    json: async () => {
      throw new SyntaxError("server internals");
    },
  });
  await expect(checkHealth(api)).rejects.toThrow("API returned invalid JSON.");
});

test("turns network errors into a retryable message", async () => {
  fetchMock.mockRejectedValue(new TypeError("internal network details"));
  await expect(checkHealth(api)).rejects.toThrow("Could not reach the API.");
});

function stallUntilAborted() {
  fetchMock.mockImplementation(
    (_url: string, options: RequestInit) =>
      new Promise((_resolve, reject) => {
        options.signal?.addEventListener("abort", () =>
          reject(new Error("aborted"))
        );
      })
  );
}

test("aborts slow requests after eight seconds and clears its timer", async () => {
  jest.useFakeTimers();
  stallUntilAborted();
  const pending = expect(checkHealth(api)).rejects.toThrow(
    "Connection timed out."
  );
  await jest.advanceTimersByTimeAsync(8000);
  await pending;
  expect(jest.getTimerCount()).toBe(0);
});

test("cancels an in-flight request when its caller leaves", async () => {
  jest.useFakeTimers();
  stallUntilAborted();
  const controller = new AbortController();
  const pending = expect(checkHealth(api, controller.signal)).rejects.toThrow(
    "Request cancelled."
  );
  controller.abort();
  await pending;
  expect(jest.getTimerCount()).toBe(0);
});

test("does not send a request when already cancelled", async () => {
  const controller = new AbortController();
  controller.abort();
  await expect(checkHealth(api, controller.signal)).rejects.toThrow(
    "Request cancelled."
  );
  expect(fetchMock).not.toHaveBeenCalled();
});

test("cleans up timeout after success", async () => {
  jest.useFakeTimers();
  fetchMock.mockResolvedValue(response({ status: "ok" }));
  await checkHealth(api);
  expect(jest.getTimerCount()).toBe(0);
});
