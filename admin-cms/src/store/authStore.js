import { create } from "zustand";
import api from "../libs/api";

const useAuth = create((set, ) => ({
  user: null,
  loading: false,
  error: null,

  hydrate: async () => {
    try {
      const { data } = await api.get("/auth/me");
      set({ user: data.user || null });
    } catch {
      set({ user: null });
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post("/auth/login", { email, password });
      set({ user: data.user, loading: false });
      return data.user;
    } catch (e) {
      set({ loading: false, error: e?.response?.data?.message || "Login failed" });
      throw e;
    }
  },

  logout: async () => {
    await api.post("/auth/logout");
    set({ user: null });
  },

  changePassword: async (currentPassword, newPassword) => {
    await api.post("/auth/change-password", { currentPassword, newPassword });
    const { data } = await api.get("/auth/me");
    set({ user: data.user });
  }
}));

export default useAuth;
