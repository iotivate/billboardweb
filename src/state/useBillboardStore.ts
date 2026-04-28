import { create } from "zustand";
import type {
  BillboardState,
  Direction,
  FontId,
  Motion,
  Preset,
  SavedPreset,
  Style,
} from "../data/types";
import {
  newSavedPresetId,
  readSavedPresets,
  writeSavedPresets,
} from "../lib/savedPresets";
import { DEFAULT_FONT, FONT_BY_ID } from "../data/fonts";
import type { ProductId } from "../data/products";
import {
  migrateLegacyWatermarkLicense,
  readStoredLicense,
  type StoredLicense,
} from "../lib/license";

const STORAGE_KEY = "webbillboard:v1";
const IMAGE_STORAGE_KEY = "webbillboard:image:v1";

const DEFAULTS: BillboardState = {
  text: "WEBBILLBOARD",
  style: "neon",
  speed: 50,
  direction: "left",
  motion: "scroll",
  accent: "#ff00de",
  bg: "#0a0a0f",
  font: DEFAULT_FONT,
  fontSize: 100,
  glow: 60,
  outline: false,
  gap: 50,
  ledSize: 50,
  image: null,
  imageAspect: 1,
  stopwatchStartedAt: 0,
  stopwatchAccumulatedPause: 0,
  stopwatchPausedAt: null,
};

const FONT_SIZE_MIN = 50;
const FONT_SIZE_MAX = 200;

function isValidFontSize(v: unknown): v is number {
  return typeof v === "number" && v >= FONT_SIZE_MIN && v <= FONT_SIZE_MAX;
}

function isValidPositiveNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v) && v >= 0;
}

function readPersisted(): BillboardState {
  const fallback: BillboardState = { ...DEFAULTS, stopwatchStartedAt: Date.now() };
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const image = readPersistedImage();
    if (!raw) return { ...fallback, image };
    const parsed = JSON.parse(raw) as Partial<BillboardState>;
    return {
      text: typeof parsed.text === "string" ? parsed.text : DEFAULTS.text,
      style: isStyle(parsed.style) ? parsed.style : DEFAULTS.style,
      speed:
        typeof parsed.speed === "number" && parsed.speed >= 0 && parsed.speed <= 100
          ? parsed.speed
          : DEFAULTS.speed,
      direction: isDirection(parsed.direction) ? parsed.direction : DEFAULTS.direction,
      motion: isMotion(parsed.motion) ? parsed.motion : DEFAULTS.motion,
      accent: isHexColor(parsed.accent) ? parsed.accent : DEFAULTS.accent,
      bg: isHexColor(parsed.bg) ? parsed.bg : DEFAULTS.bg,
      font: isFont(parsed.font) ? parsed.font : DEFAULTS.font,
      fontSize: isValidFontSize(parsed.fontSize) ? parsed.fontSize : DEFAULTS.fontSize,
      glow:
        typeof parsed.glow === "number" && parsed.glow >= 0 && parsed.glow <= 100
          ? parsed.glow
          : DEFAULTS.glow,
      outline: typeof parsed.outline === "boolean" ? parsed.outline : DEFAULTS.outline,
      gap:
        typeof parsed.gap === "number" && parsed.gap >= 0 && parsed.gap <= 100
          ? parsed.gap
          : DEFAULTS.gap,
      ledSize:
        typeof parsed.ledSize === "number" &&
        parsed.ledSize >= 0 &&
        parsed.ledSize <= 100
          ? parsed.ledSize
          : DEFAULTS.ledSize,
      image,
      imageAspect:
        typeof parsed.imageAspect === "number" &&
        parsed.imageAspect > 0 &&
        Number.isFinite(parsed.imageAspect)
          ? parsed.imageAspect
          : DEFAULTS.imageAspect,
      stopwatchStartedAt: isValidPositiveNumber(parsed.stopwatchStartedAt)
        ? parsed.stopwatchStartedAt
        : Date.now(),
      stopwatchAccumulatedPause: isValidPositiveNumber(parsed.stopwatchAccumulatedPause)
        ? parsed.stopwatchAccumulatedPause
        : 0,
      stopwatchPausedAt:
        parsed.stopwatchPausedAt === null
          ? null
          : isValidPositiveNumber(parsed.stopwatchPausedAt)
            ? parsed.stopwatchPausedAt
            : null,
    };
  } catch {
    return fallback;
  }
}

