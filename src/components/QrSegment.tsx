import { useMemo } from "react";
import { generateQrMatrix } from "../lib/qr";

interface QrSegmentProps {
  value: string;
}

// Renders a QR code as inline SVG sized to one line height (1em).
// Foreground = currentColor (inherits accent); background = transparent.
// We render one rect per dark module — not the most compact SVG but
// trivially React-y and fast enough for billboard scale (~40x40 max).
export function QrSegment({ value }: QrSegmentProps) {
  const matrix = useMemo(() => generateQrMatrix(value), [value]);
  const rects: React.ReactElement[] = [];
  for (let r = 0; r < matrix.size; r++) {
    for (let c = 0; c < matrix.size; c++) {
      if (matrix.modules[r][c]) {
        rects.push(
          <rect
            key={`${r}-${c}`}
            x={c}
            y={r}
            width={1}
            height={1}
            fill="currentColor"
          />,
        );
      }
    }
  }
  return (
    <svg
      className="billboard-qr"
      viewBox={`0 0 ${matrix.size} ${matrix.size}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={`QR code for ${value}`}
    >
      {rects}
    </svg>
  );
}
