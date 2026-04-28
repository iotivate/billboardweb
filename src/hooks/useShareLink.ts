import { useCallback, useEffect, useState } from "react";
import { useBillboardStore } from "../state/useBillboardStore";
import { buildShareUrl, decodeStateFromHash } from "../lib/share";

// Mount once at the app root. Imports a shared config from the URL hash
// into the store, then leaves the hash in place so the link still reads
// as a sharable URL.
export function useImportSharedState() {
  const hydrateState = useBillboardStore((s) => s.hydrateState);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const incoming = decodeStateFromHash(window.location.hash);
    if (incoming) hydrateState(incoming);
  }, [hydrateState]);
}

// Used by the share button: copies a freshly-built URL of the current state.
export function useShareLink() {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    const state = useBillboardStore.getState();
    const url = buildShareUrl(state);
    try {
      await navigator.clipboard.writeText(url);
      if (typeof window !== "undefined") {
        window.history.replaceState(null, "", url);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      if (typeof window !== "undefined") {
        window.prompt("Copy this link:", url);
      }
    }
  }, []);

  return { copy, copied };
}
