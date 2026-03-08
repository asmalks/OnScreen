export interface ColorProfile {
  id: string;
  name: string;
  description: string;
  filter: string;
}

export const colorProfiles: ColorProfile[] = [
  {
    id: "srgb",
    name: "sRGB",
    description: "Standard color space for web and most displays",
    filter: "none",
  },
  {
    id: "display-p3",
    name: "Display P3",
    description: "Wide color gamut used in modern Apple displays",
    filter: "saturate(1.15) contrast(1.02)",
  },
  {
    id: "amoled",
    name: "AMOLED",
    description: "Deep blacks and vivid colors typical of OLED screens",
    filter: "saturate(1.35) contrast(1.15) brightness(0.95)",
  },
  {
    id: "lcd-low",
    name: "Low Quality LCD",
    description: "Washed out colors simulating cheap LCD panels",
    filter: "saturate(0.7) contrast(0.85) brightness(1.05)",
  },
];
