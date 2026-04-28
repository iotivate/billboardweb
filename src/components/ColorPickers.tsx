import { useBillboardStore } from "../state/useBillboardStore";

const BG_SWATCHES: { value: string; label: string }[] = [
  { value: "#0a0a0f", label: "Void" },
  { value: "#000000", label: "Black" },
  { value: "#00b140", label: "Chroma green" },
  { value: "#0047ab", label: "Chroma blue" },
  { value: "#1c0e2e", label: "Deep purple" },
  { value: "#ffffff", label: "White" },
];

const ACCENT_SWATCHES = [
  "#ff00de",
  "#ff2d2d",
  "#39ff14",
  "#ffd700",
  "#00e5ff",
  "#b026ff",
  "#ff8a00",
  "#ffffff",
];

interface CustomColorButtonProps {
  value: string;
  onChange: (next: string) => void;
}

function CustomColorButton({ value, onChange }: CustomColorButtonProps) {
  return (
    <label
      className="group flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-dashed border-white/30 hover:border-white/70 hover:bg-white/10 cursor-pointer transition-colors"
      title="Pick any color"
    >
      <span
        aria-hidden
        className="w-4 h-4 rounded-full border border-white/40 shadow-inner"
        style={{ background: value }}
      />
      <span className="text-[10px] font-semibold uppercase tracking-wider text-white/70 group-hover:text-white">
        Custom
      </span>
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="w-3 h-3 text-white/60 group-hover:text-white"
        fill="currentColor"
      >
        <path d="M16.7 3.3a2.4 2.4 0 0 1 3.4 3.4L9.5 17.3l-4.7 1.4 1.4-4.7L16.7 3.3z" />
      </svg>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="sr-only"
      />
    </label>
  );
}

export function ColorPickers() {
  const accent = useBillboardStore((s) => s.accent);
  const setAccent = useBillboardStore((s) => s.setAccent);
  const bg = useBillboardStore((s) => s.bg);
  const setBg = useBillboardStore((s) => s.setBg);

  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-white/50">
          Accent
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          {ACCENT_SWATCHES.map((c) => (
            <button
              key={c}
              type="button"
              aria-label={`Set accent ${c}`}
              onClick={() => setAccent(c)}
              className={
                "w-6 h-6 rounded-full ring-offset-2 ring-offset-black transition-all " +
                (accent.toLowerCase() === c.toLowerCase()
                  ? "ring-2 ring-white scale-110"
                  : "ring-1 ring-white/20 hover:ring-white/60")
              }
              style={{ background: c }}
            />
          ))}
          <CustomColorButton value={accent} onChange={setAccent} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-white/50">
          Background
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          {BG_SWATCHES.map((s) => (
            <button
              key={s.value}
              type="button"
              aria-label={`Set background ${s.label}`}
              title={s.label}
              onClick={() => setBg(s.value)}
              className={
                "w-6 h-6 rounded-full ring-offset-2 ring-offset-black transition-all " +
                (bg.toLowerCase() === s.value.toLowerCase()
                  ? "ring-2 ring-white scale-110"
                  : "ring-1 ring-white/20 hover:ring-white/60")
              }
              style={{ background: s.value }}
            />
          ))}
          <CustomColorButton value={bg} onChange={setBg} />
        </div>
      </div>
    </section>
  );
}
