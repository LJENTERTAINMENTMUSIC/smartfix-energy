import { Link } from "react-router-dom";
import { ClipboardCheck, Fuel, Activity, Gauge, Settings, Zap, Clock, Sun, Car, ArrowRight } from "lucide-react";

const auditItems = [
  { icon: Fuel, title: "Generator Consumption", desc: "Fuel usage analysis and efficiency assessment." },
  { icon: Zap, title: "Grid Usage", desc: "Grid power consumption patterns and costs." },
  { icon: Gauge, title: "Load Profile", desc: "Detailed load analysis and demand mapping." },
  { icon: Settings, title: "Equipment Efficiency", desc: "Performance evaluation of existing equipment." },
  { icon: Activity, title: "Power Quality", desc: "Voltage, frequency and power factor analysis." },
  { icon: Clock, title: "Operating Patterns", desc: "Usage patterns and scheduling optimization." },
  { icon: Sun, title: "Solar Potential", desc: "Site assessment for solar feasibility." },
  { icon: Car, title: "CNG Feasibility", desc: "Evaluation of CNG conversion opportunities." },
];

export default function EnergyAudit() {
  return (
    <>
      <section className="relative min-h-[50vh] flex items-center overflow-hidden pt-4">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full bg-[var(--cng-blue)] opacity-[0.06] blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 w-full">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] mb-6">
              <Link to="/" className="hover:text-[var(--energy-green)] transition-colors">Home</Link>
              <span>/</span><span className="text-[var(--energy-green)]">Energy Audit</span>
            </div>
            <div className="inline-flex items-center gap-2 glass-panel rounded-full px-4 py-1.5 mb-6 reveal">
              <ClipboardCheck className="w-3.5 h-3.5 text-[var(--cng-blue)]" />
              <span className="text-xs font-medium tracking-[0.15em] text-[var(--muted-foreground)]">ENERGY AUDIT</span>
            </div>
            <h1 className="font-display font-bold text-4xl md:text-6xl leading-[0.95] tracking-tight reveal reveal-delay-1">
              <span className="text-gradient-light">STOP GUESSING WHERE</span>
              <br /><span className="text-gradient-green">YOUR ENERGY MONEY GOES.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base md:text-lg text-[var(--muted-foreground)] leading-relaxed reveal reveal-delay-2">
              SmartFix provides comprehensive energy audits that reveal exactly where your energy costs
              are going — and where you can save.
            </p>
            <Link to="/request-quote" className="group mt-8 inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--cng-blue)] text-white font-semibold btn-magnetic glow-blue reveal reveal-delay-3">
              Book Energy Audit <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section-padding relative">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tight">
              <span className="text-gradient-light">WHAT WE</span> <span className="text-gradient-green">AUDIT</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {auditItems.map((item, i) => (
              <div key={item.title} className="glass-card p-5 reveal" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="w-10 h-10 rounded-lg bg-[rgba(0,168,255,0.08)] flex items-center justify-center mb-3">
                  <item.icon className="w-5 h-5 text-[var(--cng-blue)]" />
                </div>
                <h3 className="font-display font-semibold text-sm text-[var(--electric)] mb-1">{item.title}</h3>
                <p className="text-xs text-[var(--muted-foreground)] leading-snug">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
