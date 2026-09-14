import { describe, it, expect, vi, beforeEach } from "vitest";
import { invoke } from "@tauri-apps/api/core";
import { pingUrl, pingWithFallback } from "@/lib/ping";

vi.mock("@tauri-apps/api/core", () => ({
  invoke: vi.fn(),
}));

const mockedInvoke = vi.mocked(invoke);

beforeEach(() => {
  vi.resetAllMocks();
});

describe("pingUrl", () => {
  it("returns ms when invoke resolves", async () => {
    mockedInvoke.mockResolvedValue(42);
    const ms = await pingUrl("https://example.com");
    expect(ms).toBe(42);
  });

  it("returns null when invoke rejects", async () => {
    mockedInvoke.mockRejectedValue(new Error("Network error"));
    const ms = await pingUrl("https://example.com");
    expect(ms).toBeNull();
  });

  it("passes correct arguments to invoke", async () => {
    mockedInvoke.mockResolvedValue(42);
    const url = "https://example.com";
    await pingUrl(url);
    expect(mockedInvoke).toHaveBeenCalledOnce();
    expect(mockedInvoke).toHaveBeenCalledWith("ping_url", { url });
  });
});

describe("pingWithFallback", () => {
  it("returns first successful ping", async () => {
    mockedInvoke
      .mockRejectedValueOnce(new Error("fail"))
      .mockResolvedValueOnce(87);
    const ms = await pingWithFallback([
      "https://primary.com",
      "https://fallback.com",
    ]);
    expect(ms).toBe(87);
    expect(mockedInvoke).toHaveBeenCalledTimes(2);
  });

  it("returns null when all URLs fail", async () => {
    mockedInvoke.mockRejectedValue(new Error("fail"));
    const ms = await pingWithFallback([
      "https://a.com",
      "https://b.com",
    ]);
    expect(ms).toBeNull();
    expect(mockedInvoke).toHaveBeenCalledTimes(2);
  });

  it("returns null for empty array", async () => {
    const ms = await pingWithFallback([]);
    expect(ms).toBeNull();
    expect(mockedInvoke).not.toHaveBeenCalled();
  });

  it("short-circuits on first success", async () => {
    mockedInvoke.mockResolvedValue(42);
    const ms = await pingWithFallback([
      "https://a.com",
      "https://b.com",
      "https://c.com",
    ]);
    expect(ms).toBe(42);
    expect(mockedInvoke).toHaveBeenCalledOnce();
  });
});
