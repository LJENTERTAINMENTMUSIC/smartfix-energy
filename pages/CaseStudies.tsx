import { Link } from "react-router-dom";
import { MapPin, Building2, AlertTriangle, Search, Wrench, CheckCircle, TrendingUp, Settings, ArrowRight } from "lucide-react";

const caseStudies = [
  {
    client: "Logistics Company",
    location: "Lagos",
    challenge: "High fuel costs across a 30-vehicle petrol fleet, with monthly fuel spend exceeding ₦2.5M.",
    assessment: "Fleet energy assessment revealed conversion feasibility for 85% of vehicles.",
    solution: "Phased CNG conversion rollout with maintained fuel tracking and SmartFix managed servicing.",
    implementation: "Conversion completed over 6 weeks with zero operational downtime.",
    result: "Fuel costs reduced by 40% within the first quarter post-conversion.",
    maintenance: "Ongoing SmartFix managed maintenance contract with quarterly servicing.",
  },
  {
    client: "Hospitality Group",
    location: "Abeokuta, Ogun",
    challenge: "Unreliable grid power and high diesel consumption for hotel operations.",
    assessment: "Energy audit identified generator inefficiency and solar potential.",
    solution: "Hybrid system: solar PV + battery storage + CNG generator conversion + grid integration.",
    implementation: "Phased installation over 8 weeks with system commissioning and staff training.",
    result: "Diesel consumption reduced by 60%; reliable 24/7 power achieved.",
    maintenance: "Annual maintenance contract with priority emergency support.",
  },
  {
    client: "Manufacturing Facility",
    location: "Ibadan, Oyo",
    challenge: "Prime power needs for continuous manufacturing operations with frequent grid outages.",
    assessment: "Load profiling and generator audit identified optimization opportunities.",
    solution: "500KVA prime power generator + ATS + load management system + CNG conversion feasibility.",
    implementation: "Installation, synchronization and commissioning over 4 weeks.",
    result: "Uninterrupted power supply with optimized fuel consumption.",
    maintenance: "Preventive maintenance schedule with remote monitoring setup.",
  },
];

const fields = [
  { icon: Building2, key: "client", label: "Client" },
  { icon: MapPin, key: "location", label: "Location" },
  { icon: AlertTriangle, key: "challenge", label: "Challenge" },
  { icon: Search, key: "assessment", label: "Assessment" },
  { icon: Wrench, key: "solution", label: "Solution" },
  { icon: Settings, key: "implementation", label: "Implementation" },
  { icon: TrendingUp, key: "result", label: "Result" },
  { icon: CheckCircle, key: "maintenance", label: "Maintenance" },
];

export default function CaseStudies() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[40vh] flex items-center overflow-hidden pt-4">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full bg-[var(--energy-green)] opacity-[0.06] blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 w-full">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] mb-6">
              <Link to="/" className="hover:text-[var(--energy-green)] transition-colors">Home</Link>
              <span>/</span><span className="text-[var(--energy-green)]">Case Studies</span>
            </div>
            <div className="inline-flex items-center gap-2 glass-panel rounded-full px-4 py-1.5 mb-6 reveal">
              <span className="text-xs font-medium tracking-[0.15em] text-[var(--energy-green)]">CASE STUDIES</span>
            </div>
            <h1 className="font-display font-bold text-4xl md:text-6xl leading-[0.95] tracking-tight reveal reveal-delay-1">
              <span className="text-gradient-light">FROM PROBLEM</span>
              <br /><span className="text-gradient-green">TO PERFORMANCE</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base text-[var(--muted-foreground)] leading-relaxed reveal reveal-delay-2">
              Real challenges, real assessments, real solutions. See how SmartFix transforms energy
              systems for businesses across Nigeria.
            </p>
          </div>
        </div>
      </section>

      {/* Case studies */}
      <section className="section-padding pt-4 relative">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="flex flex-col gap-6">
            {caseStudies.map((cs, i) => (
              <div key={i} className="glass-card p-6 md:p-8 reveal" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  {fields.map((field) => (
                    <div key={field.key}>
                      <div className="flex items-center gap-2 mb-1">
                        <field.icon className="w-4 h-4 text-[var(--energy-green)]" />
                        <span className="text-xs font-semibold tracking-wider text-[var(--muted-foreground)]">{field.label}</span>
                      </div>
                      <p className="text-sm text-[var(--electric)] leading-relaxed pl-6">
                        {cs[field.key as keyof typeof cs]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-center text-[var(--muted-foreground)] opacity-70">
            Case studies shown are representative examples. Contact us for detailed project references.
          </p>

          {/* CTA */}
          <div className="mt-10 text-center">
            <Link to="/request-quote" className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--energy-green)] text-[var(--obsidian)] font-semibold btn-magnetic glow-green">
              Discuss Your Project <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
