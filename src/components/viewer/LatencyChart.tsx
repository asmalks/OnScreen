import { useMemo } from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Area, AreaChart, XAxis, YAxis } from "recharts";
import { Wifi, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface DataPoint {
  time: string;
  latency: number;
}

interface Props {
  history: DataPoint[];
}

const chartConfig: ChartConfig = {
  latency: {
    label: "Latency",
    color: "hsl(var(--accent))",
  },
};

export default function LatencyChart({ history }: Props) {
  const stats = useMemo(() => {
    if (!history.length) return { avg: 0, min: 0, max: 0, trend: "stable" as const };
    const vals = history.map((d) => d.latency);
    const avg = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const recent = vals.slice(-5);
    const older = vals.slice(-10, -5);
    const recentAvg = recent.reduce((a, b) => a + b, 0) / (recent.length || 1);
    const olderAvg = older.length ? older.reduce((a, b) => a + b, 0) / older.length : recentAvg;
    const trend = recentAvg > olderAvg + 5 ? "up" : recentAvg < olderAvg - 5 ? "down" : "stable";
    return { avg, min, max, trend };
  }, [history]);

  const TrendIcon = stats.trend === "up" ? TrendingUp : stats.trend === "down" ? TrendingDown : Minus;
  const trendColor =
    stats.trend === "up" ? "text-destructive" : stats.trend === "down" ? "text-accent" : "text-muted-foreground";

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold flex items-center gap-2">
          <Wifi className="h-3.5 w-3.5" /> Connection Quality
        </span>
        <div className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
          <TrendIcon className="h-3 w-3" />
          <span>{stats.trend === "up" ? "Rising" : stats.trend === "down" ? "Improving" : "Stable"}</span>
        </div>
      </div>

      {/* Mini stats */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Avg", value: `${stats.avg}ms` },
          { label: "Min", value: `${stats.min}ms` },
          { label: "Max", value: `${stats.max}ms` },
        ].map((s) => (
          <div key={s.label} className="bg-muted/50 rounded-lg px-2.5 py-1.5 text-center">
            <div className="text-[10px] text-muted-foreground uppercase">{s.label}</div>
            <div className="text-xs font-semibold font-mono">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <ChartContainer config={chartConfig} className="aspect-[3/1] w-full">
        <AreaChart data={history} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="latencyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
              <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="time" hide />
          <YAxis hide domain={["dataMin - 10", "dataMax + 10"]} />
          <ChartTooltip
            content={<ChartTooltipContent hideLabel indicator="line" />}
          />
          <Area
            type="monotone"
            dataKey="latency"
            stroke="hsl(var(--accent))"
            strokeWidth={1.5}
            fill="url(#latencyGrad)"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
