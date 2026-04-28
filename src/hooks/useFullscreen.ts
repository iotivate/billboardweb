import { useCallback, useEffect, useRef, type RefObject } from "react";
import { useBillboardStore } from "../state/useBillboardStore";

interface FullscreenElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void>;
}
interface FullscreenDocument extends Document {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void>;
}

type Mode = "real" | "pseudo" | null;

export function useFullscreen(ref: RefObject<HTMLElement | null>) {
  const isFullscreen = useBillboardStore((s) => s.isFullscreen);
  const setFullscreen = useBillboardStore((s) => s.setFullscreen);

  // Track HOW we entered fullscreen so exit dispatches to the right path.
  // iOS Safari/Chrome (WebKit) doesn't implement requestFullscreen on
  // arbitrary elements, so we fall back to a CSS-only pseudo-fullscreen
  // that hides the control panel and lets the billboard fill the viewport.
  const modeRef = useRef<Mode>(null);

  const enter = useCallback(async () => {
    const el = ref.current as FullscreenElement | null;
    if (!el) return;
    // Try the real API first; if it isn't supported or the call rejects
    // (iOS), fall through to pseudo-fullscreen.
    try {
      if (el.requestFullscreen) {
        await el.requestFullscreen();
        modeRef.current = "real";
        return;
      }
      if (el.webkitRequestFullscreen) {
        await el.webkitRequestFullscreen();
        modeRef.current = "real";
        return;
      }
    } catch {
      // fall through
    }
    modeRef.current = "pseudo";
    setFullscreen(true);
  }, [ref, setFullscreen]);

  const exit = useCallback(async () => {
    if (modeRef.current === "pseudo") {
      modeRef.current = null;
      setFullscreen(false);
      return;
    }
    const doc = document as FullscreenDocument;
    try {
      if (doc.fullscreenElement && doc.exitFullscreen) await doc.exitFullscreen();
      else if (doc.webkitFullscreenElement && doc.webkitExitFullscreen)
        await doc.webkitExitFullscreen();
    } catch {
      // ignore
    }
  }, [setFullscreen]);

  const toggle = useCallback(() => {
    const doc = document as FullscreenDocument;
    const inReal = Boolean(doc.fullscreenElement || doc.webkitFullscreenElement);
    if (inReal || modeRef.current === "pseudo") void exit();
    else void enter();
  }, [enter, exit]);

  // Sync isFullscreen in the store with the browser's real fullscreen state.
  // (Pseudo-fullscreen sets the flag directly inside enter()/exit().)
  useEffect(() => {
    const sync = () => {
      const doc = document as FullscreenDocument;
      const real = Boolean(doc.fullscreenElement || doc.webkitFullscreenElement);
      if (real) modeRef.current = "real";
      else if (modeRef.current === "real") modeRef.current = null;
      // Don't touch pseudo state here.
      if (modeRef.current !== "pseudo") setFullscreen(real);
    };
    document.addEventListener("fullscreenchange", sync);
    document.addEventListener("webkitfullscreenchange", sync);
    return () => {
      document.removeEventListener("fullscreenchange", sync);
      document.removeEventListener("webkitfullscreenchange", sync);
    };
  }, [setFullscreen]);

  // Esc to exit pseudo-fullscreen (matches the real-API behavior).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && modeRef.current === "pseudo") {
        e.preventDefault();
        void exit();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [exit]);

  // F-key toggle (skips when typing).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "f" && e.key !== "F") return;
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || target?.isContentEditable) return;
      e.preventDefault();
      toggle();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);

  return { isFullscreen, enter, exit, toggle };
}
