import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out local previews",
    features: [
      "Local network streaming",
      "1 connected device",
      "720p resolution",
      "Basic device frames",
      "QR pairing",
    ],
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "/month",
    description: "For designers & developers who need more",
    features: [
      "Local + Internet streaming",
      "5 connected devices",
      "1080p resolution",
      "All device frames",
      "Color profile simulation",
      "Touch input relay",
      "Session recording",
    ],
    cta: "Start Free Trial",
    highlight: true,
  },
  {
    name: "Team",
    price: "$29",
    period: "/month per seat",
    description: "For studios and development teams",
    features: [
      "Everything in Pro",
      "10 connected devices",
      "4K resolution",
      "Team session sharing",
      "Priority TURN servers",
      "Admin dashboard",
      "SSO & SAML",
    ],
    cta: "Contact Sales",
    highlight: false,
  },
];

const Pricing = React.forwardRef<HTMLElement>(function Pricing(_, ref) {
  return (
    <section id="pricing" ref={ref} className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, transparent <span className="text-gradient">pricing</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Start free. Upgrade when you need more devices and features.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-3 max-w-5xl mx-auto">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-2xl border p-6 sm:p-8 flex flex-col ${
                tier.highlight
                  ? "border-primary/30 bg-card shadow-glow relative"
                  : "border-border bg-card shadow-card"
              }`}
            >
              {tier.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full gradient-primary px-4 py-0.5 text-xs font-semibold text-primary-foreground">
                  Most Popular
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-lg font-semibold">{tier.name}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  <span className="text-sm text-muted-foreground">{tier.period}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{tier.description}</p>
              </div>
              <ul className="mb-8 flex-1 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-accent flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                className={tier.highlight ? "gradient-primary border-0 w-full" : "w-full"}
                variant={tier.highlight ? "default" : "outline"}
                asChild
              >
                <Link to="/dashboard">{tier.cta}</Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

export default Pricing;
