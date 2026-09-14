import { invoke } from "@tauri-apps/api/core";

export async function pingUrl(url: string): Promise<number | null> {
  try {
    const ms = await invoke<number>("ping_url", { url });
    return ms;
  } catch {
    return null;
  }
}

export async function pingWithFallback(urls: string[]): Promise<number | null> {
  for (const url of urls) {
    const ms = await pingUrl(url);
    if (ms !== null) return ms;
  }
  return null;
}
