import { Wifi } from "lucide-react";

interface Props {
  latency: number;
  className?: string;
}

export default function LatencyIndicator({ latency, className = "" }: Props) {
  const getColor = () => {
    if (latency === 0) return "text-muted-foreground";
    if (latency < 60) return "text-accent";
    if (latency < 150) return "text-yellow-500";
    return "text-destructive";
  };

  const getLabel = () => {
    if (latency === 0) return "Offline";
    if (latency < 60) return "Excellent";
    if (latency < 150) return "Good";
    return "High";
  };

  return (
    <div className={`flex items-center gap-1.5 text-xs font-medium ${getColor()} ${className}`}>
      <Wifi className="h-3.5 w-3.5" />
      <span>{latency > 0 ? `${latency}ms` : getLabel()}</span>
    </div>
  );
}
