import { Link } from "react-router-dom";
import { ArrowRight, Car, Factory, Zap, Sun, ClipboardCheck, Layers } from "lucide-react";

const solutions = [
  {
    icon: Car,
    title: "CNG Vehicle Conversion",
    desc: "Convert petrol-powered vehicles to CNG. Reduce fuel dependence and improve operating economics.",
    cta: "Explore CNG",
    link: "/cng",
    accent: "var(--energy-green)",
  },
  {
    icon: Factory,
    title: "CNG Generator Solutions",
    desc: "Convert, supply, maintain and optimize power systems with dual-fuel and CNG generator solutions.",
    cta: "Explore Power",
    link: "/cng/generator-conversion",
    accent: "var(--cng-blue)",
  },
  {
    icon: Zap,
    title: "Generators",
    desc: "Diesel, industrial, standby, prime and large-capacity generators for every application.",
    cta: "View Generators",
    link: "/generators",
    accent: "var(--electric)",
  },
  {
    icon: Sun,
    title: "Solar & Battery",
    desc: "Solar PV, inverters, batteries and hybrid energy systems for residential and commercial use.",
    cta: "Explore Solar",
    link: "/solar",
    accent: "var(--energy-green)",
  },
  {
    icon: ClipboardCheck,
    title: "Energy Audit",
    desc: "Understand where your energy costs are going. Generator consumption, load profile, solar potential.",
    cta: "Book Energy Audit",
    link: "/energy-audit",
    accent: "var(--cng-blue)",
  },
  {
    icon: Layers,
    title: "Hybrid Energy",
    desc: "Combine CNG, solar, battery, grid and generator systems into one intelligent energy strategy.",
    cta: "Design My System",
    link: "/hybrid-energy",
    accent: "var(--electric)",
  },
];

export default function Solutions() {
  return (
    <section id="solutions" className="section-padding relative">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Section header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 glass-panel rounded-full px-4 py-1.5 mb-6">
            <span className="text-xs font-medium tracking-[0.15em] text-[var(--energy-green)]">
              SOLUTIONS
            </span>
          </div>
          <h2 className="font-display font-bold text-3xl md:text-5xl lg:text-6xl leading-tight tracking-tight">
            <span className="text-gradient-light">ONE ENERGY PARTNER.</span>
            <br />
            <span className="text-gradient-green">MULTIPLE SOLUTIONS.</span>
          </h2>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {solutions.map((sol, i) => (
            <Link
              key={sol.title}
              to={sol.link}
              className="glass-card p-6 md:p-7 group block reveal"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
                style={{
                  background: `${sol.accent}12`,
                  color: sol.accent,
                  boxShadow: `0 0 20px ${sol.accent}20`,
                }}
              >
                <sol.icon className="w-6 h-6" />
              </div>

              {/* Title */}
              <h3 className="font-display font-semibold text-lg md:text-xl text-[var(--electric)] mb-2">
                {sol.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mb-5">
                {sol.desc}
              </p>

              {/* CTA */}
              <div className="flex items-center gap-1.5 text-sm font-medium" style={{ color: sol.accent }}>
                {sol.cta}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
