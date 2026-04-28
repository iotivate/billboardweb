import { useBillboardStore } from "../state/useBillboardStore";

export function SpeedSlider() {
  const speed = useBillboardStore((s) => s.speed);
  const setSpeed = useBillboardStore((s) => s.setSpeed);

  return (
    <label className="flex flex-col gap-1.5">
      <span className="flex justify-between text-[10px] font-semibold uppercase tracking-wider text-white/50">
        <span>Speed</span>
        <span className="tabular-nums text-white/70">{speed}</span>
      </span>
      <input
        type="range"
        min={0}
        max={100}
        value={speed}
        onChange={(e) => setSpeed(Number(e.target.value))}
        className="w-full accent-white"
      />
    </label>
  );
}
