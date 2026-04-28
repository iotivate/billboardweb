import type { Preset, PresetPack } from "./types";
import { CYBERPUNK_PACK } from "./cyberpunk";
import { RETRO_DINER_PACK } from "./retro-diner";

const FREE_PRESETS: readonly Preset[] = [
  {
    id: "grand-opening",
    label: "Grand Opening",
    text: "GRAND OPENING",
    style: "neon",
    speed: 40,
    direction: "left",
    accent: "#ffd700",
    font: "bebas",
  },
  {
    id: "live-now",
    label: "LIVE Now",
    text: "● LIVE NOW ●",
    style: "neon",
    speed: 75,
    direction: "left",
    accent: "#ff2d2d",
    font: "bebas",
  },
  {
    id: "sale",
    label: "Sale",
    text: "SALE — 50% OFF",
    style: "led",
    speed: 60,
    direction: "left",
    accent: "#ff3b3b",
    font: "vt323",
  },
  {
    id: "now-open",
    label: "Now Open",
    text: "NOW OPEN",
    style: "neon",
    speed: 50,
    direction: "left",
    accent: "#39ff14",
    font: "bebas",
  },
  {
    id: "donate",
    label: "Donate",
    text: "DONATE",
    style: "neon",
    speed: 55,
    direction: "up",
    accent: "#b026ff",
    font: "orbitron",
  },
  {
    id: "coming-soon",
    label: "Coming Soon",
    text: "COMING SOON",
    style: "solid",
    speed: 30,
    direction: "right",
    accent: "#ffffff",
    font: "bebas",
  },
] as const;

export const STARTER_PACK: PresetPack = {
  id: "free-starter",
  name: "Starter",
  description: "The 6 essentials. Free for everyone.",
  presets: FREE_PRESETS,
};

// Ordered list of all packs. Adding a new paid pack means: create a file
// like `data/cyberpunk.ts`, append the import, and add the pack here.
export const PRESET_PACKS: readonly PresetPack[] = [
  STARTER_PACK,
  CYBERPUNK_PACK,
  RETRO_DINER_PACK,
] as const;

// Backwards-compat: the old PRESETS export is the FREE pack only. Code
// that needs the unlocked union should call getUnlockedPresets() with
// the current license map instead.
export const PRESETS: readonly Preset[] = FREE_PRESETS;

// Returns presets from packs that are either free or whose license is
// currently held. Order: starter pack first, then any unlocked paid
// packs in registry order. Used by PresetBar and the keyboard shortcuts.
export function getUnlockedPresets(
  isUnlocked: (productId: string) => boolean,
): readonly Preset[] {
  const out: Preset[] = [];
  for (const pack of PRESET_PACKS) {
    if (pack.productId && !isUnlocked(pack.productId)) continue;
    out.push(...pack.presets);
  }
  return out;
}
