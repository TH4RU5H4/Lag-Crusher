import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { pingUrl, pingWithFallback } from "@/lib/ping";

beforeEach(() => {
  vi.stubGlobal("navigator", { onLine: true });
  vi.stubGlobal("performance", { now: vi.fn(() => 1000) });
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("pingUrl", () => {
  it("returns ms on successful fetch", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response()));
    const ms = await pingUrl("https://example.com/favicon.ico");
    expect(ms).toBe(0);
    expect(fetch).toHaveBeenCalledOnce();
  });

  it("returns null when offline", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    vi.stubGlobal("navigator", { onLine: false });
    const ms = await pingUrl("https://example.com/favicon.ico");
    expect(ms).toBeNull();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("returns null on fetch error", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network error")));
    const ms = await pingUrl("https://example.com/favicon.ico");
    expect(ms).toBeNull();
  });

  it("appends cache-busting query param", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response()));
    await pingUrl("https://example.com/test");
    const url = fetch.mock.calls[0][0] as string;
    expect(url).toMatch(/\?_z=\d+$/);
  });

  it("appends to existing query string", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response()));
    await pingUrl("https://example.com/test?foo=bar");
    const url = fetch.mock.calls[0][0] as string;
    expect(url).toContain("&_z=");
  });
});

describe("pingWithFallback", () => {
  it("returns first successful ping", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValueOnce(new Error("fail")).mockResolvedValueOnce(new Response()),
    );
    const ms = await pingWithFallback([
      "https://primary.com/favicon.ico",
      "https://fallback.com/favicon.ico",
    ]);
    expect(ms).toBe(0);
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("returns null when all URLs fail", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("fail")));
    const ms = await pingWithFallback(["https://a.com/favicon.ico", "https://b.com/favicon.ico"]);
    expect(ms).toBeNull();
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("returns null for empty array", async () => {
    const ms = await pingWithFallback([]);
    expect(ms).toBeNull();
  });

  it("short-circuits on first success", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response()));
    const ms = await pingWithFallback([
      "https://a.com/favicon.ico",
      "https://b.com/favicon.ico",
      "https://c.com/favicon.ico",
    ]);
    expect(ms).toBe(0);
    expect(fetch).toHaveBeenCalledOnce();
  });
});
