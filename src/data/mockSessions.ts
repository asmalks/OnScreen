export interface MockSession {
  id: string;
  name: string;
  source: string;
  status: "active" | "paused" | "ended";
  connectedDevices: number;
  latency: number;
  resolution: string;
  startedAt: string;
  duration: string;
}

export const mockSessions: MockSession[] = [
  {
    id: "ABX9F2",
    name: "Figma — Mobile App Design",
    source: "Google Chrome",
    status: "active",
    connectedDevices: 2,
    latency: 42,
    resolution: "1080p",
    startedAt: "2 min ago",
    duration: "00:02:34",
  },
  {
    id: "KP3M7W",
    name: "VS Code — localhost:5173",
    source: "Visual Studio Code",
    status: "active",
    connectedDevices: 1,
    latency: 38,
    resolution: "1080p",
    startedAt: "15 min ago",
    duration: "00:15:12",
  },
  {
    id: "QR8T1X",
    name: "Photoshop — Banner Design",
    source: "Adobe Photoshop",
    status: "paused",
    connectedDevices: 0,
    latency: 0,
    resolution: "720p",
    startedAt: "1 hour ago",
    duration: "00:45:00",
  },
  {
    id: "LN5V2D",
    name: "Premiere Pro — Video Edit",
    source: "Adobe Premiere Pro",
    status: "ended",
    connectedDevices: 0,
    latency: 0,
    resolution: "1080p",
    startedAt: "Yesterday",
    duration: "01:23:45",
  },
];

export interface ConnectedDevice {
  id: string;
  name: string;
  type: "iphone" | "android" | "tablet";
  status: "connected" | "pairing" | "disconnected";
  battery: number;
  latency: number;
}

export const mockDevices: ConnectedDevice[] = [
  {
    id: "dev-1",
    name: "iPhone 15 Pro",
    type: "iphone",
    status: "connected",
    battery: 87,
    latency: 42,
  },
  {
    id: "dev-2",
    name: "Pixel 8",
    type: "android",
    status: "connected",
    battery: 65,
    latency: 55,
  },
  {
    id: "dev-3",
    name: "iPad Pro",
    type: "tablet",
    status: "disconnected",
    battery: 34,
    latency: 0,
  },
];
