/**
 * SMARTFIX ENERGY OS — ADMIN-CONTROLLED PRICING STORE
 *
 * Single source of truth for ALL prices across the platform.
 * Admin sets prices → persisted to Supabase → every consumer reads live values.
 * Fallback: localStorage when Supabase is unavailable.
 *
 * Consumers:
 *   - OrderFuelModal (customer portal fuel ordering)
 *   - Knowledge Engine (AI copilot price responses)
 *   - Public pages (fuel page, CNG page, quote forms)
 *   - Admin dashboard (pricing overview)
 */

import { useSyncExternalStore } from "react";
import { supabase } from "./supabaseClient";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type PriceCategory =
  | "FUEL"
  | "CNG_CONVERSION"
  | "GENERATOR_CONVERSION"
  | "SERVICE"
  | "PARTS"
  | "SOLAR"
  | "FLEET"
  | "LOGISTICS"
  | "CUSTOM";

export type PriceUnit =
  | "Litre"
  | "SCM"
  | "kVA"
  | "kWp"
  | "Unit"
  | "Vehicle"
  | "Hour"
  | "Visit"
  | "Project"
  | "Month"
  | "Flat";

export interface PriceItem {
  id: string;
  name: string;
  description: string;
  category: PriceCategory;
  basePrice: number;
  unit: PriceUnit;
  minQuantity?: number;
  bulkDiscountPercent?: number;
  bulkThreshold?: number;
  isActive: boolean;
  effectiveDate: string;
  expiryDate?: string;
  lastUpdatedBy: string;
  lastUpdatedAt: string;
  notes?: string;
  /** Internal reference code for quick lookups */
  code: string;
}

export interface PriceChange {
  id: string;
  priceItemId: string;
  priceItemName: string;
  previousPrice: number;
  newPrice: number;
  changedBy: string;
  changedAt: string;
  reason: string;
}

/* ------------------------------------------------------------------ */
/*  Well-Known Price Codes                                             */
/* ------------------------------------------------------------------ */

/** These codes are used throughout the platform for programmatic lookups */
export const PRICE_CODES = {
  AGO_DIESEL_PER_LITRE: "AGO_DIESEL_PER_LITRE",
  CNG_PER_SCM: "CNG_PER_SCM",
  CNG_VEHICLE_CONVERSION_BASE: "CNG_VEHICLE_CONVERSION_BASE",
  GENERATOR_DUALFUEL_CONVERSION: "GENERATOR_DUALFUEL_CONVERSION",
  CNG_DIAGNOSTICS: "CNG_DIAGNOSTICS",
  CNG_SERVICING: "CNG_SERVICING",
  GENERATOR_MAINTENANCE_VISIT: "GENERATOR_MAINTENANCE_VISIT",
  SOLAR_PV_PER_KWP: "SOLAR_PV_PER_KWP",
  FLEET_ASSESSMENT_FEE: "FLEET_ASSESSMENT_FEE",
  EMERGENCY_CALLOUT: "EMERGENCY_CALLOUT",
  EXPRESS_DELIVERY_SURCHARGE: "EXPRESS_DELIVERY_SURCHARGE",
} as const;

/* ------------------------------------------------------------------ */
/*  Default Seed Prices (used as initial values)                       */
/* ------------------------------------------------------------------ */

