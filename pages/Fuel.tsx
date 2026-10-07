import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Fuel,
  Flame,
  Truck,
  ShieldCheck,
  Clock,
  Gauge,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  PhoneCall,
  Calendar,
} from "lucide-react";
import { catalog } from "@/lib/catalog";
import { toast } from "sonner";
import { SMARTFIX_CONTACT } from "@/lib/contact";

const FUEL_SERVICES = [
  {
    title: "Bulk Diesel Supply & Delivery",
    desc: "Guaranteed high-density, low-sulfur automotive gas oil (AGO) delivered directly to your storage tanks or generator bays with certified meter accuracy.",
    icon: Truck,
    badge: "High Demand",
  },
  {
    title: "CNG Virtual Pipeline & Supply",
    desc: "Mobile tube trailers delivering compressed natural gas directly to industrial sites without physical pipeline access, operating at 200–250 bar.",
    icon: Flame,
    badge: "Up to 60% Savings",
  },
  {
    title: "Scheduled Fuel Replenishment",
    desc: "Automated recurring supply contracts. Never experience generator shutdown due to dry tanks. Monitored delivery schedules.",
    icon: Calendar,
    badge: "Contract Retainer",
  },
  {
    title: "Emergency / On-Demand Refueling",
    desc: "Priority 24/7 rapid fuel dispatch for hospitals, data centers, cold storage, and manufacturing plants during national grid collapses.",
    icon: Clock,
    badge: "24/7 Priority",
  },
  {
    title: "Fleet Fuel & Telematics Management",
    desc: "Dedicated fuel distribution and RFID dispensing systems for transport fleets, preventing fuel pilferage and monitoring consumption per km.",
    icon: Gauge,
    badge: "Zero Pilferage",
  },
  {
    title: "Combined CNG + Diesel Hybrid Plan",
    desc: "Convert your primary generators to CNG for 60% savings while maintaining guaranteed automated diesel supply for backup redundancy.",
    icon: Sparkles,
    badge: "Recommended",
  },
];

