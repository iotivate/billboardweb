import { useBillboardStore } from "../state/useBillboardStore";
import { FONTS } from "../data/fonts";

export function FontPicker() {
  const font = useBillboardStore((s) => s.font);
  const setFont = useBillboardStore((s) => s.setFont);

  return (
    <div className="grid grid-cols-2 gap-1.5">
      {FONTS.map((f) => {
        const active = font === f.id;
        return (
          <button
            key={f.id}
            type="button"
            onClick={() => setFont(f.id)}
            className={
              "flex flex-col items-start gap-0.5 px-3 py-2 rounded-md text-left transition-colors border " +
              (active
                ? "bg-white text-black border-white"
                : "bg-white/5 text-white/80 border-white/10 hover:border-white/30 hover:bg-white/10")
            }
            style={{ fontFamily: f.cssFamily }}
            title={f.hint}
          >
            <span className="text-base leading-none">Aa</span>
            <span
              className={
                "text-[10px] uppercase tracking-wider " +
                (active ? "text-black/60" : "text-white/40")
              }
              style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}
            >
              {f.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
