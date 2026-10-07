import { Link } from "react-router-dom";
import { ArrowRight, Fuel, Zap, Gauge } from "lucide-react";

const stats = [
  { label: "CNG CONVERSION", items: "Vehicle • Fleet • Generator", icon: Fuel, color: "var(--energy-green)" },
  { label: "POWER", items: "Generator • Solar • Battery", icon: Zap, color: "var(--cng-blue)" },
  { label: "ENERGY", items: "Audit • Efficiency • Hybrid", icon: Gauge, color: "var(--electric)" },
];

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Radial glow accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[var(--energy-green)] opacity-[0.07] blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[var(--cng-blue)] opacity-[0.05] blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 text-center">
        {/* Tagline badge */}
        <div className="inline-flex items-center gap-2 glass-panel rounded-full px-4 py-1.5 mb-8 reveal">
          <span className="w-2 h-2 rounded-full bg-[var(--energy-green)] pulse-ring" />
          <span className="text-xs font-medium tracking-[0.15em] text-[var(--muted-foreground)]">
            CNG • POWER • SOLAR • ALTERNATIVE ENERGY
          </span>
        </div>

        {/* Headlines */}
        <h1 className="font-display font-bold text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight reveal reveal-delay-1">
          <span className="text-gradient-light block">POWER YOUR</span>
          <span className="text-gradient-green block">BUSINESS.</span>
          <span className="text-gradient-light block">MOVE SMARTER.</span>
        </h1>

        {/* Supporting text */}
        <p className="mt-8 max-w-2xl mx-auto text-base md:text-lg text-[var(--muted-foreground)] leading-relaxed reveal reveal-delay-2">
          CNG conversion, alternative energy, generators, solar, hybrid power and energy-management
          solutions engineered for modern businesses, fleets and industries.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 reveal reveal-delay-3">
          <Link
            to="/request-quote"
            className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--energy-green)] text-[var(--obsidian)] font-semibold btn-magnetic glow-green"
          >
            Get Your Energy Quote
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/cng"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl glass-card text-[var(--electric)] font-medium"
          >
            Explore Solutions
          </Link>
        </div>

        {/* Floating glass statistics */}
        <div className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="glass-card p-4 md:p-5 text-left stat-float"
              style={{ animationDelay: `${i * 0.5}s` }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-7 h-7 rounded-md flex items-center justify-center"
                  style={{ background: `${stat.color}15`, color: stat.color }}
                >
                  <stat.icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold tracking-wider" style={{ color: stat.color }}>
                  {stat.label}
                </span>
              </div>
              <p className="text-sm text-[var(--muted-foreground)]">{stat.items}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
