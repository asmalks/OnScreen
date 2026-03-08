import { MockSession } from "@/data/mockSessions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import LatencyIndicator from "@/components/shared/LatencyIndicator";
import { Play, Pause, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

export default function SessionCard({ session }: { session: MockSession }) {
  const statusColor = {
    active: "bg-accent text-accent-foreground",
    paused: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    ended: "bg-muted text-muted-foreground",
  }[session.status];

  return (
    <Card className="shadow-card hover:shadow-glow transition-all border-border hover:border-primary/20">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate">{session.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{session.source}</p>
          </div>
          <Badge variant="outline" className={`text-xs ml-2 ${statusColor}`}>
            {session.status}
          </Badge>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
          <span>{session.resolution}</span>
          <span>•</span>
          <span>{session.connectedDevices} device{session.connectedDevices !== 1 ? "s" : ""}</span>
          <span>•</span>
          <span>{session.duration}</span>
        </div>

        <div className="flex items-center justify-between">
          <LatencyIndicator latency={session.latency} />
          <div className="flex gap-2">
            {session.status === "active" && (
              <>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Pause className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                  <Link to={`/view/${session.id}`}>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </>
            )}
            {session.status === "paused" && (
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Play className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
