import { act, fireEvent, render, screen } from "@testing-library/react-native";

import { ConnectionPanel } from "@/components/connection-panel";
import { checkConnection, type HealthResult } from "@/lib/health";

jest.mock("@/lib/health", () => ({ checkConnection: jest.fn() }));
const checkMock = jest.mocked(checkConnection);

beforeEach(() => checkMock.mockReset());

test("waits for user intent and labels simulated results", async () => {
  checkMock.mockResolvedValue({ status: "ok", source: "demo" });
  await render(<ConnectionPanel />);
  expect(checkMock).not.toHaveBeenCalled();
  await fireEvent.press(
    screen.getByRole("button", { name: "Check connection" })
  );
  expect(await screen.findByText("Demo is ready")).toBeVisible();
  expect(
    screen.getByText("Simulated response. No network request was made.")
  ).toBeVisible();
});

test("shows loading, prevents duplicate requests, and reports API success", async () => {
  let resolve!: (value: HealthResult) => void;
  checkMock.mockReturnValue(
    new Promise((done) => {
      resolve = done;
    })
  );
  await render(<ConnectionPanel />);
  await fireEvent.press(
    screen.getByRole("button", { name: "Check connection" })
  );
  const button = screen.getByRole("button", { name: "Checking…" });
  expect(button).toBeDisabled();
  await fireEvent.press(button);
  expect(checkMock).toHaveBeenCalledTimes(1);
  await act(async () => resolve({ status: "ok", source: "api" }));
  expect(screen.getByText("Connected")).toBeVisible();
  expect(screen.getByRole("button", { name: "Check again" })).toBeEnabled();
});

test("offers a working retry after a failure", async () => {
  checkMock.mockRejectedValueOnce(
    new Error("Connection timed out. Please try again.")
  );
  checkMock.mockResolvedValueOnce({ status: "ok", source: "api" });
  await render(<ConnectionPanel />);
  await fireEvent.press(
    screen.getByRole("button", { name: "Check connection" })
  );
  expect(await screen.findByText("Unable to connect")).toBeVisible();
  expect(
    screen.getByText("Connection timed out. Please try again.")
  ).toBeVisible();
  await fireEvent.press(screen.getByRole("button", { name: "Try again" }));
  expect(await screen.findByText("Connected")).toBeVisible();
  expect(checkMock).toHaveBeenCalledTimes(2);
});

test("cancels pending work when the screen unmounts", async () => {
  let signal!: AbortSignal;
  let resolve!: (value: HealthResult) => void;
  checkMock.mockImplementation((requestSignal) => {
    signal = requestSignal;
    return new Promise((done) => {
      resolve = done;
    });
  });
  await render(<ConnectionPanel />);
  await fireEvent.press(
    screen.getByRole("button", { name: "Check connection" })
  );
  expect(signal.aborted).toBe(false);
  await screen.unmount();
  expect(signal.aborted).toBe(true);
  await act(async () => resolve({ status: "ok", source: "api" }));
});
