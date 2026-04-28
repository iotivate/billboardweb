// Persistence + ID generation for the user's saved presets ("My signs").
// Kept under a separate localStorage key so the main config blob staying
// small is never a constraint on how many signs a user can save.

import type { SavedPreset } from "../data/types";

const KEY = "webbillboard:saved-presets:v1";

export function readSavedPresets(): SavedPreset[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isShapeValid);
  } catch {
    return [];
  }
}

export function writeSavedPresets(list: SavedPreset[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // quota or storage disabled — silently drop the write
  }
}

// crypto.randomUUID() exists in modern browsers, but fall back to a
// timestamp-based id for any environment where it isn't.
export function newSavedPresetId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return `sp-${crypto.randomUUID()}`;
  }
  return `sp-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function isShapeValid(v: unknown): v is SavedPreset {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.name === "string" &&
    typeof o.createdAt === "number" &&
    typeof o.text === "string" &&
    typeof o.style === "string" &&
    typeof o.speed === "number" &&
    typeof o.direction === "string" &&
    typeof o.accent === "string" &&
    typeof o.bg === "string" &&
    typeof o.font === "string" &&
    typeof o.fontSize === "number" &&
    typeof o.glow === "number" &&
    typeof o.outline === "boolean"
    // motion + gap are optional for forward compatibility — we'll fall
    // back to defaults if missing on read.
  );
}
