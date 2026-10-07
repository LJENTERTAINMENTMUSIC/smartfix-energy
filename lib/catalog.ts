import { useSyncExternalStore } from "react";
import { supabase } from "./supabaseClient";

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
  price: number | null;
  stock: number;
  sold: number;
  promo: boolean;
  promoLabel?: string;
  featured?: boolean;
  image?: string;
};

export type LeadStatus = "Hot" | "Qualified" | "Information";

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  service: string;
  location: string;
  budget: string;
  value: number;
  status: LeadStatus;
  created_at?: string;
};

type Catalog = {
  products: Product[];
  leads: Lead[];
  loading: boolean;
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
/*  Store                                                              */
/* ------------------------------------------------------------------ */

let state: Catalog = { products: [], leads: [], loading: true };
const listeners = new Set<() => void>();

function commit(next: Catalog) {
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

let subscriptionsInitialized = false;

// Fetch initial data
async function initStore() {
  if (!supabase) {
    commit({ ...state, loading: false });
    return;
  }
  const [productsRes, leadsRes] = await Promise.all([
    supabase.from("products").select("*").order("created_at", { ascending: false }),
    supabase.from("leads").select("*").order("created_at", { ascending: false })
  ]);
  
  commit({
    products: productsRes.data || [],
    leads: leadsRes.data || [],
    loading: false
  });

  // Set up realtime subscriptions (run once only)
  if (!subscriptionsInitialized) {
    subscriptionsInitialized = true;
    supabase.channel('public:products')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, (payload: any) => {
        if (payload.eventType === 'INSERT') {
          commit({ ...state, products: [payload.new as Product, ...state.products] });
        } else if (payload.eventType === 'UPDATE') {
          commit({ ...state, products: state.products.map(p => p.id === payload.new.id ? payload.new as Product : p) });
        } else if (payload.eventType === 'DELETE') {
          commit({ ...state, products: state.products.filter(p => p.id !== payload.old.id) });
        }
      })
      .subscribe();

    supabase.channel('public:leads')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, (payload: any) => {
        if (payload.eventType === 'INSERT') {
          commit({ ...state, leads: [payload.new as Lead, ...state.leads] });
        } else if (payload.eventType === 'UPDATE') {
          commit({ ...state, leads: state.leads.map(l => l.id === payload.new.id ? payload.new as Lead : l) });
        } else if (payload.eventType === 'DELETE') {
          commit({ ...state, leads: state.leads.filter(l => l.id !== payload.old.id) });
        }
      })
      .subscribe();
  }
}

// Fire init immediately
initStore();

if (supabase) {
  supabase.auth.onAuthStateChange((_event, session) => {
    if (session) {
      initStore();
    }
  });
}

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

export const catalog = {
  subscribe,
  getSnapshot,
  refresh: initStore,

  async addProduct(p: Omit<Product, "id">) {
    if (!supabase) return;
    const { data } = await supabase.from("products").insert([p]).select();
    if (data && data.length > 0) {
      commit({ ...state, products: [data[0] as Product, ...state.products.filter(x => x.id !== data[0].id)] });
    }
  },

  async updateProduct(id: string, patch: Partial<Product>) {
    if (!supabase) return;
    commit({ ...state, products: state.products.map(p => p.id === id ? { ...p, ...patch } : p) });
    await supabase.from("products").update(patch).eq("id", id);
  },

  async deleteProduct(id: string) {
    if (!supabase) return;
    commit({ ...state, products: state.products.filter(p => p.id !== id) });
    await supabase.from("products").delete().eq("id", id);
  },

  async togglePromo(id: string) {
    const p = state.products.find(x => x.id === id);
    if (!p || !supabase) return;
    commit({ ...state, products: state.products.map(x => x.id === id ? { ...x, promo: !x.promo } : x) });
    await supabase.from("products").update({ promo: !p.promo }).eq("id", id);
  },

  async toggleFeatured(id: string) {
    const p = state.products.find(x => x.id === id);
    if (!p || !supabase) return;
    commit({ ...state, products: state.products.map(x => x.id === id ? { ...x, featured: !x.featured } : x) });
    await supabase.from("products").update({ featured: !p.featured }).eq("id", id);
  },

  async addLead(l: Omit<Lead, "id">) {
    if (!supabase) return;
    const tempLead: Lead = {
      id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      ...l,
      created_at: new Date().toISOString(),
    };
    commit({ ...state, leads: [tempLead, ...state.leads] });
    await supabase.from("leads").insert([l]);
  },

  async updateLead(id: string, patch: Partial<Lead>) {
    if (!supabase) return;
    commit({ ...state, leads: state.leads.map(l => l.id === id ? { ...l, ...patch } : l) });
    await supabase.from("leads").update(patch).eq("id", id);
  },

  async deleteLead(id: string) {
    if (!supabase) return;
    commit({ ...state, leads: state.leads.filter(l => l.id !== id) });
    await supabase.from("leads").delete().eq("id", id);
  },

  reset() {
    console.warn("Reset is no longer supported with Supabase.");
  }
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
