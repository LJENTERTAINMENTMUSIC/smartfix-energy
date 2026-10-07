import { useSyncExternalStore } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type Availability = "In Stock" | "Made to Order" | "Pre-Order";

export type Product = {
  id: string;
  name: string;
  category: string;
  capacity: string;
  fuel: string;
  application: string;
  availability: Availability;
  price: number | null; // NGN, null = request price
  stock: number;
  sold: number; // lifetime units sold (for sales stats)
  promo: boolean;
  promoLabel?: string;
  featured?: boolean; // show on billboard slider
  image?: string;
};

export type LeadStatus = "Hot" | "Qualified" | "Information";

export type Lead = {
  id: string;
  name: string;
  service: string;
  location: string;
  budget: string;
  value: number; // estimated deal value in NGN
  status: LeadStatus;
  date: string; // ISO
};

type Catalog = {
  products: Product[];
  leads: Lead[];
};

/* ------------------------------------------------------------------ */
/*  Categories                                                         */
/* ------------------------------------------------------------------ */

export const CATEGORIES = [
  "Diesel Generators",
  "Industrial Generators",
  "Prime Power",
  "Standby Generators",
  "Silent Generators",
  "Portable Generators",
  "CNG Generators",
  "Generator Parts",
  "ATS",
  "Control Panels",
  "Switchgear",
  "Accessories",
] as const;

/* ------------------------------------------------------------------ */
/*  Seed data                                                          */
/* ------------------------------------------------------------------ */

const uid = () => Math.random().toString(36).slice(2, 10);

const seedProducts: Product[] = [
  { id: uid(), name: "Perkins 100KVA Diesel Generator", category: "Diesel Generators", capacity: "100 KVA", fuel: "Diesel", application: "Industrial", availability: "In Stock", price: 9850000, stock: 6, sold: 14, promo: true, promoLabel: "Best Seller", featured: true },
  { id: uid(), name: "Cummins 250KVA Standby Generator", category: "Standby Generators", capacity: "250 KVA", fuel: "Diesel", application: "Standby Power", availability: "In Stock", price: 24500000, stock: 3, sold: 7, promo: false, featured: true },
  { id: uid(), name: "Silent 30KVA Generator", category: "Silent Generators", capacity: "30 KVA", fuel: "Diesel", application: "Commercial", availability: "In Stock", price: 4200000, stock: 11, sold: 22, promo: true, promoLabel: "10% Off", featured: false },
  { id: uid(), name: "Portable 5KVA Generator", category: "Portable Generators", capacity: "5 KVA", fuel: "Petrol", application: "Residential", availability: "In Stock", price: 685000, stock: 24, sold: 58, promo: false, featured: false },
  { id: uid(), name: "CNG 50KVA Generator", category: "CNG Generators", capacity: "50 KVA", fuel: "CNG", application: "Continuous Power", availability: "Made to Order", price: 8900000, stock: 0, sold: 5, promo: true, promoLabel: "Clean Energy", featured: true },
  { id: uid(), name: "Prime 500KVA Generator", category: "Prime Power", capacity: "500 KVA", fuel: "Diesel", application: "Prime Power", availability: "Made to Order", price: 46000000, stock: 0, sold: 3, promo: false, featured: true },
  { id: uid(), name: "ATS 100-400A Auto Transfer Switch", category: "ATS", capacity: "100-400A", fuel: "—", application: "Auto Transfer", availability: "In Stock", price: 1250000, stock: 15, sold: 19, promo: false, featured: false },
  { id: uid(), name: "Digital Control Panel", category: "Control Panels", capacity: "Various", fuel: "—", application: "Control & Monitoring", availability: "In Stock", price: 890000, stock: 20, sold: 12, promo: false, featured: false },
  { id: uid(), name: "Industrial 350KVA Generator", category: "Industrial Generators", capacity: "350 KVA", fuel: "Diesel", application: "Heavy Industrial", availability: "Pre-Order", price: 33500000, stock: 2, sold: 4, promo: false, featured: false },
  { id: uid(), name: "Soundproof Canopy Kit", category: "Accessories", capacity: "Various", fuel: "—", application: "Noise Reduction", availability: "In Stock", price: 460000, stock: 30, sold: 27, promo: false, featured: false },
];

const seedLeads: Lead[] = [
  { id: uid(), name: "Adewale Motors", service: "Fleet CNG Conversion", location: "Lagos", budget: "₦10m – ₦25m", value: 18000000, status: "Hot", date: "2026-09-30" },
  { id: uid(), name: "Greenfield Hotels", service: "Hybrid Energy System", location: "Ogun", budget: "₦25m+", value: 32000000, status: "Qualified", date: "2026-09-29" },
  { id: uid(), name: "Ifeanyi Logistics", service: "Generator (250KVA)", location: "Anambra", budget: "₦10m – ₦25m", value: 24500000, status: "Hot", date: "2026-09-28" },
  { id: uid(), name: "Blessing Residence", service: "Solar + Battery", location: "Abuja", budget: "₦2m – ₦5m", value: 4200000, status: "Information", date: "2026-09-27" },
  { id: uid(), name: "Delta Manufacturing", service: "Energy Audit", location: "Delta", budget: "₦5m – ₦10m", value: 7500000, status: "Qualified", date: "2026-09-26" },
  { id: uid(), name: "City Ride Fleet", service: "Vehicle CNG Conversion", location: "Lagos", budget: "₦5m – ₦10m", value: 9000000, status: "Hot", date: "2026-09-25" },
];

const SEED: Catalog = { products: seedProducts, leads: seedLeads };

/* ------------------------------------------------------------------ */
/*  Store                                                              */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = "smartfix_catalog_v1";

function load(): Catalog {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Catalog;
      if (Array.isArray(parsed.products) && parsed.products.length) return parsed;
    }
  } catch {
    /* ignore corrupt storage */
  }
  return SEED;
}

let state: Catalog = load();
const listeners = new Set<() => void>();

function commit(next: Catalog) {
  state = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* storage may be unavailable */
  }
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
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

export const catalog = {
  subscribe,
  getSnapshot,

  addProduct(p: Omit<Product, "id">): Product {
    const product: Product = { ...p, id: uid() };
    commit({ ...state, products: [product, ...state.products] });
    return product;
  },

  updateProduct(id: string, patch: Partial<Product>) {
    commit({
      ...state,
      products: state.products.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    });
  },

  deleteProduct(id: string) {
    commit({ ...state, products: state.products.filter((p) => p.id !== id) });
  },

  togglePromo(id: string) {
    commit({
      ...state,
      products: state.products.map((p) => (p.id === id ? { ...p, promo: !p.promo } : p)),
    });
  },

  toggleFeatured(id: string) {
    commit({
      ...state,
      products: state.products.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p)),
    });
  },

  addLead(l: Omit<Lead, "id">): Lead {
    const lead: Lead = { ...l, id: uid() };
    commit({ ...state, leads: [lead, ...state.leads] });
    return lead;
  },

  updateLead(id: string, patch: Partial<Lead>) {
    commit({
      ...state,
      leads: state.leads.map((l) => (l.id === id ? { ...l, ...patch } : l)),
    });
  },

  deleteLead(id: string) {
    commit({ ...state, leads: state.leads.filter((l) => l.id !== id) });
  },

  reset() {
    commit(SEED);
  },
};

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function useCatalog(): Catalog {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

export function formatNaira(value: number | null): string {
  if (value == null) return "Request Price";
  return "₦" + value.toLocaleString("en-NG");
}
