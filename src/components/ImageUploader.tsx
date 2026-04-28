import { useRef, useState } from "react";
import { useBillboardStore } from "../state/useBillboardStore";
import { readImageFileAsResizedDataUrl } from "../lib/image";

export function ImageUploader() {
  const image = useBillboardStore((s) => s.image);
  const setImage = useBillboardStore((s) => s.setImage);
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("That file isn't an image.");
      return;
    }
    setError(null);
    setBusy(true);
    try {
      const { dataUrl, aspect } = await readImageFileAsResizedDataUrl(file);
      setImage(dataUrl, aspect);
    } catch {
      setError("Couldn't read that image.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-[10px] font-semibold uppercase tracking-wider text-white/50">
        Logo / Image
      </h2>

      {image ? (
        <div className="flex items-center gap-3 p-2 rounded-md bg-white/5 border border-white/10">
          <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center overflow-hidden">
            <img src={image} alt="Logo preview" className="max-w-full max-h-full" />
          </div>
          <div className="flex-1 text-[11px] text-white/70 leading-tight">
            Use <code className="px-1 rounded bg-white/10 text-white">${"{img}"}</code> in
            text to place it.
          </div>
          <button
            type="button"
            onClick={() => setImage(null)}
            className="text-[10px] text-white/40 hover:text-white/70 underline"
          >
            Remove
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={busy}
          onClick={() => fileRef.current?.click()}
          className="rounded-md py-2 px-3 bg-white/5 border border-dashed border-white/20 hover:border-white/50 hover:bg-white/10 text-xs uppercase tracking-wider text-white/70 hover:text-white transition-colors disabled:opacity-50"
        >
          {busy ? "Reading…" : "+ Upload image"}
        </button>
      )}

      {error && <p className="text-[11px] text-red-400">{error}</p>}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          void onFile(file);
          e.target.value = ""; // allow re-picking the same file
        }}
      />
    </section>
  );
}
