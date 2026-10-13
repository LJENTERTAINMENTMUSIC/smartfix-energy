import React, { useState, useMemo } from "react";
import {
  CreditCard,
  Zap,
  CheckCircle2,
  Copy,
  Receipt,
  Smartphone,
  ShieldCheck,
  Building2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  Download,
  Printer,
  ChevronRight,
} from "lucide-react";
import { formatNaira } from "@/lib/catalog";
import { pricingStore, PRICE_CODES, usePricing } from "@/lib/pricingStore";
import { toast } from "sonner";

interface EstateOption {
  id: string;
  name: string;
  location: string;
  meterPrefix: string;
  units: number;
}

const ESTATES: EstateOption[] = [
  {
    id: "EST-LEK-01",
    name: "Palm Gardens Estate",
    location: "Lekki Phase 1, Lagos",
    meterPrefix: "0429-8812",
    units: 240,
  },
  {
    id: "EST-IKY-02",
    name: "Victoria Bay Luxury Crest",
    location: "Ikoyi, Lagos",
    meterPrefix: "0433-9104",
    units: 180,
  },
  {
    id: "EST-ABJ-03",
    name: "Guzape Diplomatic Hilltop",
    location: "Guzape District, Abuja",
    meterPrefix: "0418-7203",
    units: 310,
  },
  {
    id: "EST-GRA-04",
    name: "Emerald Heights Court",
    location: "GRA Phase 2, Port Harcourt",
    meterPrefix: "0455-6619",
    units: 140,
  },
];

