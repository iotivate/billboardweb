import { useBillboardStore } from "../state/useBillboardStore";
import { useTick } from "../hooks/useTick";
import {
  formatStopwatch,
  getStopwatchElapsedMs,
  hasStopwatchToken,
} from "../lib/tokens";

export function StopwatchControls() {
  const text = useBillboardStore((s) => s.text);
  const startedAt = useBillboardStore((s) => s.stopwatchStartedAt);
  const accumulatedPause = useBillboardStore((s) => s.stopwatchAccumulatedPause);
  const pausedAt = useBillboardStore((s) => s.stopwatchPausedAt);
  const reset = useBillboardStore((s) => s.resetStopwatch);
  const toggle = useBillboardStore((s) => s.toggleStopwatch);

  const isRunning = pausedAt === null;

  // Tick once per second only while running and only while the user
  // actually has the stopwatch token in their text — otherwise this
  // panel is hidden anyway.
  const tick = useTick(isRunning);
  const elapsed = getStopwatchElapsedMs(startedAt, accumulatedPause, pausedAt, tick);

  if (!hasStopwatchToken(text)) return null;

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-[10px] font-semibold uppercase tracking-wider text-white/50">
        Stopwatch
      </h2>
      <div className="flex items-center gap-2 p-2 rounded-md bg-white/5 border border-white/10">
        <span className="font-mono text-lg tabular-nums text-white px-2 min-w-[5ch] text-center">
          {formatStopwatch(elapsed)}
        </span>
        <button
          type="button"
          onClick={toggle}
          className={
            "flex-1 rounded py-1.5 px-2 text-[11px] font-bold uppercase tracking-wider transition-colors " +
            (isRunning
              ? "bg-white/10 text-white hover:bg-white/15"
              : "bg-emerald-500 text-black hover:bg-emerald-400")
          }
        >
          {isRunning ? "❚❚ Pause" : "▶ Resume"}
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded py-1.5 px-2 text-[11px] font-bold uppercase tracking-wider bg-white/10 text-white hover:bg-white/15 transition-colors"
        >
          ↺ Reset
        </button>
      </div>
    </section>
  );
}
