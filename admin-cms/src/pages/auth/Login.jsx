import React, { useState } from "react";
import useAuth from "../../store/authStore";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Login() {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();
  const loc = useLocation();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email.trim(), password);
      const redirectTo = loc.state?.from?.pathname || "/";
      if (user?.forceChangePassword) nav("/force-change-password");
      else nav(redirectTo, { replace: true });
    } catch(err) {
        console.log(err.massage)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card w-full max-w-md p-6">
        <h1 className="text-2xl font-semibold mb-4">Sign in</h1>
        <form onSubmit={onSubmit} className="space-y-3">
          <input className="input" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
          <input className="input" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button className="btn btn-primary w-full" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</button>
        </form>
        <div className="mt-3 text-sm">
          <Link to="/forgot" className="text-brand.green">Forgot password?</Link>
        </div>
      </div>
    </div>
  );
}
