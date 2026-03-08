import { Link, useLocation } from "react-router-dom";
import { Monitor, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Navbar() {
  const location = useLocation();
  const isLanding = location.pathname === "/";
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
            <Monitor className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight font-[Space_Grotesk]">DevPreview</span>
        </Link>

        {isLanding ? (
          <>
            <div className="hidden items-center gap-8 md:flex">
              <a href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Features</a>
              <a href="#how-it-works" className="text-sm text-muted-foreground transition-colors hover:text-foreground">How it works</a>
              <a href="#pricing" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Pricing</a>
            </div>
            <div className="hidden items-center gap-3 md:flex">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Log in</Link>
              </Button>
              <Button size="sm" className="gradient-primary border-0" asChild>
                <Link to="/login">Get Started</Link>
              </Button>
            </div>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            {mobileOpen && (
              <div className="absolute left-0 right-0 top-16 border-b border-border bg-background p-4 md:hidden">
                <div className="flex flex-col gap-3">
                  <a href="#features" className="text-sm text-muted-foreground" onClick={() => setMobileOpen(false)}>Features</a>
                  <a href="#how-it-works" className="text-sm text-muted-foreground" onClick={() => setMobileOpen(false)}>How it works</a>
                  <a href="#pricing" className="text-sm text-muted-foreground" onClick={() => setMobileOpen(false)}>Pricing</a>
                  <Button size="sm" className="gradient-primary border-0 mt-2" asChild>
                    <Link to="/login">Get Started</Link>
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/settings">Settings</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">Home</Link>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
