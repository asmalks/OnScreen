import { motion } from "framer-motion";
import { Monitor, Smartphone, Palette, QrCode, Users, Hand } from "lucide-react";

const features = [
  {
    icon: Monitor,
    title: "Screen & Window Capture",
    description: "Stream your entire screen, a specific window, or a selected region to any connected device.",
  },
  {
    icon: Smartphone,
    title: "Device Frame Simulation",
    description: "Preview inside accurate device frames with safe areas, notches, and status bars.",
  },
  {
    icon: Palette,
    title: "Color Profile Preview",
    description: "Test how your designs look under sRGB, Display P3, AMOLED, and low-quality LCD profiles.",
  },
  {
    icon: QrCode,
    title: "QR Code Pairing",
    description: "Scan a QR code from your phone to instantly connect — no manual IP entry needed.",
  },
  {
    icon: Users,
    title: "Multi-Device Preview",
    description: "Stream to up to 10 devices simultaneously. Test on iPhone, Android, and tablets at once.",
  },
  {
    icon: Hand,
    title: "Touch Simulation",
    description: "Use your phone's touchscreen to interact with the desktop preview — tap, swipe, and scroll.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need for <span className="text-gradient">pixel-perfect</span> previews
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Built for designers and developers who need to see their work on real devices, in real time.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:shadow-glow hover:border-primary/20"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl gradient-primary">
                <feature.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