const SEED_PRICES: PriceItem[] = [
  // FUEL
  {
    id: "PRC-FUEL-001",
    code: PRICE_CODES.AGO_DIESEL_PER_LITRE,
    name: "Certified AGO Diesel (Per Litre)",
    description: "Standard certified Automotive Gas Oil — metered delivery included, quality certification & tamper-evident seal.",
    category: "FUEL",
    basePrice: 1250,
    unit: "Litre",
    minQuantity: 2500,
    bulkDiscountPercent: 2,
    bulkThreshold: 10000,
    isActive: true,
    effectiveDate: "2026-03-01",
    lastUpdatedBy: "Admin (System Seed)",
    lastUpdatedAt: new Date().toISOString(),
    notes: "Price inclusive of logistics. Bulk discount applies for 10,000L+.",
  },
  {
    id: "PRC-FUEL-002",
    code: PRICE_CODES.CNG_PER_SCM,
    name: "Virtual Pipeline CNG (Per SCM)",
    description: "200-bar mobile skid trailer delivery — Standard Cubic Metre rate with digital metering.",
    category: "FUEL",
    basePrice: 1150,
    unit: "SCM",
    minQuantity: 1000,
    bulkDiscountPercent: 3,
    bulkThreshold: 5000,
    isActive: true,
    effectiveDate: "2026-03-01",
    lastUpdatedBy: "Admin (System Seed)",
    lastUpdatedAt: new Date().toISOString(),
    notes: "Price inclusive of mobile skid delivery and gas quality certificate.",
  },

  // CNG CONVERSION
  {
    id: "PRC-CNG-001",
    code: PRICE_CODES.CNG_VEHICLE_CONVERSION_BASE,
    name: "Vehicle CNG Conversion (Base Price)",
    description: "Petrol-to-CNG dual-fuel or dedicated CNG conversion — includes kit, installation, calibration & pressure test.",
    category: "CNG_CONVERSION",
    basePrice: 850000,
    unit: "Vehicle",
    isActive: true,
    effectiveDate: "2026-01-01",
    lastUpdatedBy: "Admin (System Seed)",
    lastUpdatedAt: new Date().toISOString(),
    notes: "Final price varies by engine size and configuration. Includes 24-month warranty.",
  },

  // GENERATOR CONVERSION
  {
    id: "PRC-GEN-001",
    code: PRICE_CODES.GENERATOR_DUALFUEL_CONVERSION,
    name: "Generator Dual-Fuel CNG Conversion (Per kVA)",
    description: "Complete diesel-to-dual-fuel gas conversion system — ECU, gas train, regulators, calibration & commissioning.",
    category: "GENERATOR_CONVERSION",
    basePrice: 35000,
    unit: "kVA",
    isActive: true,
    effectiveDate: "2026-01-01",
    lastUpdatedBy: "Admin (System Seed)",
    lastUpdatedAt: new Date().toISOString(),
    notes: "Guide price. Final quote issued after engineering assessment.",
  },

  // SERVICE
  {
    id: "PRC-SVC-001",
    code: PRICE_CODES.CNG_DIAGNOSTICS,
    name: "CNG System Diagnostics",
    description: "Comprehensive CNG system scan, pressure test & safety audit report.",
    category: "SERVICE",
    basePrice: 75000,
    unit: "Visit",
    isActive: true,
    effectiveDate: "2026-01-01",
    lastUpdatedBy: "Admin (System Seed)",
    lastUpdatedAt: new Date().toISOString(),
  },
  {
    id: "PRC-SVC-002",
    code: PRICE_CODES.CNG_SERVICING,
    name: "CNG Scheduled Servicing & Maintenance",
    description: "Periodic filter change, regulator check, injector calibration, pressure integrity test.",
    category: "SERVICE",
    basePrice: 120000,
    unit: "Visit",
    isActive: true,
    effectiveDate: "2026-01-01",
    lastUpdatedBy: "Admin (System Seed)",
    lastUpdatedAt: new Date().toISOString(),
  },
  {
    id: "PRC-SVC-003",
    code: PRICE_CODES.GENERATOR_MAINTENANCE_VISIT,
    name: "Generator Preventive Maintenance Visit",
    description: "Scheduled oil & filter change, coolant check, load test, EGT sensor verification.",
    category: "SERVICE",
    basePrice: 185000,
    unit: "Visit",
    isActive: true,
    effectiveDate: "2026-01-01",
    lastUpdatedBy: "Admin (System Seed)",
    lastUpdatedAt: new Date().toISOString(),
  },

  // SOLAR
  {
    id: "PRC-SOL-001",
    code: PRICE_CODES.SOLAR_PV_PER_KWP,
    name: "Commercial Solar PV Installation (Per kWp)",
    description: "Tier-1 monocrystalline panels, mounting, inverter, wiring & commissioning.",
    category: "SOLAR",
    basePrice: 550000,
    unit: "kWp",
    isActive: true,
    effectiveDate: "2026-01-01",
    lastUpdatedBy: "Admin (System Seed)",
    lastUpdatedAt: new Date().toISOString(),
    notes: "Battery storage quoted separately.",
  },

  // FLEET
  {
    id: "PRC-FLT-001",
    code: PRICE_CODES.FLEET_ASSESSMENT_FEE,
    name: "Fleet Energy Assessment",
    description: "Comprehensive fleet audit — fuel consumption analysis, CNG feasibility, ROI projection.",
    category: "FLEET",
    basePrice: 250000,
    unit: "Flat",
    isActive: true,
    effectiveDate: "2026-01-01",
    lastUpdatedBy: "Admin (System Seed)",
    lastUpdatedAt: new Date().toISOString(),
    notes: "Fee waived for fleet conversion contracts above 20 vehicles.",
  },

  // LOGISTICS
  {
    id: "PRC-LOG-001",
    code: PRICE_CODES.EMERGENCY_CALLOUT,
    name: "Emergency Callout (Critical / After-Hours)",
    description: "24/7 emergency dispatch — certified technician within 2 hours.",
    category: "LOGISTICS",
    basePrice: 95000,
    unit: "Visit",
    isActive: true,
    effectiveDate: "2026-01-01",
    lastUpdatedBy: "Admin (System Seed)",
    lastUpdatedAt: new Date().toISOString(),
  },
  {
    id: "PRC-LOG-002",
    code: PRICE_CODES.EXPRESS_DELIVERY_SURCHARGE,
    name: "Express Fuel Delivery Surcharge (4-Hour Dispatch)",
    description: "Priority dispatch surcharge for same-day fuel delivery within 4 hours.",
    category: "LOGISTICS",
    basePrice: 50000,
    unit: "Flat",
    isActive: true,
    effectiveDate: "2026-01-01",
    lastUpdatedBy: "Admin (System Seed)",
    lastUpdatedAt: new Date().toISOString(),
  },
];

