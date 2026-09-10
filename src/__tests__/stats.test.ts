import { describe, it, expect } from "vitest";
import { calcAverage, calcLoss, connectionQuality } from "@/lib/stats";

describe("calcAverage", () => {
  it("returns null for empty array", () => {
    expect(calcAverage([])).toBeNull();
  });

  it("returns null when all pings failed", () => {
    expect(calcAverage([{ ms: null }, { ms: null }])).toBeNull();
  });

  it("calculates average of successful pings", () => {
    expect(calcAverage([{ ms: 100 }, { ms: 200 }, { ms: 300 }])).toBe(200);
  });

  it("averages only successful pings, ignoring nulls", () => {
    expect(calcAverage([{ ms: 100 }, { ms: null }, { ms: 300 }])).toBe(200);
  });

  it("rounds to nearest integer", () => {
    expect(calcAverage([{ ms: 100 }, { ms: 101 }])).toBe(101);
  });
});

describe("calcLoss", () => {
  it("returns 0 for empty array", () => {
    expect(calcLoss([])).toBe(0);
  });

  it("returns 0 when all pings succeeded", () => {
    expect(calcLoss([{ ms: 100 }, { ms: 200 }])).toBe(0);
  });

  it("returns 100 when all pings failed", () => {
    expect(calcLoss([{ ms: null }, { ms: null }])).toBe(100);
  });

  it("calculates correct loss percentage", () => {
    expect(calcLoss([{ ms: 100 }, { ms: null }, { ms: 300 }, { ms: null }])).toBe(50);
  });

  it("rounds to nearest integer", () => {
    expect(calcLoss([{ ms: 100 }, { ms: null }, { ms: null }])).toBe(67);
  });
});

describe("connectionQuality", () => {
  it("returns 'idle' when no data", () => {
    expect(connectionQuality(undefined, true)).toBe("idle");
    expect(connectionQuality(null, true)).toBe("idle");
  });

  it("returns 'lost' when offline", () => {
    expect(connectionQuality(50, false)).toBe("lost");
    expect(connectionQuality(null, false)).toBe("lost");
    expect(connectionQuality(undefined, false)).toBe("lost");
  });

  it("returns 'excellent' for < 100ms", () => {
    expect(connectionQuality(50, true)).toBe("excellent");
    expect(connectionQuality(99, true)).toBe("excellent");
  });

  it("returns 'good' for 100-300ms", () => {
    expect(connectionQuality(100, true)).toBe("good");
    expect(connectionQuality(200, true)).toBe("good");
    expect(connectionQuality(300, true)).toBe("good");
  });

  it("returns 'poor' for > 300ms", () => {
    expect(connectionQuality(301, true)).toBe("poor");
    expect(connectionQuality(500, true)).toBe("poor");
  });
});
