import { useBillboardStore } from "../state/useBillboardStore";
import { PresetBar } from "./PresetBar";
import { StylePicker } from "./StylePicker";
import { SpeedSlider } from "./SpeedSlider";
import { DirectionPicker } from "./DirectionPicker";
import { LicensePanel } from "./LicensePanel";
import { ColorPickers } from "./ColorPickers";
import { PlayPauseButton } from "./PlayPauseButton";
import { ShareButton } from "./ShareButton";
import { FontPicker } from "./FontPicker";
import { FontSizeSlider } from "./FontSizeSlider";
import { EffectsControls } from "./EffectsControls";
import { ImageUploader } from "./ImageUploader";
import { StopwatchControls } from "./StopwatchControls";
import { PresetPackCard } from "./PresetPackCard";
import { PRESET_PACKS } from "../data/presets";
import { MotionPicker } from "./MotionPicker";
import { TextEditor } from "./TextEditor";
import { SavedPresetsBar } from "./SavedPresetsBar";

interface ControlPanelProps {
  onFullscreen: () => void;
}

export function ControlPanel({ onFullscreen }: ControlPanelProps) {
  const motion = useBillboardStore((s) => s.motion);

  return (
    <aside className="control-panel-aside flex flex-col gap-5 p-5 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-sm font-bold uppercase tracking-[0.2em] text-white/90">
            BillboardWeb
          </h1>
          <p className="text-[11px] text-white/40 mt-0.5">
            Your monitor is a billboard.
          </p>
        </div>
        <ShareButton />
      </div>

      <SavedPresetsBar />

      <section className="flex flex-col gap-2">
        <h2 className="text-[10px] font-semibold uppercase tracking-wider text-white/50">
          Presets <span className="text-white/30">· 1–9</span>
        </h2>
        <PresetBar />
      </section>

      {PRESET_PACKS.filter((p) => p.productId).map((pack) => (
        <PresetPackCard key={pack.id} pack={pack} />
      ))}

      <TextEditor />

      <StopwatchControls />

      <ImageUploader />

      <section className="flex flex-col gap-2">
        <h2 className="text-[10px] font-semibold uppercase tracking-wider text-white/50">
          Style
        </h2>
        <StylePicker />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-[10px] font-semibold uppercase tracking-wider text-white/50">
          Font
        </h2>
        <FontPicker />
        <FontSizeSlider />
      </section>

      <ColorPickers />

      <section className="flex flex-col gap-2">
        <h2 className="text-[10px] font-semibold uppercase tracking-wider text-white/50">
          Effects
        </h2>
        <EffectsControls />
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-[10px] font-semibold uppercase tracking-wider text-white/50">
          Motion
        </h2>
        <MotionPicker />
      </section>

      <section>
        <SpeedSlider />
      </section>

      {motion === "scroll" && (
        <section className="flex flex-col gap-2">
          <h2 className="text-[10px] font-semibold uppercase tracking-wider text-white/50">
            Direction <span className="text-white/30">· arrows</span>
          </h2>
          <DirectionPicker />
        </section>
      )}

      <div className="grid grid-cols-2 gap-2">
        <PlayPauseButton />
        <button
          type="button"
          onClick={onFullscreen}
          className="rounded-md py-3 px-4 bg-white text-black font-bold tracking-wider text-sm uppercase hover:bg-white/90 transition-colors"
        >
          Fullscreen <span className="opacity-50 ml-1 text-xs">(F)</span>
        </button>
      </div>

      <div className="mt-auto pt-4 border-t border-white/5">
        <LicensePanel />
      </div>
    </aside>
  );
}
