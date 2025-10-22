// src/admin/components/LeadTable.jsx
import React from "react";

export default function LeadTable({ leads, selectedSet, onToggle, onOpen }) {
  return (
    <div className="overflow-auto border rounded">
      <table className="min-w-full divide-y">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-2"><input type="checkbox" /></th>
            <th className="p-2 text-left">Ref</th>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Form</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Date</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y">
          {leads.map((l) => (
            <tr key={l._id} className="hover:bg-gray-50">
              <td className="p-2">
                <input type="checkbox" checked={selectedSet.has(l._id)} onChange={()=>onToggle(l._id)} />
              </td>
              <td className="p-2">{l.referenceId}</td>
              <td className="p-2">{l.name || "-"}</td>
              <td className="p-2">{l.email || "-"}</td>
              <td className="p-2">{l.formType}</td>
              <td className="p-2"><span className={`px-2 py-0.5 rounded text-xs ${l.status==='new'?'bg-yellow-100':'bg-green-100'}`}>{l.status}</span></td>
              <td className="p-2">{new Date(l.createdAt).toLocaleString()}</td>
              <td className="p-2">
                <button onClick={()=>onOpen(l._id)} className="px-2 py-1 text-sm border rounded">Open</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
