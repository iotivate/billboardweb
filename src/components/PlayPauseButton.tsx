import { useBillboardStore } from "../state/useBillboardStore";

export function PlayPauseButton() {
  const isPaused = useBillboardStore((s) => s.isPaused);
  const togglePaused = useBillboardStore((s) => s.togglePaused);

  return (
    <button
      type="button"
      onClick={togglePaused}
      className="rounded-md py-3 px-4 bg-white/5 border border-white/10 text-white font-bold tracking-wider text-sm uppercase hover:bg-white/10 transition-colors"
      aria-label={isPaused ? "Play" : "Pause"}
    >
      {isPaused ? "▶ Play" : "❚❚ Pause"}
      <span className="opacity-50 ml-2 text-xs">(Space)</span>
    </button>
  );
}