/* ------------------------------------------------------------------ */
/*  Store (SyncExternalStore pattern)                                  */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = "smartfix_admin_prices";
const CHANGE_LOG_KEY = "smartfix_price_changelog";

interface PricingState {
  prices: PriceItem[];
  changeLog: PriceChange[];
  loading: boolean;
  lastSynced: string | null;
}

let state: PricingState = {
  prices: [],
  changeLog: [],
  loading: true,
  lastSynced: null,
};

const listeners = new Set<() => void>();

function commit(next: PricingState) {
  state = next;
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

/* ------------------------------------------------------------------ */
/*  Persistence (localStorage + Supabase)                              */
/* ------------------------------------------------------------------ */

function loadFromLocalStorage(): { prices: PriceItem[]; changeLog: PriceChange[] } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const logRaw = localStorage.getItem(CHANGE_LOG_KEY);
    return {
      prices: raw ? JSON.parse(raw) : SEED_PRICES,
      changeLog: logRaw ? JSON.parse(logRaw) : [],
    };
  } catch {
    return { prices: SEED_PRICES, changeLog: [] };
  }
}

function saveToLocalStorage(prices: PriceItem[], changeLog: PriceChange[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prices));
    localStorage.setItem(CHANGE_LOG_KEY, JSON.stringify(changeLog));
  } catch {}
}

async function syncToSupabase(prices: PriceItem[]) {
  if (!supabase) return;
  try {
    // Upsert prices to a "pricing" table if it exists
    await supabase.from("pricing").upsert(
      prices.map((p) => ({
        id: p.id,
        code: p.code,
        name: p.name,
        description: p.description,
        category: p.category,
        base_price: p.basePrice,
        unit: p.unit,
        min_quantity: p.minQuantity ?? null,
        bulk_discount_percent: p.bulkDiscountPercent ?? null,
        bulk_threshold: p.bulkThreshold ?? null,
        is_active: p.isActive,
        effective_date: p.effectiveDate,
        expiry_date: p.expiryDate ?? null,
        last_updated_by: p.lastUpdatedBy,
        last_updated_at: p.lastUpdatedAt,
        notes: p.notes ?? null,
      })),
      { onConflict: "id" }
    );
  } catch {
    // Supabase sync is best-effort; localStorage is the fallback
  }
}

/* ------------------------------------------------------------------ */
/*  Initialization                                                     */
/* ------------------------------------------------------------------ */

function initPricingStore() {
  const { prices, changeLog } = loadFromLocalStorage();
  commit({
    prices,
    changeLog,
    loading: false,
    lastSynced: new Date().toISOString(),
  });
}

// Fire init immediately
initPricingStore();

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

