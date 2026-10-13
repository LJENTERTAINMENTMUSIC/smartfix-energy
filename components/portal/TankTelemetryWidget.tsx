import React, { useState } from "react";
import {
  Fuel,
  Flame,
  AlertTriangle,
  Radio,
  Clock,
  Sparkles,
  ChevronRight,
  TrendingDown,
  Truck,
  CheckCircle2,
  RefreshCw,
  Gauge,
  Thermometer,
} from "lucide-react";
import { formatNaira } from "@/lib/catalog";
import { pricingStore, PRICE_CODES } from "@/lib/pricingStore";

export interface IoTTelemetryTank {
  id: string;
  name: string;
  siteName: string;
  fuelType: "Diesel (AGO)" | "Virtual Pipeline CNG";
  capacity: number; // in Litres or SCM
  currentLevel: number; // in Litres or SCM
  unit: "Litres" | "SCM";
  burnRatePerHour: number;
  temperatureC: number;
  pressureBar?: number; // for CNG
  sensorType: string;
  signalStrength: number; // %
  lastSyncTime: string;
}

const INITIAL_TANKS: IoTTelemetryTank[] = [
  {
    id: "TNK-AGO-01",
    name: "Primary AGO Underground Storage Tank",
    siteName: "Main Studio & Production Complex (Victoria Island)",
    fuelType: "Diesel (AGO)",
    capacity: 20000,
    currentLevel: 3850, // 19.25% -> LOW FUEL TRIGGER
    unit: "Litres",
    burnRatePerHour: 72,
    temperatureC: 28.5,
    sensorType: "Ultrasonic Dual-Echo Level Sensor",
    signalStrength: 98,
    lastSyncTime: "3 mins ago",
  },
  {
    id: "TNK-CNG-02",
    name: "200-Bar Virtual Pipeline Cascade Skid",
    siteName: "Main Studio & Production Complex (Victoria Island)",
    fuelType: "Virtual Pipeline CNG",
    capacity: 3500,
    currentLevel: 2750, // 78.5% -> HEALTHY
    unit: "SCM",
    burnRatePerHour: 55,
    temperatureC: 24.1,
    pressureBar: 182,
    sensorType: "Smart Pressure Transducer & Digital Manifold",
    signalStrength: 94,
    lastSyncTime: "1 min ago",
  },
  {
    id: "TNK-AGO-03",
    name: "Auxiliary Generator Day Tank",
    siteName: "Ikeja Logistics & Cold Storage Hub",
    fuelType: "Diesel (AGO)",
    capacity: 5000,
    currentLevel: 4100, // 82% -> HEALTHY
    unit: "Litres",
    burnRatePerHour: 38,
    temperatureC: 29.2,
    sensorType: "Magnetostrictive Continuous Level Probe",
    signalStrength: 96,
    lastSyncTime: "Just now",
  },
];

interface TankTelemetryWidgetProps {
  onQuickReorder: (tank: IoTTelemetryTank, recommendedVolume: number) => void;
}

