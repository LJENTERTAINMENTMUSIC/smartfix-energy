import { Link } from "react-router-dom";
import { Wrench, AlertTriangle, Phone, Cog, Car, Sun, Battery, AirVent, Stethoscope, Package, ArrowRight } from "lucide-react";

const services = [
  { icon: Wrench, title: "Preventive Maintenance", desc: "Scheduled servicing to prevent failures and extend equipment life." },
  { icon: AlertTriangle, title: "Corrective Maintenance", desc: "Rapid response repairs for equipment failures and faults." },
  { icon: Phone, title: "Emergency Support", desc: "24/7 emergency technical support when power goes down." },
  { icon: Cog, title: "Generator Servicing", desc: "Full servicing for diesel, gas and hybrid generators." },
  { icon: Car, title: "CNG System Maintenance", desc: "Maintenance and servicing for CNG-converted vehicles and generators." },
  { icon: Sun, title: "Solar Maintenance", desc: "Panel cleaning, inverter checks and solar system optimization." },
  { icon: Battery, title: "Battery Replacement", desc: "Battery testing, replacement and disposal services." },
  { icon: AirVent, title: "HVAC / Electrical Support", desc: "Electrical and HVAC maintenance support services." },
  { icon: Stethoscope, title: "Diagnostics", desc: "Comprehensive diagnostic services for all energy systems." },
  { icon: Package, title: "Asset Management", desc: "Long-term asset tracking and lifecycle management." },
];

export default function Maintenance() {
  return (
    <>
      <section className="relative min-h-[50vh] flex items-center overflow-hidden pt-4">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full bg-[var(--energy-green)] opacity-[0.06] blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 w-full">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] mb-6">
              <Link to="/" className="hover:text-[var(--energy-green)] transition-colors">Home</Link>
              <span>/</span><span className="text-[var(--energy-green)]">Maintenance</span>
            </div>
            <div className="inline-flex items-center gap-2 glass-panel rounded-full px-4 py-1.5 mb-6 reveal">
              <Wrench className="w-3.5 h-3.5 text-[var(--energy-green)]" />
              <span className="text-xs font-medium tracking-[0.15em] text-[var(--muted-foreground)]">SERVICE & MAINTENANCE</span>
            </div>
            <h1 className="font-display font-bold text-4xl md:text-6xl leading-[0.95] tracking-tight reveal reveal-delay-1">
              <span className="text-gradient-light">WHEN YOUR POWER SYSTEM</span>
              <br /><span className="text-gradient-green">STOPS, BUSINESS STOPS.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base md:text-lg text-[var(--muted-foreground)] leading-relaxed reveal reveal-delay-2">
              SmartFix provides comprehensive maintenance and technical services for generators, CNG systems,
              solar installations, batteries and all energy infrastructure.
            </p>
            <Link to="/request-quote" className="group mt-8 inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--energy-green)] text-[var(--obsidian)] font-semibold btn-magnetic glow-green reveal reveal-delay-3">
              Book Technical Service <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section-padding relative">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tight">
              <span className="text-gradient-light">FULL SERVICE</span> <span className="text-gradient-green">COVERAGE</span>
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
