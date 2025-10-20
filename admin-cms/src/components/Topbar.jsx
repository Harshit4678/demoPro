import React from "react";
import useAuth from "../store/authStore";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const onLogout = async () => {
    await logout();
    nav("/login");
  };

  return (
    <header className="w-full h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      <div className="font-semibold">CARE Admin</div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">{user?.email} ({user?.role})</span>
        <button className="btn" onClick={onLogout}>Logout</button>
      </div>
    </header>
  );
}
