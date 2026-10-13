import React, { useState } from "react";
import {
  Truck,
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
  CheckCircle2,
  FileText,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Maximize2,
  Download,
  Share2,
  Gauge,
  Check,
  Fuel,
} from "lucide-react";
import { formatNaira } from "@/lib/catalog";
import { toast } from "sonner";
import { SMARTFIX_CONTACT } from "@/lib/contact";

export interface ActiveDeliveryShipment {
  id: string;
  orderId: string;
  customerName: string;
  company: string;
  destinationSite: string;
  fuelType: string;
  volume: string;
  tankerReg: string;
  driverName: string;
  driverPhone: string;
  sealNumber: string;
  departureTime: string;
  estimatedArrival: string;
  status: "DEPARTED_TERMINAL" | "IN_TRANSIT" | "ARRIVED_AT_GATE" | "DISCHARGING" | "DELIVERED";
  startMeterIndex: number;
  endMeterIndex?: number;
  density: number; // kg/L
  temperature: number;
  podSigned?: boolean;
  podSignedAt?: string;
  podSignerName?: string;
}

const DEFAULT_SHIPMENT: ActiveDeliveryShipment = {
  id: "DSP-2026-9812",
  orderId: "SFE-ORD-8821",
  customerName: "Olalekan Jimoh",
  company: "LJ Entertainment Records",
  destinationSite: "Main Studio & Production Complex (Victoria Island, Lagos)",
  fuelType: "Certified AGO Diesel",
  volume: "10,000 Litres",
  tankerReg: "LAG-782-KT",
  driverName: "Suleiman Bello",
  driverPhone: "0803 555 0192",
  sealNumber: "SFE-SEAL-882914",
  departureTime: "07:30 AM",
  estimatedArrival: "Approaching Facility (15 mins)",
  status: "IN_TRANSIT",
  startMeterIndex: 214580,
  density: 0.842,
  temperature: 28.1,
  podSigned: false,
};

interface LiveDeliveryTrackerProps {
  shipment?: ActiveDeliveryShipment;
  onPODCompleted?: (shipmentId: string) => void;
}

