import { useBillboardStore } from "../state/useBillboardStore";

export function PlayPauseButton() {
  const isPaused = useBillboardStore((s) => s.isPaused);
  const togglePaused = useBillboardStore((s) => s.togglePaused);

  // Compact (icon-only) so the Fullscreen button next to it gets the
  // visual weight. Keyboard hint is in the title; icons are large enough
  // to be tappable on mobile.
  return (
    <button
      type="button"
      onClick={togglePaused}
      title={isPaused ? "Play (Space)" : "Pause (Space)"}
      className="rounded-md py-3.5 px-4 bg-white/5 border border-white/10 text-white text-base hover:bg-white/10 transition-colors"
      aria-label={isPaused ? "Play" : "Pause"}
    >
      {isPaused ? "▶" : "❚❚"}
    </button>
  );
}
