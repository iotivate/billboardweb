import { useState } from "react";
import { useLicense } from "../hooks/useLicense";
import { PRODUCTS } from "../data/products";

const WATERMARK_PRODUCT = PRODUCTS.watermark;

export function LicensePanel() {
  const { isLicensed, activate, deactivate, preview, status } = useLicense("watermark");
  const [keyInput, setKeyInput] = useState("");
  const [showInput, setShowInput] = useState(false);

  if (isLicensed) {
    return (
      <section className="flex flex-col gap-2">
        <h2 className="text-[10px] font-semibold uppercase tracking-wider text-white/50">
          License
        </h2>
        <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-md bg-emerald-500/10 border border-emerald-400/30">
          <span className="text-xs text-emerald-300 font-semibold">
            ✓ Watermark removed
          </span>
          <button
            type="button"
            onClick={deactivate}
            className="text-[10px] text-white/40 hover:text-white/70 underline"
          >
            Sign out
          </button>
        </div>
      </section>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyInput.trim()) return;
    const ok = await activate(keyInput);
    if (ok) setKeyInput("");
  };

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-[10px] font-semibold uppercase tracking-wider text-white/50">
        Remove watermark
      </h2>

      <a
        href={WATERMARK_PRODUCT.checkoutUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-md py-2.5 px-3 bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white font-bold text-xs uppercase tracking-wider text-center hover:opacity-90 transition-opacity"
      >
        Buy lifetime &mdash; {WATERMARK_PRODUCT.priceLabel}
      </a>

      {!showInput ? (
        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => setShowInput(true)}
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
                setShowInput(false);
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
