import React, { useState } from "react";
import {
  X,
  Fuel,
  CheckCircle2,
  Calendar,
  MapPin,
  Clock,
  Truck,
  RotateCcw,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { portalStorage, type CustomerProfile, type PortalOrder, type RecurringSupply } from "@/lib/portalData";
import { toast } from "sonner";
import { formatNaira } from "@/lib/catalog";
import { pricingStore, PRICE_CODES } from "@/lib/pricingStore";

interface OrderFuelModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CustomerProfile;
  onOrderPlaced: (order: PortalOrder) => void;
}

/* Prices are now read LIVE from the admin-controlled pricing store */
const getDieselPrice = () => pricingStore.getPriceValue(PRICE_CODES.AGO_DIESEL_PER_LITRE) || 1250;
const getCngPrice = () => pricingStore.getPriceValue(PRICE_CODES.CNG_PER_SCM) || 1150;

export default function OrderFuelModal({
  isOpen,
  onClose,
  profile,
  onOrderPlaced,
}: OrderFuelModalProps) {
  const [fuelType, setFuelType] = useState<"Diesel (AGO)" | "CNG Fuel">("Diesel (AGO)");
  const [quantity, setQuantity] = useState<number>(10000);
  const [selectedSiteId, setSelectedSiteId] = useState(profile.activeSiteId || profile.sites[0]?.id || "SITE-01");
  const [scheduleType, setScheduleType] = useState<"once" | "recurring">("once");
  const [frequency, setFrequency] = useState<RecurringSupply["frequency"]>("Bi-Weekly");
  const [deliveryDate, setDeliveryDate] = useState("Today (Express 4-Hour Dispatch)");
  const [contactName, setContactName] = useState(profile.name);
  const [contactPhone, setContactPhone] = useState(profile.phone);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<PortalOrder | null>(null);

  if (!isOpen) return null;

  const unitPrice = fuelType === "Diesel (AGO)" ? getDieselPrice() : getCngPrice();
  const unitLabel = fuelType === "Diesel (AGO)" ? "Litres" : "SCM (Standard Cubic Metres)";
  const totalPrice = quantity * unitPrice;
  const selectedSite = profile.sites.find((s) => s.id === selectedSiteId) || profile.sites[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactPhone.trim()) {
      toast.error("Please enter a contact phone number for the delivery driver");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const order = portalStorage.addOrder({
        date: new Date().toISOString().split("T")[0],
        type: fuelType,
        items: `${fuelType} Delivery to ${selectedSite?.name || "Facility"}`,
        quantity: `${quantity.toLocaleString()} ${unitLabel}`,
        totalPrice,
        status: "CONFIRMED",
        paymentStatus: "PENDING",
        deliveryAddress: selectedSite?.location || profile.address,
        driverName: "Capt. Ibrahim S. (Assigned)",
        driverPhone: "0803 881 2940",
        tankerReg: "LAG-782-KT (Dedicated Multi-Compartment)",
        estimatedArrival: deliveryDate.includes("Express") ? "Within 4 Hours" : deliveryDate,
      });

      if (scheduleType === "recurring") {
        const recurringList = portalStorage.getRecurring();
        const newRec: RecurringSupply = {
          id: `REC-${Math.floor(100 + Math.random() * 900)}`,
          fuelType: fuelType === "Diesel (AGO)" ? "Diesel (AGO)" : "Virtual Pipeline CNG",
          quantity: `${quantity.toLocaleString()} ${unitLabel}`,
          frequency,
          siteName: selectedSite?.name || "Facility",
          preferredTime: "10:00 AM",
          contactPerson: contactName,
          contactPhone,
          status: "ACTIVE",
          nextDeliveryDate: "In 14 Days",
          estimatedMonthlySpend: totalPrice * (frequency === "Weekly" ? 4 : frequency === "Bi-Weekly" ? 2 : 1),
        };
        recurringList.unshift(newRec);
        portalStorage.saveRecurring(recurringList);
        toast.success(`Recurring fuel supply contract created for ${frequency} replenishment!`);
      }

      setIsSubmitting(false);
      setConfirmedOrder(order);
      onOrderPlaced(order);
      toast.success(`Fuel order ${order.id} confirmed! Dispatch is notified.`);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0e1013] border border-white/10 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-[#14161b]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#ff9f0a]/15 text-[#ff9f0a] border border-[#ff9f0a]/30 flex items-center justify-center">
              <Fuel className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base sm:text-lg text-[var(--electric)]">
                SmartFix Fuel Procurement Desk
              </h3>
              <p className="text-[11px] text-[var(--muted-foreground)]">
                Certified AGO Diesel Distribution &amp; Virtual Pipeline CNG
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full glass-panel flex items-center justify-center text-[var(--muted-foreground)] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {!confirmedOrder ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Fuel Selector */}
              <div>
                <label className="block text-xs font-semibold text-[var(--muted-foreground)] mb-2 uppercase tracking-wider">
                  Select Energy Carrier
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setFuelType("Diesel (AGO)");
                      setQuantity(10000);
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      fuelType === "Diesel (AGO)"
                        ? "bg-[#ff9f0a]/15 border-[#ff9f0a] text-[var(--electric)]"
                        : "glass-panel border-white/5 text-[var(--muted-foreground)] hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm">Diesel (AGO)</span>
                      <Fuel className="w-4 h-4 text-[#ff9f0a]" />
                    </div>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      Standard certified AGO · ₦{getDieselPrice().toLocaleString()}/L
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFuelType("CNG Fuel");
                      setQuantity(3000);
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      fuelType === "CNG Fuel"
                        ? "bg-[var(--cng-blue)]/15 border-[var(--cng-blue)] text-[var(--electric)]"
                        : "glass-panel border-white/5 text-[var(--muted-foreground)] hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm">Virtual Pipeline CNG</span>
                      <Fuel className="w-4 h-4 text-[var(--cng-blue)]" />
                    </div>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      200-Bar Gas Skid · ₦{getCngPrice().toLocaleString()}/SCM
                    </p>
                  </button>
                </div>
              </div>

              {/* Quantity Preset Buttons */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
                    Volume Required ({unitLabel})
                  </label>
                  <span className="font-mono text-xs font-bold text-[var(--energy-green)]">
                    {quantity.toLocaleString()} {unitLabel}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {(fuelType === "Diesel (AGO)" ? [2500, 5000, 10000, 33000] : [1000, 2500, 5000, 10000]).map((vol) => (
                    <button
                      key={vol}
                      type="button"
                      onClick={() => setQuantity(vol)}
                      className={`py-2 rounded-xl text-xs font-semibold font-mono border transition-all cursor-pointer ${
                        quantity === vol
                          ? "bg-[var(--energy-green)] text-[var(--obsidian)] border-[var(--energy-green)]"
                          : "glass-panel text-[var(--muted-foreground)] hover:text-white"
                      }`}
                    >
                      {vol.toLocaleString()}
                    </button>
                  ))}
                </div>
                <input
                  type="range"
                  min={fuelType === "Diesel (AGO)" ? 1000 : 500}
                  max={fuelType === "Diesel (AGO)" ? 50000 : 25000}
                  step={500}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full accent-[var(--energy-green)]"
                />
              </div>

              {/* Supply Mode: Once vs Recurring */}
              <div>
                <label className="block text-xs font-semibold text-[var(--muted-foreground)] mb-2 uppercase tracking-wider">
                  Supply Fulfillment Mode
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setScheduleType("once")}
                    className={`p-3 rounded-xl border text-xs font-medium text-left cursor-pointer transition-all ${
                      scheduleType === "once"
                        ? "bg-[var(--energy-green)]/15 border-[var(--energy-green)] text-[var(--electric)]"
                        : "glass-panel text-[var(--muted-foreground)]"
                    }`}
                  >
                    <div className="font-bold mb-0.5">One-Time Spot Dispatch</div>
                    <div className="text-[11px] text-[var(--muted-foreground)]">Single dedicated tanker shipment</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setScheduleType("recurring")}
                    className={`p-3 rounded-xl border text-xs font-medium text-left cursor-pointer transition-all ${
                      scheduleType === "recurring"
                        ? "bg-[#ff9f0a]/15 border-[#ff9f0a] text-[var(--electric)]"
                        : "glass-panel text-[var(--muted-foreground)]"
                    }`}
                  >
                    <div className="font-bold mb-0.5">Recurring Replenishment</div>
                    <div className="text-[11px] text-[var(--muted-foreground)]">Automated scheduled tanker cycle</div>
                  </button>
                </div>

                {scheduleType === "recurring" && (
                  <div className="mt-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-between gap-3">
                    <span className="text-xs text-[var(--muted-foreground)]">Delivery Cycle:</span>
                    <select
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value as any)}
                      className="px-3 py-1.5 rounded-lg bg-[#14161b] text-[#f5f5f7] border border-white/10 text-xs outline-none"
                    >
                      <option value="Weekly">Weekly (Every 7 Days)</option>
                      <option value="Bi-Weekly">Bi-Weekly (Every 14 Days)</option>
                      <option value="Monthly">Monthly</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Destination Site Selection */}
              <div>
                <label className="block text-xs font-semibold text-[var(--muted-foreground)] mb-1.5 uppercase tracking-wider">
                  Delivery Destination Site
                </label>
                <select
                  value={selectedSiteId}
                  onChange={(e) => setSelectedSiteId(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl bg-[#14161b] text-[#f5f5f7] border border-white/10 text-xs sm:text-sm [color-scheme:dark] outline-none"
                >
                  {profile.sites.map((site) => (
                    <option key={site.id} value={site.id}>
                      {site.name} · {site.location}
                    </option>
                  ))}
                </select>
              </div>

              {/* Contact On-Site */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[var(--muted-foreground)] mb-1">
                    Site Receiver Name
                  </label>
                  <input
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#14161b] text-[#f5f5f7] border border-white/10 text-xs sm:text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--muted-foreground)] mb-1">
                    Receiver Phone Number *
                  </label>
                  <input
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#14161b] text-[#f5f5f7] border border-white/10 text-xs sm:text-sm outline-none"
                  />
                </div>
              </div>

              {/* Pricing Summary Card */}
              <div className="p-4 rounded-2xl glass-card border border-white/10 space-y-2">
                <div className="flex justify-between text-xs text-[var(--muted-foreground)]">
                  <span>Unit Price:</span>
                  <span className="font-mono text-white">₦{unitPrice.toLocaleString()} / {unitLabel.split(" ")[0]}</span>
                </div>
                <div className="flex justify-between text-xs text-[var(--muted-foreground)]">
                  <span>Logistics &amp; Quality Certification:</span>
                  <span className="font-mono text-[var(--energy-green)]">INCLUDED (Free Metered Delivery)</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[var(--electric)] pt-2 border-t border-white/5">
                  <span>Estimated Total Amount:</span>
                  <span className="text-base text-[var(--energy-green)] font-mono">{formatNaira(totalPrice)}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-5 py-4 rounded-xl bg-[#ff9f0a] text-[var(--obsidian)] font-bold text-sm shadow-xl hover:opacity-95 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? "Locking In Tanker Logistics..." : `Confirm Fuel Order · ${formatNaira(totalPrice)} →`}
              </button>
            </form>
          ) : (
            /* Confirmation Screen */
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#ff9f0a] text-[var(--obsidian)] flex items-center justify-center mx-auto shadow-xl">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <span className="text-xs font-mono font-bold text-[#ff9f0a] uppercase tracking-widest">
                FUEL PROCUREMENT ORDER LOCKED
              </span>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-[var(--electric)]">
                {confirmedOrder.id}
              </h3>
              <p className="text-xs text-[var(--muted-foreground)] max-w-md mx-auto">
                Your fuel request has been dispatched to the SmartFix Fuel Terminal. Automated dispatch telemetry is active.
              </p>

              <div className="max-w-md mx-auto rounded-2xl glass-card border border-white/10 p-5 text-left text-xs space-y-2.5">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-[var(--muted-foreground)]">Volume &amp; Grade:</span>
                  <span className="font-bold text-[var(--electric)]">{confirmedOrder.quantity} ({confirmedOrder.type})</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-[var(--muted-foreground)]">Destination Site:</span>
                  <span className="font-semibold text-[var(--electric)]">{confirmedOrder.deliveryAddress}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-[var(--muted-foreground)]">Tanker Vessel:</span>
                  <span className="font-mono text-[var(--cng-blue)]">{confirmedOrder.tankerReg}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-[var(--muted-foreground)]">Dispatch Driver:</span>
                  <span className="font-semibold text-white">{confirmedOrder.driverName} ({confirmedOrder.driverPhone})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted-foreground)]">Estimated Arrival:</span>
                  <span className="font-bold text-[var(--energy-green)] font-mono">{confirmedOrder.estimatedArrival}</span>
                </div>
              </div>

              <div className="pt-4 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 rounded-xl bg-[var(--energy-green)] text-[var(--obsidian)] font-bold text-xs sm:text-sm btn-magnetic"
                >
                  View in My Orders
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
