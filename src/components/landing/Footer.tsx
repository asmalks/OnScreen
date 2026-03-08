import React from "react";
import { Monitor } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = React.forwardRef<HTMLElement>(function Footer(_, ref) {
  return (
    <footer ref={ref} className="border-t border-border bg-muted/30 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
              <Monitor className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-bold font-[Space_Grotesk]">DevPreview</span>
          </Link>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Docs</a>
            <a href="#" className="hover:text-foreground transition-colors">GitHub</a>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 DevPreview. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
});

export default Footer;
