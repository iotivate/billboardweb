import { useCallback, useEffect, useState } from "react";
import {
  activateLicense,
  DEV_PREVIEW_KEY,
  validateLicense,
  writeStoredLicense,
  type StoredLicense,
} from "../lib/license";
import { useBillboardStore } from "../state/useBillboardStore";
import type { ProductId } from "../data/products";

export type ActivationStatus = "idle" | "pending" | "success" | "error";

export function useLicense(productId: ProductId) {
  const license = useBillboardStore((s) => s.licenses[productId]);
  const setLicense = useBillboardStore((s) => s.setLicense);
  const [status, setStatus] = useState<ActivationStatus>("idle");

  // Re-validate any persisted license against LS on mount, in case the
  // user was refunded or the license was deactivated upstream.
  useEffect(() => {
    if (!license) return;
    let cancelled = false;
    void validateLicense(license).then((valid) => {
      if (cancelled) return;
      if (!valid) {
        writeStoredLicense(productId, null);
        setLicense(productId, null);
      }
    });
    return () => {
      cancelled = true;
    };
    // license intentionally not in deps — we only re-check on identity
    // changes which happen via setLicense, never mid-run.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const activate = useCallback(
    async (rawKey: string) => {
      setStatus("pending");
      const next = await activateLicense(rawKey);
      if (next) {
        writeStoredLicense(productId, next);
        setLicense(productId, next);
        setStatus("success");
        return true;
      }
      setStatus("error");
      return false;
    },
    [productId, setLicense],
  );

  const deactivate = useCallback(() => {
    writeStoredLicense(productId, null);
    setLicense(productId, null);
    setStatus("idle");
  }, [productId, setLicense]);

  const preview = useCallback(() => {
    if (!import.meta.env.DEV) return;
    const next: StoredLicense = {
      key: DEV_PREVIEW_KEY,
      instanceId: "preview",
      activatedAt: Date.now(),
    };
    writeStoredLicense(productId, next);
    setLicense(productId, next);
  }, [productId, setLicense]);

  return {
    isLicensed: Boolean(license),
    activate,
    deactivate,
    preview,
    status,
  };
}
