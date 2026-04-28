import { useEffect } from "react";
import { useBillboardStore } from "../state/useBillboardStore";
import { getUnlockedPresets } from "../data/presets";
import type { Direction } from "../data/types";

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable;
}

const ARROW_TO_DIRECTION: Record<string, Direction> = {
  ArrowLeft: "left",
  ArrowRight: "right",
  ArrowUp: "up",
  ArrowDown: "down",
};

export function useShortcuts() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      // Space → toggle pause
      if (e.code === "Space") {
        e.preventDefault();
        useBillboardStore.getState().togglePaused();
        return;
      }

      // 1–9 → apply unlocked preset (starter pack first, then unlocked
      // paid packs). Read the licenses map at event time so newly unlocked
      // packs become reachable without remount.
      if (e.key >= "1" && e.key <= "9") {
        const idx = Number(e.key) - 1;
        const state = useBillboardStore.getState();
        const presets = getUnlockedPresets((id) =>
          Boolean(state.licenses[id as keyof typeof state.licenses]),
        );
        const preset = presets[idx];
        if (preset) {
          e.preventDefault();
          state.applyPreset(preset);
        }
        return;
      }

      const dir = ARROW_TO_DIRECTION[e.key];
      if (dir) {
        e.preventDefault();
        const state = useBillboardStore.getState();
        state.setDirection(dir);
        // If user is in static/blink/pulse, they probably meant "scroll
        // that direction" by pressing an arrow key. Snap them back.
        if (state.motion !== "scroll") state.setMotion("scroll");
        return;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}
