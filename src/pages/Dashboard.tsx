import Navbar from "@/components/shared/Navbar";
import SessionCard from "@/components/dashboard/SessionCard";
import ConnectedDevices from "@/components/dashboard/ConnectedDevices";
import QRPairingPanel from "@/components/shared/QRPairingPanel";
import { useSession } from "@/contexts/SessionContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Monitor, Wifi, Clock, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Dashboard() {
  const { sessions, connectedDevices } = useSession();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const activeSessions = sessions.filter((s) => s.status === "active");
  const otherSessions = sessions.filter((s) => s.status !== "active");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 pt-24 pb-12 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your preview sessions and devices</p>
          </div>
          <Button className="gradient-primary border-0" asChild>
            <Link to="/session/new">
              <Plus className="mr-1.5 h-4 w-4" /> New Session
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          {[
            { label: "Active Sessions", value: activeSessions.length, icon: Monitor },
            { label: "Connected Devices", value: connectedDevices.filter((d) => d.status === "connected").length, icon: Wifi },
            { label: "Total Sessions", value: sessions.length, icon: Clock },
          ].map((stat) => (
            <Card key={stat.label} className="shadow-card">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
                  <stat.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Sessions */}
          <div className="lg:col-span-2 space-y-4">
            {activeSessions.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Active</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {activeSessions.map((s) => (
                    <SessionCard key={s.id} session={s} />
                  ))}
                </div>
              </div>
            )}
            {otherSessions.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 mt-6">Recent</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {otherSessions.map((s) => (
                    <SessionCard key={s.id} session={s} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <ConnectedDevices devices={connectedDevices} />
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Quick Pair</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <QRPairingPanel sessionId="QUICK1" size={160} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