export const pricingStore = {
  subscribe,
  getSnapshot,
  refresh: initPricingStore,

  /** Get all price items */
  getAllPrices(): PriceItem[] {
    return state.prices;
  },

  /** Get a single price by its well-known code */
  getByCode(code: string): PriceItem | undefined {
    return state.prices.find((p) => p.code === code && p.isActive);
  },

  /** Get price value by code (returns the numeric price or 0) */
  getPriceValue(code: string): number {
    return this.getByCode(code)?.basePrice ?? 0;
  },

  /** Get prices by category */
  getByCategory(category: PriceCategory): PriceItem[] {
    return state.prices.filter((p) => p.category === category && p.isActive);
  },

  /** Update a price (admin action) */
  updatePrice(id: string, patch: Partial<PriceItem>, updatedBy: string, reason: string) {
    const existing = state.prices.find((p) => p.id === id);
    if (!existing) return;

    // Record change log if price changed
    const changeLog = [...state.changeLog];
    if (patch.basePrice !== undefined && patch.basePrice !== existing.basePrice) {
      changeLog.unshift({
        id: `CHG-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        priceItemId: id,
        priceItemName: existing.name,
        previousPrice: existing.basePrice,
        newPrice: patch.basePrice,
        changedBy: updatedBy,
        changedAt: new Date().toISOString(),
        reason,
      });
    }

    const updatedPrices = state.prices.map((p) =>
      p.id === id
        ? {
            ...p,
            ...patch,
            lastUpdatedBy: updatedBy,
            lastUpdatedAt: new Date().toISOString(),
          }
        : p
    );

    commit({
      ...state,
      prices: updatedPrices,
      changeLog,
      lastSynced: new Date().toISOString(),
    });

    saveToLocalStorage(updatedPrices, changeLog);
    syncToSupabase(updatedPrices);
  },

  /** Add a new custom price item */
  addPrice(item: Omit<PriceItem, "id" | "lastUpdatedAt">) {
    const newItem: PriceItem = {
      ...item,
      id: `PRC-CUSTOM-${Date.now().toString(36).toUpperCase()}`,
      lastUpdatedAt: new Date().toISOString(),
    };

    const updatedPrices = [newItem, ...state.prices];
    commit({ ...state, prices: updatedPrices, lastSynced: new Date().toISOString() });
    saveToLocalStorage(updatedPrices, state.changeLog);
    syncToSupabase(updatedPrices);
    return newItem;
  },

  /** Toggle price active/inactive */
  toggleActive(id: string, updatedBy: string) {
    const item = state.prices.find((p) => p.id === id);
    if (!item) return;
    this.updatePrice(id, { isActive: !item.isActive }, updatedBy, item.isActive ? "Deactivated" : "Reactivated");
  },

  /** Delete a price item */
  deletePrice(id: string) {
    const updatedPrices = state.prices.filter((p) => p.id !== id);
    commit({ ...state, prices: updatedPrices, lastSynced: new Date().toISOString() });
    saveToLocalStorage(updatedPrices, state.changeLog);
    syncToSupabase(updatedPrices);
  },

  /** Get change log */
  getChangeLog(): PriceChange[] {
    return state.changeLog;
  },

  /** Reset to seed prices */
  resetToDefaults() {
    commit({
      prices: [...SEED_PRICES],
      changeLog: [],
      loading: false,
      lastSynced: new Date().toISOString(),
    });
    saveToLocalStorage(SEED_PRICES, []);
    syncToSupabase(SEED_PRICES);
  },
};

/* ------------------------------------------------------------------ */
/*  React Hook                                                         */
/* ------------------------------------------------------------------ */

export function usePricing(): PricingState {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/* ------------------------------------------------------------------ */
/*  Helper: Format price with unit                                     */
/* ------------------------------------------------------------------ */

export function formatPriceWithUnit(item: PriceItem): string {
  const price = "₦" + item.basePrice.toLocaleString("en-NG");
  return `${price} / ${item.unit}`;
}

export function formatPriceCategory(cat: PriceCategory): string {
  const map: Record<PriceCategory, string> = {
    FUEL: "⛽ Fuel Supply",
    CNG_CONVERSION: "🚗 CNG Conversion",
    GENERATOR_CONVERSION: "⚡ Generator Conversion",
    SERVICE: "🔧 Service & Maintenance",
    PARTS: "🔩 Parts & Components",
    SOLAR: "☀️ Solar & Renewables",
    FLEET: "🚛 Fleet Services",
    LOGISTICS: "🚚 Logistics & Delivery",
    CUSTOM: "📋 Custom",
  };
  return map[cat] || cat;
}
