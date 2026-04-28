import { useEffect, useState } from "react";

// Returns Date.now() and re-renders the component every second, but only
// while `enabled` is true. Call as `const now = useTick(hasDynamicToken(text))`
// so static text doesn't pay for a re-render it doesn't need.
export function useTick(enabled: boolean): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!enabled) return;
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [enabled]);
  return now;
}
