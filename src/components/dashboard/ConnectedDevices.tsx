import { ConnectedDevice } from "@/data/mockSessions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Tablet } from "lucide-react";
import LatencyIndicator from "@/components/shared/LatencyIndicator";

const icons = {
  iphone: Smartphone,
  android: Smartphone,
  tablet: Tablet,
};

export default function ConnectedDevices({ devices }: { devices: ConnectedDevice[] }) {
  return (
    <Card className="shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Connected Devices</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {devices.map((d) => {
          const Icon = icons[d.type];
          return (
            <div key={d.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
              <Icon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{d.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <LatencyIndicator latency={d.latency} />
                  <span className="text-xs text-muted-foreground">• {d.battery}%</span>
                </div>
              </div>
              <Badge
                variant="outline"
                className={`text-xs ${
                  d.status === "connected"
                    ? "bg-accent/10 text-accent border-accent/20"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {d.status}
              </Badge>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
