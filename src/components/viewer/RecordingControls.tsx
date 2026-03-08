import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Circle, Square, Download, Film, Image } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function RecordingControls() {
  const [isRecording, setIsRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [hasRecording, setHasRecording] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = () => {
    setIsRecording(true);
    setElapsed(0);
    setHasRecording(false);
    const start = Date.now();
    timerRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 1000));
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setHasRecording(true);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const handleExport = (format: "mp4" | "gif") => {
    // Mock export - in production this would use MediaRecorder API
    const sanitizedFormat = format === "mp4" ? "MP4" : "GIF";
    const toast = document.createElement("div");
    toast.className = "fixed bottom-4 left-1/2 -translate-x-1/2 bg-card border border-border text-foreground px-4 py-2 rounded-lg shadow-lg text-sm z-50 animate-in fade-in slide-in-from-bottom-2";
    toast.textContent = `Exporting as ${sanitizedFormat}… (simulated)`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
    setHasRecording(false);
  };

  return (
    <div className="flex items-center gap-2">
      {isRecording ? (
        <>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/10 border border-destructive/30">
            <Circle className="h-3 w-3 fill-destructive text-destructive animate-pulse" />
            <span className="text-xs font-mono font-semibold text-destructive">
              {formatTime(elapsed)}
            </span>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={stopRecording}
            className="h-8 px-3 gap-1.5"
          >
            <Square className="h-3 w-3 fill-current" />
            <span className="hidden sm:inline">Stop</span>
          </Button>
        </>
      ) : (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={startRecording}
            className="h-8 px-3 gap-1.5"
          >
            <Circle className="h-3 w-3 text-destructive" />
            <span className="hidden sm:inline">Record</span>
          </Button>
          {hasRecording && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 px-3 gap-1.5">
                  <Download className="h-3 w-3" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExport("mp4")}>
                  <Film className="h-4 w-4 mr-2" /> Export as MP4
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("gif")}>
                  <Image className="h-4 w-4 mr-2" /> Export as GIF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </>
      )}
    </div>
  );
}
