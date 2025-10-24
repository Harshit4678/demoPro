// src/admin/pages/CasesList.jsx
import React, { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function CasesList({ onEdit = null }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/cases`);
      const text = await res.text();
      let data = null;
      try { data = text ? JSON.parse(text) : null; } catch (err) {
        console.error("Failed to parse /api/cases response text:", text, err);
        throw new Error("Invalid JSON from server");
      }
      if (data?.ok) setItems(data.items || []);
      else setItems([]);
    } catch (err) {
      console.error("load cases err:", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id) {
    if (!confirm("Delete this case?")) return;
    try {
    const token = localStorage.getItem("admin_token") || localStorage.getItem("token");
    const res = await fetch(`${API_BASE}/api/cases/${id}`, {
      method: "DELETE",
      headers: token ? { "Authorization": `Bearer ${token}` } : {}
    });
    const text = await res.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch(e) { console.error("delete parse err:", text, e); }
    if (!res.ok) throw new Error((data && data.message) || `Server ${res.status}`);
      // refresh list
      await load();
      alert("Deleted");
    } catch (err) {
      console.error(err);
      alert("Delete failed: " + (err.message || ""));
    }
  }

  return (
    <div>
      {loading ? <div>Loading cases...</div> : (
        <div className="space-y-3">
          {items.length === 0 && <div className="text-sm text-gray-500">No cases yet</div>}
          {items.map(it => (
            <div key={it._id} className="p-3 border rounded flex items-center justify-between">
              <div>
                <div className="font-medium">{it.title}</div>
                <div className="text-sm text-gray-600">{it.cardExcerpt}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => onEdit ? onEdit(it) : null} className="text-sm text-blue-600">Edit</button>
                <button onClick={() => handleDelete(it._id)} className="text-sm text-red-600">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
