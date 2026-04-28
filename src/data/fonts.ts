import type { FontId } from "./types";

export interface FontOption {
  id: FontId;
  label: string;
  cssFamily: string;
  // Hint shown under the label so users can preview the vibe without
  // having to apply each one to read it.
  hint: string;
}

// Curated 6-font palette. Loaded via Google Fonts <link> in index.html.
// Adding new fonts means: extend FontId, add an entry here, and update
// the index.html <link> URL.
export const FONTS: readonly FontOption[] = [
  {
    id: "bebas",
    label: "Bebas Neue",
    cssFamily: "'Bebas Neue', Impact, sans-serif",
    hint: "Classic billboard",
  },
  {
    id: "inter",
    label: "Inter",
    cssFamily: "'Inter', system-ui, sans-serif",
    hint: "Modern sans",
  },
  {
    id: "vt323",
    label: "VT323",
    cssFamily: "'VT323', ui-monospace, monospace",
    hint: "Retro terminal",
  },
  {
    id: "marker",
    label: "Permanent Marker",
    cssFamily: "'Permanent Marker', cursive",
    hint: "Hand-drawn",
  },
  {
    id: "orbitron",
    label: "Orbitron",
    cssFamily: "'Orbitron', sans-serif",
    hint: "Sci-fi futurist",
  },
  {
    id: "pixel",
    label: "Press Start 2P",
    cssFamily: "'Press Start 2P', ui-monospace, monospace",
    hint: "8-bit pixel",
  },
] as const;

export const FONT_BY_ID: Record<FontId, FontOption> = FONTS.reduce(
  (acc, f) => {
    acc[f.id] = f;
    return acc;
  },
  {} as Record<FontId, FontOption>,
);

export const DEFAULT_FONT: FontId = "bebas";
