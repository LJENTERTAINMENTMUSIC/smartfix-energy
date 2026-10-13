import React from "react";
import EnergySavingsCalculator from "@/components/calculator/EnergySavingsCalculator";
import { Link } from "react-router-dom";
import { ShieldCheck, ArrowRight, Zap, Flame, Truck, PhoneCall } from "lucide-react";
import { SMARTFIX_CONTACT } from "@/lib/contact";

export default function EnergyCalculatorPage() {
  return (
    <div className="min-h-screen pt-28 pb-20">
      {/* Breadcrumb / Top label */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-4">
        <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
          <Link to="/" className="hover:text-white">Home</Link>
          <span>/</span>
          <span className="text-[var(--electric)]">Energy Savings & Payback Calculator</span>
        </div>
      </div>

      {/* Main Calculator */}
      <EnergySavingsCalculator />

      {/* Additional Trust & Technical Sizing section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-16">
        <div className="glass-card p-8 md:p-12 rounded-3xl border border-white/10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[var(--energy-green)]/15 text-[var(--energy-green)] flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-[var(--electric)]">
              Certified Gas Train Integration
            </h3>
            <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed">
              Every SmartFix generator conversion utilizes dual-fuel ECU dynamic mapping with electronic air-gas Venturi mixers and fast-response shutoff solenoids, ensuring engine warranty protection.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[var(--cng-blue)]/15 text-[var(--cng-blue)] flex items-center justify-center">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-[var(--electric)]">
              Virtual Pipeline Reliability
            </h3>
            <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed">
              No physical pipeline? No problem. SmartFix 200-bar mobile skid trailers provide non-stop gas delivery to your facility with automated cascade manifold pressure regulation.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#ff9f0a]/15 text-[#ff9f0a] flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-[var(--electric)]">
              Guaranteed Diesel Backup
            </h3>
            <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed">
              Never get stranded. If natural gas supply is ever paused for maintenance, your generator instantaneously switches back to 100% diesel without a single second of power flicker.
            </p>
          </div>
        </div>

        {/* Direct Callout Banner */}
        <div className="mt-8 p-6 rounded-2xl glass-panel border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--energy-green)]/20 text-[var(--energy-green)] flex items-center justify-center shrink-0">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-[var(--electric)]">Need a customized engineering site visit?</div>
              <div className="text-xs text-[var(--muted-foreground)]">Our lead power engineer can inspect your generator bay within 24 hours.</div>
            </div>
          </div>
          <a
            href={SMARTFIX_CONTACT.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-[var(--energy-green)] text-[var(--obsidian)] text-xs font-bold whitespace-nowrap"
          >
            Speak to Lead Engineer →
          </a>
        </div>
      </div>
    </div>
  );
}
