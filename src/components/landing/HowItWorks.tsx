import { motion } from "framer-motion";
import { Download, QrCode, Eye } from "lucide-react";

const steps = [
  {
    icon: Download,
    step: "01",
    title: "Install & Launch",
    description: "Download the desktop app or open the web dashboard. Select which screen or window to share.",
  },
  {
    icon: QrCode,
    step: "02",
    title: "Scan QR Code",
    description: "A unique QR code is generated. Scan it with your phone camera to pair instantly.",
  },
  {
    icon: Eye,
    step: "03",
    title: "Preview in Real Time",
    description: "See your work on your phone with <80ms latency. Rotate, zoom, and test touch interactions.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Up and running in <span className="text-gradient">seconds</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Three steps. No complex setup. No accounts required for local mode.
          </p>
        </motion.div>

        <div className="grid gap-8 sm:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative text-center"
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow">
                <step.icon className="h-7 w-7 text-primary-foreground" />
              </div>
              <div className="text-xs font-bold text-primary tracking-widest uppercase mb-2">{step.step}</div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              {i < 2 && (
                <div className="hidden sm:block absolute top-8 -right-4 w-8 h-0.5 bg-border" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
