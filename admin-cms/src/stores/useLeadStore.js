// src/admin/store/useLeadStore.js
import {create} from "zustand";

export const useLeadStore = create((set) => ({
  leads: [],
  total: 0,
  page: 1,
  limit: 20,
  loading: false,
  filters: { formType: "career", q: "", status: "", from: "", to: "" },
  selected: new Set(),

  setLoading: (b) => set({ loading: b }),
  setLeads: (payload) => set({ leads: payload.items, total: payload.total, page: payload.page, limit: payload.limit }),
  setFilters: (f) => set((s) => ({ filters: { ...s.filters, ...f }, page: 1 })),
  setPage: (p) => set({ page: p }),
  toggleSelected: (id) => set((s) => {
    const sel = new Set(s.selected);
    if (sel.has(id)) sel.delete(id); else sel.add(id);
    return { selected: sel };
  }),
  clearSelected: () => set({ selected: new Set() }),
  setSelectedAll: (ids) => set({ selected: new Set(ids) })
}));
