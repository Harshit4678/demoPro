// src/admin/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useAuthStore } from "../stores/authStore";
import { useNavigate } from "react-router-dom";

import AboutTimeline from "../content/who-we-are/AboutTimeline";
import LeadsPage from "./LeadsPage";

// import cases admin components (path adjust karo agar alag ho)
import CasesList from "./CasesList";
import CaseEditor from "../components/CaseEditor";
import SectionGallery from "../components/SectionGallery";

// <-- NEW: Stories admin page (simple single-file admin view)
import StoriesAdmin from "./StoriesAdmin";

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const nav = useNavigate();

  const [activeTab, setActiveTab] = useState("about");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCase, setEditingCase] = useState(null); // for edit-in-modal
  const [refreshKey, setRefreshKey] = useState(0); // bump to refresh lists

  const handleLogout = () => {
    logout();
    nav("/login");
  };

  const TABS = [
    { id: "about", label: "About Page" },
    { id: "home", label: "Home Page" },
    { id: "services", label: "Services" },
    { id: "contact", label: "Contact Page" },
    { id: "leads", label: "Leads Dashboard" },
    { id: "cases", label: "Cases" }, // Cases tab
    { id: "stories", label: "Stories" } ,// <-- NEW: Stories tab
    { id: "gallery", label: "Section Gallery" },
  ];

  function openCreate() {
    setEditingCase(null);
    setShowCreateModal(true);
  }

  // called after CaseEditor saves successfully
  function onSaved() {
    setShowCreateModal(false);
    setEditingCase(null);
    setRefreshKey((k) => k + 1);
  }

  // lock background scroll while modal open
  useEffect(() => {
    document.body.style.overflow = showCreateModal ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showCreateModal]);

  // helper to open edit modal from CasesList
  function handleEdit(caseObj) {
    setEditingCase(caseObj);
    setShowCreateModal(true);
  }

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
                <span className="text-xs text-slate-300" />
              </button>
            ))}
          </nav>

          <div className="mt-6 text-xs text-gray-500">
            <div>Manage content for each public page here.</div>
            <div className="mt-2">Tip: click section to edit content.</div>
          </div>
        </aside>

        {/* Content area */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-semibold">
                {TABS.find((t) => t.id === activeTab)?.label}
              </h3>
              <p className="text-sm text-gray-500 mt-1">Manage and edit content for the selected section</p>
            </div>

            {/* show New Case only on cases tab */}
            {activeTab === "cases" && (
              <div>
                <button
                  onClick={openCreate}
                  className="px-3 py-2 bg-blue-600 text-white rounded shadow"
                >
                  + New Case
                </button>
              </div>
            )}
          </div>

          <div className="bg-white p-4 rounded shadow-sm min-h-[400px]">
            {activeTab === "about" && <AboutTimeline onSaved={() => {}} />}

            {activeTab === "home" && (
              <div>
                <h4 className="font-medium">Home Page content</h4>
                <p className="text-sm text-gray-600">Create/edit hero, features, banners from here.</p>
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

            {activeTab === "leads" && (
              <div className="p-0">
                <LeadsPage />
              </div>
            )}

            {activeTab === "cases" && (
              <div>
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Create & manage Cases shown on the public site.</p>
                </div>

                {/* Cases list; pass onEdit to open modal */}
                <CasesList
                  key={refreshKey}
                  onEdit={handleEdit}
                />

                {/* Modal */}
                {showCreateModal && (
                  <div className="fixed inset-0 z-50 flex items-start justify-center pt-16">
                    <div
                      className="absolute inset-0 bg-black/40"
                      onClick={() => { setShowCreateModal(false); setEditingCase(null); }}
                    />
                    <div className="relative bg-white w-[90%] md:w-3/4 max-h-[85vh] overflow-y-auto rounded shadow-lg p-4 z-10">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-lg font-semibold">{editingCase ? "Edit Case" : "Create Case"}</h4>
                        <button className="text-sm text-gray-600" onClick={() => { setShowCreateModal(false); setEditingCase(null); }}>Close</button>
                      </div>

                      <CaseEditor
                        initial={editingCase}
                        token={localStorage.getItem("admin_token") || localStorage.getItem("token")}
                        onSaved={onSaved}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* NEW: Stories admin area */}
            {activeTab === "stories" && (
              <div>
                <StoriesAdmin />
              </div>
            )}
            {activeTab === "gallery" && (
             <div className="p-4">
             <SectionGallery />
              </div>
               )}
          </div>
        </main>
      </div>
    </div>
  );
}