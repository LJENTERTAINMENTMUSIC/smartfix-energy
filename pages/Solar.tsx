import { Link } from "react-router-dom";
import { Home, Building2, Factory, Landmark, ArrowRight, Sun, Battery, Zap, Grid3x3 } from "lucide-react";

const solutions = [
  { icon: Home, title: "Residential", desc: "Solar + inverter + battery systems for homes and apartments.", color: "var(--energy-green)" },
  { icon: Building2, title: "Commercial", desc: "Solar + battery + grid + generator for offices and retail.", color: "var(--cng-blue)" },
  { icon: Factory, title: "Industrial", desc: "Large-scale solar + storage + power management systems.", color: "var(--electric)" },
  { icon: Landmark, title: "Institutional", desc: "Schools, hospitals, offices and government facilities.", color: "var(--energy-green)" },
];

const features = [
  { icon: Sun, title: "Solar PV", desc: "Monocrystalline and polycrystalline panels" },
  { icon: Zap, title: "Inverters", desc: "String, hybrid and off-grid inverters" },
  { icon: Battery, title: "Batteries", desc: "Lithium-ion and lead-acid storage" },
  { icon: Grid3x3, title: "Hybrid Systems", desc: "Solar + grid + generator + battery integration" },
];

export default function Solar() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden pt-4">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full bg-[var(--energy-green)] opacity-[0.06] blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 w-full">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] mb-6">
              <Link to="/" className="hover:text-[var(--energy-green)] transition-colors">Home</Link>
              <span>/</span><span className="text-[var(--energy-green)]">Solar & Battery</span>
            </div>
            <div className="inline-flex items-center gap-2 glass-panel rounded-full px-4 py-1.5 mb-6 reveal">
              <Sun className="w-3.5 h-3.5 text-[var(--energy-green)]" />
              <span className="text-xs font-medium tracking-[0.15em] text-[var(--muted-foreground)]">SOLAR & BATTERY</span>
            </div>
            <h1 className="font-display font-bold text-4xl md:text-6xl leading-[0.95] tracking-tight reveal reveal-delay-1">
              <span className="text-gradient-light">ENERGY THAT WORKS</span>
              <br /><span className="text-gradient-green">WHEN YOU NEED IT.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base md:text-lg text-[var(--muted-foreground)] leading-relaxed reveal reveal-delay-2">
              Solar PV, inverters, batteries and hybrid energy systems for residential, commercial,
              industrial and institutional applications.
            </p>
            <Link to="/request-quote" className="group mt-8 inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--energy-green)] text-[var(--obsidian)] font-semibold btn-magnetic glow-green reveal reveal-delay-3">
              Design My Solar System <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section className="section-padding relative">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tight">
              <span className="text-gradient-light">SOLUTIONS FOR</span> <span className="text-gradient-green">EVERY SCALE</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {solutions.map((sol, i) => (
              <div key={sol.title} className="glass-card p-6 reveal" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: `${sol.color}12`, color: sol.color }}>
                  <sol.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display font-semibold text-lg text-[var(--electric)] mb-2">{sol.title}</h3>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{sol.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding relative">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tight">
              <span className="text-gradient-light">COMPLETE</span> <span className="text-gradient-green">SYSTEM COMPONENTS</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((f, i) => (
              <div key={f.title} className="glass-card p-5 text-center reveal" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="w-10 h-10 rounded-lg bg-[rgba(0,217,127,0.08)] flex items-center justify-center mx-auto mb-3">
                  <f.icon className="w-5 h-5 text-[var(--energy-green)]" />
                </div>
                <h3 className="font-display font-semibold text-sm text-[var(--electric)] mb-1">{f.title}</h3>
                <p className="text-xs text-[var(--muted-foreground)]">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
