import { Link } from "react-router-dom";
import { ArrowRight, Fuel, TrendingDown, Leaf } from "lucide-react";

const benefits = [
  { icon: TrendingDown, title: "Reduce Fuel Dependence", desc: "Cut petrol costs significantly with cleaner-burning CNG." },
  { icon: Fuel, title: "Improve Operating Economics", desc: "Lower per-kilometre energy costs for commercial fleets." },
  { icon: Leaf, title: "Transition to Cleaner Fuel", desc: "Reduce emissions without changing your vehicle." },
];

export default function CNGHero() {
  return (
    <section className="relative min-h-[60vh] flex items-center overflow-hidden pt-4">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-80 h-80 rounded-full bg-[var(--energy-green)] opacity-[0.06] blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 w-full">
        <div className="max-w-3xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] mb-6">
            <Link to="/" className="hover:text-[var(--energy-green)] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[var(--energy-green)]">CNG</span>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass-panel rounded-full px-4 py-1.5 mb-6 reveal">
            <span className="w-2 h-2 rounded-full bg-[var(--energy-green)] pulse-ring" />
            <span className="text-xs font-medium tracking-[0.15em] text-[var(--muted-foreground)]">
              CNG CONVERSION
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display font-bold text-4xl md:text-6xl leading-[0.95] tracking-tight reveal reveal-delay-1">
            <span className="text-gradient-light">CNG CONVERSION</span>
            <br />
            <span className="text-gradient-green">ENGINEERED FOR YOUR VEHICLE.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-base md:text-lg text-[var(--muted-foreground)] leading-relaxed reveal reveal-delay-2">
            Reduce fuel dependence. Improve operating economics. Transition to a cleaner alternative
            fuel system. SmartFix provides CNG conversion, installation, diagnostics, maintenance and
            fleet solutions.
          </p>

          {/* CTA */}
          <div className="mt-8 reveal reveal-delay-3">
            <a
              href="#wizard"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("wizard")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--energy-green)] text-[var(--obsidian)] font-semibold btn-magnetic glow-green cursor-pointer"
            >
              Check My Vehicle
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl">
          {benefits.map((b, i) => (
            <div key={b.title} className="glass-card p-5 reveal" style={{ animationDelay: `${0.4 + i * 0.1}s` }}>
              <div className="w-9 h-9 rounded-lg bg-[rgba(0,217,127,0.08)] flex items-center justify-center mb-3">
                <b.icon className="w-5 h-5 text-[var(--energy-green)]" />
              </div>
              <h3 className="font-display font-semibold text-sm text-[var(--electric)] mb-1">{b.title}</h3>
              <p className="text-xs text-[var(--muted-foreground)] leading-snug">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
