// src/admin/pages/Dashboard.jsx
import React, { useState } from "react";
import { useAuthStore } from "../stores/authStore";
import { useNavigate } from "react-router-dom";

import AboutTimeline from "../content/who-we-are/AboutTimeline";
import LeadsPage from "./LeadsPage"; // integrated leads dashboard

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const nav = useNavigate();
  const [activeTab, setActiveTab] = useState("about");

  const handleLogout = () => {
    logout();
    nav("/login");
  };

  const TABS = [
    { id: "about", label: "About Page" },
    { id: "home", label: "Home Page" },
    { id: "services", label: "Services" },
    { id: "contact", label: "Contact Page" },
    { id: "leads", label: "Leads Dashboard" } // <-- NEW
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row">
        {/* Sidebar / Tabs */}
        <aside className="w-full md:w-64 bg-white border-r p-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold">Admin Dashboard</h2>
              <div className="text-sm text-gray-500">{user?.name || user?.email}</div>
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded"
            >
              Logout
            </button>
          </div>

          <nav className="space-y-2">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`w-full text-left px-3 py-2 rounded flex items-center justify-between
                  ${activeTab === t.id ? "bg-emerald-600 text-white" : "text-slate-700 hover:bg-slate-100"}`}
              >
                <span>{t.label}</span>
                <span className="text-xs text-slate-300">{/* optional count/badge */}</span>
              </button>
            ))}
          </nav>

          <div className="mt-6 text-xs text-gray-500">
            <div>Manage content for each public page here.</div>
            <div className="mt-2">Tip: click "About Page" to edit timeline items & images.</div>
          </div>
        </aside>

        {/* Content area */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="mb-4">
            <h3 className="text-2xl font-semibold">
              {TABS.find(t => t.id === activeTab)?.label}
            </h3>
            <p className="text-sm text-gray-500 mt-1">Manage and edit content for the selected section</p>
          </div>

          <div className="bg-white p-4 rounded shadow-sm min-h-[400px]">
            {/* About */}
            {activeTab === "about" && (
              <AboutTimeline onSaved={() => { /* optionally refresh parent */ }} />
            )}

            {/* Home */}
            {activeTab === "home" && (
              <div>
                <h4 className="font-medium">Home Page content</h4>
                <p className="text-sm text-gray-600">Create/edit hero, features, banners from here.</p>
                {/* Add components for Home page editing */}
              </div>
            )}

            {/* Services */}
            {activeTab === "services" && (
              <div>
                <h4 className="font-medium">Services</h4>
                <p className="text-sm text-gray-600">Manage services list / icons / ordering.</p>
                {/* Add components for Services editing */}
              </div>
            )}

            {/* Contact */}
            {activeTab === "contact" && (
              <div>
                <h4 className="font-medium">Contact</h4>
                <p className="text-sm text-gray-600">Edit contact details, map embed, form settings.</p>
                {/* Add components for Contact editing */}
              </div>
            )}

            {/* Leads Dashboard */}
            {activeTab === "leads" && (
              <div className="p-0">
                <LeadsPage />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
