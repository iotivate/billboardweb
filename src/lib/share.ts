// URL-hash sharing: encodes the user's billboard config so a single link
// reproduces the exact look on any other browser. No server required —
// the link IS the state. This is the v0 distribution loop.

import type { BillboardState } from "../data/types";

const HASH_KEY = "s";

// URL-safe base64 (no padding, +/ → -_). btoa works on Latin-1 only,
// so we encodeURIComponent first to handle emoji and non-ASCII text.
function toBase64Url(input: string): string {
  const utf8 = unescape(encodeURIComponent(input));
  return btoa(utf8).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(input: string): string {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  const utf8 = atob(padded + "===".slice((padded.length + 3) % 4));
  return decodeURIComponent(escape(utf8));
}

export function encodeStateToHash(state: BillboardState): string {
  const payload = JSON.stringify({
    t: state.text,
    s: state.style,
    p: state.speed,
    d: state.direction,
    mo: state.motion,
    a: state.accent,
    b: state.bg,
    f: state.font,
    z: state.fontSize,
    g: state.glow,
    o: state.outline,
    gp: state.gap,
    l: state.ledSize,
  });
  return `#${HASH_KEY}=${toBase64Url(payload)}`;
}

export function decodeStateFromHash(hash: string): Partial<BillboardState> | null {
  if (!hash) return null;
  const trimmed = hash.startsWith("#") ? hash.slice(1) : hash;
  const params = new URLSearchParams(trimmed);
  const raw = params.get(HASH_KEY);
  if (!raw) return null;
  try {
    const json = JSON.parse(fromBase64Url(raw)) as {
      t?: string;
      s?: string;
      p?: number;
      d?: string;
      mo?: string;
      a?: string;
      b?: string;
      f?: string;
      z?: number;
      g?: number;
      o?: boolean;
      gp?: number;
      l?: number;
    };
    return {
      text: json.t,
      style: json.s as BillboardState["style"] | undefined,
      speed: json.p,
      direction: json.d as BillboardState["direction"] | undefined,
      motion: json.mo as BillboardState["motion"] | undefined,
      accent: json.a,
      bg: json.b,
      font: json.f as BillboardState["font"] | undefined,
      fontSize: json.z,
      glow: json.g,
      outline: json.o,
      gap: json.gp,
      ledSize: json.l,
    };
  } catch {
    return null;
  }
}

export function buildShareUrl(state: BillboardState): string {
  if (typeof window === "undefined") return "";
  const { origin, pathname } = window.location;
  return `${origin}${pathname}${encodeStateToHash(state)}`;
}
