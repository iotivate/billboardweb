import { useState } from "react";

const TOKENS: { token: string; description: string }[] = [
  { token: "${time}", description: "Current time, e.g. 9:42 PM" },
  { token: "${time24}", description: "24-hour, e.g. 21:42" },
  { token: "${date}", description: "Apr 28" },
  { token: "${weekday}", description: "Tuesday" },
  { token: "${countdown:2026-12-25}", description: "Days/hours/min to date" },
  { token: "${stopwatch}", description: "Counts up since page load" },
  { token: "${qr:VALUE}", description: "Scannable QR code (URL or text)" },
  { token: "${img}", description: "Your uploaded image" },
];

export function TokenHints() {
  const [open, setOpen] = useState(false);
  return (
    <div className="text-[11px]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-white/40 hover:text-white/80 underline"
      >
        {open ? "Hide" : "Use live tokens"}
      </button>
      {open && (
        <ul className="mt-2 space-y-1 rounded-md bg-white/5 border border-white/10 p-2.5">
          {TOKENS.map((t) => (
            <li key={t.token} className="flex items-baseline justify-between gap-3">
              <code className="text-white/90 font-mono text-[11px]">{t.token}</code>
              <span className="text-white/50 text-[10px] text-right">
                {t.description}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
