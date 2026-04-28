import { useMemo } from "react";
import { useBillboardStore } from "../state/useBillboardStore";
import type { Direction, Motion, Style } from "../data/types";
import { FONT_BY_ID } from "../data/fonts";
import {
  getStopwatchElapsedMs,
  hasDynamicToken,
  parseTextToSegments,
  type Segment,
} from "../lib/tokens";
import { useTick } from "../hooks/useTick";
import { QrSegment } from "./QrSegment";
import { ImageSegment } from "./ImageSegment";

function speedToScrollDuration(speed: number): number {
  // Exponential mapping: each slider step = perceptually equal change.
  const MIN = 5;
  const MAX = 60;
  const clamped = Math.max(0, Math.min(100, speed));
  return MIN * Math.pow(MAX / MIN, (100 - clamped) / 100);
}

function speedToBlinkPeriod(speed: number): number {
  // Slower blinks at low speed, fast strobe at high.
  const MIN = 0.3;
  const MAX = 4;
  const clamped = Math.max(0, Math.min(100, speed));
  return MIN * Math.pow(MAX / MIN, (100 - clamped) / 100);
}

function speedToPulsePeriod(speed: number): number {
  // Pulse should feel slower than blink — it's a heartbeat, not a strobe.
  const MIN = 0.6;
  const MAX = 6;
  const clamped = Math.max(0, Math.min(100, speed));
  return MIN * Math.pow(MAX / MIN, (100 - clamped) / 100);
}

function axisFor(direction: Direction): "horizontal" | "vertical" {
  return direction === "up" || direction === "down" ? "vertical" : "horizontal";
}

function animationDirectionFor(direction: Direction): "normal" | "reverse" {
  return direction === "right" || direction === "down" ? "reverse" : "normal";
}

function styleClass(style: Style, outline: boolean): string {
  return `style-${style}` + (outline ? " is-outline" : "");
}

function glowToScale(glow: number): number {
  const clamped = Math.max(0, Math.min(100, glow));
  return clamped / 60;
}

interface CellProps {
  segments: Segment[];
  axis: "horizontal" | "vertical";
  textClass: string;
  ariaHidden?: boolean;
}

function Cell({ segments, axis, textClass, ariaHidden }: CellProps) {
  const lines = useMemo(() => groupByNewline(segments), [segments]);
  return (
    <div className="billboard-cell" aria-hidden={ariaHidden}>
      {lines.map((line, lineIdx) => (
        <span
          key={lineIdx}
          className={
            "billboard-line billboard-text" +
            (axis === "vertical" ? " billboard-text--vertical" : "")
          }
        >
          {line.length === 0 ? (
            <span className={textClass}>&nbsp;</span>
          ) : (
            line.map((seg, i) => {
              if (seg.type === "qr") {
                return <QrSegment key={i} value={seg.value} />;
              }
              if (seg.type === "image") {
                return <ImageSegment key={i} />;
              }
              return (
                <span key={i} className={textClass}>
                  {seg.value}
                </span>
              );
            })
          )}
        </span>
      ))}
    </div>
  );
}

function groupByNewline(segments: Segment[]): Segment[][] {
  const lines: Segment[][] = [[]];
  for (const seg of segments) {
    if (seg.type !== "text") {
      lines[lines.length - 1].push(seg);
      continue;
    }
    const parts = seg.value.split("\n");
    parts.forEach((part, i) => {
      if (i > 0) lines.push([]);
      if (part) lines[lines.length - 1].push({ type: "text", value: part });
    });
  }
  return lines;
}

