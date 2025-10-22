// src/admin/pages/LeadsPage.jsx
import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useLeadStore } from "../stores/useLeadStore";
import FiltersBar from "../components/FiltersBar";
import LeadTable from "../components/LeadTable";
import LeadDrawer from "../components/LeadDrawer";

const TABS = ["career","intern","volunteer","ngo","csr","corporate"];

export default function LeadsPage() {
  const { leads, total, page, limit, filters, selected, setLeads, setLoading, setFilters, setPage, toggleSelected, clearSelected, setSelectedAll } = useLeadStore();
  const [activeTab, setActiveTab] = useState(filters.formType || "career");
  const [drawerId, setDrawerId] = useState(null);

  useEffect(()=> {
    fetchLeads();
    // eslint-disable-next-line
  }, [page, activeTab]);

  useEffect(()=> {
    setFilters({ formType: activeTab });
    // eslint-disable-next-line
  }, [activeTab]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        formType: activeTab,
        status: filters.status || "",
        q: filters.q || "",
        from: filters.from || "",
        to: filters.to || ""
      };
      const res = await api.get("/leads", { params });
      setLeads(res.data);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  const onSearch = () => { setPage(1); fetchLeads(); };
  const onBulkAction = async (action, payload) => {
    if (!selected || selected.size === 0) return alert("Select leads first");
    const ids = Array.from(selected);
    await api.post("/leads/bulk", { ids, action, payload });
    clearSelected();
    fetchLeads();
  };

  const openLead = (id) => {
    setDrawerId(id);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Leads</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {TABS.map(t => (
          <button key={t} onClick={()=>{ setActiveTab(t); setPage(1); clearSelected(); }} className={`px-3 py-1 rounded ${activeTab===t ? "bg-blue-600 text-white": "border"}`}>{t.toUpperCase()}</button>
        ))}
      </div>

      {/* Filters */}
      <FiltersBar filters={filters} onChange={(f)=> setFilters(f)} onSearch={onSearch} />

      {/* Bulk actions */}
      <div className="mb-3 flex gap-2">
        <button onClick={()=> onBulkAction("status", { status:"reviewed" })} className="px-3 py-1 border rounded">Mark Reviewed</button>
        <button onClick={()=> onBulkAction("status", { status:"contacted" })} className="px-3 py-1 border rounded">Mark Contacted</button>
        <button onClick={()=> onBulkAction("delete")} className="px-3 py-1 border rounded">Delete</button>
        <button onClick={async ()=>{ await api.get(`/leads/export?formType=${activeTab}`); window.location = `/api/leads/export?formType=${activeTab}` }} className="px-3 py-1 border rounded">Export CSV</button>
      </div>

      {/* Table + pagination */}
      <div className="flex gap-6">
        <div className="flex-1">
          <LeadTable leads={leads} selectedSet={selected} onToggle={toggleSelected} onOpen={openLead} />
          <div className="mt-3 flex items-center justify-between text-sm">
            <div>{total} leads</div>
            <div className="flex gap-2">
              <button onClick={()=> setPage(Math.max(1, page-1))} className="px-2 py-1 border rounded">Prev</button>
              <div className="px-3 py-1 border rounded">{page}</div>
              <button onClick={()=> setPage(page+1)} className="px-2 py-1 border rounded">Next</button>
            </div>
          </div>
        </div>

        {/* Right column: quick stats */}
        <div className="w-80">
          <div className="p-4 border rounded mb-4">
            <h3 className="font-semibold">Quick stats</h3>
            <div className="mt-2 text-sm">Total: {total}</div>
            <div className="mt-1 text-sm">Showing: {leads.length}</div>
          </div>

          <div className="p-4 border rounded">
            <h3 className="font-semibold">Selection</h3>
            <div className="mt-2 text-sm">Selected: {selected ? selected.size : 0}</div>
            <div className="mt-3 flex gap-2">
              <button onClick={()=> setSelectedAll(leads.map(l=>l._id))} className="px-2 py-1 border rounded">Select All</button>
              <button onClick={()=> clearSelected()} className="px-2 py-1 border rounded">Clear</button>
            </div>
          </div>
        </div>
      </div>

      {/* Drawer */}
      {drawerId && <LeadDrawer id={drawerId} onClose={()=> setDrawerId(null)} onUpdated={()=>{ fetchLeads(); }} />}
    </div>
  );
}
