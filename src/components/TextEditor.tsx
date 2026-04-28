import { useRef } from "react";
import { useBillboardStore } from "../state/useBillboardStore";
import { EmojiPicker } from "./EmojiPicker";
import { TokenHints } from "./TokenHints";

export function TextEditor() {
  const text = useBillboardStore((s) => s.text);
  const setText = useBillboardStore((s) => s.setText);
  const ref = useRef<HTMLTextAreaElement>(null);

  // Insert at the current cursor position so power users can compose
  // mixed strings. Falls back to appending if the textarea isn't focused
  // (e.g., user clicked the symbol button without first clicking the
  // textarea).
  const insert = (chars: string) => {
    const ta = ref.current;
    if (!ta) {
      setText(text + chars);
      return;
    }
    const start = ta.selectionStart ?? text.length;
    const end = ta.selectionEnd ?? text.length;
    const next = text.slice(0, start) + chars + text.slice(end);
    setText(next);
    // Restore cursor after React commits the new value.
    requestAnimationFrame(() => {
      ta.focus();
      const pos = start + chars.length;
      ta.setSelectionRange(pos, pos);
    });
  };

  return (
    <section className="flex flex-col gap-2">
      <label className="text-[10px] font-semibold uppercase tracking-wider text-white/50">
        Text
      </label>
      <textarea
        ref={ref}
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        spellCheck={false}
        className="w-full resize-y rounded-md bg-white/5 border border-white/10 focus:border-white/30 focus:outline-none px-3 py-2 text-sm text-white font-mono"
        placeholder="Type your sign…  try ${time} or ${qr:https://…}"
      />
      <EmojiPicker onPick={insert} />
      <TokenHints />
    </section>
  );
}
