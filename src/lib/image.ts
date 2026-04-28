// Reads a user-selected image file, downscales it via canvas to keep the
// data URL small enough for localStorage (which is typically 5–10 MB total
// across all keys), and returns the resulting data URL plus its aspect
// ratio so the renderer can size the inline image correctly without
// briefly squishing it before the natural dimensions arrive.

const MAX_DIMENSION = 1024; // px on the longest side
const QUALITY = 0.85;

export interface ProcessedImage {
  dataUrl: string;
  aspect: number; // width / height
}

export async function readImageFileAsResizedDataUrl(
  file: File,
): Promise<ProcessedImage> {
  const dataUrl = await readAsDataUrl(file);
  const img = await loadImage(dataUrl);
  const aspect = img.naturalWidth / Math.max(1, img.naturalHeight);
  const { width, height } = scaleToFit(
    img.naturalWidth,
    img.naturalHeight,
    MAX_DIMENSION,
  );

  // If the image is already small enough, skip the canvas round-trip
  // and keep the original (preserves transparency/format better).
  if (
    img.naturalWidth <= MAX_DIMENSION &&
    img.naturalHeight <= MAX_DIMENSION &&
    file.size < 250_000
  ) {
    return { dataUrl, aspect };
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return { dataUrl, aspect };
  ctx.drawImage(img, 0, 0, width, height);

  // Use PNG for transparency-bearing types, JPEG otherwise (smaller).
  const isLossless = file.type === "image/png" || file.type === "image/svg+xml";
  return {
    dataUrl: canvas.toDataURL(isLossless ? "image/png" : "image/jpeg", QUALITY),
    aspect,
  };
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error("Read failed"));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Image load failed"));
    img.src = src;
  });
}

function scaleToFit(w: number, h: number, max: number): { width: number; height: number } {
  if (w <= max && h <= max) return { width: w, height: h };
  const ratio = Math.min(max / w, max / h);
  return { width: Math.round(w * ratio), height: Math.round(h * ratio) };
}
