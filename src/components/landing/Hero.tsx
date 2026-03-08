import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Smartphone, Monitor, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute right-0 top-40 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-card mb-8"
          >
            <Zap className="h-3.5 w-3.5 text-accent" />
            Real-time preview with &lt;80ms latency
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl max-w-4xl"
          >
            Preview any screen on{" "}
            <span className="text-gradient">any device</span>, instantly
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl"
          >
            Stream your desktop screen, design tools, or localhost to your phone in real time. 
            See exactly how your work looks on real mobile displays.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <Button size="lg" className="gradient-primary border-0 text-base px-8 shadow-glow" asChild>
              <Link to="/dashboard">
                Start Previewing <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-base px-8" asChild>
              <a href="#how-it-works">See how it works</a>
            </Button>
          </motion.div>

          {/* Hero mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16 sm:mt-20 w-full max-w-4xl"
          >
            <div className="relative rounded-2xl border border-border bg-card p-2 shadow-card">
              {/* Desktop mockup */}
              <div className="rounded-xl bg-muted overflow-hidden aspect-video flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
                <div className="flex items-center gap-12 relative">
                  <div className="flex flex-col items-center gap-2">
                    <Monitor className="h-16 w-16 text-primary/40" />
                    <span className="text-sm text-muted-foreground font-medium">Desktop</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="h-1.5 w-1.5 rounded-full bg-primary/40"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity }}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">streaming</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Smartphone className="h-16 w-16 text-accent/50" />
                    <span className="text-sm text-muted-foreground font-medium">Phone</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
