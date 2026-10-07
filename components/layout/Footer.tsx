import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, ArrowUpRight, MessageCircle } from "lucide-react";
import Logo from "@/components/layout/Logo";
import { SMARTFIX_CONTACT } from "@/lib/contact";

const footerSections = [
  {
    title: "Solutions",
    links: [
      { label: "CNG Conversion", path: "/cng" },
      { label: "SmartFix Fuel (Diesel & CNG)", path: "/fuel" },
      { label: "Generators", path: "/generators" },
      { label: "Solar & Battery", path: "/solar" },
      { label: "Hybrid Energy", path: "/hybrid-energy" },
      { label: "Energy Audit", path: "/energy-audit" },
      { label: "Maintenance", path: "/maintenance" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", path: "/about" },
      { label: "Industries", path: "/industries" },
      { label: "Case Studies", path: "/case-studies" },
      { label: "Contact", path: "/contact" },
    ],
  },
  {
    title: "Support & Tracking",
    links: [
      { label: "Track My Project", path: "/track" },
      { label: "Request Service", path: "/request-quote" },
      { label: "Request Quote", path: "/request-quote" },
      { label: "WhatsApp", path: SMARTFIX_CONTACT.whatsapp, external: true },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-[var(--border)] bg-[rgba(8,9,10,0.8)] backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <Logo size={36} />
            </div>
            <p className="text-sm text-[var(--muted-foreground)] mb-4 max-w-xs leading-relaxed">
              SmartFix Innovative Services Limited — CNG, Power, Solar, Alternative Energy.
              Innovative solutions. Endless possibilities.
            </p>
            <div className="flex flex-col gap-2 text-sm text-[var(--muted-foreground)]">
              <a href={`tel:${SMARTFIX_CONTACT.phone1Intl}`} className="flex items-center gap-2 hover:text-[var(--energy-green)] transition-colors">
                <Phone className="w-4 h-4" /> {SMARTFIX_CONTACT.phone1}
              </a>
              <a href={`tel:${SMARTFIX_CONTACT.phone2Intl}`} className="flex items-center gap-2 hover:text-[var(--energy-green)] transition-colors">
                <Phone className="w-4 h-4 opacity-0 md:opacity-100" /> {SMARTFIX_CONTACT.phone2}
              </a>
              <a href={`mailto:${SMARTFIX_CONTACT.emailGeneral}`} className="flex items-center gap-2 hover:text-[var(--energy-green)] transition-colors">
                <Mail className="w-4 h-4" /> {SMARTFIX_CONTACT.emailGeneral}
              </a>
              <a
                href={SMARTFIX_CONTACT.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-[var(--energy-green)] transition-colors"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp: {SMARTFIX_CONTACT.phone1}
              </a>
              <span className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" /> 9 Lawani Oduloye Street, Victoria Island / Oniru, Lagos
              </span>
            </div>
          </div>

          {/* Link columns */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-semibold text-[var(--electric)] mb-3">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[var(--muted-foreground)] hover:text-[var(--energy-green)] transition-colors flex items-center gap-1 group"
                      >
                        {link.label}
                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    ) : (
                      <Link
                        to={link.path}
                        className="text-sm text-[var(--muted-foreground)] hover:text-[var(--energy-green)] transition-colors flex items-center gap-1 group"
                      >
                        {link.label}
                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-[var(--border)] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--muted-foreground)]">
            (c) {new Date().getFullYear()} SmartFix Innovative Services Limited. All rights reserved.
          </p>
          <p className="text-xs font-display font-medium tracking-[0.15em] text-[var(--muted-foreground)]">
            INNOVATIVE SOLUTIONS. ENDLESS POSSIBILITIES.
          </p>
        </div>
      </div>
    </footer>
  );
}
