import { ColorProfile, colorProfiles } from "@/data/colorProfiles";
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";

interface Props {
  active: string;
  onChange: (profile: ColorProfile) => void;
}

export default function ColorProfileFilter({ active, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Palette className="h-4 w-4 text-muted-foreground" />
      {colorProfiles.map((p) => (
        <Button
          key={p.id}
          variant={active === p.id ? "default" : "outline"}
          size="sm"
          className={`text-xs h-7 ${active === p.id ? "gradient-primary border-0" : ""}`}
          onClick={() => onChange(p)}
          title={p.description}
        >
          {p.name}
        </Button>
      ))}
    </div>
  );
}
