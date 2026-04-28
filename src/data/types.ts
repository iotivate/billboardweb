export type Style = "neon" | "solid" | "led";
export type Direction = "left" | "right" | "up" | "down";
export type Motion = "scroll" | "static" | "blink" | "pulse";

export interface Preset {
  id: string;
  label: string;
  text: string;
  style: Style;
  speed: number;
  direction: Direction;
  motion?: Motion;
  accent?: string;
  font?: FontId;
  fontSize?: number;
  glow?: number;
  outline?: boolean;
  gap?: number;
  ledSize?: number;
}

export interface PresetPack {
  id: string;
  name: string;
  description: string;
  presets: readonly Preset[];
  // If present, this pack is gated by a paid product. The id maps to an
  // entry in PRODUCTS and to the per-product license stored under the
  // matching key. Free packs leave this undefined.
  productId?: import("./products").ProductId;
  /** Optional pair of accent colors used for the locked-pack card preview. */
  swatchColors?: readonly string[];
}

// A user's own saved billboard config. Captures every visual field
// (the same set as Preset) plus a name and timestamp. Stored in its
// own localStorage key so it survives the main config blob being reset.
// Image is intentionally NOT included — it's user-global, not
// per-preset, and the data URL would balloon storage size.
export interface SavedPreset {
  id: string;
  name: string;
  createdAt: number;
  text: string;
  style: Style;
  speed: number;
  direction: Direction;
  motion: Motion;
  accent: string;
  bg: string;
  font: FontId;
  fontSize: number;
  glow: number;
  outline: boolean;
  gap: number;
}

export type FontId =
  | "bebas"
  | "inter"
  | "vt323"
  | "marker"
  | "orbitron"
  | "pixel";

export interface BillboardState {
  text: string;
  style: Style;
  speed: number;
  direction: Direction;
  motion: Motion;
  accent: string;
  bg: string;
  font: FontId;
  fontSize: number;
  glow: number;
  outline: boolean;
  /** Spacing between marquee repeats, 0–100. Mapped to em-padding on cells. */
  gap: number;
  /** LED dot pitch, 0–100. Bigger values = bigger, more spaced dots that
   * survive video capture without diffusing into a solid block. */
  ledSize: number;
  // image is held in the store but persisted/loaded under a SEPARATE
  // localStorage key, and is intentionally excluded from share URLs
  // (data URLs would bloat the link past usable length).
  image: string | null;
  imageAspect: number; // width / height — kept so silhouette layout doesn't pop
  // Stopwatch state — persisted across refreshes so a streamer who
  // refreshes mid-stream doesn't lose their count. Excluded from share
  // URLs (it's session-personal, not part of the look).
  stopwatchStartedAt: number;
  stopwatchAccumulatedPause: number;
  stopwatchPausedAt: number | null;
}