function readPersistedImage(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(IMAGE_STORAGE_KEY);
    if (!raw) return null;
    if (raw.startsWith("data:image/")) return raw;
    return null;
  } catch {
    return null;
  }
}

function readInitialLicenses(): Record<ProductId, StoredLicense | null> {
  migrateLegacyWatermarkLicense();
  return {
    watermark: readStoredLicense("watermark"),
    "pack-cyberpunk": readStoredLicense("pack-cyberpunk"),
    "pack-retro-diner": readStoredLicense("pack-retro-diner"),
  };
}

function isStyle(v: unknown): v is Style {
  return v === "neon" || v === "solid" || v === "led";
}
function isDirection(v: unknown): v is Direction {
  return v === "left" || v === "right" || v === "up" || v === "down";
}
function isMotion(v: unknown): v is Motion {
  return v === "scroll" || v === "static" || v === "blink" || v === "pulse";
}
function isHexColor(v: unknown): v is string {
  return typeof v === "string" && /^#[0-9a-fA-F]{3,8}$/.test(v);
}
function isFont(v: unknown): v is FontId {
  return typeof v === "string" && v in FONT_BY_ID;
}

interface Store extends BillboardState {
  isFullscreen: boolean;
  isPaused: boolean;
  licenses: Record<ProductId, StoredLicense | null>;
  savedPresets: SavedPreset[];
  setText: (text: string) => void;
  setStyle: (style: Style) => void;
  setSpeed: (speed: number) => void;
  setDirection: (direction: Direction) => void;
  setMotion: (motion: Motion) => void;
  setAccent: (accent: string) => void;
  setBg: (bg: string) => void;
  setFont: (font: FontId) => void;
  setFontSize: (fontSize: number) => void;
  setGlow: (glow: number) => void;
  setOutline: (outline: boolean) => void;
  toggleOutline: () => void;
  setGap: (gap: number) => void;
  setLedSize: (ledSize: number) => void;
  setFullscreen: (isFullscreen: boolean) => void;
  setPaused: (isPaused: boolean) => void;
  togglePaused: () => void;
  setLicense: (id: ProductId, license: StoredLicense | null) => void;
  saveCurrentAsPreset: (name: string) => void;
  removeSavedPreset: (id: string) => void;
  renameSavedPreset: (id: string, name: string) => void;
  applySavedPreset: (id: string) => void;
  setImage: (image: string | null, aspect?: number) => void;
  resetStopwatch: () => void;
  toggleStopwatch: () => void;
  applyPreset: (p: Preset) => void;
  hydrateState: (next: Partial<BillboardState>) => void;
}

