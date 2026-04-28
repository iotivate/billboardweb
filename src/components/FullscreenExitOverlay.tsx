import { useEffect, useState } from "react";
import { useBillboardStore } from "../state/useBillboardStore";

interface FullscreenExitOverlayProps {
  onExit: () => void;
}

// Small floating ✕ button that lets touch users exit pseudo-fullscreen
// (iOS and any other browser that doesn't support real Fullscreen API).
// Auto-hides after 2.5s of inactivity to stay out of the way of filming;
// any tap on the screen brings it back briefly.
export function FullscreenExitOverlay({ onExit }: FullscreenExitOverlayProps) {
  const isFullscreen = useBillboardStore((s) => s.isFullscreen);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!isFullscreen) return;
    setVisible(true);

    let hideTimer = window.setTimeout(() => setVisible(false), 2500);

    const onAnyTap = () => {
      setVisible(true);
      window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(() => setVisible(false), 2500);
    };

    window.addEventListener("pointerdown", onAnyTap);
    return () => {
      window.removeEventListener("pointerdown", onAnyTap);
      window.clearTimeout(hideTimer);
    };
  }, [isFullscreen]);

  if (!isFullscreen) return null;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onExit();
      }}
      aria-label="Exit fullscreen"
      className={
        "fixed top-3 right-3 z-[1000] w-11 h-11 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 text-white text-lg flex items-center justify-center transition-opacity duration-300 " +
        (visible ? "opacity-100" : "opacity-0 pointer-events-none")
      }
    >
      ✕
    </button>
  );
}
