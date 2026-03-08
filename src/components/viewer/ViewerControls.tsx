import { devices, DeviceProfile } from "@/data/devices";
import { ColorProfile } from "@/data/colorProfiles";
import ColorProfileFilter from "@/components/viewer/ColorProfileFilter";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Maximize,
  Minimize,
  Hand,
  Sun,
  Smartphone,
} from "lucide-react";
import LatencyChart from "@/components/viewer/LatencyChart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  device: DeviceProfile;
  setDevice: (d: DeviceProfile) => void;
  rotation: "portrait" | "landscape";
  setRotation: (r: "portrait" | "landscape") => void;
  brightness: number;
  setBrightness: (b: number) => void;
  colorProfile: ColorProfile;
  setColorProfile: (cp: ColorProfile) => void;
  touchEnabled: boolean;
  setTouchEnabled: (v: boolean) => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  latencyHistory?: { time: string; latency: number }[];
}

export default function ViewerControls({
  device, setDevice, rotation, setRotation,
  brightness, setBrightness, colorProfile, setColorProfile,
  touchEnabled, setTouchEnabled, isFullscreen, toggleFullscreen,
  latencyHistory,
}: Props) {
  return (
    <div className="space-y-5">
      {/* Device selector */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Device</Label>
        <Select value={device.id} onValueChange={(v) => setDevice(devices.find((d) => d.id === v)!)}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {devices.map((d) => (
              <SelectItem key={d.id} value={d.id}>
                <div className="flex items-center gap-2">
                  <Smartphone className="h-3.5 w-3.5" />
                  {d.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Rotation */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Orientation</Label>
        <div className="flex gap-2">
          <Button
            variant={rotation === "portrait" ? "default" : "outline"}
            size="sm"
            className={`flex-1 ${rotation === "portrait" ? "gradient-primary border-0" : ""}`}
            onClick={() => setRotation("portrait")}
          >
            Portrait
          </Button>
          <Button
            variant={rotation === "landscape" ? "default" : "outline"}
            size="sm"
            className={`flex-1 ${rotation === "landscape" ? "gradient-primary border-0" : ""}`}
            onClick={() => setRotation("landscape")}
          >
            Landscape
          </Button>
        </div>
      </div>

      {/* Brightness */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold flex items-center gap-2">
          <Sun className="h-3.5 w-3.5" /> Brightness — {brightness}%
        </Label>
        <Slider
          value={[brightness]}
          onValueChange={(v) => setBrightness(v[0])}
          min={20}
          max={100}
          step={5}
        />
      </div>

      {/* Color Profile */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Color Profile</Label>
        <ColorProfileFilter active={colorProfile.id} onChange={setColorProfile} />
      </div>

      {/* Touch Simulation */}
      <div className="flex items-center justify-between">
        <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold flex items-center gap-2">
          <Hand className="h-3.5 w-3.5" /> Touch Input
        </Label>
        <Switch checked={touchEnabled} onCheckedChange={setTouchEnabled} />
      </div>

      {/* Latency Chart */}
      {latencyHistory && latencyHistory.length > 1 && (
        <LatencyChart history={latencyHistory} />
      )}

      {/* Fullscreen */}
      <Button variant="outline" className="w-full" onClick={toggleFullscreen}>
        {isFullscreen ? (
          <><Minimize className="mr-2 h-4 w-4" /> Exit Fullscreen</>
        ) : (
          <><Maximize className="mr-2 h-4 w-4" /> Fullscreen</>
        )}
      </Button>
    </div>
  );
}
