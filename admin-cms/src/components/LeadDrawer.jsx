// src/admin/components/LeadDrawer.jsx
import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function LeadDrawer({ id, onClose, onUpdated }) {
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!id) return setLead(null);
    let mounted = true;
    setLoading(true);
    api.get(`/leads/${id}`).then(res => { if(mounted) setLead(res.data.item); })
      .catch(()=>{})
      .finally(()=> setLoading(false));
    return ()=> mounted = false;
  }, [id]);

  if (!id) return null;

  const changeStatus = async (status) => {
    await api.put(`/leads/${id}`, { status });
    onUpdated(); // refresh list
  };

  const addNote = async () => {
    if (!note.trim()) return;
    await api.put(`/leads/${id}`, { note });
    setNote("");
    onUpdated();
  };

  return (
    <div className="fixed right-0 top-0 h-full w-[420px] bg-white shadow-lg border-l z-50 p-4 overflow-auto">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Lead details</h3>
        <button onClick={onClose} className="text-sm px-2 py-1">Close</button>
      </div>

      {loading || !lead ? <div className="mt-4">Loading...</div> : (
        <div className="mt-4 space-y-3 text-sm">
          <div><strong>Ref:</strong> {lead.referenceId}</div>
          <div><strong>Name:</strong> {lead.name}</div>
          <div><strong>Email:</strong> {lead.email}</div>
          <div><strong>Phone:</strong> {lead.phone}</div>
          <div><strong>Form:</strong> {lead.formType}</div>
          <div><strong>Status:</strong> {lead.status}</div>
          <div><strong>Message:</strong><div className="mt-1 p-2 bg-gray-50 rounded">{lead.message || '-'}</div></div>

          <div>
            <strong>Attachments</strong>
            <div className="mt-2 space-y-1">
              {lead.attachments && lead.attachments.length ? lead.attachments.map(a=>(
                <div key={a.url} className="flex items-center justify-between">
                  <a href={a.url} target="_blank" rel="noreferrer" className="text-blue-600 text-sm truncate max-w-[260px]">{a.name}</a>
                  <a href={a.url} target="_blank" rel="noreferrer" className="px-2 py-1 border rounded text-xs">Download</a>
                </div>
              )) : <div className="text-xs text-gray-500">No attachments</div>}
            </div>
          </div>

          <div className="flex gap-2 mt-2">
            <button onClick={()=>changeStatus('reviewed')} className="px-3 py-1 border rounded text-sm">Mark Reviewed</button>
            <button onClick={()=>changeStatus('contacted')} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Mark Contacted</button>
            <button onClick={()=>changeStatus('closed')} className="px-3 py-1 border rounded text-sm">Close</button>
          </div>

          <div className="mt-3">
            <strong>Internal notes</strong>
            <div className="mt-2">
              <textarea value={note} onChange={(e)=>setNote(e.target.value)} className="w-full p-2 border rounded" rows={3} />
              <div className="flex justify-end mt-2">
                <button onClick={addNote} className="px-3 py-1 bg-green-600 text-white rounded text-sm">Add note</button>
              </div>
            </div>
            <div className="mt-3 space-y-2">
              {lead.notes && lead.notes.length ? lead.notes.map((n,i)=>(
                <div key={i} className="p-2 bg-gray-50 border rounded text-xs">{n.text} <div className="text-gray-400 text-[11px]">{new Date(n.at).toLocaleString()}</div></div>
              )) : <div className="text-xs text-gray-400">No notes yet</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
