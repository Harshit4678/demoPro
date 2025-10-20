import React from "react";
import { Outlet } from "react-router-dom";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";

export default function AdminLayout() {
  return (
    <div className="min-h-screen grid grid-rows-[56px_1fr]">
      <Topbar />
      <div className="grid grid-cols-[256px_1fr]">
        <Sidebar />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
