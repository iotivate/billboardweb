import { useEffect } from "react";
import { useBillboardStore, STORAGE } from "../state/useBillboardStore";

const DEBOUNCE_MS = 300;

export function usePersistence() {
  useEffect(() => {
    let timer: number | undefined;

    const unsubscribe = useBillboardStore.subscribe((state, prev) => {
      const configChanged =
        state.text !== prev.text ||
        state.style !== prev.style ||
        state.speed !== prev.speed ||
        state.direction !== prev.direction ||
        state.motion !== prev.motion ||
        state.accent !== prev.accent ||
        state.bg !== prev.bg ||
        state.font !== prev.font ||
        state.fontSize !== prev.fontSize ||
        state.glow !== prev.glow ||
        state.outline !== prev.outline ||
        state.gap !== prev.gap ||
        state.ledSize !== prev.ledSize ||
        state.stopwatchStartedAt !== prev.stopwatchStartedAt ||
        state.stopwatchAccumulatedPause !== prev.stopwatchAccumulatedPause ||
        state.stopwatchPausedAt !== prev.stopwatchPausedAt ||
        state.imageAspect !== prev.imageAspect;
      const imageChanged = state.image !== prev.image;

      if (configChanged) {
        if (timer !== undefined) window.clearTimeout(timer);
        timer = window.setTimeout(() => {
          try {
            window.localStorage.setItem(
              STORAGE.key,
              JSON.stringify({
                text: state.text,
                style: state.style,
                speed: state.speed,
                direction: state.direction,
                motion: state.motion,
                accent: state.accent,
                bg: state.bg,
                font: state.font,
                fontSize: state.fontSize,
                glow: state.glow,
                outline: state.outline,
                gap: state.gap,
                ledSize: state.ledSize,
                stopwatchStartedAt: state.stopwatchStartedAt,
                stopwatchAccumulatedPause: state.stopwatchAccumulatedPause,
                stopwatchPausedAt: state.stopwatchPausedAt,
                imageAspect: state.imageAspect,
              }),
            );
          } catch {
            // quota exceeded or storage disabled — silently drop
          }
        }, DEBOUNCE_MS);
      }

      if (imageChanged) {
        // Image writes are not debounced: setImage is already a single,
        // user-initiated event (file pick or clear).
        try {
          if (state.image) {
            window.localStorage.setItem(STORAGE.imageKey, state.image);
          } else {
            window.localStorage.removeItem(STORAGE.imageKey);
          }
        } catch {
          // Likely quota exceeded — image is large. Drop it from storage
          // but keep the in-memory copy so the current session still works.
        }
      }
    });

    return () => {
      if (timer !== undefined) window.clearTimeout(timer);
      unsubscribe();
    };
  }, []);
}
