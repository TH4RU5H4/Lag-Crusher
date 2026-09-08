import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { JojoFxProvider, useDramatic } from "@/lib/jojo-fx";
import { JojoSelect, type Option } from "@/components/JojoSelect";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LagCrusher — powered by TH4RU5H4" },
      {
        name: "description",
        content:
          "Crush lag on Dialog, Mobitel, Hutch and Airtel mobile internet with a looping pinger. Pick a provider or custom URL, set the interval, and unleash Stand Power.",
      },
      { property: "og:title", content: "LagCrusher — powered by TH4RU5H4" },
      {
        property: "og:description",
        content:
          "A menacing pinger UI for Sri Lankan networks: provider presets, interval control, live latency readout.",
      },
    ],
  }),
  component: () => (
    <JojoFxProvider>
      <PingerScreen />
    </JojoFxProvider>
  ),
});

const PROVIDERS: (Option & { url: string })[] = [
  { value: "dialog", label: "Dialog", sub: "Dialog Axiata · optimized node", url: "https://www.dialog.lk/favicon.ico" },
  { value: "mobitel", label: "Mobitel", sub: "SLT-Mobitel · optimized node", url: "https://www.mobitel.lk/favicon.ico" },
  { value: "hutch", label: "Hutch", sub: "Hutchison · optimized node", url: "https://www.hutch.lk/favicon.ico" },
  { value: "airtel", label: "Airtel", sub: "Airtel Lanka · optimized node", url: "https://www.airtel.lk/favicon.ico" },
  { value: "custom", label: "Custom URL", sub: "Your own address", url: "" },
];

const INTERVALS: Option[] = [
  { value: "1000", label: "1 Second", sub: "Aggressive · オラオラ" },
  { value: "3000", label: "3 Seconds", sub: "Balanced" },
  { value: "5000", label: "5 Seconds", sub: "Steady" },
  { value: "10000", label: "10 Seconds", sub: "Battery saver" },
];

type Beat = { id: number; ms: number | null; at: string };

