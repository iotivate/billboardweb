import { useBillboardStore } from "../state/useBillboardStore";
import { PRODUCTS } from "../data/products";

// Free-tier corner watermark. Tappable: clicking it opens the watermark
// removal checkout in a new tab. The corner placement keeps it out of
// the user's content (no interference with the marquee) while still
// being visible enough to register in phone video — the size and opacity
// are tuned for camera capture, not just on-screen reading.
export function Watermark() {
  const license = useBillboardStore((s) => s.licenses.watermark);
  if (license) return null;

  return (
    <a
      href={PRODUCTS.watermark.checkoutUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="billboard-watermark"
      title={`Remove watermark — ${PRODUCTS.watermark.priceLabel}`}
    >
      billboardweb.app
    </a>
  );
}
