import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/shared/Navbar";
import QRPairingPanel from "@/components/shared/QRPairingPanel";
import { useSession } from "@/contexts/SessionContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Monitor, AppWindow, Crop, Globe, ArrowRight } from "lucide-react";

const captureTypes = [
  { id: "screen", label: "Entire Screen", icon: Monitor, desc: "Share your full desktop" },
  { id: "window", label: "Application Window", icon: AppWindow, desc: "Share a specific app" },
  { id: "region", label: "Screen Region", icon: Crop, desc: "Select a custom area" },
  { id: "localhost", label: "Localhost URL", icon: Globe, desc: "Preview a dev server" },
];

const mockApps = [
  "Google Chrome",
  "Visual Studio Code",
  "Adobe Photoshop",
  "Adobe Illustrator",
  "Adobe Premiere Pro",
  "Figma Desktop",
  "Blender",
  "Terminal",
];

export default function SessionSetup() {
  const [captureType, setCaptureType] = useState("screen");
  const [sessionName, setSessionName] = useState("");
  const [selectedApp, setSelectedApp] = useState("");
  const [localhostUrl, setLocalhostUrl] = useState("localhost:5173");
  const [resolution, setResolution] = useState("1080p");
  const { createSession, setLocalStream } = useSession();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleStart = async () => {
    try {
      if (captureType !== "localhost") {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
        setLocalStream(stream);
      }

      const trimmedName = sessionName.trim().slice(0, 100);
      const trimmedUrl = localhostUrl.trim().slice(0, 200);

      const source =
        captureType === "window"
          ? selectedApp
          : captureType === "localhost"
            ? trimmedUrl
            : captureType === "region"
              ? "Screen Region"
              : "Entire Screen";

      const session = createSession(trimmedName || `Preview — ${source}`, source);
      navigate(`/view/${session.id}`);
    } catch (err) {
      toast({
        title: "Screen capture failed",
        description: "Please allow screen recording permissions to start a session.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 pt-24 pb-12 sm:px-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl mb-2">New Preview Session</h1>
        <p className="text-sm text-muted-foreground mb-8">Choose what to share and start streaming to your devices.</p>

        <div className="space-y-6">
          {/* Session name */}
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Session Name</CardTitle>
              <CardDescription className="text-xs">Optional — auto-generated if empty</CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="e.g. Mobile App Design Preview"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                maxLength={100}
              />
            </CardContent>
          </Card>

          {/* Capture type */}
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Capture Source</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={captureType} onValueChange={setCaptureType} className="grid gap-3 sm:grid-cols-2">
                {captureTypes.map((t) => (
                  <Label
                    key={t.id}
                    htmlFor={t.id}
                    className={`flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition-all ${captureType === t.id ? "border-primary/40 bg-primary/5 shadow-glow" : "border-border hover:border-primary/20"
                      }`}
                  >
                    <RadioGroupItem value={t.id} id={t.id} className="sr-only" />
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${captureType === t.id ? "gradient-primary" : "bg-muted"
                      }`}>
                      <t.icon className={`h-5 w-5 ${captureType === t.id ? "text-primary-foreground" : "text-muted-foreground"}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t.label}</p>
                      <p className="text-xs text-muted-foreground">{t.desc}</p>
                    </div>
                  </Label>
                ))}
              </RadioGroup>

              {/* Window selector */}
              {captureType === "window" && (
                <div className="mt-4">
                  <Label className="text-xs text-muted-foreground mb-2 block">Select Application</Label>
                  <Select value={selectedApp} onValueChange={setSelectedApp}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an application" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockApps.map((app) => (
                        <SelectItem key={app} value={app}>{app}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Localhost URL */}
              {captureType === "localhost" && (
                <div className="mt-4">
                  <Label className="text-xs text-muted-foreground mb-2 block">Server URL</Label>
                  <Input
                    value={localhostUrl}
                    onChange={(e) => setLocalhostUrl(e.target.value)}
                    placeholder="localhost:3000"
                    maxLength={200}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Resolution */}
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Stream Quality</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                {["720p", "1080p", "4K"].map((r) => (
                  <Button
                    key={r}
                    variant={resolution === r ? "default" : "outline"}
                    size="sm"
                    className={resolution === r ? "gradient-primary border-0" : ""}
                    onClick={() => setResolution(r)}
                  >
                    {r}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* QR + Start */}
          <div className="grid gap-6 sm:grid-cols-2">
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Pair Device</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <QRPairingPanel sessionId="NEW001" size={160} />
              </CardContent>
            </Card>

            <div className="flex flex-col justify-end">
              <Button
                size="lg"
                className="gradient-primary border-0 shadow-glow w-full text-base"
                onClick={handleStart}
              >
                Start Session <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
