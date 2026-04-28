import { useBillboardStore } from "../state/useBillboardStore";
import type { Direction } from "../data/types";

const OPTIONS: { value: Direction; label: string; arrow: string }[] = [
  { value: "left", label: "Left", arrow: "←" },
  { value: "right", label: "Right", arrow: "→" },
  { value: "up", label: "Up", arrow: "↑" },
  { value: "down", label: "Down", arrow: "↓" },
];

export function DirectionPicker() {
  const direction = useBillboardStore((s) => s.direction);
  const setDirection = useBillboardStore((s) => s.setDirection);

  return (
    <div className="flex gap-1 p-1 rounded-md bg-white/5 border border-white/10 w-fit">
      {OPTIONS.map((o) => {
        const active = direction === o.value;
        return (
          <button
            key={o.value}
            type="button"
            aria-label={`Scroll ${o.label}`}
            onClick={() => setDirection(o.value)}
            className={
              "w-9 h-9 rounded text-base font-semibold transition-colors " +
              (active ? "bg-white text-black" : "text-white/60 hover:text-white")
            }
          >
            {o.arrow}
          </button>
        );
      })}
    </div>
  );
}
