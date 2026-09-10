import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";

const SFX: string[] = [
  "ゴゴゴゴ",
  "ドドドド",
  "ドドド",
  "メメタァ",
  "ズキュゥゥン",
  "オラオラ",
  "無駄無駄",
];
const COLORS: string[] = ["text-magenta", "text-cyan", "text-gold"];

type Fx = { id: number; x: number; y: number; text: string; color: string; rot: number };

type FxApi = {
  burst: (x: number, y: number, text?: string) => void;
  backBurst: (x: number, y: number, text?: string) => void;
  shake: () => void;
};

const FxContext = createContext<FxApi>({
  burst: () => {},
  backBurst: () => {},
  shake: () => {},
});

export function useJojoFx() {
  return useContext(FxContext);
}

/** Wraps a click handler so every interaction fires a burst + sound-effect typography. */
export function useDramatic() {
  const { burst, shake } = useJojoFx();
  return useCallback(
    (e: { clientX: number; clientY: number }, opts?: { text?: string; shake?: boolean }) => {
      burst(e.clientX, e.clientY, opts?.text);
      if (opts?.shake) shake();
    },
    [burst, shake],
  );
}

export function JojoFxProvider({ children }: { children: ReactNode }) {
  const [fx, setFx] = useState<Fx[]>([]);
  const [backFx, setBackFx] = useState<Fx[]>([]);
  const [shaking, setShaking] = useState(false);
  const seq = useRef(0);

  const spawn = useCallback((x: number, y: number, text?: string): Fx => {
    const id = ++seq.current;
    return {
      id,
      x,
      y,
      text: text ?? SFX[Math.floor(Math.random() * SFX.length)] ?? "ゴゴゴゴ",
      color: COLORS[Math.floor(Math.random() * COLORS.length)] ?? "text-magenta",
      rot: Math.random() * 24 - 12,
    };
  }, []);

  const burst = useCallback(
    (x: number, y: number, text?: string) => {
      const fx = spawn(x, y, text);
      setFx((prev) => [...prev.slice(-6), fx]);
      setTimeout(() => setFx((prev) => prev.filter((f) => f.id !== fx.id)), 1200);
    },
    [spawn],
  );

  const backBurst = useCallback(
    (x: number, y: number, text?: string) => {
      const fx = spawn(x, y, text);
      setBackFx((prev) => [...prev.slice(-10), fx]);
      setTimeout(() => setBackFx((prev) => prev.filter((f) => f.id !== fx.id)), 2200);
    },
    [spawn],
  );

  const shake = useCallback(() => {
    setShaking(false);
    requestAnimationFrame(() => setShaking(true));
    setTimeout(() => setShaking(false), 460);
  }, []);

  const renderFx = (list: Fx[], glowOpacity = 0.7) =>
    list.map((f) => (
      <div key={f.id} className="absolute" style={{ left: f.x, top: f.y }}>
        <div className="absolute -translate-x-1/2 -translate-y-1/2">
          <div
            className="speedlines animate-burst h-40 w-40 rounded-full"
            style={{ opacity: glowOpacity }}
          />
        </div>
        <div
          className={`animate-menacing absolute -translate-x-1/2 -translate-y-1/2 font-jp text-3xl font-black whitespace-nowrap ${f.color}`}
          style={{
            transform: `rotate(${f.rot}deg)`,
            WebkitTextStroke: "2px var(--ink)",
            paintOrder: "stroke fill",
          }}
        >
          {f.text}
        </div>
      </div>
    ));

  return (
    <FxContext.Provider value={{ burst, backBurst, shake }}>
      {/* Background ambient SFX layer */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        {renderFx(backFx, 0.35)}
      </div>
      <div className={shaking ? "animate-shake" : undefined}>{children}</div>
      {/* Foreground interactive burst layer */}
      <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">{renderFx(fx)}</div>
    </FxContext.Provider>
  );
}
