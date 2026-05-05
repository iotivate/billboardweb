// Client-side Lemon Squeezy license activation + validation.
// LS license endpoints accept the license key itself as auth, so we can
// call them directly from the browser without exposing a secret.
//
// Each product (watermark removal, preset packs, future Pro features)
// gets its own license stored under a separate localStorage key so a
// user can hold multiple licenses simultaneously.
//
// Docs: https://docs.lemonsqueezy.com/api/license-api

import type { ProductId } from "../data/products";

const LS_API = "https://api.lemonsqueezy.com/v1";
const STORAGE_PREFIX = "webbillboard:license:";
const LEGACY_WATERMARK_KEY = "webbillboard:license:v1";

// Magic license key that bypasses LS validation. Only ever issued by the
// dev-only preview button (see useLicense.preview), which is itself
// gated by import.meta.env.DEV and tree-shaken in production builds.
export const DEV_PREVIEW_KEY = "__DEV_PREVIEW__";

export interface StoredLicense {
  key: string;
  instanceId: string;
  activatedAt: number;
}

interface ActivateResponse {
  activated?: boolean;
  instance?: { id?: string };
  error?: string;
}

interface ValidateResponse {
  valid?: boolean;
  error?: string;
}

function storageKey(productId: ProductId): string {
  return `${STORAGE_PREFIX}${productId}`;
}

function instanceName(): string {
  if (typeof navigator === "undefined") return "billboardweb";
  return navigator.userAgent.slice(0, 80) || "billboardweb";
}

export async function activateLicense(
  rawKey: string,
): Promise<StoredLicense | null> {
  const key = rawKey.trim();
  if (!key) return null;
  const body = new URLSearchParams({
    license_key: key,
    instance_name: instanceName(),
  });
  try {
    const res = await fetch(`${LS_API}/licenses/activate`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });
    if (!res.ok) return null;
    const json = (await res.json()) as ActivateResponse;
    if (!json.activated || !json.instance?.id) return null;
    return { key, instanceId: json.instance.id, activatedAt: Date.now() };
  } catch {
    return null;
  }
}

export async function validateLicense(stored: StoredLicense): Promise<boolean> {
  // Dev-issued preview licenses skip the LS round trip — they have no
  // real key/instance to validate against. Production builds never
  // reach this path because the preview button is tree-shaken out.
  if (stored.key === DEV_PREVIEW_KEY) return true;

  const body = new URLSearchParams({
    license_key: stored.key,
    instance_id: stored.instanceId,
  });
  try {
    const res = await fetch(`${LS_API}/licenses/validate`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });
    if (!res.ok) return false;
    const json = (await res.json()) as ValidateResponse;
    return Boolean(json.valid);
  } catch {
    // Network failure during validation should not lock a previously-valid
    // license out. Treat as valid; we'll re-check next load.
    return true;
  }
}

export function readStoredLicense(productId: ProductId): StoredLicense | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(storageKey(productId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredLicense>;
    if (
      typeof parsed.key === "string" &&
      typeof parsed.instanceId === "string" &&
      typeof parsed.activatedAt === "number"
    ) {
      return parsed as StoredLicense;
    }
    return null;
  } catch {
    return null;
  }
}

export function writeStoredLicense(
  productId: ProductId,
  license: StoredLicense | null,
): void {
  if (typeof window === "undefined") return;
  try {
    if (license) {
      window.localStorage.setItem(storageKey(productId), JSON.stringify(license));
    } else {
      window.localStorage.removeItem(storageKey(productId));
    }
  } catch {
    // quota / disabled storage — silently drop
  }
}

// One-time migration: the original watermark license lived under a
// generic `webbillboard:license:v1` key. Move it to the per-product
// `webbillboard:license:watermark` key. Idempotent — safe to run on
// every load.
export function migrateLegacyWatermarkLicense(): void {
  if (typeof window === "undefined") return;
  try {
    const legacy = window.localStorage.getItem(LEGACY_WATERMARK_KEY);
    if (!legacy) return;
    const targetKey = storageKey("watermark");
    if (!window.localStorage.getItem(targetKey)) {
      window.localStorage.setItem(targetKey, legacy);
    }
    window.localStorage.removeItem(LEGACY_WATERMARK_KEY);
  } catch {
    // ignore
  }
}
