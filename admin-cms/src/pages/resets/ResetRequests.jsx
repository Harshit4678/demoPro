import React, { useEffect, useState } from "react";
import api from "../../libs/api";

export default function ResetRequests() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [pwd, setPwd] = useState({});

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/resets");
      setItems(data.items || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const setNewPassword = async (resetId, generate) => {
    setMsg("");
    try {
      const payload = generate ? { resetId, generate: true } : { resetId, newPassword: pwd[resetId] };
      await api.post("/admin/resets/set", payload);
      setMsg("Password reset & emailed.");
      await load();
    } catch (e) {
      setMsg(e?.response?.data?.message || "Failed");
    }
  };

  const reject = async (resetId) => {
    if (!confirm("Reject this request?")) return;
    try {
      await api.post("/admin/resets/reject", { resetId });
      setMsg("Rejected.");
      await load();
    } catch (e) {
      setMsg(e?.response?.data?.message || "Failed");
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Password Reset Requests</h1>
      {msg && <div className="text-sm text-gray-700">{msg}</div>}

      <div className="card p-0 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Requested</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="p-3" colSpan={4}>Loading…</td></tr>
            ) : items.length ? (
              items.map((r) => (
                <tr key={r._id} className="border-t">
                  <td className="p-3">{r.email}</td>
                  <td className="p-3 capitalize">{r.status}</td>
                  <td className="p-3">{new Date(r.requestedAt || r.createdAt).toLocaleString()}</td>
                  <td className="p-3 space-x-2">
                    {r.status === "pending" ? (
                      <>
                        <input
                          className="input w-52"
                          placeholder="New password (optional)"
                          value={pwd[r._id] || ""}
                          onChange={(e)=>setPwd({...pwd, [r._id]: e.target.value})}
                        />
                        <button className="btn btn-primary" onClick={()=>setNewPassword(r._id, false)}>Set</button>
                        <button className="btn" onClick={()=>setNewPassword(r._id, true)}>Generate</button>
                        <button className="btn" onClick={()=>reject(r._id)}>Reject</button>
                      </>
                    ) : (
                      <span className="text-gray-500">Handled</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr><td className="p-3" colSpan={4}>No requests</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
