export interface DeviceProfile {
  id: string;
  name: string;
  brand: "apple" | "android" | "tablet";
  width: number;
  height: number;
  screenRadius: number;
  hasNotch: boolean;
  hasDynamicIsland: boolean;
  statusBarHeight: number;
  safeAreaBottom: number;
}

export const devices: DeviceProfile[] = [
  {
    id: "iphone-15-pro",
    name: "iPhone 15 Pro",
    brand: "apple",
    width: 393,
    height: 852,
    screenRadius: 55,
    hasNotch: false,
    hasDynamicIsland: true,
    statusBarHeight: 59,
    safeAreaBottom: 34,
  },
  {
    id: "iphone-14",
    name: "iPhone 14",
    brand: "apple",
    width: 390,
    height: 844,
    screenRadius: 47,
    hasNotch: true,
    hasDynamicIsland: false,
    statusBarHeight: 47,
    safeAreaBottom: 34,
  },
  {
    id: "pixel-8",
    name: "Pixel 8",
    brand: "android",
    width: 412,
    height: 915,
    screenRadius: 28,
    hasNotch: false,
    hasDynamicIsland: false,
    statusBarHeight: 36,
    safeAreaBottom: 20,
  },
  {
    id: "samsung-s24",
    name: "Samsung S24",
    brand: "android",
    width: 360,
    height: 780,
    screenRadius: 24,
    hasNotch: false,
    hasDynamicIsland: false,
    statusBarHeight: 32,
    safeAreaBottom: 16,
  },
  {
    id: "ipad-pro",
    name: "iPad Pro 11\"",
    brand: "tablet",
    width: 834,
    height: 1194,
    screenRadius: 18,
    hasNotch: false,
    hasDynamicIsland: false,
    statusBarHeight: 24,
    safeAreaBottom: 20,
  },
];