export default function FuelPage() {
  const [fuelType, setFuelType] = useState("Combined CNG + Diesel Hybrid Plan");
  const [volume, setVolume] = useState("5,000 - 15,000 Litres / Month");
  const [frequency, setFrequency] = useState("Bi-Weekly Scheduled");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("Lagos, Nigeria");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      toast.error("Please enter your name and phone number");
      return;
    }

    try {
      await catalog.addLead({
        name,
        email: `${phone.replace(/\s+/g, "")}@smartfixenergy.com`,
        phone,
        company: company || "Direct Facility Client",
        service: `SMARTFIX FUEL: ${fuelType} (${volume})`,
        location,
        budget: "Bulk Fuel Supply Contract",
        value: 12000000,
        status: "Hot",
      });
      toast.success("Fuel supply opportunity created! An energy procurement specialist will call you.");
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative min-h-screen py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Hero Banner */}
        <div className="text-center max-w-4xl mx-auto mb-14 md:mb-20">
          <div className="inline-flex items-center gap-2 glass-panel rounded-full px-4 py-1.5 mb-6">
            <Fuel className="w-4 h-4 text-[#ff9f0a]" />
            <span className="text-xs font-semibold tracking-[0.2em] text-[var(--muted-foreground)] uppercase">
              SMARTFIX FUEL DIVISION
            </span>
          </div>
          <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-7xl tracking-tight text-[var(--electric)] leading-[1.05]">
            CNG + DIESEL <span className="text-gradient-green">+ ENERGY SUPPLY.</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-[var(--muted-foreground)] leading-relaxed max-w-2xl mx-auto">
            Reliable fuel procurement, certified bulk diesel distribution, virtual CNG pipeline transport, and automated generator replenishment for Nigerian enterprises.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#fuel-form"
              className="btn-magnetic px-8 py-4 rounded-xl bg-[#ff9f0a] text-[var(--obsidian)] font-bold text-sm sm:text-base shadow-xl hover:opacity-95"
            >
              Request Fuel Procurement Quote
            </a>
            <a
              href={SMARTFIX_CONTACT.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-xl glass-panel text-sm font-semibold text-[var(--electric)] hover:text-[var(--energy-green)]"
            >
              <PhoneCall className="w-4 h-4 text-[var(--energy-green)]" />
              Direct Fuel Desk: 0813 978 4331
            </a>
          </div>
        </div>

        {/* Core Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 md:mb-24">
          {FUEL_SERVICES.map((srv) => {
            const Icon = srv.icon;
            return (
              <div
                key={srv.title}
                className="group rounded-3xl glass-card border border-white/10 p-7 flex flex-col justify-between hover:border-white/20 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#ff9f0a]/15 text-[#ff9f0a] flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[var(--electric)]">
                      {srv.badge}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-xl text-[var(--electric)] mb-2">
                    {srv.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed">
                    {srv.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Commercial Synergy Callout: CNG + DIESEL HYBRID PLAN */}
        <div className="rounded-3xl glass-card border border-white/10 p-8 md:p-12 mb-16 md:mb-24 bg-gradient-to-r from-black/80 via-[var(--energy-green)]/[0.04] to-[#ff9f0a]/[0.05] relative overflow-hidden">
          <div className="max-w-3xl">
            <span className="text-xs font-mono font-bold tracking-widest text-[var(--energy-green)] uppercase">
              THE COMMERCIAL ADVANTAGE
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-4xl text-[var(--electric)] mt-2 mb-4">
              Why Choose Between CNG and Diesel When You Can Have Both?
            </h2>
            <p className="text-sm sm:text-base text-[var(--muted-foreground)] leading-relaxed mb-6">
              When SmartFix converts your industrial generators to dual-fuel CNG, you slash fuel expenses by up to 60%. But rather than leaving you stranded for backup diesel, SmartFix handles the entire fuel equation: regular scheduled diesel replenishment for backup tanks, with automated CNG supply as your primary fuel.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl glass-panel border border-white/5">
                <span className="text-xl font-bold font-display text-[var(--energy-green)]">60% Drop</span>
                <p className="text-xs text-[var(--muted-foreground)] mt-1">In baseline fuel operating costs</p>
              </div>
              <div className="p-4 rounded-2xl glass-panel border border-white/5">
                <span className="text-xl font-bold font-display text-[var(--cng-blue)]">Zero Downtime</span>
                <p className="text-xs text-[var(--muted-foreground)] mt-1">Instant automatic fallback to diesel</p>
              </div>
              <div className="p-4 rounded-2xl glass-panel border border-white/5">
                <span className="text-xl font-bold font-display text-[#ff9f0a]">1 Vendor</span>
                <p className="text-xs text-[var(--muted-foreground)] mt-1">One invoice, one SLA, zero headache</p>
              </div>
            </div>
          </div>
        </div>

        {/* Intake Form */}
        <div id="fuel-form" className="max-w-2xl mx-auto rounded-3xl glass-card border border-white/10 p-6 sm:p-10">
          <div className="text-center mb-8">
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-[var(--electric)]">
              Schedule Fuel Supply or Contract
            </h2>
            <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-1">
              Submit your volume requirements. Our logistics coordinator will reach out within 2 hours.
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 rounded-full bg-[var(--energy-green)] text-[var(--obsidian)] flex items-center justify-center mx-auto mb-4 glow-green">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-display font-bold text-2xl text-[var(--electric)]">
                Fuel Request Received
              </h3>
              <p className="text-xs sm:text-sm text-[var(--muted-foreground)] max-w-md mx-auto mt-2">
                Thank you, {name}. A SmartFix Fuel Logistics specialist is reviewing your requirement for {fuelType} ({volume}) in {location}.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-6 text-xs text-[var(--energy-green)] hover:underline"
              >
                Submit another fuel enquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1.5">
                  Fuel Requirement Type
                </label>
                <select
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value)}
                  className="w-full px-3 py-3 rounded-xl bg-[#141417] text-[#f5f5f7] border border-white/10 text-xs sm:text-sm [color-scheme:dark] outline-none focus:border-[var(--energy-green)]"
                >
                  <option value="Combined CNG + Diesel Hybrid Plan">Combined CNG + Diesel Hybrid Plan</option>
                  <option value="Bulk Diesel Supply (AGO)">Bulk Diesel Supply (AGO)</option>
                  <option value="CNG Virtual Pipeline Supply">CNG Virtual Pipeline Supply</option>
                  <option value="Scheduled Generator Refueling">Scheduled Generator Refueling</option>
                  <option value="Emergency Fuel Delivery">Emergency Fuel Delivery (24/7)</option>
                  <option value="Fleet Fuel Procurement Contract">Fleet Fuel Procurement Contract</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1.5">
                    Estimated Monthly Volume
                  </label>
                  <select
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    className="w-full px-3 py-3 rounded-xl bg-[#141417] text-[#f5f5f7] border border-white/10 text-xs sm:text-sm [color-scheme:dark] outline-none focus:border-[var(--energy-green)]"
                  >
                    <option value="Under 5,000 Litres / Month">Under 5,000 Litres / Month</option>
                    <option value="5,000 - 15,000 Litres / Month">5,000 - 15,000 Litres / Month</option>
                    <option value="15,000 - 50,000 Litres / Month">15,000 - 50,000 Litres / Month</option>
                    <option value="50,000+ Litres / Month">50,000+ Litres / Month (Industrial)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1.5">
                    Delivery Frequency
                  </label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-full px-3 py-3 rounded-xl bg-[#141417] text-[#f5f5f7] border border-white/10 text-xs sm:text-sm [color-scheme:dark] outline-none focus:border-[var(--energy-green)]"
                  >
                    <option value="Weekly Replenishment">Weekly Replenishment</option>
                    <option value="Bi-Weekly Scheduled">Bi-Weekly Scheduled</option>
                    <option value="Monthly Delivery">Monthly Delivery</option>
                    <option value="On-Demand / As Needed">On-Demand / As Needed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1.5">
                    Full Name *
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                    className="w-full px-3 py-3 rounded-xl bg-[#141417] text-[#f5f5f7] border border-white/10 text-xs sm:text-sm outline-none focus:border-[var(--energy-green)]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1.5">
                    Company / Facility Name
                  </label>
                  <input
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Radisson Blu / ABC Factory"
                    className="w-full px-3 py-3 rounded-xl bg-[#141417] text-[#f5f5f7] border border-white/10 text-xs sm:text-sm outline-none focus:border-[var(--energy-green)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1.5">
                    Phone / WhatsApp *
                  </label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0803 000 0000"
                    required
                    className="w-full px-3 py-3 rounded-xl bg-[#141417] text-[#f5f5f7] border border-white/10 text-xs sm:text-sm outline-none focus:border-[var(--energy-green)]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1.5">
                    Delivery Location / State
                  </label>
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Ikeja, Lagos"
                    className="w-full px-3 py-3 rounded-xl bg-[#141417] text-[#f5f5f7] border border-white/10 text-xs sm:text-sm outline-none focus:border-[var(--energy-green)]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-6 w-full py-4 rounded-xl bg-[#ff9f0a] text-[var(--obsidian)] font-bold text-sm sm:text-base btn-magnetic shadow-xl hover:opacity-95 cursor-pointer"
              >
                Submit Fuel Procurement Request →
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
