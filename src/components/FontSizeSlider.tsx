import { useBillboardStore } from "../state/useBillboardStore";

export function FontSizeSlider() {
  const fontSize = useBillboardStore((s) => s.fontSize);
  const setFontSize = useBillboardStore((s) => s.setFontSize);

  return (
    <label className="flex flex-col gap-1.5">
      <span className="flex justify-between text-[10px] font-semibold uppercase tracking-wider text-white/50">
        <span>Size</span>
        <span className="tabular-nums text-white/70">{fontSize}%</span>
      </span>
      <input
        type="range"
        min={50}
        max={200}
        step={1}
        value={fontSize}
        onChange={(e) => setFontSize(Number(e.target.value))}
        className="w-full accent-white"
      />
    </label>
  );
}