export default function ResidentVendingSimulator() {
  const { prices } = usePricing();

  const adminIppTariff = useMemo(() => {
    return pricingStore.getPriceValue(PRICE_CODES.IPP_ESTATE_BASE_TARIFF_KWH, 195);
  }, [prices]);

  // Vending form state
  const [selectedEstate, setSelectedEstate] = useState<EstateOption>(ESTATES[0]);
  const [unitNumber, setUnitNumber] = useState<string>("Villa 14B, Hibiscus Close");
  const [meterNumber, setMeterNumber] = useState<string>("0429-8812-9402");
  const [amount, setAmount] = useState<number>(15000);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [vendingResult, setVendingResult] = useState<{
    token: string;
    kwhCredited: number;
    receiptNumber: string;
    timestamp: string;
    previousBalanceKwh: number;
    newBalanceKwh: number;
    amountPaid: number;
  } | null>(null);

  // Initial meter balance
  const [currentBalanceKwh, setCurrentBalanceKwh] = useState<number>(38.4);

  // Calculate kWh credit based on amount and admin IPP tariff
  const activeAmount = customAmount ? Number(customAmount) || 0 : amount;
  const calculatedKwh = activeAmount > 0 ? Number((activeAmount / adminIppTariff).toFixed(2)) : 0;

  const handleEstateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const found = ESTATES.find((est) => est.id === e.target.value) || ESTATES[0];
    setSelectedEstate(found);
    setMeterNumber(`${found.meterPrefix}-${Math.floor(1000 + Math.random() * 9000)}`);
    setVendingResult(null);
  };

  const handleVendToken = () => {
    if (activeAmount < 1000) {
      toast.error("Minimum electricity purchase is ₦1,000");
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      // Generate realistic 20-digit STS token: 4 blocks of 5 digits or 5 blocks of 4 digits
      const part1 = Math.floor(1000 + Math.random() * 9000);
      const part2 = Math.floor(1000 + Math.random() * 9000);
      const part3 = Math.floor(1000 + Math.random() * 9000);
      const part4 = Math.floor(1000 + Math.random() * 9000);
      const part5 = Math.floor(1000 + Math.random() * 9000);
      const token = `${part1} ${part2} ${part3} ${part4} ${part5}`;

      const receiptNumber = `STS-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
      const prevBal = currentBalanceKwh;
      const newBal = Number((prevBal + calculatedKwh).toFixed(2));

      setVendingResult({
        token,
        kwhCredited: calculatedKwh,
        receiptNumber,
        timestamp: new Date().toLocaleString("en-NG", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
        previousBalanceKwh: prevBal,
        newBalanceKwh: newBal,
        amountPaid: activeAmount,
      });

      setCurrentBalanceKwh(newBal);
      setIsProcessing(false);
      toast.success("20-Digit STS Token Generated Successfully!");
    }, 900);
  };

  const copyToken = () => {
    if (vendingResult?.token) {
      navigator.clipboard.writeText(vendingResult.token.replace(/\s/g, ""));
      toast.success("STS Token copied to clipboard!");
    }
  };

  return (
    <div className="w-full glass-card p-6 md:p-8 rounded-3xl border border-white/10 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--cng-blue)]/15 text-[var(--cng-blue)] text-xs font-semibold uppercase tracking-wider mb-2">
            <Smartphone className="w-3.5 h-3.5" />
            RESIDENT PORTAL DEMO
          </div>
          <h3 className="font-display font-bold text-xl sm:text-2xl text-[var(--electric)]">
            STS Smart Pre-Paid Electricity Vending
          </h3>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
            Test the seamless, 24/7 resident payment &amp; STS token generation experience.
          </p>
        </div>
        <div className="sm:text-right">
          <span className="text-[10px] text-[var(--muted-foreground)] uppercase font-mono block">
            Estate Tariff Rate
          </span>
          <span className="text-lg font-bold font-mono text-[var(--energy-green)]">
            ₦{adminIppTariff} <span className="text-xs font-normal text-[var(--muted-foreground)]">/ kWh</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Vending Input Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Estate Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--electric)] flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-[var(--cng-blue)]" />
              Contracted Estate / Development:
            </label>
            <select
              value={selectedEstate.id}
              onChange={handleEstateChange}
              className="w-full rounded-xl bg-black/40 border border-white/15 px-3.5 py-2.5 text-xs text-[var(--electric)] focus:outline-none focus:border-[var(--energy-green)]"
            >
              {ESTATES.map((e) => (
                <option key={e.id} value={e.id} className="bg-[#14161b] text-white">
                  {e.name} ({e.location}) — {e.units} Units
                </option>
              ))}
            </select>
          </div>

          {/* Unit & Meter Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--electric)]">
                Resident Unit / Address:
              </label>
              <input
                type="text"
                value={unitNumber}
                onChange={(e) => setUnitNumber(e.target.value)}
                className="w-full rounded-xl bg-black/40 border border-white/15 px-3.5 py-2 text-xs text-[var(--electric)] focus:outline-none focus:border-[var(--energy-green)]"
                placeholder="e.g. Flat 4B, Block 2"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--electric)]">
                STS Split-Meter Number:
              </label>
              <input
                type="text"
                value={meterNumber}
                onChange={(e) => setMeterNumber(e.target.value)}
                className="w-full rounded-xl bg-black/40 border border-white/15 px-3.5 py-2 text-xs font-mono text-[var(--energy-green)] focus:outline-none focus:border-[var(--energy-green)]"
                placeholder="0429-XXXX-XXXX"
              />
            </div>
          </div>

          {/* Current Live Meter Balance Widget */}
          <div className="p-4 rounded-2xl bg-black/30 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400/15 text-amber-400 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-[var(--muted-foreground)] uppercase font-mono block">
                  Simulated In-Home CIU Meter Balance
                </span>
                <span className="text-xl font-bold font-mono text-white">
                  {currentBalanceKwh} <span className="text-xs text-[var(--muted-foreground)]">kWh</span>
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[var(--muted-foreground)] block">Telemetry Status</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--energy-green)]">
                <span className="w-2 h-2 rounded-full bg-[var(--energy-green)] animate-pulse" />
                Online &amp; Synced
              </span>
            </div>
          </div>

          {/* Quick Amount Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[var(--electric)] block">
              Select Token Purchase Amount:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[5000, 10000, 20000, 50000].map((amt) => {
                const isSelected = amount === amt && !customAmount;
                return (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setAmount(amt);
                      setCustomAmount("");
                    }}
                    className={`p-3 rounded-xl border text-xs font-bold font-mono transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[var(--energy-green)] text-[var(--obsidian)] border-[var(--energy-green)] shadow-md"
                        : "bg-white/[0.03] text-[var(--electric)] border-white/10 hover:border-white/20"
                    }`}
                  >
                    {formatNaira(amt)}
                  </button>
                );
              })}
            </div>

            {/* Custom Amount input */}
            <div className="pt-1">
              <input
                type="number"
                placeholder="Or enter custom amount in ₦ (e.g. 35000)"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-full rounded-xl bg-black/40 border border-white/15 px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-[var(--energy-green)]"
              />
            </div>
          </div>

          {/* Conversion Breakdown Box */}
          <div className="p-3.5 rounded-xl bg-[var(--energy-green)]/10 border border-[var(--energy-green)]/30 flex items-center justify-between text-xs">
            <span className="text-[var(--muted-foreground)]">
              Estimated Energy Credit:
            </span>
            <span className="font-mono font-bold text-[var(--energy-green)] text-sm">
              +{calculatedKwh} kWh @ ₦{adminIppTariff}/kWh
            </span>
          </div>

          {/* Vend Button */}
          <button
            type="button"
            onClick={handleVendToken}
            disabled={isProcessing}
            className="w-full py-3.5 rounded-xl bg-[var(--energy-green)] text-[var(--obsidian)] font-bold text-sm btn-magnetic glow-green flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                <span>Encrypting STS Token (IEC 62055-41)...</span>
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                <span>Simulate Instant Token Purchase ({formatNaira(activeAmount)})</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Generated Token & STS Official Receipt (5 cols) */}
        <div className="lg:col-span-5">
          {vendingResult ? (
            <div className="p-6 rounded-3xl bg-[#0e1014] border border-[var(--energy-green)]/40 shadow-2xl space-y-5 animate-in fade-in">
              {/* Receipt Header */}
              <div className="text-center border-b border-white/10 pb-4 space-y-1">
                <span className="text-[10px] font-mono text-[var(--energy-green)] uppercase tracking-wider block">
                  SMARTFIX ENERGY OS · STS VENDING GATEWAY
                </span>
                <h4 className="font-display font-bold text-base text-[var(--electric)]">
                  Standard Transfer Specification Receipt
                </h4>
                <p className="text-[10px] text-[var(--muted-foreground)] font-mono">
                  Receipt Ref: {vendingResult.receiptNumber}
                </p>
              </div>

              {/* 20-Digit STS Token Display Box */}
              <div className="p-4 rounded-2xl bg-black border border-[var(--energy-green)]/50 text-center space-y-2">
                <span className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-wider block font-mono">
                  KEY THIS 20-DIGIT TOKEN INTO YOUR IN-HOME CIU KEYPAD:
                </span>
                <div className="font-mono text-xl sm:text-2xl font-extrabold text-[var(--energy-green)] tracking-wider select-all py-1">
                  {vendingResult.token}
                </div>
                <button
                  type="button"
                  onClick={copyToken}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[var(--energy-green)]/15 text-[var(--energy-green)] text-xs font-semibold hover:bg-[var(--energy-green)]/25 cursor-pointer transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Token</span>
                </button>
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-2 text-xs font-mono border-t border-b border-white/10 py-3">
                <div className="flex justify-between text-[var(--muted-foreground)]">
                  <span>Estate:</span>
                  <span className="text-white font-sans">{selectedEstate.name}</span>
                </div>
                <div className="flex justify-between text-[var(--muted-foreground)]">
                  <span>Unit Address:</span>
                  <span className="text-white font-sans">{unitNumber}</span>
                </div>
                <div className="flex justify-between text-[var(--muted-foreground)]">
                  <span>Meter Number:</span>
                  <span className="text-[var(--energy-green)]">{meterNumber}</span>
                </div>
                <div className="flex justify-between text-[var(--muted-foreground)]">
                  <span>Tariff Applied:</span>
                  <span className="text-white">₦{adminIppTariff} / kWh</span>
                </div>
                <div className="flex justify-between text-[var(--muted-foreground)]">
                  <span>Amount Paid:</span>
                  <span className="text-white font-bold">{formatNaira(vendingResult.amountPaid)}</span>
                </div>
                <div className="flex justify-between text-[var(--muted-foreground)]">
                  <span>Units Credited:</span>
                  <span className="text-[var(--energy-green)] font-bold">+{vendingResult.kwhCredited} kWh</span>
                </div>
                <div className="flex justify-between text-[var(--muted-foreground)] pt-1 border-t border-white/5">
                  <span>Updated CIU Balance:</span>
                  <span className="text-white font-bold">{vendingResult.newBalanceKwh} kWh</span>
                </div>
              </div>

              {/* CIU Instructions */}
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-[11px] text-[var(--muted-foreground)] space-y-1">
                <strong className="text-white block">Keypad Instructions:</strong>
                <p>1. Ensure your in-home CIU keypad display is powered on.</p>
                <p>2. Punch in the 20 digits above and press the blue <strong className="text-[var(--energy-green)]">ENTER (↵)</strong> button.</p>
                <p>3. The meter will beep twice and display <strong className="text-[var(--energy-green)]">ACCEPT</strong> with your new credit.</p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => toast.success("Receipt printed to PDF.")}
                  className="flex-1 py-2.5 rounded-xl glass-panel border border-white/15 text-xs text-[var(--electric)] font-bold flex items-center justify-center gap-1.5 cursor-pointer hover:bg-white/10"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={() => setVendingResult(null)}
                  className="py-2.5 px-4 rounded-xl glass-panel border border-white/15 text-xs text-[var(--muted-foreground)] hover:text-white cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-3xl glass-card border border-white/10 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-white/5 text-[var(--energy-green)] mx-auto flex items-center justify-center">
                <Receipt className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-bold text-base text-[var(--electric)]">
                  Ready to Vend Electricity Token
                </h4>
                <p className="text-xs text-[var(--muted-foreground)] max-w-xs mx-auto mt-1">
                  Choose your estate, confirm the meter number, and click the button to simulate the resident STS token vending workflow.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-[10px] font-mono text-[var(--muted-foreground)] text-left space-y-1">
                <div className="flex items-center gap-1 text-[var(--energy-green)] font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>STS Association Compliant (IEC 62055-41)</span>
                </div>
                <p>Encrypted transfer key ensures tokens can only be accepted by the target estate split-meter.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
