import { useState } from "react";

// Curated set of glyphs that read well at billboard scale.
// Heavy on solid block/marquee characters that look like LED bulbs;
// emoji limited to ones that scale crisply (no faces, no text-on-emoji).
const GLYPHS: { group: string; items: string[] }[] = [
  {
    group: "Marquee",
    items: ["●", "○", "★", "☆", "▲", "▼", "◆", "■", "▌", "▓", "░", "·"],
  },
  {
    group: "Arrows",
    items: ["→", "←", "↑", "↓", "⇄", "⇆", "►", "◄", "✓", "✗"],
  },
  {
    group: "Hot",
    items: ["🔥", "⚡", "✨", "💎", "💰", "💵", "🎉", "🎊", "💯", "⭐"],
  },
  {
    group: "Heart",
    items: ["❤️", "💚", "💙", "💛", "💜", "♥", "♦"],
  },
  {
    group: "Hands",
    items: ["👉", "👈", "👆", "👇", "✋", "🤝"],
  },
];

interface EmojiPickerProps {
  onPick: (glyph: string) => void;
}

export function EmojiPicker({ onPick }: EmojiPickerProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-[10px] text-white/50 hover:text-white/80 underline self-start"
      >
        {open ? "Hide symbols" : "+ Insert symbol or emoji"}
      </button>
      {open && (
        <div className="rounded-md bg-white/5 border border-white/10 p-2 flex flex-col gap-2 max-h-56 overflow-y-auto">
          {GLYPHS.map((group) => (
            <div key={group.group} className="flex flex-col gap-1">
              <span className="text-[9px] uppercase tracking-wider text-white/40">
                {group.group}
              </span>
              <div className="flex flex-wrap gap-1">
                {group.items.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => onPick(g)}
                    aria-label={`Insert ${g}`}
                    className="w-8 h-8 rounded bg-white/0 hover:bg-white/15 text-base flex items-center justify-center transition-colors"
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
