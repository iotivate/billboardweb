import { useRef } from "react";
import { Billboard } from "./components/Billboard";
import { ControlPanel } from "./components/ControlPanel";
import { FullscreenExitOverlay } from "./components/FullscreenExitOverlay";
import { useFullscreen } from "./hooks/useFullscreen";
import { usePersistence } from "./hooks/usePersistence";
import { useImportSharedState } from "./hooks/useShareLink";
import { useShortcuts } from "./hooks/useShortcuts";
import { useBillboardStore } from "./state/useBillboardStore";
import "./styles/billboard.css";

function App() {
  const billboardRef = useRef<HTMLDivElement>(null);
  const { toggle, exit } = useFullscreen(billboardRef);
  usePersistence();
  useImportSharedState();
  useShortcuts();

  const isFullscreen = useBillboardStore((s) => s.isFullscreen);

  return (
    <div
      className={"app-layout" + (isFullscreen ? " app-layout--fullscreen" : "")}
    >
      <Billboard ref={billboardRef} />
      {!isFullscreen && <ControlPanel onFullscreen={toggle} />}
      <FullscreenExitOverlay onExit={() => void exit()} />
    </div>
  );
}

export default App;
