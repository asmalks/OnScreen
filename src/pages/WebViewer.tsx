import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { devices, DeviceProfile } from "@/data/devices";
import { colorProfiles, ColorProfile } from "@/data/colorProfiles";
import DeviceFrame from "@/components/viewer/DeviceFrame";
import ViewerControls from "@/components/viewer/ViewerControls";
import RecordingControls from "@/components/viewer/RecordingControls";
import LatencyIndicator from "@/components/shared/LatencyIndicator";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings2, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";

export default function WebViewer() {
  const { sessionId } = useParams();
  const isMobile = useIsMobile();
  const [device, setDevice] = useState<DeviceProfile>(devices[0]);
  const [rotation, setRotation] = useState<"portrait" | "landscape">("portrait");
  const [brightness, setBrightness] = useState(100);
  const [colorProfile, setColorProfile] = useState<ColorProfile>(colorProfiles[0]);
  const [touchEnabled, setTouchEnabled] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [latency, setLatency] = useState(42);
  const [latencyHistory, setLatencyHistory] = useState<{ time: string; latency: number }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency((l) => {
        const next = Math.max(25, Math.min(90, l + Math.floor(Math.random() * 11) - 5));
        setLatencyHistory((h) => {
          const now = new Date();
          const time = `${now.getMinutes()}:${String(now.getSeconds()).padStart(2, "0")}`;
          const updated = [...h, { time, latency: next }];
          return updated.length > 30 ? updated.slice(-30) : updated;
        });
        return next;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const controlsProps = {
    device, setDevice, rotation, setRotation,
    brightness, setBrightness, colorProfile, setColorProfile,
    touchEnabled, setTouchEnabled, isFullscreen, toggleFullscreen,
    latencyHistory,
  };

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">
      {/* Top bar */}
      <div className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-background/90 backdrop-blur-xl px-3 sm:px-4 h-12 sm:h-14">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="min-w-0">
            <span className="text-sm font-semibold">Session</span>
            <span className="text-xs text-muted-foreground ml-1.5 font-mono truncate hidden sm:inline">{sessionId}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <RecordingControls />
          <LatencyIndicator latency={latency} />
          <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
          <span className="text-xs text-accent font-medium hidden sm:inline">Live</span>
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Settings2 className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[70dvh] rounded-t-2xl p-5 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold">Controls</span>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <X className="h-4 w-4" />
                    </Button>
                  </SheetClose>
                </div>
                <ViewerControls {...controlsProps} />
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
        {/* Preview area */}
        <div className="flex-1 flex items-center justify-center p-3 sm:p-8 min-h-0 overflow-auto">
          <div
            style={{
              filter: colorProfile.filter !== "none" ? colorProfile.filter : undefined,
              opacity: brightness / 100,
            }}
          >
            <DeviceFrame device={device} rotation={rotation}>
              <div className="h-full w-full bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5 flex flex-col items-center justify-center relative">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[length:20px_20px]" />
                <div className="relative text-center p-6">
                  <div className="text-4xl mb-3">📱</div>
                  <p className="text-sm font-semibold text-foreground/70">Live Preview</p>
                  <p className="text-xs text-muted-foreground mt-1">Streaming from desktop</p>
                  <div className="mt-4 flex items-center justify-center gap-1">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse"
                        style={{ animationDelay: `${i * 0.3}s` }}
                      />
                    ))}
                  </div>
                </div>
                {touchEnabled && (
                  <div className="absolute bottom-4 left-0 right-0 text-center">
                    <span className="text-xs bg-foreground/10 px-3 py-1 rounded-full text-foreground/50">
                      Touch input active
                    </span>
                  </div>
                )}
              </div>
            </DeviceFrame>
          </div>
        </div>

        {/* Desktop sidebar controls */}
        {!isMobile && (
          <div className="w-72 border-l border-border bg-card p-5 overflow-y-auto">
            <ViewerControls {...controlsProps} />
          </div>
        )}
      </div>
    </div>
  );
}
