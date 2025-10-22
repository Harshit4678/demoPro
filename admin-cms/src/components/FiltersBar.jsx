// src/admin/components/FiltersBar.jsx
import React from "react";

export default function FiltersBar({ filters, onChange, onSearch }) {
  return (
    <div className="flex flex-wrap gap-3 items-center mb-4">
      <select
        value={filters.status}
        onChange={(e) => onChange({ status: e.target.value })}
        className="px-3 py-2 border rounded"
      >
        <option value="">All statuses</option>
        <option value="new">New</option>
        <option value="reviewed">Reviewed</option>
        <option value="contacted">Contacted</option>
        <option value="closed">Closed</option>
        <option value="spam">Spam</option>
      </select>

      <input
        type="date"
        value={filters.from || ""}
        onChange={(e) => onChange({ from: e.target.value })}
        className="px-3 py-2 border rounded"
        title="From"
      />
      <input
        type="date"
        value={filters.to || ""}
        onChange={(e) => onChange({ to: e.target.value })}
        className="px-3 py-2 border rounded"
        title="To"
      />

      <input
        type="text"
        placeholder="Search name, email, ref..."
        value={filters.q}
        onChange={(e) => onChange({ q: e.target.value })}
        className="px-3 py-2 border rounded flex-1 min-w-[200px]"
        onKeyDown={(e)=> { if(e.key==='Enter') onSearch(); }}
      />

      <button onClick={onSearch} className="px-3 py-2 bg-blue-600 text-white rounded">Search</button>
      <button onClick={() => { onChange({ status: "", from: "", to: "", q: "" }); onSearch(); }} className="px-3 py-2 border rounded">Reset</button>
    </div>
  );
}
