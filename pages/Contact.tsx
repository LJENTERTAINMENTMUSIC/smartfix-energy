import { Link } from "react-router-dom";
import {
  MapPin, Phone, Mail, Globe, MessageCircle, ArrowRight,
  Zap, Wrench, Package, HardHat, Cpu, Clock,
} from "lucide-react";
import QuoteForm from "@/components/quote/QuoteForm";
import { SMARTFIX_CONTACT } from "@/lib/contact";

/* ------------------------------------------------------------------ */

const projectCategories = [
  {
    icon: Zap,
    title: "CNG & Alternative Energy",
    items: "Vehicle conversion • Fleet conversion • CNG generators • Solar • Battery • Hybrid energy",
    accent: "var(--energy-green)",
  },
  {
    icon: Wrench,
    title: "Engineering & Power",
    items: "Generators • Electrical • Mechanical • MEP • Installation • Maintenance",
    accent: "var(--cng-blue)",
  },
  {
    icon: Package,
    title: "Procurement & Equipment",
    items: "Equipment sourcing • Industrial machinery • Spare parts • Local & international procurement",
    accent: "var(--energy-green)",
  },
  {
    icon: HardHat,
    title: "Construction & Property",
    items: "Construction • Renovation • Real estate • Facility management • Property maintenance",
    accent: "var(--cng-blue)",
  },
  {
    icon: Cpu,
    title: "Technology & Digital",
    items: "Software • Websites • AI • Automation • IT infrastructure • Digital transformation",
    accent: "var(--energy-green)",
  },
];

/* ------------------------------------------------------------------ */

export default function Contact() {
  const c = SMARTFIX_CONTACT;

  return (
    <div className="relative min-h-screen pt-4 pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* ---------- Hero ---------- */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 glass-panel rounded-full px-3.5 py-1.5 mb-5">
            <MessageCircle className="w-3.5 h-3.5 text-[var(--energy-green)]" />
            <span className="text-xs font-medium tracking-[0.15em] text-[var(--muted-foreground)]">CONTACT · TALK TO US</span>
          </div>
          <h1 className="font-display font-bold text-3xl md:text-5xl tracking-tight mb-4">
            <span className="text-gradient-light">One company.</span>{" "}
            <span className="text-gradient-green">Multiple solutions.</span>
          </h1>
          <p className="text-sm md:text-base text-[var(--muted-foreground)] leading-relaxed">
            Whether you need CNG conversion, alternative energy, generators, solar systems,
            engineering, procurement, construction, facility management, technology solutions or
            general contracting — our team is ready to assist.
          </p>
        </div>

        {/* ---------- Contact info cards ---------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          <div className="glass-card p-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: "color-mix(in srgb, var(--energy-green) 14%, transparent)" }}>
              <MapPin className="w-5 h-5 text-[var(--energy-green)]" />
            </div>
            <h3 className="font-display font-semibold text-[var(--electric)] mb-1.5">Lagos Office</h3>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{c.address}</p>
          </div>

          <div className="glass-card p-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: "color-mix(in srgb, var(--cng-blue) 14%, transparent)" }}>
              <Phone className="w-5 h-5 text-[var(--cng-blue)]" />
            </div>
            <h3 className="font-display font-semibold text-[var(--electric)] mb-1.5">Phone</h3>
            <div className="flex flex-col gap-1">
              <a href={`tel:${c.phone1Intl}`} className="text-sm text-[var(--muted-foreground)] hover:text-[var(--energy-green)] transition-colors">{c.phone1}</a>
              <a href={`tel:${c.phone2Intl}`} className="text-sm text-[var(--muted-foreground)] hover:text-[var(--energy-green)] transition-colors">{c.phone2}</a>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: "color-mix(in srgb, var(--energy-green) 14%, transparent)" }}>
              <MessageCircle className="w-5 h-5 text-[var(--energy-green)]" />
            </div>
            <h3 className="font-display font-semibold text-[var(--electric)] mb-1.5">WhatsApp</h3>
            <a
              href={c.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--energy-green)] transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-[var(--energy-green)] animate-pulse" /> Chat with us — {c.phone1}
            </a>
          </div>

          <div className="glass-card p-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: "color-mix(in srgb, var(--cng-blue) 14%, transparent)" }}>
              <Mail className="w-5 h-5 text-[var(--cng-blue)]" />
            </div>
            <h3 className="font-display font-semibold text-[var(--electric)] mb-1.5">General Enquiries</h3>
            <a href={`mailto:${c.emailGeneral}`} className="text-sm text-[var(--muted-foreground)] hover:text-[var(--energy-green)] transition-colors break-all">
              {c.emailGeneral}
            </a>
          </div>

          <div className="glass-card p-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: "color-mix(in srgb, var(--energy-green) 14%, transparent)" }}>
              <Mail className="w-5 h-5 text-[var(--energy-green)]" />
            </div>
            <h3 className="font-display font-semibold text-[var(--electric)] mb-1.5">Finance &amp; Accounts</h3>
            <a href={`mailto:${c.emailFinance}`} className="text-sm text-[var(--muted-foreground)] hover:text-[var(--energy-green)] transition-colors break-all">
              {c.emailFinance}
            </a>
          </div>

          <div className="glass-card p-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: "color-mix(in srgb, var(--cng-blue) 14%, transparent)" }}>
              <Globe className="w-5 h-5 text-[var(--cng-blue)]" />
            </div>
            <h3 className="font-display font-semibold text-[var(--electric)] mb-1.5">Website</h3>
            <a href={`https://${c.website}`} target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--energy-green)] transition-colors">
              {c.website}
            </a>
          </div>
        </div>

        {/* ---------- Start your project ---------- */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="font-display font-bold text-2xl md:text-3xl mb-3">
            <span className="text-gradient-light">Start your project</span>
          </h2>
          <p className="text-sm text-[var(--muted-foreground)]">
            Tell us what you need. We'll help you find the right solution.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-16">
          {projectCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div key={cat.title} className="glass-card p-5 flex flex-col">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: `color-mix(in srgb, ${cat.accent} 14%, transparent)` }}>
                  <Icon className="w-4.5 h-4.5" style={{ color: cat.accent }} />
                </div>
                <h3 className="font-display font-semibold text-sm text-[var(--electric)] mb-2">{cat.title}</h3>
                <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">{cat.items}</p>
              </div>
            );
          })}
        </div>

        {/* ---------- Quick CTAs ---------- */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          <Link
            to="/request-quote"
            className="press-scale inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold bg-[var(--energy-green)] text-[var(--obsidian)] glow-green"
          >
            GET A QUOTE <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/request-quote"
            className="press-scale inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold glass-panel border border-[var(--border)] text-[var(--electric)] hover:border-[var(--energy-green)] transition-colors"
          >
            <Clock className="w-4 h-4" /> BOOK AN ASSESSMENT
          </Link>
          <a
            href={c.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="press-scale inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold glass-panel border border-[var(--border)] text-[var(--electric)] hover:border-[var(--energy-green)] transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-[var(--energy-green)]" /> WHATSAPP SMARTFIX
          </a>
        </div>

        {/* ---------- Contact form ---------- */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-display font-bold text-2xl md:text-3xl mb-3">
              <span className="text-gradient-light">Contact form</span>
            </h2>
            <p className="text-sm text-[var(--muted-foreground)]">
              Tell us about your requirement. Our team will review your request and contact you
              regarding the next step.
            </p>
          </div>
          <QuoteForm />
        </div>
      </div>
    </div>
  );
}
