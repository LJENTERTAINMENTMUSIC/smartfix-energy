import React, { useState } from "react";
import {
  Activity,
  Zap,
  Gauge,
  Cpu,
  Flame,
  Sun,
  BatteryCharging,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Radio,
  Wifi,
  Server,
  Building,
  Volume2,
  RefreshCw,
} from "lucide-react";

export default function EstateSCADAPreview() {
  const [activeEstate, setActiveEstate] = useState<string>("Palm Gardens Estate (Lekki Phase 1)");

  return (
    <div className="w-full glass-card p-6 md:p-8 rounded-3xl border border-white/10 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--energy-green)]/15 text-[var(--energy-green)] text-xs font-semibold uppercase tracking-wider mb-2">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            LIVE SCADA &amp; IOT TELEMETRY
          </div>
          <h3 className="font-display font-bold text-xl sm:text-2xl text-[var(--electric)]">
            Estate Central Power Command Center
          </h3>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
            24/7 autonomous frequency, phase voltage, gas pressure, and STS meter monitoring.
          </p>
        </div>

        {/* Estate Selector Pill */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--muted-foreground)] hidden sm:inline">Active Estate:</span>
          <select
            value={activeEstate}
            onChange={(e) => setActiveEstate(e.target.value)}
            className="rounded-xl bg-black/40 border border-white/15 px-3 py-1.5 text-xs text-[var(--energy-green)] font-semibold focus:outline-none"
          >
            <option value="Palm Gardens Estate (Lekki Phase 1)">Palm Gardens Estate (Lekki) — 1.2MW</option>
            <option value="Victoria Bay Luxury Crest (Ikoyi)">Victoria Bay Crest (Ikoyi) — 800kVA</option>
            <option value="Guzape Diplomatic Hilltop (Abuja)">Guzape Hilltop (Abuja) — 1.5MW</option>
          </select>
        </div>
      </div>

      {/* Primary SCADA KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Frequency */}
        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
          <span className="text-[10px] uppercase font-mono text-[var(--muted-foreground)] block">
            Grid Frequency
          </span>
          <div className="text-xl font-bold font-mono text-[var(--energy-green)] flex items-baseline gap-1">
            50.02 <span className="text-xs text-[var(--muted-foreground)] font-normal">Hz</span>
          </div>
          <span className="text-[10px] text-[var(--energy-green)] block">±0.05% Rock-solid</span>
        </div>

        {/* 3-Phase Voltage */}
        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
          <span className="text-[10px] uppercase font-mono text-[var(--muted-foreground)] block">
            Phase Voltages
          </span>
          <div className="text-base font-bold font-mono text-[var(--electric)]">
            230V / 400V
          </div>
          <span className="text-[10px] text-[var(--muted-foreground)] font-mono block">L1: 230.4 | L2: 230.1 | L3: 230.8</span>
        </div>

        {/* Total Microgrid Load */}
        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
          <span className="text-[10px] uppercase font-mono text-[var(--muted-foreground)] block">
            Active Estate Demand
          </span>
          <div className="text-xl font-bold font-mono text-[var(--cng-blue)] flex items-baseline gap-1">
            642 <span className="text-xs text-[var(--muted-foreground)] font-normal">kW</span>
          </div>
          <span className="text-[10px] text-[var(--muted-foreground)] block">72.4% of Plant Capacity</span>
        </div>

        {/* Gas Skid Pressure */}
        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
          <span className="text-[10px] uppercase font-mono text-[var(--muted-foreground)] block">
            CNG Skid Pressure
          </span>
          <div className="text-xl font-bold font-mono text-amber-400 flex items-baseline gap-1">
            182 <span className="text-xs text-[var(--muted-foreground)] font-normal">bar</span>
          </div>
          <span className="text-[10px] text-amber-400/80 block">Reserve Skid: 215 bar</span>
        </div>

        {/* Acoustic Level */}
        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
          <span className="text-[10px] uppercase font-mono text-[var(--muted-foreground)] block">
            Acoustic Boundary
          </span>
          <div className="text-xl font-bold font-mono text-purple-300 flex items-baseline gap-1">
            54.2 <span className="text-xs text-[var(--muted-foreground)] font-normal">dBA</span>
          </div>
          <span className="text-[10px] text-purple-300/80 block">&lt;60 dBA Statutory Limit</span>
        </div>

        {/* Continuous Uptime Streak */}
        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
          <span className="text-[10px] uppercase font-mono text-[var(--muted-foreground)] block">
            Zero-Outage Streak
          </span>
          <div className="text-xl font-bold font-mono text-white flex items-baseline gap-1">
            418 <span className="text-xs text-[var(--muted-foreground)] font-normal">Days</span>
          </div>
          <span className="text-[10px] text-[var(--energy-green)] block">100% SLA Compliant</span>
        </div>
      </div>

      {/* Generation Flow & Source Mix */}
      <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-[var(--electric)] flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-[var(--energy-green)]" />
            Live Estate Generation Mix: 642 kW Total Supply
          </span>
          <span className="font-mono text-[var(--muted-foreground)]">Autonomous Synchronization</span>
        </div>

        {/* Stacked generation bar */}
        <div className="w-full h-4 rounded-full bg-white/10 overflow-hidden flex">
          {/* Gas Baseload: 65% */}
          <div
            className="h-full bg-gradient-to-r from-[var(--cng-blue)] to-blue-500 relative group cursor-pointer"
            style={{ width: "65%" }}
            title="Gas Generation: 420 kW (65.4%)"
          />
          {/* Solar PV: 35% */}
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 relative group cursor-pointer"
            style={{ width: "35%" }}
            title="Solar PV: 222 kW (34.6%)"
          />
        </div>

        {/* Legend */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-black/30 border border-white/5">
            <Flame className="w-4 h-4 text-[var(--cng-blue)]" />
            <div>
              <span className="text-[11px] text-[var(--muted-foreground)] block">Gas Engine Baseload</span>
              <strong className="text-white font-mono">420 kW (65.4%)</strong>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-black/30 border border-white/5">
            <Sun className="w-4 h-4 text-amber-300" />
            <div>
              <span className="text-[11px] text-[var(--muted-foreground)] block">Solar PV Daytime Array</span>
              <strong className="text-white font-mono">222 kW (34.6%)</strong>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-black/30 border border-white/5">
            <BatteryCharging className="w-4 h-4 text-purple-300" />
            <div>
              <span className="text-[11px] text-[var(--muted-foreground)] block">BESS Battery Reserve</span>
              <strong className="text-white font-mono">94% SOC (Spinning Reserve)</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Telemetry: Smart Meter Fleet & Distribution Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="p-4 rounded-2xl bg-black/30 border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--energy-green)]/15 text-[var(--energy-green)] flex items-center justify-center">
              <Wifi className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-[var(--electric)] block">STS Smart Split-Meters</span>
              <span className="text-[11px] text-[var(--muted-foreground)]">
                240 of 240 Units Connected (100%)
              </span>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-[var(--energy-green)] px-2.5 py-1 rounded-lg bg-[var(--energy-green)]/10 border border-[var(--energy-green)]/20">
            0 Tamper Alerts
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-black/30 border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--cng-blue)]/15 text-[var(--cng-blue)] flex items-center justify-center">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-[var(--electric)] block">Automated Gas Decompression Skid</span>
              <span className="text-[11px] text-[var(--muted-foreground)]">
                Dual 200-bar Manifold · Active Line #1
              </span>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-[var(--cng-blue)] px-2.5 py-1 rounded-lg bg-[var(--cng-blue)]/10 border border-[var(--cng-blue)]/20">
            Scheduled: 3.4 Days Remaining
          </span>
        </div>
      </div>
    </div>
  );
}
