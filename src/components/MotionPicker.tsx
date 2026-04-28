import { useBillboardStore } from "../state/useBillboardStore";
import type { Motion } from "../data/types";

const OPTIONS: { value: Motion; label: string; hint: string }[] = [
  { value: "scroll", label: "Scroll", hint: "Marquee" },
  { value: "static", label: "Static", hint: "No motion" },
  { value: "blink", label: "Blink", hint: "On / off" },
  { value: "pulse", label: "Pulse", hint: "Fade" },
];

export function MotionPicker() {
  const motion = useBillboardStore((s) => s.motion);
  const setMotion = useBillboardStore((s) => s.setMotion);

  return (
    <div className="grid grid-cols-2 gap-1 p-1 rounded-md bg-white/5 border border-white/10">
      {OPTIONS.map((o) => {
        const active = motion === o.value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => setMotion(o.value)}
            title={o.hint}
            className={
              "px-3 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors " +
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
