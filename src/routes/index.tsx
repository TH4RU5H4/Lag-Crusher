import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { JojoFxProvider, useDramatic, useJojoFx } from "@/lib/jojo-fx";
import { JojoSelect, type Option } from "@/components/JojoSelect";
import { calcAverage, calcLoss, connectionQuality, QUALITY_LABELS } from "@/lib/stats";
import { pingWithFallback } from "@/lib/ping";

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

type ProviderOption = Option & { urls: string[] };

const PROVIDERS: ProviderOption[] = [
  {
    value: "dialog",
    label: "Dialog",
    sub: "Dialog Axiata · optimized nodes",
    urls: ["https://www.dialog.lk/favicon.ico", "https://www.dialog.lk/media/images/favicon.png"],
  },
  {
    value: "mobitel",
    label: "Mobitel",
    sub: "SLT-Mobitel · optimized nodes",
    urls: ["https://www.mobitel.lk/favicon.ico", "https://www.mobitel.lk/media/favicon.ico"],
  },
  {
    value: "hutch",
    label: "Hutch",
    sub: "Hutchison · optimized nodes",
    urls: ["https://www.hutch.lk/favicon.ico", "https://www.hutch.lk/favicon.png"],
  },
  {
    value: "airtel",
    label: "Airtel",
    sub: "Airtel Lanka · optimized nodes",
    urls: ["https://www.airtel.lk/favicon.ico", "https://www.airtel.lk/images/favicon.png"],
  },
  { value: "custom", label: "Custom URL", sub: "Your own address", urls: [] },
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
  const { backBurst } = useJojoFx();
  const [provider, setProvider] = useState("dialog");
  const [interval, setInterval_] = useState("3000");
  const [customUrl, setCustomUrl] = useState("");
  const [savedUrl, setSavedUrl] = useState("");
  const [running, setRunning] = useState(false);
  const [beats, setBeats] = useState<Beat[]>([]);
  const [count, setCount] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const seq = useRef(0);
  const intervalRef = useRef("3000");

  useEffect(() => {
    intervalRef.current = interval;
  }, [interval]);

  useEffect(() => {
    const stored = localStorage.getItem("stand-pinger-url");
    if (stored) {
      setSavedUrl(stored);
      setCustomUrl(stored);
    }
  }, []);

  const getTargets = useCallback((): string[] => {
    if (provider === "custom") {
      const url = savedUrl || customUrl;
      return url ? [url] : [];
    }
    const p = PROVIDERS.find((p) => p.value === provider);
    return p?.urls ?? [];
  }, [provider, savedUrl, customUrl]);

  useEffect(() => {
    if (!running) return;
    const targets = getTargets();
    if (targets.length === 0) return;

    let alive = true;

    const loop = async () => {
      if (!alive) return;
      const ms = await pingWithFallback(targets);
      if (!alive) return;
      const id = ++seq.current;
      setBeats((prev) => [{ id, ms, at: new Date().toLocaleTimeString() }, ...prev.slice(0, 24)]);
      setCount((c) => c + 1);
      timer.current = setTimeout(loop, Number(intervalRef.current));
    };

    loop();

    return () => {
      alive = false;
      if (timer.current) clearTimeout(timer.current);
    };
  }, [running, getTargets]);

  useEffect(() => {
    if (!running) return;
    const spawn = () => {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      backBurst(x, y);
    };
    spawn();
    const id = setInterval(spawn, 900);
    return () => clearInterval(id);
  }, [running, backBurst]);

  const latest = beats[0];
  const avg = calcAverage(beats);
  const loss = calcLoss(beats);
  const quality = connectionQuality(latest?.ms, navigator.onLine);
  const target = getTargets()[0] ?? "";

  return (
    <main className="inkwash relative min-h-screen overflow-hidden pb-16">
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
        <header className="animate-stamp">
          <h1 className="jojo-title text-5xl leading-[0.85]">
            Lag
            <br />
            Crusher
          </h1>
          <p className="font-slab text-cyan mt-2 text-right text-sm tracking-[0.2em] uppercase">
            powered by TH4RU5H4
          </p>
          <p className="text-paper/70 font-jp mt-3 text-xs">
            ラグ粉砕 · Sri Lanka mobile net stabilizer
          </p>
        </header>

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
              {savedUrl && <p className="text-gold mt-2 truncate text-xs">SAVED · {savedUrl}</p>}
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

        <section className="relative mt-9 flex flex-col items-center">
          <div className="relative flex items-center justify-center">
            {running && (
              <div className="speedlines animate-aura pointer-events-none absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30" />
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
                CRUSHER
              </span>
              <span className="font-jp text-ink/80 mt-1 text-[10px] font-black">
                {running ? "スタンド解除" : "スタンドパワー"}
              </span>
            </button>
          </div>

          <div className="panel mt-6 flex w-full items-center gap-3 px-4 py-3">
            <span
              className={`h-4 w-4 shrink-0 border-2 border-black ${
                running
                  ? latest?.ms === null
                    ? "bg-destructive"
                    : "bg-cyan animate-pulse"
                  : "bg-muted"
              }`}
            />
            <span className="min-w-0 flex-1">
              <span className="font-display block truncate text-sm">
                {running
                  ? `CRUSHER ACTIVE — ${QUALITY_LABELS[quality].toUpperCase()}`
                  : "CRUSHER DORMANT"}
              </span>
              <span className="text-muted-foreground block truncate text-xs">
                {target || "Set a target URL"}
              </span>
            </span>
          </div>
        </section>

        <section className="mt-5 grid grid-cols-4 gap-2">
          {[
            { k: "Latency", v: latest ? (latest.ms === null ? "LOST" : `${latest.ms}ms`) : "—" },
            { k: "Average", v: avg === null ? "—" : `${avg}ms` },
            { k: "Loss", v: `${loss}%` },
            { k: "Quality", v: QUALITY_LABELS[quality] },
          ].map((s) => (
            <div key={s.k} className="panel px-2 py-3 text-center">
              <p className="font-display text-gold truncate text-lg">{s.v}</p>
              <p className="font-slab text-paper/60 text-xs tracking-[0.2em] uppercase">{s.k}</p>
            </div>
          ))}
        </section>

        <section className="mt-6">
          <h2 className="font-slab text-paper/70 text-lg tracking-[0.35em] uppercase">
            Ping Log · {count}
          </h2>
          <div className="panel mt-2 max-h-64 overflow-y-auto">
            {beats.length === 0 ? (
              <p className="text-muted-foreground p-4 text-sm">
                No pings yet. Unleash your Crusher.
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
          ゴゴゴ · Keep the app open in the background to hold the connection.
        </p>
      </div>
    </main>
  );
}