export default function TankTelemetryWidget({ onQuickReorder }: TankTelemetryWidgetProps) {
  const [tanks, setTanks] = useState<IoTTelemetryTank[]>(INITIAL_TANKS);
  const [refreshing, setRefreshing] = useState(false);

  // Live admin prices
  const dieselPrice = pricingStore.getPriceValue(PRICE_CODES.AGO_DIESEL_PER_LITRE) || 1250;
  const cngPrice = pricingStore.getPriceValue(PRICE_CODES.CNG_PER_SCM) || 1150;

  // Identify critical tanks (< 25% capacity)
  const criticalTanks = tanks.filter((t) => (t.currentLevel / t.capacity) < 0.25);

  const handleSimulateRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setTanks((prev) =>
        prev.map((t) => ({
          ...t,
          lastSyncTime: "Just now",
          signalStrength: Math.min(100, Math.max(90, Math.floor(Math.random() * 10) + 90)),
        }))
      );
      setRefreshing(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Telemetry Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--energy-green)] animate-ping" />
            <h3 className="font-display font-bold text-lg text-[var(--electric)] flex items-center gap-2">
              <Radio className="w-4 h-4 text-[var(--energy-green)]" /> Live Smart Tank IoT Telemetry
            </h3>
          </div>
          <p className="text-xs text-[var(--muted-foreground)]">
            Continuous ultrasonic level monitoring, telemetry burn rates & automated replenishment triggers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel text-[11px] font-mono text-[var(--muted-foreground)]">
            <span className="w-2 h-2 rounded-full bg-[var(--energy-green)]" />
            LoRaWAN Cellular Gateway · 98% Link
          </div>
          <button
            onClick={handleSimulateRefresh}
            className="w-8 h-8 rounded-full glass-panel flex items-center justify-center text-[var(--muted-foreground)] hover:text-white transition-colors"
            title="Refresh Telemetry"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-[var(--energy-green)]" : ""}`} />
          </button>
        </div>
      </div>

      {/* Critical Low-Fuel Banner if any tank < 25% */}
      {criticalTanks.length > 0 && (
        <div className="p-5 rounded-2xl glass-card border border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                    AUTOMATED LOW-FUEL ALERT
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                    ACTION REQUIRED
                  </span>
                </div>
                <h4 className="font-display font-bold text-sm text-[var(--electric)] mt-0.5">
                  {criticalTanks[0].name} is at {Math.round((criticalTanks[0].currentLevel / criticalTanks[0].capacity) * 100)}% ({criticalTanks[0].currentLevel.toLocaleString()} {criticalTanks[0].unit})
                </h4>
                <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                  At current electrical load ({criticalTanks[0].burnRatePerHour} L/hr), facility has approximately{" "}
                  <strong className="text-amber-300">
                    {Math.round(criticalTanks[0].currentLevel / criticalTanks[0].burnRatePerHour)} hours
                  </strong>{" "}
                  of run-time remaining.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => onQuickReorder(criticalTanks[0], 10000)}
                className="btn-magnetic px-5 py-2.5 rounded-xl bg-amber-400 text-black font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20"
              >
                <Truck className="w-3.5 h-3.5" /> 1-Click Auto-Reorder (10,000L AGO)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tank Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {tanks.map((tank) => {
          const percent = Math.round((tank.currentLevel / tank.capacity) * 100);
          const isCritical = percent < 25;
          const isWarning = percent >= 25 && percent < 45;
          const hoursLeft = Math.round(tank.currentLevel / tank.burnRatePerHour);
          const daysLeft = (hoursLeft / 24).toFixed(1);
          const ullage = tank.capacity - tank.currentLevel;

          const levelColor = isCritical
            ? "#ff3b30"
            : isWarning
            ? "#ff9f0a"
            : "var(--energy-green)";

          return (
            <div
              key={tank.id}
              className={`glass-card p-6 rounded-3xl border transition-all flex flex-col justify-between ${
                isCritical
                  ? "border-red-500/40 bg-red-500/[0.03]"
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        tank.fuelType.includes("CNG")
                          ? "bg-[var(--cng-blue)]/15 text-[var(--cng-blue)]"
                          : "bg-[#ff9f0a]/15 text-[#ff9f0a]"
                      }`}
                    >
                      {tank.fuelType.includes("CNG") ? (
                        <Flame className="w-5 h-5" />
                      ) : (
                        <Fuel className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-[var(--electric)] line-clamp-1">
                        {tank.name}
                      </div>
                      <div className="text-[10px] text-[var(--muted-foreground)] line-clamp-1">
                        {tank.siteName}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      isCritical
                        ? "bg-red-500/20 text-red-400 animate-pulse"
                        : isWarning
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-[var(--energy-green)]/15 text-[var(--energy-green)]"
                    }`}
                  >
                    {isCritical ? "CRITICAL" : isWarning ? "MODERATE" : "HEALTHY"}
                  </span>
                </div>

                {/* Level Percentage & Gauge Display */}
                <div className="my-5 p-4 rounded-2xl glass-panel border border-white/5">
                  <div className="flex items-end justify-between mb-2">
                    <div>
                      <div className="text-[10px] font-mono uppercase text-[var(--muted-foreground)]">
                        CURRENT LEVEL
                      </div>
                      <div
                        className="font-display font-extrabold text-3xl"
                        style={{ color: levelColor }}
                      >
                        {percent}%
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-sm text-[var(--electric)]">
                        {tank.currentLevel.toLocaleString()}{" "}
                        <span className="text-[10px] font-normal text-[var(--muted-foreground)]">
                          / {tank.capacity.toLocaleString()} {tank.unit}
                        </span>
                      </div>
                      <div className="text-[10px] text-[var(--muted-foreground)]">
                        Ullage Space: {ullage.toLocaleString()} {tank.unit}
                      </div>
                    </div>
                  </div>

                  {/* Visual Bar */}
                  <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/10">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${percent}%`,
                        backgroundColor: levelColor,
                        boxShadow: `0 0 10px ${levelColor}40`,
                      }}
                    />
                  </div>
                </div>

                {/* Telemetry Metrics */}
                <div className="grid grid-cols-2 gap-2 text-[11px] mb-4">
                  <div className="p-2.5 rounded-xl glass-panel border border-white/5">
                    <div className="text-[10px] text-[var(--muted-foreground)] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[var(--cng-blue)]" /> Run-Time Left
                    </div>
                    <div className="font-mono font-bold text-[var(--electric)] mt-0.5">
                      ~{daysLeft} Days ({hoursLeft} hrs)
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl glass-panel border border-white/5">
                    <div className="text-[10px] text-[var(--muted-foreground)] flex items-center gap-1">
                      <Thermometer className="w-3 h-3 text-[#ff9f0a]" /> Temperature
                    </div>
                    <div className="font-mono font-bold text-[var(--electric)] mt-0.5">
                      {tank.temperatureC}°C {tank.pressureBar ? `· ${tank.pressureBar} bar` : ""}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Action */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-mono text-[var(--muted-foreground)]">
                  Synced: {tank.lastSyncTime}
                </span>

                <button
                  onClick={() =>
                    onQuickReorder(
                      tank,
                      tank.fuelType.includes("Diesel") ? Math.min(10000, ullage) : 2000
                    )
                  }
                  className="text-xs font-semibold text-[var(--energy-green)] hover:underline inline-flex items-center gap-1"
                >
                  Order Refill <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
