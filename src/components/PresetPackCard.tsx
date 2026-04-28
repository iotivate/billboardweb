import { useState } from "react";
import type { PresetPack } from "../data/types";
import { PRODUCTS } from "../data/products";
import { useLicense } from "../hooks/useLicense";

interface PresetPackCardProps {
  pack: PresetPack;
}

// Locked-pack upsell card. Renders nothing if the pack is free or the
// pack is already unlocked (its presets fold into PresetBar instead).
export function PresetPackCard({ pack }: PresetPackCardProps) {
  const productId = pack.productId;
  const enabled = Boolean(productId);
  const { isLicensed, activate, preview, status } = useLicense(
    productId ?? "watermark", // safe fallback; gated by `enabled` below
  );
  const [keyInput, setKeyInput] = useState("");
  const [showKey, setShowKey] = useState(false);

  if (!enabled || isLicensed) return null;

  const product = productId ? PRODUCTS[productId] : null;
  const swatches = pack.swatchColors ?? [];

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyInput.trim()) return;
    const ok = await activate(keyInput);
    if (ok) {
      setKeyInput("");
      setShowKey(false);
    }
  };

  return (
    <section className="rounded-xl p-4 bg-gradient-to-br from-fuchsia-500/10 via-purple-500/5 to-cyan-500/10 border border-fuchsia-500/30 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-white">
            {pack.name}
          </h3>
          <p className="text-[11px] text-white/60 mt-1">{pack.description}</p>
        </div>
        {swatches.length > 0 && (
          <div className="flex -space-x-1.5 shrink-0">
            {swatches.map((c, i) => (
              <span
                key={i}
                className="w-4 h-4 rounded-full ring-1 ring-black/40"
                style={{ background: c, boxShadow: `0 0 6px ${c}` }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="text-[10px] uppercase tracking-wider text-white/50">
        {pack.presets.length} presets
      </div>

      <a
        href={product?.checkoutUrl ?? "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-md py-2.5 px-3 bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-black font-bold text-xs uppercase tracking-wider text-center hover:opacity-90 transition-opacity"
      >
        Unlock for {product?.priceLabel ?? "$"}
      </a>

      {!showKey ? (
        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => setShowKey(true)}
            className="text-[10px] text-white/50 hover:text-white/80 underline self-start"
          >
            Already paid? Enter your license key
          </button>
          {import.meta.env.DEV && (
            <button
              type="button"
              onClick={preview}
              className="text-[10px] text-yellow-300/70 hover:text-yellow-200 underline self-start"
            >
              DEV: preview without paying
            </button>
          )}
        </div>
      ) : (
        <form onSubmit={onSubmit} className="flex flex-col gap-1.5">
          <input
            type="text"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="XXXX-XXXX-XXXX-XXXX"
            spellCheck={false}
            autoComplete="off"
            className="w-full rounded-md bg-white/5 border border-white/10 focus:border-white/30 focus:outline-none px-3 py-2 text-xs text-white font-mono tracking-wider"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={status === "pending" || !keyInput.trim()}
              className="flex-1 rounded-md py-2 px-3 bg-white text-black font-semibold text-xs uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/90 transition-colors"
            >
              {status === "pending" ? "Activating…" : "Activate"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowKey(false);
                setKeyInput("");
              }}
              className="rounded-md py-2 px-3 text-white/50 hover:text-white/80 text-xs"
            >
              Cancel
            </button>
          </div>
          {status === "error" && (
            <p className="text-[11px] text-red-400">
              Couldn't activate that key. Check it and try again.
            </p>
          )}
        </form>
      )}
    </section>
  );
}
