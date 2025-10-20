import React, { useState } from "react";
import useAuth from "../../store/authStore";

export default function ForceChangePassword() {
  const { changePassword } = useAuth();
  const [currentPassword, setC] = useState("");
  const [newPassword, setN] = useState("");
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await changePassword(currentPassword, newPassword);
      setOk(true);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card w-full max-w-md p-6">
        <h1 className="text-2xl font-semibold mb-3">Change your password</h1>
        {ok ? (
          <div className="text-green-600">Password changed. You can continue.</div>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <input className="input" placeholder="Current password" type="password" value={currentPassword} onChange={(e)=>setC(e.target.value)} />
            <input className="input" placeholder="New password" type="password" value={newPassword} onChange={(e)=>setN(e.target.value)} />
            {err && <p className="text-sm text-red-600">{err}</p>}
            <button className="btn btn-primary w-full">Save</button>
          </form>
        )}
      </div>
    </div>
  );
}