function PingerScreen() {
  const drama = useDramatic();
  const [provider, setProvider] = useState("dialog");
  const [interval, setInterval_] = useState("3000");
  const [customUrl, setCustomUrl] = useState("");
  const [savedUrl, setSavedUrl] = useState("");
  const [running, setRunning] = useState(false);
  const [beats, setBeats] = useState<Beat[]>([]);
  const [count, setCount] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const seq = useRef(0);

  useEffect(() => {
    const stored = localStorage.getItem("stand-pinger-url");
    if (stored) {
      setSavedUrl(stored);
      setCustomUrl(stored);
    }
  }, []);

  const target =
    provider === "custom"
      ? savedUrl || customUrl
      : (PROVIDERS.find((p) => p.value === provider)?.url ?? "");

  const ping = useCallback(async (url: string) => {
    const start = performance.now();
    try {
      await fetch(`${url}${url.includes("?") ? "&" : "?"}_z=${Date.now()}`, {
        mode: "no-cors",
        cache: "no-store",
      });
      return Math.round(performance.now() - start);
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (!running || !target) return;
    let alive = true;
    const loop = async () => {
      const ms = await ping(target);
      if (!alive) return;
      const id = ++seq.current;
      setBeats((prev) => [
        { id, ms, at: new Date().toLocaleTimeString() },
        ...prev.slice(0, 24),
      ]);
      setCount((c) => c + 1);
      timer.current = setTimeout(loop, Number(interval));
    };
    loop();
    return () => {
      alive = false;
      if (timer.current) clearTimeout(timer.current);
    };
  }, [running, target, interval, ping]);

  const latest = beats[0];
  const alive = beats.filter((b) => b.ms !== null);
  const avg = alive.length
    ? Math.round(alive.reduce((s, b) => s + (b.ms ?? 0), 0) / alive.length)
    : null;
  const loss = beats.length ? Math.round(((beats.length - alive.length) / beats.length) * 100) : 0;

  return (
    <main className="inkwash relative min-h-screen overflow-hidden pb-16">
      {/* halftone + rumble background */}
      <div className="halftone pointer-events-none absolute inset-0 opacity-[0.12]" />
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-around overflow-hidden opacity-20">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="animate-rumble font-jp text-paper text-5xl font-black whitespace-nowrap"
            style={{ animationDelay: `${i * 0.22}s`, paddingLeft: `${i * 18}px` }}
          >
            ゴゴゴゴゴゴゴゴゴゴ
          </div>
        ))}
      </div>

      <div className="relative mx-auto w-full max-w-md px-5 pt-8">
        {/* Header */}
        <header className="animate-stamp">
          <h1 className="jojo-title text-5xl leading-[0.85]">
            Lag
            <br />
            Crusher
          </h1>
          <p className="font-slab text-cyan mt-2 text-lg tracking-[0.25em] uppercase">
            powered by TH4RU5H4
          </p>
          <p className="text-paper/70 font-jp mt-3 text-xs">
            ラグ粉砕 · Sri Lanka mobile net stabilizer
          </p>
        </header>

        {/* Controls */}
        <section className="mt-7 space-y-5">
          <JojoSelect
            label="Service Provider"
            value={provider}
            options={PROVIDERS}
            onChange={setProvider}
            accent="magenta"
          />

          {provider === "custom" && (
            <div className="animate-flip-in panel origin-top p-4">
              <label className="font-slab text-paper/70 block text-base tracking-[0.3em] uppercase">
                Custom URL
              </label>
              <input
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://example.com"
                className="border-paper/40 font-display placeholder:text-muted-foreground mt-2 w-full border-2 bg-black/40 px-3 py-2 text-sm outline-none focus:border-cyan"
              />
              <button
                type="button"
                onClick={(e) => {
                  drama(e, { text: "ズキュゥゥン", shake: true });
                  const clean = customUrl.trim();
                  if (!clean) return;
                  localStorage.setItem("stand-pinger-url", clean);
                  setSavedUrl(clean);
                }}
                className="bg-cyan text-ink font-display mt-3 w-full border-2 border-black py-2 text-sm uppercase transition-transform active:scale-95"
              >
                Save Address
              </button>
              {savedUrl && (
                <p className="text-gold mt-2 truncate text-xs">SAVED · {savedUrl}</p>
              )}
            </div>
          )}

          <JojoSelect
            label="Interval Delay"
            value={interval}
            options={INTERVALS}
            onChange={setInterval_}
            accent="cyan"
          />
        </section>

        {/* Control center */}
        <section className="relative mt-9 flex flex-col items-center">
          {running && (
            <div className="speedlines animate-aura pointer-events-none absolute -top-10 h-80 w-80 rounded-full opacity-30" />
          )}
          <button
            type="button"
            disabled={!target}
            onClick={(e) => {
              drama(e, { text: running ? "やれやれだぜ" : "ゴゴゴゴ", shake: true });
              setRunning((r) => !r);
            }}
            className={`relative z-10 flex h-44 w-44 flex-col items-center justify-center rounded-full border-[5px] border-black text-center transition-transform active:scale-90 disabled:opacity-40 ${
              running ? "bg-gold" : "bg-magenta"
            }`}
            style={{ boxShadow: "0 0 0 6px var(--paper), var(--shadow-glow)" }}
          >
            <span className="font-display text-ink text-2xl leading-6">
              {running ? "STOP" : "START"}
              <br />
              {running ? "STAND" : "PING"}
            </span>
            <span className="font-jp text-ink/80 mt-1 text-[10px] font-black">
              {running ? "スタンド解除" : "スタンドパワー"}
            </span>
          </button>

          <div className="panel mt-6 flex w-full items-center gap-3 px-4 py-3">
            <span
              className={`h-4 w-4 shrink-0 border-2 border-black ${
                running ? (latest?.ms === null ? "bg-destructive" : "bg-cyan animate-pulse") : "bg-muted"
              }`}
            />
            <span className="min-w-0 flex-1">
              <span className="font-display block truncate text-sm">
                {running ? "STAND ACTIVE — LOOPING" : "STAND DORMANT"}
              </span>
              <span className="text-muted-foreground block truncate text-xs">
                {target || "Set a target URL"}
              </span>
            </span>
          </div>
        </section>

        {/* Stats */}
        <section className="mt-5 grid grid-cols-3 gap-3">
          {[
            { k: "Latency", v: latest ? (latest.ms === null ? "LOST" : `${latest.ms}ms`) : "—" },
            { k: "Average", v: avg === null ? "—" : `${avg}ms` },
            { k: "Loss", v: `${loss}%` },
          ].map((s) => (
            <div key={s.k} className="panel px-2 py-3 text-center">
              <p className="font-display text-gold truncate text-lg">{s.v}</p>
              <p className="font-slab text-paper/60 text-xs tracking-[0.2em] uppercase">{s.k}</p>
            </div>
          ))}
        </section>

        {/* Log */}
        <section className="mt-6">
          <h2 className="font-slab text-paper/70 text-lg tracking-[0.35em] uppercase">
            Ping Log · {count}
          </h2>
          <div className="panel mt-2 max-h-64 overflow-y-auto">
            {beats.length === 0 ? (
              <p className="text-muted-foreground p-4 text-sm">
                No pings yet. Unleash your Stand.
              </p>
            ) : (
              beats.map((b, i) => (
                <div
                  key={b.id}
                  className={`flex items-center justify-between px-4 py-2 ${
                    i > 0 ? "border-paper/20 border-t" : "animate-stamp"
                  }`}
                >
                  <span className="text-muted-foreground font-display text-xs">{b.at}</span>
                  <span
                    className={`font-display text-sm ${b.ms === null ? "text-destructive" : "text-cyan"}`}
                  >
                    {b.ms === null ? "TIMEOUT" : `${b.ms} ms`}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>

        <p className="text-paper/40 font-jp mt-8 text-center text-[10px]">
          ゴゴゴ · Keep the app open to hold the connection.
        </p>
      </div>
    </main>
  );
}
