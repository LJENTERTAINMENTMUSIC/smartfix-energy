import { Link } from "react-router-dom";
import { ShieldCheck, Award, Handshake, Wrench, FileCheck, MapPin, Phone, Mail, Activity, Fuel, Zap, Sun, Battery, Car, Bell, Gauge, ArrowRight } from "lucide-react";

const trustItems = [
  { icon: FileCheck, title: "Company Registration", desc: "SmartFix Innovative Services Limited — fully registered Nigerian company." },
  { icon: Award, title: "Certifications", desc: "Contact us for current technical certifications and compliance documentation." },
  { icon: Handshake, title: "Technical Partners", desc: "Working with leading energy equipment manufacturers and suppliers." },
  { icon: Wrench, title: "Equipment Brands", desc: "Authorized supply of major generator, solar and CNG equipment brands." },
  { icon: ShieldCheck, title: "Safety Standards", desc: "All installations meet industry safety standards and best practices." },
  { icon: ShieldCheck, title: "Warranty Information", desc: "Comprehensive warranty coverage on equipment and installations." },
  { icon: MapPin, title: "Service Coverage", desc: "Lagos, Ogun, Oyo and expanding across Nigeria." },
  { icon: Phone, title: "Contact Details", desc: "Available for consultations, site visits and technical support." },
];

const controlCenterItems = [
  { icon: Activity, label: "Energy Monitoring", value: "Real-time" },
  { icon: Fuel, label: "Fuel Consumption", value: "Tracking" },
  { icon: Zap, label: "Generator Status", value: "Online" },
  { icon: Sun, label: "Solar Output", value: "12.4 kW" },
  { icon: Battery, label: "Battery Level", value: "87%" },
  { icon: Car, label: "CNG System", value: "Active" },
  { icon: Bell, label: "Service Alerts", value: "2 pending" },
  { icon: Gauge, label: "Load Profile", value: "Optimized" },
];

export default function About() {
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
              <span>/</span><span className="text-[var(--energy-green)]">About</span>
            </div>
            <h1 className="font-display font-bold text-4xl md:text-6xl leading-[0.95] tracking-tight reveal">
              <span className="text-gradient-light">THE INTELLIGENT</span>
              <br /><span className="text-gradient-green">ENERGY PARTNER</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base md:text-lg text-[var(--muted-foreground)] leading-relaxed reveal reveal-delay-1">
              SmartFix Innovative Services Limited is a multidisciplinary solutions company providing
              CNG conversion, power, solar, alternative energy and energy management solutions for
              vehicles, businesses, fleets and industries across Nigeria.
            </p>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="section-padding relative">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 glass-panel rounded-full px-4 py-1.5 mb-6">
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--energy-green)]" />
              <span className="text-xs font-medium tracking-[0.15em] text-[var(--muted-foreground)]">TRUST & CREDIBILITY</span>
            </div>
            <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tight">
              <span className="text-gradient-light">ENGINEERED FOR PERFORMANCE.</span>
              <br /><span className="text-gradient-green">BUILT FOR LONG-TERM VALUE.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {trustItems.map((item, i) => (
              <div key={item.title} className="glass-card p-5 reveal" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="w-10 h-10 rounded-lg bg-[rgba(0,217,127,0.08)] flex items-center justify-center mb-3">
                  <item.icon className="w-5 h-5 text-[var(--energy-green)]" />
                </div>
                <h3 className="font-display font-semibold text-sm text-[var(--electric)] mb-1">{item.title}</h3>
                <p className="text-xs text-[var(--muted-foreground)] leading-snug">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-center text-[var(--muted-foreground)] opacity-70">
            We do not display certifications, partnerships or client logos that cannot be verified. Contact us for current documentation.
          </p>
        </div>
      </section>

      {/* Control Center */}
      <section className="section-padding relative">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 glass-panel rounded-full px-4 py-1.5 mb-6">
              <Activity className="w-3.5 h-3.5 text-[var(--cng-blue)]" />
              <span className="text-xs font-medium tracking-[0.15em] text-[var(--muted-foreground)]">FUTURE-READY TECHNOLOGY</span>
            </div>
            <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tight">
              <span className="text-gradient-light">SMARTFIX ENERGY</span>
              <br /><span className="text-gradient-green">CONTROL CENTER</span>
            </h2>
            <p className="mt-6 max-w-2xl mx-auto text-base text-[var(--muted-foreground)] italic">
              "Your energy infrastructure should not operate blindly."
            </p>
          </div>

          {/* Dashboard visual */}
          <div className="glass-card p-6 md:p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {controlCenterItems.map((item, i) => (
                <div key={item.label} className="glass-panel rounded-xl p-4 reveal" style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className="flex items-center justify-between mb-2">
                    <item.icon className="w-5 h-5 text-[var(--cng-blue)]" />
                    <span className="w-2 h-2 rounded-full bg-[var(--energy-green)] pulse-ring" />
                  </div>
                  <p className="text-xs text-[var(--muted-foreground)]">{item.label}</p>
                  <p className="text-sm font-semibold text-[var(--electric)]">{item.value}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-center text-[var(--muted-foreground)] opacity-70">
              Conceptual visualization of SmartFix's long-term energy monitoring technology layer.
            </p>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="section-padding pt-4 relative">
        <div className="max-w-3xl mx-auto px-4 md:px-6 text-center">
          <h2 className="font-display font-bold text-2xl md:text-4xl mb-6">
            <span className="text-gradient-light">READY TO</span> <span className="text-gradient-green">START?</span>
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/request-quote" className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--energy-green)] text-[var(--obsidian)] font-semibold btn-magnetic glow-green">
              Get a Quote <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="tel:+2348139784331" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl glass-card text-[var(--electric)] font-medium">
              <Phone className="w-4 h-4 text-[var(--energy-green)]" /> 0813 978 4331
            </a>
            <a href="mailto:info@smartfixinnovative.com" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl glass-card text-[var(--electric)] font-medium">
              <Mail className="w-4 h-4 text-[var(--cng-blue)]" /> Email
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