export default function LiveDeliveryTracker({
  shipment = DEFAULT_SHIPMENT,
  onPODCompleted,
}: LiveDeliveryTrackerProps) {
  const [activeShipment, setActiveShipment] = useState<ActiveDeliveryShipment>(shipment);
  const [showPODModal, setShowPODModal] = useState(false);
  const [signerName, setSignerName] = useState(activeShipment.customerName);
  const [dischargedMeter, setDischargedMeter] = useState(activeShipment.startMeterIndex + 10000);
  const [signatureDone, setSignatureDone] = useState(false);

  const steps = [
    { label: "Terminal Loaded", time: "07:15 AM", done: true },
    { label: "Security Sealed", time: "07:30 AM", done: true },
    { label: "In Transit (En Route)", time: "08:15 AM", done: true, current: activeShipment.status === "IN_TRANSIT" },
    { label: "Gate Arrival", time: "08:45 AM", done: activeShipment.status === "ARRIVED_AT_GATE" || activeShipment.status === "DISCHARGING" || activeShipment.status === "DELIVERED" },
    { label: "Metered Discharge & e-POD", time: "Pending", done: activeShipment.status === "DELIVERED" },
  ];

  const handleConfirmPOD = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signerName.trim()) {
      toast.error("Please enter the receiving manager's name");
      return;
    }

    const updated: ActiveDeliveryShipment = {
      ...activeShipment,
      status: "DELIVERED",
      endMeterIndex: dischargedMeter,
      podSigned: true,
      podSignedAt: new Date().toLocaleTimeString() + ", " + new Date().toLocaleDateString(),
      podSignerName: signerName,
    };

    setActiveShipment(updated);
    setSignatureDone(true);
    toast.success("Electronic Proof of Delivery (e-POD) signed and certified!");
    if (onPODCompleted) onPODCompleted(updated.id);
  };

  return (
    <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
      {/* Tracker Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--cng-blue)] animate-ping" />
            <h3 className="font-display font-bold text-lg text-[var(--electric)] flex items-center gap-2">
              <Truck className="w-5 h-5 text-[var(--cng-blue)]" /> Live Tanker Dispatch & GPS Tracker
            </h3>
          </div>
          <p className="text-xs text-[var(--muted-foreground)]">
            Tracking dedicated tanker for {activeShipment.company} · Order {activeShipment.orderId}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[var(--cng-blue)]/15 text-[var(--cng-blue)]">
            DISPATCH REF: {activeShipment.id}
          </span>
          {activeShipment.podSigned && (
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[var(--energy-green)]/15 text-[var(--energy-green)] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> e-POD CERTIFIED
            </span>
          )}
        </div>
      </div>

      {/* Main Grid: GPS Map Simulation + Tanker Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Simulated Map & Route Graphic (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl glass-panel border border-white/10 p-5 space-y-4 relative overflow-hidden bg-black/40">
          <div className="flex items-center justify-between">
            <div className="text-xs font-mono font-semibold text-[var(--muted-foreground)] flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-red-400" /> LIVE ROUTE TELEMETRY
            </div>
            <span className="text-[11px] font-mono text-[var(--energy-green)]">
              GPS Signal: LOCKED (42 km/h)
            </span>
          </div>

          {/* Graphical Map Representation */}
          <div className="relative h-56 rounded-xl bg-[#0c0d10] border border-white/5 overflow-hidden flex items-center justify-center p-4">
            {/* Grid overlay */}
            <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:24px_24px]" />

            {/* Route Polyline Graphic */}
            <svg className="w-full h-full absolute inset-0 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M 50 180 Q 150 90 280 120 T 520 70"
                fill="none"
                stroke="rgba(0, 168, 255, 0.4)"
                strokeWidth="4"
                strokeDasharray="6 6"
              />
              <path
                d="M 50 180 Q 150 90 280 120"
                fill="none"
                stroke="var(--cng-blue)"
                strokeWidth="4"
              />
            </svg>

            {/* Origin Depot Pin */}
            <div className="absolute left-10 bottom-6 flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-white/60 ring-4 ring-white/10" />
              <span className="text-[9px] font-mono text-[var(--muted-foreground)] mt-1 whitespace-nowrap">
                Apapa Terminal (07:30)
              </span>
            </div>

            {/* Moving Tanker Marker */}
            <div className="absolute left-[48%] top-[45%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
              <div className="w-10 h-10 rounded-2xl bg-[var(--cng-blue)] text-white flex items-center justify-center shadow-lg shadow-[var(--cng-blue)]/40 ring-4 ring-[var(--cng-blue)]/20 animate-bounce">
                <Truck className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold font-mono text-[var(--electric)] mt-1 px-2 py-0.5 rounded-full bg-black/80 border border-white/20 whitespace-nowrap">
                {activeShipment.tankerReg} · 42 km/h
              </span>
            </div>

            {/* Destination Pin */}
            <div className="absolute right-10 top-10 flex flex-col items-center">
              <div className="w-4 h-4 rounded-full bg-[var(--energy-green)] ring-4 ring-[var(--energy-green)]/20 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--obsidian)]" />
              </div>
              <span className="text-[9px] font-mono text-[var(--energy-green)] font-bold mt-1 whitespace-nowrap">
                Destination: VI Studio Bay
              </span>
            </div>
          </div>

          {/* Delivery Timeline Steps */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
            {steps.map((st, i) => (
              <div key={st.label} className="p-2 rounded-xl glass-panel border border-white/5 text-center">
                <div className="flex items-center justify-center mb-1">
                  {st.done ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--energy-green)]" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-white/20" />
                  )}
                </div>
                <div className="text-[10px] font-medium text-[var(--electric)] line-clamp-1">{st.label}</div>
                <div className="text-[9px] font-mono text-[var(--muted-foreground)]">{st.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tanker Details & Dispatch Manifest (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Driver Card */}
          <div className="p-4 rounded-2xl glass-panel border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[var(--cng-blue)]/20 text-[var(--cng-blue)] flex items-center justify-center font-bold font-mono">
                SB
              </div>
              <div>
                <div className="font-semibold text-xs text-[var(--electric)] flex items-center gap-1.5">
                  {activeShipment.driverName}
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-[var(--energy-green)]">
                    Hazmat Certified
                  </span>
                </div>
                <div className="text-[11px] text-[var(--muted-foreground)] mt-0.5">
                  Vehicle: <strong className="text-[var(--electric)]">{activeShipment.tankerReg}</strong> (33,000L Triple-Axle)
                </div>
              </div>
            </div>

            <a
              href={`tel:${activeShipment.driverPhone}`}
              className="w-9 h-9 rounded-xl glass-panel flex items-center justify-center text-[var(--energy-green)] hover:bg-[var(--energy-green)] hover:text-black transition-colors"
              title="Call Driver"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>

          {/* Meter & Quality Assurance Manifest */}
          <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-bold text-[var(--electric)] flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-[#ff9f0a]" /> Digital Meter Calibration
              </span>
              <span className="text-[10px] font-mono text-[var(--energy-green)]">NMDPRA TESTED</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-[var(--muted-foreground)] block">Dispatched Product</span>
                <span className="font-semibold text-[var(--electric)]">{activeShipment.fuelType}</span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--muted-foreground)] block">Ordered Volume</span>
                <span className="font-semibold text-[var(--electric)] font-mono">{activeShipment.volume}</span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--muted-foreground)] block">Terminal Seal Serial</span>
                <span className="font-mono font-bold text-[var(--cng-blue)]">{activeShipment.sealNumber}</span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--muted-foreground)] block">Product Density (15°C)</span>
                <span className="font-mono text-[var(--electric)]">{activeShipment.density} kg/L (AGO)</span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--muted-foreground)] block">Starting Flowmeter</span>
                <span className="font-mono text-[var(--electric)]">{activeShipment.startMeterIndex.toLocaleString()} L</span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--muted-foreground)] block">Ending Meter (Projected)</span>
                <span className="font-mono text-[var(--energy-green)]">
                  {activeShipment.endMeterIndex ? `${activeShipment.endMeterIndex.toLocaleString()} L` : `${(activeShipment.startMeterIndex + 10000).toLocaleString()} L`}
                </span>
              </div>
            </div>
          </div>

          {/* e-POD Sign-off Button / Status */}
          {activeShipment.podSigned ? (
            <div className="p-4 rounded-2xl bg-[var(--energy-green)]/10 border border-[var(--energy-green)]/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[var(--energy-green)] text-black flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[var(--electric)]">e-POD Signed & Discharged</div>
                  <div className="text-[10px] text-[var(--muted-foreground)]">
                    Signed by {activeShipment.podSignerName} · {activeShipment.podSignedAt}
                  </div>
                </div>
              </div>
              <button
                onClick={() => toast.success("Downloading official electronic Proof of Delivery PDF...")}
                className="p-2 rounded-xl glass-panel text-[var(--electric)] hover:text-[var(--energy-green)]"
                title="Download e-POD PDF"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowPODModal(true)}
              className="w-full py-3.5 rounded-2xl bg-[var(--energy-green)] text-[var(--obsidian)] font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[var(--energy-green)]/20"
            >
              <FileText className="w-4 h-4" /> Verify Flowmeter & Sign Electronic POD
            </button>
          )}
        </div>
      </div>

      {/* ========== DIGITAL PROOF OF DELIVERY (e-POD) MODAL ========== */}
      {showPODModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowPODModal(false)} />
          <div className="relative z-10 w-full max-w-lg glass-card p-6 md:p-8 rounded-3xl border border-white/10">
            {signatureDone ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 rounded-full bg-[var(--energy-green)] text-[var(--obsidian)] flex items-center justify-center mx-auto mb-4 glow-green">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-display font-bold text-xl text-[var(--electric)]">
                  Delivery Certified & Handover Complete
                </h3>
                <p className="text-xs text-[var(--muted-foreground)] mt-2">
                  Official SmartFix e-POD has been generated. Fuel intake of 10,000 Litres AGO Diesel verified by {signerName}.
                </p>

                <div className="my-5 p-4 rounded-2xl glass-panel border border-white/10 text-left text-xs font-mono space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-[var(--muted-foreground)]">e-POD Hash:</span>
                    <span className="text-[var(--energy-green)]">SFE-POD-9812-OK</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--muted-foreground)]">Net Discharged:</span>
                    <span>10,000 Litres</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--muted-foreground)]">Tamper Seal:</span>
                    <span>{activeShipment.sealNumber} (Intact)</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowPODModal(false)}
                  className="w-full py-3 rounded-xl bg-[var(--energy-green)] text-black font-bold text-xs"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleConfirmPOD} className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <h3 className="font-display font-bold text-lg text-[var(--electric)] flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[var(--energy-green)]" />
                    Electronic Proof of Delivery (e-POD)
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowPODModal(false)}
                    className="text-xs text-[var(--muted-foreground)] hover:text-white"
                  >
                    Cancel
                  </button>
                </div>

                <div className="p-3 rounded-xl glass-panel border border-white/10 text-xs space-y-1">
                  <div className="text-[var(--muted-foreground)]">Facility:</div>
                  <div className="font-semibold text-[var(--electric)]">{activeShipment.destinationSite}</div>
                  <div className="text-[11px] text-[var(--cng-blue)] font-mono">
                    Tanker {activeShipment.tankerReg} · Seal {activeShipment.sealNumber}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-[var(--muted-foreground)] block mb-1">
                      Start Flowmeter Index
                    </label>
                    <input
                      type="number"
                      readOnly
                      value={activeShipment.startMeterIndex}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] text-[var(--electric)] border border-white/10 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[var(--muted-foreground)] block mb-1">
                      Final Flowmeter Reading
                    </label>
                    <input
                      type="number"
                      value={dischargedMeter}
                      onChange={(e) => setDischargedMeter(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-[#141417] text-[var(--energy-green)] border border-white/10 text-xs font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[var(--energy-green)]/10 border border-[var(--energy-green)]/20 text-xs flex justify-between items-center">
                  <span className="text-[var(--muted-foreground)]">Net Delivered:</span>
                  <span className="font-mono font-bold text-[var(--energy-green)] text-sm">
                    {(dischargedMeter - activeShipment.startMeterIndex).toLocaleString()} Litres
                  </span>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[var(--muted-foreground)] block mb-1">
                    Receiving Engineer / Facility Manager Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={signerName}
                    onChange={(e) => setSignerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#141417] text-white border border-white/10 text-xs outline-none focus:border-[var(--energy-green)]"
                    placeholder="e.g. Engr. Olalekan Jimoh"
                  />
                </div>

                <div className="p-3 rounded-xl glass-panel border border-white/10 text-[10px] text-[var(--muted-foreground)]">
                  By clicking certify, I confirm that the tamper-evident seals were inspected, fuel density checked, and digital flowmeter index verified before and after discharge.
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[var(--energy-green)] text-black font-bold text-xs flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4 stroke-[3]" /> Certify & Sign Electronic POD
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
