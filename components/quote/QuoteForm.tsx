import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, ArrowRight, Upload, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { catalog } from "@/lib/catalog";

const serviceOptions = [
  "CNG Vehicle Conversion",
  "Fleet Conversion",
  "CNG Generator",
  "Generator",
  "Solar System",
  "Battery Storage",
  "Hybrid Energy",
  "Energy Audit",
  "Maintenance",
  "Equipment",
  "Industrial Project",
  "Other",
];

const budgetRanges = [
  "Under ₦500,000",
  "₦500,000 - ₦2,000,000",
  "₦2,000,000 - ₦10,000,000",
  "₦10,000,000 - ₦50,000,000",
  "₦50,000,000+",
  "Not sure yet",
];

const timelines = ["Immediate (1-2 weeks)", "1-3 months", "3-6 months", "6+ months", "Exploring options"];
const nigerianStates = ["Lagos", "Ogun", "Oyo", "FCT (Abuja)", "Rivers", "Kano", "Kaduna", "Enugu", "Anambra", "Delta", "Edo", "Cross River", "Other"];

export default function QuoteForm() {
  const [selected, setSelected] = useState<string[]>([]);
  const [details, setDetails] = useState("");
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const toggle = (service: string) => {
    setSelected((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    );
  };

  const handleSubmit = async () => {
    if (selected.length === 0) {
      toast.error("Please select at least one service requirement above");
      return;
    }
    if (!name.trim() || !phone.trim()) {
      toast.error("Please enter your name and phone number");
      return;
    }
    try {
      await catalog.addLead({
        name,
        email: email || `${phone.replace(/\s+/g, "")}@smartfixenergy.com`,
        phone,
        company: company || "Direct Customer",
        service: selected.join(", "),
        location: `${city || state || "Lagos"}, ${state || "Nigeria"}`,
        budget: budget || "Custom Quote",
        value: 1500000,
        status: "Hot",
      });
      toast.success("Quote request submitted successfully!");
    } catch (err) {
      console.error("Failed to add lead:", err);
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="glass-card p-8 md:p-12 text-center reveal">
        <div className="w-16 h-16 rounded-full bg-[var(--energy-green)] flex items-center justify-center mx-auto mb-6 glow-green">
          <Check className="w-8 h-8 text-[var(--obsidian)]" />
        </div>
        <h2 className="font-display font-bold text-2xl md:text-3xl text-[var(--electric)] mb-3">
          Request Received
        </h2>
        <p className="text-sm text-[var(--muted-foreground)] max-w-md mx-auto leading-relaxed mb-6">
          Thank you, {name}. Your request for {selected.join(", ")} has been submitted. A SmartFix
 energy specialist will contact you within 24 hours.
        </p>
        <div className="glass-panel rounded-xl p-4 text-left max-w-md mx-auto mb-6">
          <p className="text-xs text-[var(--muted-foreground)] mb-2">Your request:</p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {selected.map((s) => (
              <span key={s} className="text-xs glass-panel px-2.5 py-1 rounded-full text-[var(--energy-green)]">
                {s}
              </span>
            ))}
          </div>
          {budget && <p className="text-xs text-[var(--muted-foreground)]">Budget: <span className="text-[var(--electric)]">{budget}</span></p>}
          {timeline && <p className="text-xs text-[var(--muted-foreground)]">Timeline: <span className="text-[var(--electric)]">{timeline}</span></p>}
        </div>
        <button
          onClick={() => { setSubmitted(false); setSelected([]); }}
          className="text-sm text-[var(--energy-green)] hover:underline"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 md:p-8">
      {/* Service selection */}
      <div>
        <h3 className="font-display font-semibold text-lg text-[var(--electric)] mb-4">
          What do you need?
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {serviceOptions.map((service) => (
            <button
              key={service}
              onClick={() => toggle(service)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm border text-left transition-all ${
                selected.includes(service)
                  ? "bg-[var(--energy-green)] text-[var(--obsidian)] border-[var(--energy-green)]"
                  : "glass-panel text-[var(--muted-foreground)] border-[var(--border)] hover:text-[var(--electric)]"
              }`}
            >
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                selected.includes(service) ? "border-[var(--obsidian)]" : "border-[var(--border)]"
              }`}>
                {selected.includes(service) && <Check className="w-3 h-3" />}
              </div>
              {service}
            </button>
          ))}
        </div>
      </div>

      {/* Details */}
      <div className="mt-6">
        <label className="text-xs text-[var(--muted-foreground)] mb-1.5 block">Tell us about your requirement</label>
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows={3}
          placeholder="Describe your energy needs, current setup, challenges..."
          className="w-full px-3 py-2.5 rounded-lg bg-[var(--muted)] border border-[var(--border)] text-sm text-[var(--electric)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--energy-green)] outline-none resize-none"
        />
      </div>

      {/* Budget, Timeline, Location */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="text-xs text-[var(--muted-foreground)] mb-1.5 block">Budget range</label>
          <select
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg bg-[var(--muted)] border border-[var(--border)] text-sm text-[var(--electric)] focus:border-[var(--energy-green)] outline-none"
          >
            <option value="">Select budget</option>
            {budgetRanges.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-[var(--muted-foreground)] mb-1.5 block">Timeline</label>
          <select
            value={timeline}
            onChange={(e) => setTimeline(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg bg-[var(--muted)] border border-[var(--border)] text-sm text-[var(--electric)] focus:border-[var(--energy-green)] outline-none"
          >
            <option value="">Select timeline</option>
            {timelines.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-[var(--muted-foreground)] mb-1.5 block">State</label>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg bg-[var(--muted)] border border-[var(--border)] text-sm text-[var(--electric)] focus:border-[var(--energy-green)] outline-none"
          >
            <option value="">Select state</option>
            {nigerianStates.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div className="mt-3">
        <label className="text-xs text-[var(--muted-foreground)] mb-1.5 block">City</label>
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="e.g. Ikeja"
          className="w-full px-3 py-2.5 rounded-lg bg-[var(--muted)] border border-[var(--border)] text-sm text-[var(--electric)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--energy-green)] outline-none"
        />
      </div>

      {/* Upload placeholder */}
      <div className="mt-4">
        <label className="text-xs text-[var(--muted-foreground)] mb-1.5 block">Upload documents/photos (optional)</label>
        <div className="border-2 border-dashed border-[var(--border)] rounded-lg p-6 text-center hover:border-[var(--energy-green)] transition-colors cursor-pointer">
          <Upload className="w-6 h-6 text-[var(--muted-foreground)] mx-auto mb-2" />
          <p className="text-xs text-[var(--muted-foreground)]">Click to upload or drag and drop</p>
          <p className="text-xs text-[var(--muted-foreground)] mt-1 opacity-60">PDF, JPG, PNG up to 10MB</p>
        </div>
      </div>

      {/* Contact */}
      <div className="mt-6 pt-6 border-t border-[var(--border)]">
        <h3 className="font-display font-semibold text-base text-[var(--electric)] mb-4">Contact Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-[var(--muted-foreground)] mb-1.5 block">Full Name *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full px-3 py-2.5 rounded-lg bg-[var(--muted)] border border-[var(--border)] text-sm text-[var(--electric)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--energy-green)] outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-[var(--muted-foreground)] mb-1.5 block">Company</label>
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Company name"
              className="w-full px-3 py-2.5 rounded-lg bg-[var(--muted)] border border-[var(--border)] text-sm text-[var(--electric)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--energy-green)] outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-[var(--muted-foreground)] mb-1.5 block">Phone *</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 0803 000 0000"
              className="w-full px-3 py-2.5 rounded-lg bg-[var(--muted)] border border-[var(--border)] text-sm text-[var(--electric)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--energy-green)] outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-[var(--muted-foreground)] mb-1.5 block">WhatsApp</label>
            <input
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="WhatsApp number"
              className="w-full px-3 py-2.5 rounded-lg bg-[var(--muted)] border border-[var(--border)] text-sm text-[var(--electric)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--energy-green)] outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-[var(--muted-foreground)] mb-1.5 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="w-full px-3 py-2.5 rounded-lg bg-[var(--muted)] border border-[var(--border)] text-sm text-[var(--electric)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--energy-green)] outline-none"
            />
          </div>
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[var(--energy-green)] text-[var(--obsidian)] font-bold btn-magnetic glow-green cursor-pointer shadow-lg hover:opacity-95"
      >
        Submit Request
        <ArrowRight className="w-5 h-5" />
      </button>
      {(!selected.length || !name.trim() || !phone.trim()) && (
        <p className="mt-2 text-xs text-center text-[var(--muted-foreground)]">
          Select at least one service and provide your name and phone number.
        </p>
      )}
    </div>
  );
}
