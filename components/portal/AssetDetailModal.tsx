import React from "react";
import {
  X,
  Cpu,
  ShieldCheck,
  Clock,
  Calendar,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Download,
  Flame,
  Zap,
  MapPin,
} from "lucide-react";
import { type CustomerAsset } from "@/lib/portalData";
import { toast } from "sonner";

interface AssetDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: CustomerAsset | null;
  onRequestService: (assetId: string) => void;
}

export default function AssetDetailModal({
  isOpen,
  onClose,
  asset,
  onRequestService,
}: AssetDetailModalProps) {
  if (!isOpen || !asset) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0e1013] border border-white/10 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-[#14161b]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--energy-green)]/15 text-[var(--energy-green)] border border-[var(--energy-green)]/30 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[var(--energy-green)] px-2 py-0.5 rounded bg-[var(--energy-green)]/10">
                  {asset.id}
                </span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                  asset.status === "Operational"
                    ? "bg-[var(--energy-green)]/15 text-[var(--energy-green)]"
                    : "bg-amber-400/15 text-amber-400"
                }`}>
                  {asset.status}
                </span>
              </div>
              <h3 className="font-display font-bold text-base sm:text-lg text-[var(--electric)] mt-0.5">
                {asset.name}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full glass-panel flex items-center justify-center text-[var(--muted-foreground)] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-2xl glass-card border border-white/5">
              <span className="text-[11px] text-[var(--muted-foreground)] block">Capacity / Rating</span>
              <span className="text-sm font-bold text-[var(--electric)] font-mono">{asset.capacity}</span>
            </div>
            <div className="p-3 rounded-2xl glass-card border border-white/5">
              <span className="text-[11px] text-[var(--muted-foreground)] block">Runtime Hours</span>
              <span className="text-sm font-bold text-[var(--energy-green)] font-mono">{asset.runningHours.toLocaleString()} hrs</span>
            </div>
            <div className="p-3 rounded-2xl glass-card border border-white/5">
              <span className="text-[11px] text-[var(--muted-foreground)] block">Warranty Status</span>
              <span className="text-sm font-bold text-[var(--cng-blue)]">{asset.warrantyStatus}</span>
            </div>
            <div className="p-3 rounded-2xl glass-card border border-white/5">
              <span className="text-[11px] text-[var(--muted-foreground)] block">Care SLA Plan</span>
              <span className="text-sm font-bold text-[#ff9f0a] truncate block">{asset.servicePlan}</span>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="p-4 rounded-2xl glass-card border border-white/10 space-y-2.5 text-xs">
            <h4 className="font-bold text-[var(--electric)] uppercase tracking-wider text-xs border-b border-white/5 pb-2">
              Engineering Specifications
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-[var(--muted-foreground)]">Manufacturer:</span>
                <span className="font-semibold text-white">{asset.manufacturer}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-[var(--muted-foreground)]">Model / Variant:</span>
                <span className="font-mono text-white">{asset.model}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-[var(--muted-foreground)]">Serial Number:</span>
                <span className="font-mono text-[var(--energy-green)]">{asset.serialNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-[var(--muted-foreground)]">Carrier / Fuel Type:</span>
                <span className="font-semibold text-[var(--cng-blue)]">{asset.fuelType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-[var(--muted-foreground)]">Installation Site:</span>
                <span className="font-semibold text-white truncate max-w-[200px]">{asset.location}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-[var(--muted-foreground)]">Commissioning Date:</span>
                <span className="font-mono text-white">{asset.installationDate}</span>
              </div>
            </div>
          </div>

          {/* Maintenance & Warranty Timelines */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl glass-card border border-white/10 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider">
                <Calendar className="w-4 h-4" /> Maintenance Cycle
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-[var(--muted-foreground)]">Last Serviced:</span>
                <span className="font-mono text-white">{asset.lastServiceDate}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[var(--muted-foreground)]">Next Service Due:</span>
                <span className="font-mono font-bold text-amber-400">{asset.nextServiceDate}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl glass-card border border-white/10 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-[var(--cng-blue)] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" /> Factory Warranty
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-[var(--muted-foreground)]">Expiry Date:</span>
                <span className="font-mono text-white">{asset.warrantyExpiry}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[var(--muted-foreground)]">Coverage Tier:</span>
                <span className="font-bold text-[var(--energy-green)]">100% Comprehensive Parts &amp; Labour</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onRequestService(asset.id);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[var(--energy-green)] text-[var(--obsidian)] font-bold text-xs sm:text-sm btn-magnetic glow-green cursor-pointer"
            >
              <Wrench className="w-4 h-4" />
              Request Service / Report Issue
            </button>
            <button
              type="button"
              onClick={() => toast.success(`SmartFix Digital Asset Passport for ${asset.id} downloaded!`)}
              className="px-5 py-3.5 rounded-xl glass-panel text-xs sm:text-sm font-semibold text-[var(--electric)] hover:text-white inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Download Asset Passport
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
