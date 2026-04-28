import { getUnlockedPresets, PRESET_PACKS } from "../data/presets";
import { useBillboardStore } from "../state/useBillboardStore";

export function PresetBar() {
  const applyPreset = useBillboardStore((s) => s.applyPreset);
  const licenses = useBillboardStore((s) => s.licenses);

  const presets = getUnlockedPresets((productId) => Boolean(licenses[productId as keyof typeof licenses]));

  // Resolve which pack a preset belongs to so we can dim labels for the
  // (unlocked) Cyberpunk pack vs. starter, giving a subtle hierarchy.
  const packOf = new Map<string, string>();
  for (const pack of PRESET_PACKS) {
    for (const p of pack.presets) packOf.set(p.id, pack.id);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {presets.map((p, idx) => {
        const fromPaidPack = packOf.get(p.id) !== "free-starter";
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => applyPreset(p)}
            className={
              "px-3 py-2 rounded-md text-xs font-semibold uppercase tracking-wider border transition-colors " +
              (fromPaidPack
                ? "border-fuchsia-500/40 bg-fuchsia-500/5 hover:bg-fuchsia-500/15 hover:border-fuchsia-400/70"
                : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20")
            }
            style={{ color: p.accent ?? "#fff" }}
            title={idx < 9 ? `${p.label} · ${idx + 1}` : p.label}
          >
            {p.label}
          </button>
        );
      })}
    </div>
  );
}
