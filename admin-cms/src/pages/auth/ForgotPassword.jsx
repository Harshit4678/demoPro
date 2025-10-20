import React, { useState } from "react";
import api from "../../libs/api";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await api.post("/admin/resets/request", { email: email.trim() });
      setDone(true);
    } catch (e) {
      setErr(e?.response?.data?.message || "Something went wrong");
    }
  };

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card w-full max-w-md p-6 text-center">
          <h2 className="text-xl font-semibold">Request received</h2>
          <p className="text-sm text-gray-600 mt-2">
            Agar yeh email registered hai to superadmin ko notification chali gayi hai.
          </p>
          <Link to="/login" className="btn mt-4">Back to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card w-full max-w-md p-6">
        <h1 className="text-2xl font-semibold mb-4">Forgot password</h1>
        <form onSubmit={submit} className="space-y-3">
          <input className="input" placeholder="Your registered email" value={email} onChange={(e)=>setEmail(e.target.value)} />
          {err && <p className="text-sm text-red-600">{err}</p>}
          <button className="btn btn-primary w-full">Submit</button>
        </form>
      </div>
    </div>
  );
}
