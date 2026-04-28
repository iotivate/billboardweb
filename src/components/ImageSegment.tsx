import { useBillboardStore } from "../state/useBillboardStore";

// Renders the user's uploaded image as a STYLE-AWARE silhouette inline.
// The image's alpha/luminance becomes a mask; the visible fill is the
// current accent color. CSS then applies per-style treatments:
//   neon  → glowing colored silhouette
//   led   → dotted silhouette (background dot pattern clipped by mask)
//   solid → flat colored silhouette
//
// We intentionally do NOT render raw RGB photo data. A flat photo in a
// neon/LED billboard looks tutorial-grade — the silhouette fits the
// product's aesthetic and resembles how a real LED display would render
// an image.
export function ImageSegment() {
  const image = useBillboardStore((s) => s.image);
  const aspect = useBillboardStore((s) => s.imageAspect);
  const style = useBillboardStore((s) => s.style);
  if (!image) return null;
  return (
    <span
      aria-hidden
      className={`billboard-image-silhouette billboard-image-${style}`}
      style={{
        WebkitMaskImage: `url(${image})`,
        maskImage: `url(${image})`,
        aspectRatio: aspect,
      }}
    />
  );
}
