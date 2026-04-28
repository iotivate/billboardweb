import { useBillboardStore } from "../state/useBillboardStore";
import type { Style } from "../data/types";

const OPTIONS: { value: Style; label: string }[] = [
  { value: "neon", label: "Neon" },
  { value: "solid", label: "Solid" },
  { value: "led", label: "LED" },
];

export function StylePicker() {
  const style = useBillboardStore((s) => s.style);
  const setStyle = useBillboardStore((s) => s.setStyle);

  return (
    <div className="flex gap-1 p-1 rounded-md bg-white/5 border border-white/10 w-fit">
      {OPTIONS.map((o) => {
        const active = style === o.value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => setStyle(o.value)}
            className={
              "px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-colors " +
              (active ? "bg-white text-black" : "text-white/60 hover:text-white")
            }
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
