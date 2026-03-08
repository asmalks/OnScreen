import { useEffect, useRef } from "react";

interface Props {
  sessionId: string;
  size?: number;
}

export default function QRPairingPanel({ sessionId, size = 200 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const s = size;
    canvas.width = s;
    canvas.height = s;
    const cellSize = Math.floor(s / 25);

    // Generate deterministic pattern from sessionId
    const seed = sessionId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    const rng = (i: number) => ((seed * 9301 + i * 49297) % 233280) / 233280;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = "#1a1a2e";

    // Draw finder patterns
    const drawFinder = (x: number, y: number) => {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
          const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
          if (isBorder || isInner) {
            ctx.fillRect((x + c) * cellSize, (y + r) * cellSize, cellSize, cellSize);
          }
        }
      }
    };

    drawFinder(2, 2);
    drawFinder(16, 2);
    drawFinder(2, 16);

    // Fill data area
    for (let r = 0; r < 25; r++) {
      for (let c = 0; c < 25; c++) {
        const inFinder =
          (r < 9 && c < 9) || (r < 9 && c > 15) || (r > 15 && c < 9);
        if (!inFinder && rng(r * 25 + c) > 0.5) {
          ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
        }
      }
    }
  }, [sessionId, size]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
        <canvas ref={canvasRef} className="rounded-lg" style={{ width: size, height: size }} />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">Scan to connect</p>
        <p className="text-xs text-muted-foreground mt-1">
          Session: <span className="font-mono font-semibold">{sessionId}</span>
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">Expires in 60s</p>
      </div>
    </div>
  );
}
