import { useShareLink } from "../hooks/useShareLink";

export function ShareButton() {
  const { copy, copied } = useShareLink();
  return (
    <button
      type="button"
      onClick={copy}
      className="text-[11px] font-semibold uppercase tracking-wider text-white/50 hover:text-white transition-colors"
    >
      {copied ? "✓ Copied" : "Share link"}
    </button>
  );
}
