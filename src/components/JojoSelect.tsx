import { useState } from "react";
import { useDramatic } from "@/lib/jojo-fx";

export type Option = { value: string; label: string; sub?: string };

export function JojoSelect({
  label,
  value,
  options,
  onChange,
  accent = "magenta",
}: {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  accent?: "magenta" | "cyan" | "gold";
}) {
  const [open, setOpen] = useState(false);
  const drama = useDramatic();
  const current = options.find((o) => o.value === value);
  const accentText =
    accent === "cyan" ? "text-cyan" : accent === "gold" ? "text-gold" : "text-magenta";
  const accentBg = accent === "cyan" ? "bg-cyan" : accent === "gold" ? "bg-gold" : "bg-magenta";

  return (
    <div className="relative">
      <span className="font-slab text-paper/70 block text-lg tracking-[0.35em] uppercase">
        {label}
      </span>
      <button
        type="button"
        onClick={(e) => {
          drama(e, { text: open ? "ゴゴゴ" : "ドドド" });
          setOpen((o) => !o);
        }}
        className="panel mt-1 flex w-full items-center justify-between gap-3 px-4 py-3 transition-transform active:scale-[0.97]"
      >
        <span className="min-w-0 text-left">
          <span className={`font-display block truncate text-lg ${accentText}`}>
            {current?.label ?? "—"}
          </span>
          {current?.sub && (
            <span className="text-muted-foreground block truncate text-xs">{current.sub}</span>
          )}
        </span>
        <span
          className={`${accentBg} text-ink font-display shrink-0 border-2 border-black px-2 py-1 text-xs`}
        >
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div className="animate-flip-in panel absolute z-30 mt-2 w-full origin-top overflow-hidden">
          {options.map((o, i) => (
            <button
              key={o.value}
              type="button"
              onClick={(e) => {
                drama(e, { text: "ドドドド", shake: true });
                onChange(o.value);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                i > 0 ? "border-paper/25 border-t-2" : ""
              } ${o.value === value ? "bg-paper/15" : "hover:bg-paper/10"}`}
            >
              <span className={`${accentBg} h-6 w-1.5 shrink-0`} />
              <span className="min-w-0">
                <span className="font-display block truncate text-base">{o.label}</span>
                {o.sub && (
                  <span className="text-muted-foreground block truncate text-xs">{o.sub}</span>
                )}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
