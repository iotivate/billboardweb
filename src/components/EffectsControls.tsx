import { useBillboardStore } from "../state/useBillboardStore";

export function EffectsControls() {
  const glow = useBillboardStore((s) => s.glow);
  const setGlow = useBillboardStore((s) => s.setGlow);
  const outline = useBillboardStore((s) => s.outline);
  const toggleOutline = useBillboardStore((s) => s.toggleOutline);
  const gap = useBillboardStore((s) => s.gap);
  const setGap = useBillboardStore((s) => s.setGap);
  const ledSize = useBillboardStore((s) => s.ledSize);
  const setLedSize = useBillboardStore((s) => s.setLedSize);
  const style = useBillboardStore((s) => s.style);

  return (
    <section className="flex flex-col gap-3">
      <label className="flex flex-col gap-1.5">
        <span className="flex justify-between text-[10px] font-semibold uppercase tracking-wider text-white/50">
          <span>Glow</span>
          <span className="tabular-nums text-white/70">{glow}</span>
        </span>
        <input
          type="range"
          min={0}
          max={100}
          value={glow}
          onChange={(e) => setGlow(Number(e.target.value))}
          className="w-full accent-white"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="flex justify-between text-[10px] font-semibold uppercase tracking-wider text-white/50">
          <span>Gap between repeats</span>
          <span className="tabular-nums text-white/70">{gap}</span>
        </span>
        <input
          type="range"
          min={0}
          max={100}
          value={gap}
          onChange={(e) => setGap(Number(e.target.value))}
          className="w-full accent-white"
        />
      </label>

      <label
        className={
          "flex flex-col gap-1.5 transition-opacity " +
          (style === "led" ? "opacity-100" : "opacity-50")
        }
      >
        <span className="flex justify-between text-[10px] font-semibold uppercase tracking-wider text-white/50">
          <span>LED dot size</span>
          <span className="tabular-nums text-white/70">{ledSize}</span>
        </span>
        <input
          type="range"
          min={0}
          max={100}
          value={ledSize}
          onChange={(e) => setLedSize(Number(e.target.value))}
          className="w-full accent-white"
          aria-label="LED dot size"
        />
        <span className="text-[10px] text-white/40">
          Bigger dots survive video capture better. Crank it up if filming.
        </span>
      </label>

      <label className="flex items-center justify-between gap-3 px-3 py-2 rounded-md bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
        <div className="flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-wider text-white/80">
            Outline
          </span>
          <span className="text-[10px] text-white/40">
            Hollow letters, stroked in accent color
          </span>
        </div>
        <span
          className={
            "relative w-9 h-5 rounded-full transition-colors " +
            (outline ? "bg-white" : "bg-white/20")
          }
        >
          <span
            className={
              "absolute top-0.5 w-4 h-4 rounded-full bg-black transition-all " +
              (outline ? "left-4" : "left-0.5")
            }
          />
        </span>
        <input
          type="checkbox"
          checked={outline}
          onChange={toggleOutline}
          className="sr-only"
        />
      </label>
    </section>
  );
}
