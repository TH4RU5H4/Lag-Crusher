export type ConnectionQuality = "excellent" | "good" | "poor" | "lost" | "idle";

export function calcAverage(beats: { ms: number | null }[]): number | null {
  const alive = beats.filter((b) => b.ms !== null);
  if (alive.length === 0) return null;
  return Math.round(alive.reduce((s, b) => s + (b.ms ?? 0), 0) / alive.length);
}

export function calcLoss(beats: { ms: number | null }[]): number {
  if (beats.length === 0) return 0;
  const alive = beats.filter((b) => b.ms !== null);
  return Math.round(((beats.length - alive.length) / beats.length) * 100);
}

export function connectionQuality(
  latestMs: number | null | undefined,
  online: boolean,
): ConnectionQuality {
  if (!online) return "lost";
  if (latestMs === null || latestMs === undefined) return "idle";
  if (latestMs < 100) return "excellent";
  if (latestMs <= 300) return "good";
  return "poor";
}

export const QUALITY_LABELS: Record<ConnectionQuality, string> = {
  excellent: "Excellent",
  good: "Good",
  poor: "Poor",
  lost: "Lost",
  idle: "Idle",
};
