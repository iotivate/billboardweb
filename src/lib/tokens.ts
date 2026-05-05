// Token-based segment parsing.
//
// Users type strings like "OPEN UNTIL ${time}" or "SCAN: ${qr:https://x}"
// or "${img} GRAND OPENING". We split that into a list of segments, each
// rendered differently. Dynamic tokens (time/date/countdown/stopwatch)
// resolve to text and need a per-second tick to update; static tokens
// (qr, img) resolve to React elements.

export type Segment =
  | { type: "text"; value: string }
  | { type: "qr"; value: string }
  | { type: "image" }
  | { type: "watermark"; value: string };

export interface TokenContext {
  now: number;
  stopwatchElapsedMs: number;
}

const TOKEN_RE = /\$\{([^}]+)\}/g;

const DYNAMIC_TOKEN_RE = /\$\{(time(?:24)?|date|weekday|stopwatch|countdown:)/i;

function pad(n: number, len = 2): string {
  return String(n).padStart(len, "0");
}

export function formatStopwatch(elapsedMs: number): string {
  const elapsed = Math.max(0, Math.floor(elapsedMs / 1000));
  const h = Math.floor(elapsed / 3600);
  const m = Math.floor((elapsed % 3600) / 60);
  const s = elapsed % 60;
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

function resolveTextToken(token: string, ctx: TokenContext): string | null {
  if (token === "time") {
    return new Date(ctx.now).toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
  }
  if (token === "time24") {
    const d = new Date(ctx.now);
    return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
  if (token === "date") {
    return new Date(ctx.now).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  }
  if (token === "weekday") {
    return new Date(ctx.now).toLocaleDateString(undefined, { weekday: "long" });
  }
  if (token === "stopwatch") {
    return formatStopwatch(ctx.stopwatchElapsedMs);
  }
  if (token.startsWith("countdown:")) {
    const target = token.slice("countdown:".length).trim();
    const targetMs = Date.parse(target);
    if (Number.isNaN(targetMs)) return "—";
    let diff = Math.max(0, Math.floor((targetMs - ctx.now) / 1000));
    const days = Math.floor(diff / 86400);
    diff %= 86400;
    const h = Math.floor(diff / 3600);
    const m = Math.floor((diff % 3600) / 60);
    const s = diff % 60;
    if (days > 0) return `${days}d ${pad(h)}h ${pad(m)}m`;
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  }
  return null;
}

export function parseTextToSegments(text: string, ctx: TokenContext): Segment[] {
  const segments: Segment[] = [];
  let lastIndex = 0;
  TOKEN_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = TOKEN_RE.exec(text)) !== null) {
    const before = text.slice(lastIndex, match.index);
    if (before) segments.push({ type: "text", value: before });
    const token = match[1].trim();

    if (token.startsWith("qr:")) {
      const value = token.slice("qr:".length).trim();
      if (value) {
        segments.push({ type: "qr", value });
      } else {
        segments.push({ type: "text", value: match[0] });
      }
    } else if (token === "img") {
      segments.push({ type: "image" });
    } else {
      const resolved = resolveTextToken(token, ctx);
      if (resolved !== null) {
        segments.push({ type: "text", value: resolved });
      } else {
        segments.push({ type: "text", value: match[0] });
      }
    }
    lastIndex = match.index + match[0].length;
  }
  const tail = text.slice(lastIndex);
  if (tail) segments.push({ type: "text", value: tail });

  if (segments.length === 0) segments.push({ type: "text", value: " " });
  return segments;
}

export function hasDynamicToken(text: string): boolean {
  return DYNAMIC_TOKEN_RE.test(text);
}

export function hasStopwatchToken(text: string): boolean {
  return /\$\{stopwatch\}/.test(text);
}

// Pure helper used by both the token resolver and the stopwatch UI to
// derive elapsed-ms from the persisted stopwatch state.
export function getStopwatchElapsedMs(
  startedAt: number,
  accumulatedPause: number,
  pausedAt: number | null,
  now: number,
): number {
  const baseEnd = pausedAt ?? now;
  return Math.max(0, baseEnd - startedAt - accumulatedPause);
}