export const useBillboardStore = create<Store>((set) => ({
  ...readPersisted(),
  isFullscreen: false,
  isPaused: false,
  licenses: readInitialLicenses(),
  savedPresets: readSavedPresets(),
  setText: (text) => set({ text }),
  setStyle: (style) => set({ style }),
  setSpeed: (speed) => set({ speed }),
  setDirection: (direction) => set({ direction }),
  setMotion: (motion) => set({ motion }),
  setAccent: (accent) => set({ accent }),
  setBg: (bg) => set({ bg }),
  setFont: (font) => set({ font }),
  setFontSize: (fontSize) => set({ fontSize }),
  setGlow: (glow) => set({ glow }),
  setOutline: (outline) => set({ outline }),
  toggleOutline: () => set((s) => ({ outline: !s.outline })),
  setGap: (gap) => set({ gap }),
  setLedSize: (ledSize) => set({ ledSize }),
  setFullscreen: (isFullscreen) => set({ isFullscreen }),
  setPaused: (isPaused) => set({ isPaused }),
  togglePaused: () => set((s) => ({ isPaused: !s.isPaused })),
  setLicense: (id, license) =>
    set((s) => ({ licenses: { ...s.licenses, [id]: license } })),
  saveCurrentAsPreset: (name) =>
    set((s) => {
      const next: SavedPreset = {
        id: newSavedPresetId(),
        name,
        createdAt: Date.now(),
        text: s.text,
        style: s.style,
        speed: s.speed,
        direction: s.direction,
        motion: s.motion,
        accent: s.accent,
        bg: s.bg,
        font: s.font,
        fontSize: s.fontSize,
        glow: s.glow,
        outline: s.outline,
        gap: s.gap,
      };
      const list = [...s.savedPresets, next];
      writeSavedPresets(list);
      return { savedPresets: list };
    }),
  removeSavedPreset: (id) =>
    set((s) => {
      const list = s.savedPresets.filter((p) => p.id !== id);
      writeSavedPresets(list);
      return { savedPresets: list };
    }),
  renameSavedPreset: (id, name) =>
    set((s) => {
      const list = s.savedPresets.map((p) =>
        p.id === id ? { ...p, name } : p,
      );
      writeSavedPresets(list);
      return { savedPresets: list };
    }),
  applySavedPreset: (id) =>
    set((s) => {
      const p = s.savedPresets.find((sp) => sp.id === id);
      if (!p) return {};
      return {
        text: p.text,
        style: p.style,
        speed: p.speed,
        direction: p.direction,
        motion: isMotion(p.motion) ? p.motion : s.motion,
        accent: p.accent,
        bg: p.bg,
        font: p.font,
        fontSize: p.fontSize,
        glow: p.glow,
        outline: p.outline,
        gap: typeof p.gap === "number" ? p.gap : s.gap,
      };
    }),
  setImage: (image, aspect) =>
    set((s) => ({
      image,
      imageAspect:
        image === null
          ? 1
          : typeof aspect === "number" && aspect > 0 && Number.isFinite(aspect)
            ? aspect
            : s.imageAspect,
    })),
  resetStopwatch: () =>
    set({
      stopwatchStartedAt: Date.now(),
      stopwatchAccumulatedPause: 0,
      stopwatchPausedAt: null,
    }),
  toggleStopwatch: () =>
    set((s) => {
      if (s.stopwatchPausedAt === null) {
        return { stopwatchPausedAt: Date.now() };
      }
      const pausedSpan = Date.now() - s.stopwatchPausedAt;
      return {
        stopwatchPausedAt: null,
        stopwatchAccumulatedPause: s.stopwatchAccumulatedPause + Math.max(0, pausedSpan),
      };
    }),
  applyPreset: (p) =>
    set((s) => ({
      text: p.text,
      style: p.style,
      speed: p.speed,
      direction: p.direction,
      // Presets without explicit motion default to scroll — every preset
      // we ship is a scroll preset, but preserving an explicit motion
      // field lets future "BLINK NOW" / "PULSE LIVE" presets carry it.
      motion: p.motion ?? "scroll",
      accent: p.accent ?? DEFAULTS.accent,
      font: p.font ?? s.font,
      fontSize: isValidFontSize(p.fontSize) ? p.fontSize : s.fontSize,
      glow: typeof p.glow === "number" ? p.glow : s.glow,
      outline: typeof p.outline === "boolean" ? p.outline : s.outline,
      gap: typeof p.gap === "number" && p.gap >= 0 && p.gap <= 100 ? p.gap : s.gap,
      ledSize:
        typeof p.ledSize === "number" && p.ledSize >= 0 && p.ledSize <= 100
          ? p.ledSize
          : s.ledSize,
    })),
  hydrateState: (next) =>
    set((s) => ({
      text: typeof next.text === "string" ? next.text : s.text,
      style: isStyle(next.style) ? next.style : s.style,
      speed:
        typeof next.speed === "number" && next.speed >= 0 && next.speed <= 100
          ? next.speed
          : s.speed,
      direction: isDirection(next.direction) ? next.direction : s.direction,
      motion: isMotion(next.motion) ? next.motion : s.motion,
      accent: isHexColor(next.accent) ? next.accent : s.accent,
      bg: isHexColor(next.bg) ? next.bg : s.bg,
      font: isFont(next.font) ? next.font : s.font,
      fontSize: isValidFontSize(next.fontSize) ? next.fontSize : s.fontSize,
      glow:
        typeof next.glow === "number" && next.glow >= 0 && next.glow <= 100
          ? next.glow
          : s.glow,
      outline: typeof next.outline === "boolean" ? next.outline : s.outline,
      gap:
        typeof next.gap === "number" && next.gap >= 0 && next.gap <= 100
          ? next.gap
          : s.gap,
      ledSize:
        typeof next.ledSize === "number" &&
        next.ledSize >= 0 &&
        next.ledSize <= 100
          ? next.ledSize
          : s.ledSize,
    })),
}));

export const STORAGE = { key: STORAGE_KEY, imageKey: IMAGE_STORAGE_KEY };