export function ScrollingText() {
  const text = useBillboardStore((s) => s.text);
  const style = useBillboardStore((s) => s.style);
  const speed = useBillboardStore((s) => s.speed);
  const direction = useBillboardStore((s) => s.direction);
  const motion = useBillboardStore((s) => s.motion);
  const isPaused = useBillboardStore((s) => s.isPaused);
  const font = useBillboardStore((s) => s.font);
  const fontSize = useBillboardStore((s) => s.fontSize);
  const glow = useBillboardStore((s) => s.glow);
  const outline = useBillboardStore((s) => s.outline);
  const gap = useBillboardStore((s) => s.gap);
  const ledSize = useBillboardStore((s) => s.ledSize);

  const stopwatchStartedAt = useBillboardStore((s) => s.stopwatchStartedAt);
  const stopwatchAccumulatedPause = useBillboardStore(
    (s) => s.stopwatchAccumulatedPause,
  );
  const stopwatchPausedAt = useBillboardStore((s) => s.stopwatchPausedAt);

  const needsTick = hasDynamicToken(text);
  const now = useTick(needsTick);

  const stopwatchElapsedMs = getStopwatchElapsedMs(
    stopwatchStartedAt,
    stopwatchAccumulatedPause,
    stopwatchPausedAt,
    now,
  );

  const segments = useMemo(
    () => parseTextToSegments(text, { now, stopwatchElapsedMs }),
    [text, now, stopwatchElapsedMs],
  );

  const axis = axisFor(direction);
  const animDir = animationDirectionFor(direction);
  const glowScale = glowToScale(glow);
  const fontScale = fontSize / 100;
  const gapNorm = Math.max(0, Math.min(100, gap)) / 100;
  const repeatGapEm = gapNorm * gapNorm * 12;
  // ledSize 0–100 → 6px–32px ideal pitch with viewport-scaled middle.
  // Default 50 ≈ 14px on a typical 1080p, 18–22px on a 4K monitor.
  // Bigger pitch = each "LED" is more pixels = camera resolves it cleanly.
  const ledNorm = Math.max(0, Math.min(100, ledSize)) / 100;
  const ledMin = 6 + ledNorm * 8; // 6 → 14px
  const ledMax = 14 + ledNorm * 28; // 14 → 42px
  const ledIdeal = 0.4 + ledNorm * 1.6; // 0.4 → 2.0 vmin
  const fontFamily = FONT_BY_ID[font].cssFamily;
  const textClass = styleClass(style, outline);

  // Build the right track styles depending on motion. Scroll uses
  // animation-duration; blink/pulse use --motion-period; static turns
  // animation off entirely.
  const trackStyle: React.CSSProperties = {
    fontFamily,
    "--glow-scale": glowScale,
    "--font-scale": fontScale,
    "--repeat-gap": `${repeatGapEm}em`,
    "--led-dot": `clamp(${ledMin}px, ${ledIdeal}vmin, ${ledMax}px)`,
  } as React.CSSProperties;

  let trackMotionClass: string;
  if (motion === "scroll") {
    trackMotionClass =
      axis === "vertical"
        ? "billboard-track--vertical"
        : "billboard-track--horizontal";
    trackStyle.animationDuration = `${speedToScrollDuration(speed)}s`;
    trackStyle.animationDirection = animDir;
    trackStyle.animationPlayState = isPaused ? "paused" : "running";
  } else if (motion === "blink") {
    trackMotionClass = "billboard-track--blink";
    (trackStyle as Record<string, unknown>)["--motion-period"] =
      `${speedToBlinkPeriod(speed)}s`;
    trackStyle.animationPlayState = isPaused ? "paused" : "running";
  } else if (motion === "pulse") {
    trackMotionClass = "billboard-track--pulse";
    (trackStyle as Record<string, unknown>)["--motion-period"] =
      `${speedToPulsePeriod(speed)}s`;
    trackStyle.animationPlayState = isPaused ? "paused" : "running";
  } else {
    trackMotionClass = "billboard-track--static";
  }

  // Scroll needs two duplicate cells for the seamless loop. Other
  // motions use a single centered cell.
  const isScroll = motion === "scroll";

  return (
    <div className={"billboard-track " + trackMotionClass} style={trackStyle}>
      <Cell segments={segments} axis={axis} textClass={textClass} />
      {isScroll && (
        <Cell
          segments={segments}
          axis={axis}
          textClass={textClass}
          ariaHidden
        />
      )}
    </div>
  );
}

// Re-exports for any callers expecting the old name.
export type { Motion };
