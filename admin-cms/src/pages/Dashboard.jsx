// src/admin/pages/Dashboard.jsx
import React, { useState } from "react";
import { useAuthStore } from "../stores/authStore";
import { useNavigate } from "react-router-dom";

import AboutTimeline from "../content/who-we-are/AboutTimeline"; 

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
    // add more pages here as needed
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
        <main className="flex-1 p-6">
          <div className="mb-4">
            <h3 className="text-2xl font-semibold">
              {TABS.find(t => t.id === activeTab)?.label}
            </h3>
            <p className="text-sm text-gray-500 mt-1">Simple editor area for {activeTab} content</p>
          </div>

          <div className="bg-white p-4 rounded shadow-sm min-h-[320px]">
            {/* Render tab content: keep it simple and import the proper admin page/component */}
            {activeTab === "about" && (
              <>
                {/* AboutTimeline component should provide: list of items + create/edit form */}
                {/* Replace import above to point to your actual admin AboutTimeline page */}
                <AboutTimeline onSaved={() => { /* optionally refresh parent */ }} />
              </>
            )}

            {activeTab === "home" && (
              <div>
                <h4 className="font-medium">Home Page content</h4>
                <p className="text-sm text-gray-600">Create/edit hero, features, banners from here.</p>
                {/* Add components later */}
              </div>
            )}

            {activeTab === "services" && (
              <div>
                <h4 className="font-medium">Services</h4>
                <p className="text-sm text-gray-600">Manage services list / icons / ordering.</p>
              </div>
            )}

            {activeTab === "contact" && (
              <div>
                <h4 className="font-medium">Contact</h4>
                <p className="text-sm text-gray-600">Edit contact details, map embed, form settings.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
