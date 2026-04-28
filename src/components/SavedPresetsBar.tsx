import { useBillboardStore } from "../state/useBillboardStore";

export function SavedPresetsBar() {
  const savedPresets = useBillboardStore((s) => s.savedPresets);
  const saveCurrentAsPreset = useBillboardStore((s) => s.saveCurrentAsPreset);
  const removeSavedPreset = useBillboardStore((s) => s.removeSavedPreset);
  const renameSavedPreset = useBillboardStore((s) => s.renameSavedPreset);
  const applySavedPreset = useBillboardStore((s) => s.applySavedPreset);

  const onSave = () => {
    const defaultName = `Sign ${savedPresets.length + 1}`;
    const name = window.prompt("Name this sign:", defaultName);
    if (!name || !name.trim()) return;
    saveCurrentAsPreset(name.trim());
  };

  const onRename = (id: string, current: string) => {
    const name = window.prompt("Rename to:", current);
    if (!name || !name.trim() || name.trim() === current) return;
    renameSavedPreset(id, name.trim());
  };

  const onDelete = (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"? This can't be undone.`)) return;
    removeSavedPreset(id);
  };

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-[10px] font-semibold uppercase tracking-wider text-white/50">
        Your signs
      </h2>

      <div className="flex flex-wrap gap-2">
        {savedPresets.map((p) => (
          <div
            key={p.id}
            className="group flex items-center gap-1 rounded-md border border-white/15 bg-white/5 hover:bg-white/10 transition-colors overflow-hidden"
            style={{ borderColor: `${p.accent}55` }}
          >
            <button
              type="button"
              onClick={() => applySavedPreset(p.id)}
              onDoubleClick={() => onRename(p.id, p.name)}
              className="px-3 py-2 text-xs font-semibold uppercase tracking-wider"
              style={{ color: p.accent }}
              title="Click to apply · double-click to rename"
            >
              {p.name}
            </button>
            <button
              type="button"
              onClick={() => onDelete(p.id, p.name)}
              aria-label={`Delete ${p.name}`}
              className="px-2 py-2 text-white/40 hover:text-red-400 text-xs"
            >
              ✕
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={onSave}
          className="px-3 py-2 rounded-md text-xs font-semibold uppercase tracking-wider border border-dashed border-white/30 hover:border-white/60 text-white/60 hover:text-white transition-colors"
        >
          + Save current
        </button>
      </div>

      {savedPresets.length === 0 && (
        <p className="text-[11px] text-white/40">
          Saved signs are yours and stay on this device. Configure a sign,
          then click <span className="text-white/70">+ Save current</span>.
        </p>
      )}
    </section>
  );
}
