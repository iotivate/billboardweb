import { useBillboardStore } from "../state/useBillboardStore";

export function Watermark() {
  const license = useBillboardStore((s) => s.licenses.watermark);
  if (license) return null;
  return <div className="billboard-watermark">webbillboard.app</div>;
}
