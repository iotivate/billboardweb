import { forwardRef } from "react";
import { useBillboardStore } from "../state/useBillboardStore";
import { ScrollingText } from "./ScrollingText";
import { Watermark } from "./Watermark";

export const Billboard = forwardRef<HTMLDivElement>(function Billboard(_, ref) {
  const accent = useBillboardStore((s) => s.accent);
  const bg = useBillboardStore((s) => s.bg);

  return (
    <div
      ref={ref}
      className="billboard-root"
      style={{ "--accent": accent, background: bg } as React.CSSProperties}
    >
      <ScrollingText />
      <Watermark />
    </div>
  );
});
