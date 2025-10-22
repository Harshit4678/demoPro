import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const setAuth = useAuthStore((s) => s.setAuth);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const res = await api.post("/auth/login", { email, password });
      setAuth(res.data.user, res.data.token);
      nav("/dashboard");
    } catch (error) {
      setErr(error?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "80px auto", padding: 20, border: "1px solid #eee", borderRadius: 8 }}>
      <h2>Admin Login</h2>
      <form onSubmit={submit}>
        <input
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        {err && <div style={{ color: "red", marginBottom: 10 }}>{err}</div>}
        <button type="submit" style={{ padding: "8px 12px" }}>Login</button>
      </form>
    </div>
  );
}