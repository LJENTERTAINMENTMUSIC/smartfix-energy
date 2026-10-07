import { Wrench, Gauge, Cog, Shield, Truck, FileSearch, Settings, RefreshCw } from "lucide-react";

const services = [
  { icon: Wrench, title: "Petrol-to-CNG Conversion", desc: "Full conversion of petrol engines to dual-fuel or dedicated CNG systems." },
  { icon: Truck, title: "Commercial Vehicle Conversion", desc: "Conversion solutions for commercial transport and logistics vehicles." },
  { icon: Gauge, title: "Fleet Conversion", desc: "Scale conversion across entire fleets with managed rollout and tracking." },
  { icon: FileSearch, title: "CNG Diagnostics", desc: "Comprehensive diagnostic services for CNG systems and components." },
  { icon: Cog, title: "CNG Servicing & Maintenance", desc: "Scheduled servicing and preventive maintenance for CNG-converted vehicles." },
  { icon: RefreshCw, title: "Component Replacement", desc: "Genuine CNG component sourcing, replacement and warranty support." },
  { icon: Shield, title: "CNG Technical Consultancy", desc: "Expert advisory on CNG feasibility, compliance and system design." },
  { icon: Settings, title: "Fleet Energy Assessment", desc: "Comprehensive energy assessment for fleet conversion planning." },
];

export default function CNGServices() {
  return (
    <section className="section-padding relative">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 glass-panel rounded-full px-4 py-1.5 mb-6">
            <span className="text-xs font-medium tracking-[0.15em] text-[var(--energy-green)]">
              CNG SERVICES
            </span>
          </div>
          <h2 className="font-display font-bold text-3xl md:text-5xl leading-tight tracking-tight">
            <span className="text-gradient-light">COMPLETE CNG</span>{" "}
            <span className="text-gradient-green">SOLUTION STACK</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((s, i) => (
            <div
              key={s.title}
              className="glass-card p-5 group reveal"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="w-10 h-10 rounded-lg bg-[rgba(0,217,127,0.08)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <s.icon className="w-5 h-5 text-[var(--energy-green)]" />
              </div>
              <h3 className="font-display font-semibold text-sm text-[var(--electric)] mb-1">{s.title}</h3>
              <p className="text-xs text-[var(--muted-foreground)] leading-snug">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
