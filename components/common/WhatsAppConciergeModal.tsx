import React, { useState } from "react";
import {
  MessageSquare,
  X,
  PhoneCall,
  Fuel,
  Flame,
  Zap,
  Wrench,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Send,
  Sparkles,
} from "lucide-react";
import { SMARTFIX_CONTACT } from "@/lib/contact";
import { pricingStore, PRICE_CODES } from "@/lib/pricingStore";

interface WhatsAppConciergeModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTopic?: string;
}

const TEMPLATES = [
  {
    id: "DIESEL_ORDER",
    icon: Fuel,
    title: "Order Bulk AGO Diesel Supply",
    desc: "Direct metered delivery to storage tanks or generator bays",
    color: "#ff9f0a",
  },
  {
    id: "CNG_SKID",
    icon: Flame,
    title: "Request 200-Bar CNG Virtual Pipeline",
    desc: "Mobile tube skid trailer for off-grid industrial power",
    color: "var(--cng-blue)",
  },
  {
    id: "GEN_CONVERSION",
    icon: Zap,
    title: "Dual-Fuel Generator Conversion",
    desc: "Convert 50kVA - 2,500kVA diesel generators to natural gas",
    color: "var(--energy-green)",
  },
  {
    id: "EMERGENCY_DISPATCH",
    icon: AlertTriangle,
    title: "24/7 Emergency Fuel / Repair Callout",
    desc: "Priority 2-hour technician or emergency refueling dispatch",
    color: "#ff3b30",
  },
];

export default function WhatsAppConciergeModal({
  isOpen,
  onClose,
  defaultTopic = "DIESEL_ORDER",
}: WhatsAppConciergeModalProps) {
  const [selectedTopic, setSelectedTopic] = useState<string>(defaultTopic);
  const [facilityName, setFacilityName] = useState("");
  const [location, setLocation] = useState("Lagos, Nigeria");
  const [details, setDetails] = useState("");

  const dieselPrice = pricingStore.getPriceValue(PRICE_CODES.AGO_DIESEL_PER_LITRE) || 1250;
  const cngPrice = pricingStore.getPriceValue(PRICE_CODES.CNG_PER_SCM) || 1150;

  if (!isOpen) return null;

  const handleLaunchWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    let text = "";

    if (selectedTopic === "DIESEL_ORDER") {
      text =
        `*SMARTFIX ENERGY — DIESEL (AGO) DISPATCH INQUIRY*%0A` +
        `*Facility / Company:* ${facilityName || "Commercial Client"}%0A` +
        `*Location:* ${location}%0A` +
        `*Official Quoted Rate:* ₦${dieselPrice.toLocaleString()}/Litre%0A` +
        `*Requested Requirement:* ${details || "10,000 Litres spot dispatch / recurring schedule"}%0A` +
        `*Urgency:* Priority Commercial Supply`;
    } else if (selectedTopic === "CNG_SKID") {
      text =
        `*SMARTFIX ENERGY — VIRTUAL PIPELINE CNG INQUIRY*%0A` +
        `*Facility:* ${facilityName || "Industrial Client"} (${location})%0A` +
        `*Official CNG Rate:* ₦${cngPrice.toLocaleString()}/SCM%0A` +
        `*Equipment:* ${details || "Industrial generator power setup (200-bar mobile skid delivery)"}%0A` +
        `*Scope:* Site cascade manifold assessment & gas contract`;
    } else if (selectedTopic === "GEN_CONVERSION") {
      text =
        `*SMARTFIX ENERGY — GENERATOR DUAL-FUEL AUDIT*%0A` +
        `*Facility:* ${facilityName || "Enterprise Site"}%0A` +
        `*Location:* ${location}%0A` +
        `*Generator Sizing / Details:* ${details || "500 kVA Perkins / Cummins dual-fuel gas conversion"}%0A` +
        `*Objective:* 60% diesel operating cost reduction`;
    } else {
      text =
        `*🚨 SMARTFIX ENERGY — 24/7 EMERGENCY DISPATCH*%0A` +
        `*Facility:* ${facilityName || "Urgent Site"} (${location})%0A` +
        `*Critical Issue:* ${details || "Immediate generator breakdown or dry tank emergency"}%0A` +
        `*Request:* Immediate technician / emergency tanker dispatch`;
    }

    const waUrl = `https://wa.me/2348139784331?text=${text}`;
    window.open(waUrl, "_blank");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg glass-card p-6 md:p-8 rounded-3xl border border-white/10 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#25D366]/20 text-[#25D366] flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-[var(--electric)]">
                SmartFix WhatsApp Direct Concierge
              </h3>
              <p className="text-xs text-[var(--muted-foreground)]">
                Official Business Hotline: <strong>0813 978 4331</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full glass-panel flex items-center justify-center text-[var(--muted-foreground)] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Template Selector Pills */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[var(--muted-foreground)]">
            Select Your Request Type
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {TEMPLATES.map((tmpl) => {
              const Icon = tmpl.icon;
              const isSelected = selectedTopic === tmpl.id;
              return (
                <button
                  type="button"
                  key={tmpl.id}
                  onClick={() => setSelectedTopic(tmpl.id)}
                  className={`p-3 rounded-2xl text-left border transition-all flex items-start gap-2.5 ${
                    isSelected
                      ? "bg-white/[0.08] border-[var(--energy-green)] shadow-md"
                      : "glass-panel border-white/5 hover:border-white/15 opacity-75"
                  }`}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: `${tmpl.color}20`, color: tmpl.color }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[var(--electric)] line-clamp-1">
                      {tmpl.title}
                    </div>
                    <div className="text-[10px] text-[var(--muted-foreground)] line-clamp-1">
                      {tmpl.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Details */}
        <form onSubmit={handleLaunchWhatsApp} className="space-y-3 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-[var(--muted-foreground)] block mb-1">
                Company / Facility Name
              </label>
              <input
                type="text"
                value={facilityName}
                onChange={(e) => setFacilityName(e.target.value)}
                placeholder="e.g. Titan Industries / LJ Records"
                className="w-full px-3 py-2 rounded-xl bg-[#141417] text-white border border-white/10 text-xs outline-none focus:border-[var(--energy-green)]"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[var(--muted-foreground)] block mb-1">
                Facility City / State
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Victoria Island, Lagos"
                className="w-full px-3 py-2 rounded-xl bg-[#141417] text-white border border-white/10 text-xs outline-none focus:border-[var(--energy-green)]"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[var(--muted-foreground)] block mb-1">
              Specific Requirements or Notes
            </label>
            <input
              type="text"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="e.g. 10,000L AGO Diesel delivery by 9:00 AM tomorrow"
              className="w-full px-3 py-2 rounded-xl bg-[#141417] text-white border border-white/10 text-xs outline-none focus:border-[var(--energy-green)]"
            />
          </div>

          {/* Rate Notice */}
          <div className="p-3 rounded-xl glass-panel border border-white/10 text-[11px] flex items-center justify-between">
            <span className="text-[var(--muted-foreground)]">Official Rate:</span>
            <span className="font-mono font-bold text-[var(--energy-green)]">
              {selectedTopic === "CNG_SKID" ? `₦${cngPrice.toLocaleString()} / SCM (CNG)` : `₦${dieselPrice.toLocaleString()} / L (AGO Diesel)`}
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-[#25D366] text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/20 mt-2"
          >
            <Send className="w-4 h-4" /> Launch Structured WhatsApp Chat (0813 978 4331)
          </button>
        </form>
      </div>
    </div>
  );
}
