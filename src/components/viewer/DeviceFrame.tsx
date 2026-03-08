import { DeviceProfile } from "@/data/devices";
import { ReactNode } from "react";

interface Props {
  device: DeviceProfile;
  rotation: "portrait" | "landscape";
  children: ReactNode;
}

export default function DeviceFrame({ device, rotation, children }: Props) {
  const isLandscape = rotation === "landscape";
  const w = isLandscape ? device.height : device.width;
  const h = isLandscape ? device.width : device.height;
  const scale = Math.min(1, 360 / w);

  return (
    <div className="flex items-center justify-center">
      <div
        className="relative border-[3px] border-foreground/20 bg-foreground/5 transition-all duration-500"
        style={{
          width: w * scale,
          height: h * scale,
          borderRadius: device.screenRadius * scale,
        }}
      >
        {/* Dynamic Island / Notch */}
        {device.hasDynamicIsland && !isLandscape && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 h-[28px] w-[100px] rounded-full bg-foreground/90"
            style={{ transform: `translateX(-50%) scale(${scale})` }}
          />
        )}
        {device.hasNotch && !isLandscape && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 w-[45%] h-[26px] rounded-b-2xl bg-foreground/90"
            style={{ transform: `translateX(-50%) scale(${scale})` }}
          />
        )}

        {/* Status bar */}
        <div
          className="absolute top-0 left-0 right-0 z-10 flex items-end justify-between px-6 text-[9px] font-semibold"
          style={{ height: device.statusBarHeight * scale, color: "rgba(255,255,255,0.8)" }}
        >
          <span>9:41</span>
          <div className="flex items-center gap-1">
            <div className="w-4 h-2 rounded-sm border border-current relative">
              <div className="absolute inset-0.5 rounded-[1px] bg-current" style={{ width: "70%" }} />
            </div>
          </div>
        </div>

        {/* Content */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ borderRadius: (device.screenRadius - 3) * scale }}
        >
          {children}
        </div>

        {/* Safe area bottom */}
        {device.safeAreaBottom > 0 && !isLandscape && (
          <div
            className="absolute bottom-1 left-1/2 -translate-x-1/2 w-[35%] h-[4px] rounded-full bg-foreground/30"
          />
        )}
      </div>
    </div>
  );
}
