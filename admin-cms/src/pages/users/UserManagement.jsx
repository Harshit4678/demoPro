import React, { useEffect, useState } from "react";
import api from "../../libs/api";

export default function UserManagement() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", role: "administrator" });
  const [msg, setMsg] = useState("");

  const load = async () => {
    setLoading(true);
    // simple fetch of all (backend me list endpoint nahi diya; yaha quick workaround:)
    // TIP: Aap backend me GET /api/admin/users (superadmin only) add kar sakte ho.
    try {
      const { data } = await api.get("/admin/resets"); // just to ping auth
      // Temporary: fetch users by custom small util endpoint (add it in backend if needed)
      const res = await api.get("/auth/me"); // we only have me; so skip list for now
      // For demo, we won't list users unless you add /api/admin/users/list
      setList([]);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const createUser = async (e) => {
    e.preventDefault();
    setMsg("");
    const { name, email, role } = form;
    try {
      const { data } = await api.post("/admin/users/create", { name, email, role });
      setMsg(`Created: ${data.user.email}`);
      setForm({ name: "", email: "", role: "administrator" });
      // Optionally reload list if endpoint exists
    } catch (e) {
      setMsg(e?.response?.data?.message || "Failed");
    }
  };

  const deleteUser = async (id) => {
    if (!confirm("Delete this user?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setMsg("User deleted");
    } catch (e) {
      setMsg(e?.response?.data?.message || "Failed");
    }
  };

  const banUser = async (id, ban) => {
    try {
      await api.post(`/admin/users/ban/${id}`, { ban });
      setMsg(ban ? "User banned" : "User unbanned");
    } catch (e) {
      setMsg(e?.response?.data?.message || "Failed");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">User Management</h1>

      <form onSubmit={createUser} className="card p-4 grid md:grid-cols-4 gap-3">
        <input className="input" placeholder="Name" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} />
        <input className="input" placeholder="Email" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} />
        <select className="input" value={form.role} onChange={(e)=>setForm({...form, role:e.target.value})}>
          <option value="administrator">Administrator</option>
          <option value="reviewer">Reviewer</option>
        </select>
        <button className="btn btn-primary">Create</button>
        {msg && <div className="md:col-span-4 text-sm text-gray-600">{msg}</div>}
      </form>

      {/* NOTE: For real listing, add a backend endpoint GET /api/admin/users and render here */}
      <div className="card p-4">
        <div className="text-sm text-gray-500">Listing</div>
        <div className="text-xs text-gray-500 mt-1">
          (Add <code>GET /api/admin/users</code> in backend to render a list here.)
        </div>
      </div>
    </div>
  );
}
