import CNGHero from "@/components/cng/CNGHero";
import CNGServices from "@/components/cng/CNGServices";
import ConversionWizard from "@/components/cng/ConversionWizard";
import { Link } from "react-router-dom";
import { ArrowRight, Truck, Bus, Car, Package } from "lucide-react";

const fleetTypes = [
  { icon: Bus, label: "Transport companies" },
  { icon: Package, label: "Logistics" },
  { icon: Car, label: "Ride-hailing" },
  { icon: Truck, label: "Corporate fleets" },
];

function FleetSection() {
  return (
    <section className="section-padding relative">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="glass-card p-8 md:p-12 relative overflow-hidden">
          {/* Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[var(--cng-blue)] opacity-[0.06] blur-[80px] pointer-events-none" />

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 glass-panel rounded-full px-4 py-1.5 mb-4">
                <span className="text-xs font-medium tracking-[0.15em] text-[var(--cng-blue)]">
                  FLEET CONVERSION
                </span>
              </div>
              <h2 className="font-display font-bold text-3xl md:text-5xl leading-tight tracking-tight">
                <span className="text-gradient-light">YOUR FLEET.</span>
                <br />
                <span className="text-gradient-green">ONE ENERGY STRATEGY.</span>
              </h2>
              <p className="mt-4 text-sm text-[var(--muted-foreground)] leading-relaxed max-w-md">
                For transport companies, logistics, ride-hailing, corporate fleets, government fleets,
                school buses, delivery companies and industrial fleets.
              </p>
              <Link
                to="/request-quote"
                className="group mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[var(--cng-blue)] text-white font-semibold text-sm btn-magnetic glow-blue"
              >
                Start Fleet Assessment
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Dashboard-style visual */}
            <div className="glass-panel rounded-xl p-5">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Fleet Size", value: "50 vehicles", icon: Truck },
                  { label: "Current Fuel", value: "Petrol", icon: Car },
                  { label: "Conversion Status", value: "Assessment", icon: Package },
                  { label: "Maintenance", value: "SmartFix Managed", icon: Bus },
                ].map((item) => (
                  <div key={item.label} className="glass-panel rounded-lg p-4">
                    <item.icon className="w-5 h-5 text-[var(--energy-green)] mb-2" />
                    <p className="text-xs text-[var(--muted-foreground)]">{item.label}</p>
                    <p className="text-sm font-semibold text-[var(--electric)]">{item.value}</p>
                  </div>
                ))}
              </div>
              {fleetTypes.length > 0 && (
                <div className="mt-4 pt-4 border-t border-[var(--border)]">
                  <div className="flex flex-wrap gap-2">
                    {fleetTypes.map((ft) => (
                      <span key={ft.label} className="text-xs text-[var(--muted-foreground)] glass-panel px-2.5 py-1 rounded-full">
                        {ft.label}
                      </span>
                    ))}
                    <span className="text-xs text-[var(--muted-foreground)] glass-panel px-2.5 py-1 rounded-full">Government fleets</span>
                    <span className="text-xs text-[var(--muted-foreground)] glass-panel px-2.5 py-1 rounded-full">School buses</span>
                    <span className="text-xs text-[var(--muted-foreground)] glass-panel px-2.5 py-1 rounded-full">Delivery companies</span>
                    <span className="text-xs text-[var(--muted-foreground)] glass-panel px-2.5 py-1 rounded-full">Industrial fleets</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function CNG() {
  return (
    <>
      <CNGHero />
      <CNGServices />
      <FleetSection />
      <ConversionWizard />
    </>
  );
}
