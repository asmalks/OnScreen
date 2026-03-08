import Navbar from "@/components/shared/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function Settings() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-2xl px-4 pt-24 pb-12 sm:px-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl mb-2">Settings</h1>
        <p className="text-sm text-muted-foreground mb-8">Configure your account and streaming preferences.</p>

        <div className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base">Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs text-muted-foreground">Email</Label>
                <Input value="designer@studio.com" readOnly className="mt-1" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Display Name</Label>
                <Input defaultValue="Alex Designer" className="mt-1" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base">Streaming</CardTitle>
              <CardDescription className="text-xs">Default settings for new sessions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Default Resolution</Label>
                <Select defaultValue="1080p">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="720p">720p</SelectItem>
                    <SelectItem value="1080p">1080p</SelectItem>
                    <SelectItem value="4k">4K</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Adaptive Bitrate</Label>
                  <p className="text-xs text-muted-foreground">Automatically adjust quality based on connection</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-detect localhost</Label>
                  <p className="text-xs text-muted-foreground">Scan for running dev servers automatically</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Touch input relay</Label>
                  <p className="text-xs text-muted-foreground">Allow phone touch to control desktop preview</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base">Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Require device approval</Label>
                  <p className="text-xs text-muted-foreground">New devices must be approved before connecting</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Session auto-expire</Label>
                  <p className="text-xs text-muted-foreground">Sessions terminate after inactivity</p>
                </div>
                <Select defaultValue="30">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Button className="gradient-primary border-0 w-full">Save Changes</Button>
        </div>
      </div>
    </div>
  );
}
