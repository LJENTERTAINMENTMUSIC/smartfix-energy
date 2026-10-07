import { useState } from "react";
import { Check, ChevronRight, ChevronLeft, Car, User, Fuel, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { catalog } from "@/lib/catalog";

const vehicleBrands = ["Toyota", "Honda", "Hyundai", "Kia", "Mercedes", "Lexus", "Nissan", "Peugeot", "Ford", "Other"];
const usageTypes = ["Personal", "Ride-hailing", "Commercial transport", "Logistics", "Corporate fleet", "Government", "Other"];
const nigerianStates = ["Lagos", "Ogun", "Oyo", "FCT (Abuja)", "Rivers", "Kano", "Kaduna", "Enugu", "Anambra", "Delta", "Edo", "Cross River", "Other"];

const stepIcons = [Car, User, Fuel, MapPin, Phone];

interface FormData {
  brand: string;
  model: string;
  year: string;
  engine: string;
  usage: string;
  fuelSpend: string;
  state: string;
  city: string;
  name: string;
  phone: string;
  email: string;
  whatsapp: string;
}

const initialData: FormData = {
  brand: "", model: "", year: "", engine: "",
  usage: "", fuelSpend: "", state: "", city: "",
  name: "", phone: "", email: "", whatsapp: "",
};

export default function ConversionWizard() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(initialData);
  const [submitted, setSubmitted] = useState(false);

  const update = (key: keyof FormData, value: string) => setData((p) => ({ ...p, [key]: value }));

  const handleNext = () => {
    if (step === 0) {
      if (!data.brand) {
        toast.error("Please choose your vehicle brand (e.g. Toyota, Honda)");
        return;
      }
      if (!data.model) update("model", "Sedan / SUV");
      if (!data.year) update("year", "2020");
    } else if (step === 1) {
      if (!data.usage) {
        toast.error("Please choose how you use this vehicle");
        return;
      }
    } else if (step === 2) {
      if (!data.fuelSpend) {
        toast.error("Please select your estimated monthly fuel spend");
        return;
      }
    } else if (step === 3) {
      if (!data.state) {
        toast.error("Please select your state");
        return;
      }
      if (!data.city) update("city", data.state);
    }
    setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    if (!data.name.trim() || !data.phone.trim()) {
      toast.error("Please provide your name and phone number");
      return;
    }
    try {
      await catalog.addLead({
        name: data.name,
        email: data.email || `${data.phone.replace(/\s+/g, "")}@cng.smartfixenergy.com`,
        phone: data.phone,
        company: data.brand ? `${data.brand} ${data.model || ""} (${data.year || ""})` : "Vehicle Owner",
        service: "CNG Vehicle Conversion",
        location: `${data.city || data.state}, ${data.state || "Nigeria"}`,
        budget: data.fuelSpend ? `₦${data.fuelSpend}/month fuel spend` : "Standard",
        value: 1250000,
        status: "Hot",
      });
      toast.success("Assessment request received! A specialist will contact you.");
    } catch (err) {
      console.error("Failed to save lead:", err);
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section id="wizard" className="section-padding relative">
        <div className="max-w-2xl mx-auto px-4 md:px-6">
          <div className="glass-card p-8 md:p-12 text-center reveal">
            <div className="w-16 h-16 rounded-full bg-[var(--energy-green)] flex items-center justify-center mx-auto mb-6 glow-green">
              <Check className="w-8 h-8 text-[var(--obsidian)]" />
            </div>
            <h3 className="font-display font-bold text-2xl md:text-3xl text-[var(--electric)] mb-3">
              Let's Design Your Conversion
            </h3>
            <p className="text-sm text-[var(--muted-foreground)] max-w-md mx-auto leading-relaxed mb-2">
              Your CNG assessment request has been received. A SmartFix energy specialist will contact
              you within 24 hours to schedule your vehicle assessment.
            </p>
            <div className="mt-6 glass-panel rounded-xl p-4 text-left max-w-md mx-auto">
              <p className="text-xs text-[var(--muted-foreground)] mb-2">Summary:</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-[var(--muted-foreground)]">Vehicle:</span>
                <span className="text-[var(--electric)]">{data.brand} {data.model}</span>
                <span className="text-[var(--muted-foreground)]">Year:</span>
                <span className="text-[var(--electric)]">{data.year}</span>
                <span className="text-[var(--muted-foreground)]">Usage:</span>
                <span className="text-[var(--electric)]">{data.usage}</span>
                <span className="text-[var(--muted-foreground)]">Monthly fuel:</span>
                <span className="text-[var(--energy-green)]">₦{data.fuelSpend}</span>
                <span className="text-[var(--muted-foreground)]">Location:</span>
                <span className="text-[var(--electric)]">{data.city}, {data.state}</span>
              </div>
            </div>
            <button
              onClick={() => { setSubmitted(false); setStep(0); setData(initialData); }}
              className="mt-6 text-sm text-[var(--energy-green)] hover:underline"
            >
              Submit another request
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="wizard" className="section-padding relative">
      <div className="max-w-2xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 glass-panel rounded-full px-4 py-1.5 mb-4">
            <span className="text-xs font-medium tracking-[0.15em] text-[var(--energy-green)]">
              CNG CONVERSION WIZARD
            </span>
          </div>
          <h2 className="font-display font-bold text-2xl md:text-4xl tracking-tight">
            <span className="text-gradient-light">CHECK YOUR</span>{" "}
            <span className="text-gradient-green">VEHICLE</span>
          </h2>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-between mb-8 max-w-md mx-auto">
          {stepIcons.map((Icon, i) => (
            <div key={i} className="flex items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${
                  i <= step
                    ? "bg-[var(--energy-green)] border-[var(--energy-green)] text-[var(--obsidian)]"
                    : "border-[var(--border)] text-[var(--muted-foreground)]"
                }`}
              >
                {i < step ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              </div>
              {i < stepIcons.length - 1 && (
                <div className={`w-8 md:w-12 h-px ${i < step ? "bg-[var(--energy-green)]" : "bg-[var(--border)]"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Wizard card */}
        <div className="glass-card p-6 md:p-8">
          {/* Step 0: Vehicle */}
          {step === 0 && (
            <div className="reveal">
              <h3 className="font-display font-semibold text-lg text-[var(--electric)] mb-4">
                What vehicle do you want to convert?
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-5">
                {vehicleBrands.map((brand) => (
                  <button
                    key={brand}
                    onClick={() => update("brand", brand)}
                    className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                      data.brand === brand
                        ? "bg-[var(--energy-green)] text-[var(--obsidian)] border-[var(--energy-green)]"
                        : "glass-panel text-[var(--muted-foreground)] border-[var(--border)] hover:text-[var(--electric)]"
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-[var(--muted-foreground)] mb-1.5 block">Model</label>
                  <input
                    value={data.model}
                    onChange={(e) => update("model", e.target.value)}
                    placeholder="e.g. Corolla"
                    className="w-full px-3 py-2.5 rounded-lg bg-[var(--muted)] border border-[var(--border)] text-sm text-[var(--electric)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--energy-green)] outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-[var(--muted-foreground)] mb-1.5 block">Year</label>
                  <input
                    value={data.year}
                    onChange={(e) => update("year", e.target.value)}
                    placeholder="e.g. 2018"
                    className="w-full px-3 py-2.5 rounded-lg bg-[var(--muted)] border border-[var(--border)] text-sm text-[var(--electric)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--energy-green)] outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-[var(--muted-foreground)] mb-1.5 block">Engine</label>
                  <input
                    value={data.engine}
                    onChange={(e) => update("engine", e.target.value)}
                    placeholder="e.g. 1.8L"
                    className="w-full px-3 py-2.5 rounded-lg bg-[var(--muted)] border border-[var(--border)] text-sm text-[var(--electric)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--energy-green)] outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Usage */}
          {step === 1 && (
            <div className="reveal">
              <h3 className="font-display font-semibold text-lg text-[var(--electric)] mb-4">
                How is the vehicle used?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {usageTypes.map((usage) => (
                  <button
                    key={usage}
                    onClick={() => update("usage", usage)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium border text-left transition-all ${
                      data.usage === usage
                        ? "bg-[var(--energy-green)] text-[var(--obsidian)] border-[var(--energy-green)]"
                        : "glass-panel text-[var(--muted-foreground)] border-[var(--border)] hover:text-[var(--electric)]"
                    }`}
                  >
                    {usage}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Fuel */}
          {step === 2 && (
            <div className="reveal">
              <h3 className="font-display font-semibold text-lg text-[var(--electric)] mb-4">
                Estimated monthly fuel spend
              </h3>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] font-medium">
                  ₦
                </span>
                <input
                  type="number"
                  value={data.fuelSpend}
                  onChange={(e) => update("fuelSpend", e.target.value)}
                  placeholder="e.g. 80000"
                  className="w-full pl-8 pr-4 py-3 rounded-lg bg-[var(--muted)] border border-[var(--border)] text-lg text-[var(--electric)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--energy-green)] outline-none"
                />
              </div>
              <p className="mt-3 text-xs text-[var(--muted-foreground)]">
                This helps us estimate your potential savings with CNG conversion.
              </p>
              {/* Quick select */}
              <div className="mt-4 flex flex-wrap gap-2">
                {["30000", "60000", "100000", "200000", "500000"].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => update("fuelSpend", amt)}
                    className="px-3 py-1.5 rounded-full text-xs glass-panel text-[var(--muted-foreground)] hover:text-[var(--energy-green)] border border-[var(--border)]"
                  >
                    ₦{parseInt(amt).toLocaleString()}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Location */}
          {step === 3 && (
            <div className="reveal">
              <h3 className="font-display font-semibold text-lg text-[var(--electric)] mb-4">
                Where are you located?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[var(--muted-foreground)] mb-1.5 block">State</label>
                  <select
                    value={data.state}
                    onChange={(e) => update("state", e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-[var(--muted)] border border-[var(--border)] text-sm text-[var(--electric)] focus:border-[var(--energy-green)] outline-none"
                  >
                    <option value="">Select state</option>
                    {nigerianStates.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[var(--muted-foreground)] mb-1.5 block">City</label>
                  <input
                    value={data.city}
                    onChange={(e) => update("city", e.target.value)}
                    placeholder="e.g. Ikeja"
                    className="w-full px-3 py-2.5 rounded-lg bg-[var(--muted)] border border-[var(--border)] text-sm text-[var(--electric)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--energy-green)] outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Contact */}
          {step === 4 && (
            <div className="reveal">
              <h3 className="font-display font-semibold text-lg text-[var(--electric)] mb-4">
                How can we reach you?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <label className="text-xs text-[var(--muted-foreground)] mb-1.5 block">Full Name</label>
                  <input
                    value={data.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="Your name"
                    className="w-full px-3 py-2.5 rounded-lg bg-[var(--muted)] border border-[var(--border)] text-sm text-[var(--electric)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--energy-green)] outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-[var(--muted-foreground)] mb-1.5 block">Phone</label>
                  <input
                    value={data.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="e.g. 0803 000 0000"
                    className="w-full px-3 py-2.5 rounded-lg bg-[var(--muted)] border border-[var(--border)] text-sm text-[var(--electric)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--energy-green)] outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-[var(--muted-foreground)] mb-1.5 block">WhatsApp</label>
                  <input
                    value={data.whatsapp}
                    onChange={(e) => update("whatsapp", e.target.value)}
                    placeholder="WhatsApp number"
                    className="w-full px-3 py-2.5 rounded-lg bg-[var(--muted)] border border-[var(--border)] text-sm text-[var(--electric)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--energy-green)] outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs text-[var(--muted-foreground)] mb-1.5 block">Email (optional)</label>
                  <input
                    type="email"
                    value={data.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="you@email.com"
                    className="w-full px-3 py-2.5 rounded-lg bg-[var(--muted)] border border-[var(--border)] text-sm text-[var(--electric)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--energy-green)] outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="flex items-center gap-1 px-4 py-2.5 rounded-lg glass-panel text-sm text-[var(--muted-foreground)] disabled:opacity-30 disabled:cursor-not-allowed hover:text-[var(--electric)] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            {step < 4 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-lg bg-[var(--energy-green)] text-[var(--obsidian)] text-sm font-semibold hover:opacity-90 btn-magnetic cursor-pointer shadow-lg"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-1.5 px-6 py-3 rounded-lg bg-[var(--energy-green)] text-[var(--obsidian)] text-sm font-bold hover:opacity-90 btn-magnetic glow-green cursor-pointer shadow-lg"
              >
                Request CNG Assessment <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
