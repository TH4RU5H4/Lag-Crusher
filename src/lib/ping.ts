export async function pingUrl(url: string): Promise<number | null> {
  if (!navigator.onLine) return null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  const start = performance.now();
  try {
    await fetch(`${url}${url.includes("?") ? "&" : "?"}_z=${Date.now()}`, {
      mode: "no-cors",
      cache: "no-store",
      signal: controller.signal,
    });
    return Math.round(performance.now() - start);
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function pingWithFallback(urls: string[]): Promise<number | null> {
  for (const url of urls) {
    const ms = await pingUrl(url);
    if (ms !== null) return ms;
  }
  return null;
}
