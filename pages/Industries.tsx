import { Link } from "react-router-dom";
import { Truck, Factory, Hotel, HeartPulse, Building2, Briefcase, Landmark, Wheat, ArrowRight } from "lucide-react";

const industries = [
  { icon: Truck, title: "Transport & Logistics", desc: "Fleet conversion and energy optimization for transport companies, delivery services and logistics operations." },
  { icon: Factory, title: "Manufacturing", desc: "Industrial power and energy systems for factories and production facilities." },
  { icon: Hotel, title: "Hospitality", desc: "Hotels, apartments and hospitality facilities energy management." },
  { icon: HeartPulse, title: "Healthcare", desc: "Reliable energy infrastructure for hospitals and clinics." },
  { icon: Building2, title: "Real Estate", desc: "Estate-wide power and energy management solutions." },
  { icon: Briefcase, title: "Corporate", desc: "Office energy systems and power optimization." },
  { icon: Landmark, title: "Government", desc: "Energy infrastructure and technical services for government facilities." },
  { icon: Wheat, title: "Agriculture", desc: "Powering farms, irrigation systems and processing facilities." },
];

export default function Industries() {
  return (
    <>
      <section className="relative min-h-[40vh] flex items-center overflow-hidden pt-4">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full bg-[var(--cng-blue)] opacity-[0.06] blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 w-full">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] mb-6">
              <Link to="/" className="hover:text-[var(--energy-green)] transition-colors">Home</Link>
              <span>/</span><span className="text-[var(--energy-green)]">Industries</span>
            </div>
            <div className="inline-flex items-center gap-2 glass-panel rounded-full px-4 py-1.5 mb-6 reveal">
              <span className="text-xs font-medium tracking-[0.15em] text-[var(--cng-blue)]">INDUSTRIES</span>
            </div>
            <h1 className="font-display font-bold text-4xl md:text-6xl leading-[0.95] tracking-tight reveal reveal-delay-1">
              <span className="text-gradient-light">ENGINEERED FOR</span>
              <br /><span className="text-gradient-green">REAL-WORLD OPERATIONS</span>
            </h1>
          </div>
        </div>
      </section>

      <section className="section-padding pt-4 relative">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {industries.map((ind, i) => (
              <div key={ind.title} className="glass-card p-6 reveal" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="w-12 h-12 rounded-xl bg-[rgba(0,168,255,0.08)] flex items-center justify-center mb-4">
                  <ind.icon className="w-6 h-6 text-[var(--cng-blue)]" />
                </div>
                <h3 className="font-display font-semibold text-lg text-[var(--electric)] mb-2">{ind.title}</h3>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{ind.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/request-quote" className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--energy-green)] text-[var(--obsidian)] font-semibold btn-magnetic glow-green">
              Discuss Your Industry Needs <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
