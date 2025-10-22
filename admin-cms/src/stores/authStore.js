import {create} from "zustand";

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("admin_user") || "null"),
  token: localStorage.getItem("admin_token") || null,
  setAuth: (user, token) => {
    localStorage.setItem("admin_user", JSON.stringify(user));
    localStorage.setItem("admin_token", token);
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem("admin_user");
    localStorage.removeItem("admin_token");
    set({ user: null, token: null });
  },
}));
