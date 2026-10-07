import { Link } from "react-router-dom";
import { Car, Zap, Fuel, Building2, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

interface ServiceSelectorProps {
  onOpenConcierge?: () => void;
}

const CATEGORIES = [
  {
    id: "move",
    icon: Car,
    title: "MOVE",
    tagline: "CNG Vehicle & Fleet Mobility",
    accent: "var(--energy-green)",
    items: [
      "Vehicle CNG conversion",
      "Commercial fleet conversion",
      "Fleet energy assessment",
      "Dedicated CNG diagnostics",
    ],
    link: "/cng",
    cta: "Explore Mobility",
  },
  {
    id: "power",
    icon: Zap,
    title: "POWER",
    tagline: "Prime, Standby & Microgrids",
    accent: "var(--cng-blue)",
    items: [
      "Generator CNG conversion",
      "Industrial diesel generators",
      "Commercial solar PV arrays",
      "LiFePO4 battery energy storage",
      "Smart hybrid microgrids",
    ],
    link: "/generators",
    cta: "Explore Power",
  },
  {
    id: "fuel",
    icon: Fuel,
    title: "FUEL",
    tagline: "CNG + Diesel Supply Contracts",
    accent: "#ff9f0a",
    items: [
      "Bulk diesel supply & delivery",
      "CNG virtual pipeline supply",
      "Generator automated refueling",
      "Commercial fuel management",
      "Combined hybrid fuel plans",
    ],
    link: "/fuel",
    cta: "Explore Fuel",
  },
  {
    id: "infrastructure",
    icon: Building2,
    title: "INFRASTRUCTURE",
    tagline: "Turnkey Energy Engineering",
    accent: "var(--electric)",
    items: [
      "CNG daughter stations",
      "High-pressure gas storage (200-bar)",
      "Industrial ATS switchgear",
      "Energy-as-a-Service (EaaS)",
    ],
    link: "/hybrid-energy",
    cta: "Explore Infrastructure",
  },
];

export default function ServiceSelector({ onOpenConcierge }: ServiceSelectorProps) {
  return (
    <section className="relative py-12 md:py-20 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 glass-panel rounded-full px-4 py-1.5 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[var(--energy-green)]" />
            <span className="text-xs font-semibold tracking-[0.18em] text-[var(--muted-foreground)] uppercase">
              ONE ENERGY PARTNER · COMPLETE CAPABILITY
            </span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight text-[var(--electric)]">
            WHAT DO YOU NEED HELP WITH?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[var(--muted-foreground)] leading-relaxed">
            Tell SmartFix what you need once. Our integrated engineering, fuel logistics, and field workforce handle the rest.
          </p>
        </div>

        {/* 4 Large Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                className="group relative rounded-3xl glass-card border border-white/10 p-6 flex flex-col justify-between transition-all duration-300 hover:border-white/20 hover:-translate-y-1"
                style={{
                  boxShadow: `0 20px 40px -20px color-mix(in srgb, ${cat.accent} 25%, transparent)`,
                }}
              >
                <div>
                  {/* Icon & Title */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                      style={{
                        background: `color-mix(in srgb, ${cat.accent} 15%, transparent)`,
                        color: cat.accent,
                      }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-mono font-bold tracking-widest text-[var(--muted-foreground)]">
                        0{CATEGORIES.indexOf(cat) + 1}
                      </span>
                      <h3 className="font-display font-bold text-xl text-[var(--electric)]">
                        {cat.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs font-medium text-[var(--muted-foreground)] mb-5">
                    {cat.tagline}
                  </p>

                  {/* Bullet points */}
                  <ul className="space-y-2.5 mb-6">
                    {cat.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-xs sm:text-sm text-[var(--electric)]/80">
                        <CheckCircle2
                          className="w-4 h-4 flex-shrink-0 mt-0.5"
                          style={{ color: cat.accent }}
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom link */}
                <Link
                  to={cat.link}
                  className="mt-2 inline-flex items-center justify-between w-full px-4 py-3 rounded-xl glass-panel text-xs font-semibold text-[var(--electric)] hover:text-[var(--energy-green)] transition-colors"
                >
                  <span>{cat.cta}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Central Action Callout */}
        <div className="mt-10 md:mt-14 rounded-3xl glass-card border border-white/10 p-6 md:p-8 text-center relative overflow-hidden bg-gradient-to-r from-white/[0.02] via-[var(--energy-green)]/[0.04] to-transparent">
          <div className="max-w-2xl mx-auto">
            <h3 className="font-display font-bold text-xl sm:text-2xl text-[var(--electric)]">
              “Tell us what you need. We'll handle the rest.”
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed">
              No repeated questions. No lost specifications. Our AI Concierge gathers your requirements and immediately creates your verified SmartFix Project Pack.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={onOpenConcierge}
                className="btn-magnetic inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[var(--energy-green)] text-[var(--obsidian)] font-bold text-sm sm:text-base glow-green cursor-pointer shadow-xl hover:opacity-95"
              >
                <Sparkles className="w-5 h-5" />
                START MY ENERGY PROJECT →
              </button>
              <Link
                to="/fuel"
                className="inline-flex items-center gap-2 px-6 py-4 rounded-xl glass-panel text-xs sm:text-sm font-semibold text-[var(--electric)] hover:text-[#ff9f0a] transition-colors"
              >
                <Fuel className="w-4 h-4 text-[#ff9f0a]" />
                Request Diesel / CNG Fuel Supply
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
