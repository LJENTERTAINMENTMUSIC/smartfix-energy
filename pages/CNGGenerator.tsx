import { Link } from "react-router-dom";
import { Factory, Cog, Wrench, Package, Settings, CheckCircle, Stethoscope, Activity, Network, Gauge, ArrowRight } from "lucide-react";

const services = [
  { icon: Factory, title: "CNG Conversion", desc: "Convert diesel/petrol generators to run on CNG." },
  { icon: Cog, title: "Dual-Fuel Systems", desc: "Flexible dual-fuel systems for diesel-CNG operation." },
  { icon: Package, title: "Generator Supply", desc: "Supply of CNG-ready generators across all capacities." },
  { icon: Wrench, title: "Installation", desc: "Professional installation and system integration." },
  { icon: CheckCircle, title: "Commissioning", desc: "Testing, handover and system certification." },
  { icon: Settings, title: "Maintenance", desc: "Scheduled maintenance for CNG generator systems." },
  { icon: Stethoscope, title: "Diagnostics", desc: "Advanced diagnostic and troubleshooting services." },
  { icon: Activity, title: "Automation", desc: "Automated start/stop and load management systems." },
  { icon: Network, title: "Synchronization", desc: "Multi-generator synchronization for parallel operation." },
  { icon: Gauge, title: "Load Management", desc: "Intelligent load distribution and power optimization." },
];

export default function CNGGenerator() {
  return (
    <>
      <section className="relative min-h-[50vh] flex items-center overflow-hidden pt-4">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full bg-[var(--energy-green)] opacity-[0.06] blur-[120px]" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-[var(--cng-blue)] opacity-[0.05] blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 w-full">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] mb-6">
              <Link to="/" className="hover:text-[var(--energy-green)] transition-colors">Home</Link>
              <span>/</span><Link to="/cng" className="hover:text-[var(--energy-green)] transition-colors">CNG</Link>
              <span>/</span><span className="text-[var(--energy-green)]">Generator</span>
            </div>
            <div className="inline-flex items-center gap-2 glass-panel rounded-full px-4 py-1.5 mb-6 reveal">
              <Factory className="w-3.5 h-3.5 text-[var(--energy-green)]" />
              <span className="text-xs font-medium tracking-[0.15em] text-[var(--muted-foreground)]">CNG GENERATOR</span>
            </div>
            <h1 className="font-display font-bold text-4xl md:text-6xl leading-[0.95] tracking-tight reveal reveal-delay-1">
              <span className="text-gradient-light">TURN YOUR GENERATOR</span>
              <br /><span className="text-gradient-green">INTO A SMARTER POWER ASSET.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base md:text-lg text-[var(--muted-foreground)] leading-relaxed reveal reveal-delay-2">
              Convert, supply, install and maintain CNG-powered generator systems. Reduce fuel costs,
              improve reliability and transition to cleaner power generation.
            </p>
            <Link to="/request-quote" className="group mt-8 inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--energy-green)] text-[var(--obsidian)] font-semibold btn-magnetic glow-green reveal reveal-delay-3">
              Convert My Generator <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section-padding relative">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tight">
              <span className="text-gradient-light">FULL GENERATOR</span> <span className="text-gradient-green">SOLUTION STACK</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {services.map((s, i) => (
              <div key={s.title} className="glass-card p-5 reveal" style={{ animationDelay: `${i * 0.07}s` }}>
                <div className="w-10 h-10 rounded-lg bg-[rgba(0,217,127,0.08)] flex items-center justify-center mb-3">
                  <s.icon className="w-5 h-5 text-[var(--energy-green)]" />
                </div>
                <h3 className="font-display font-semibold text-sm text-[var(--electric)] mb-1">{s.title}</h3>
                <p className="text-xs text-[var(--muted-foreground)] leading-snug">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
