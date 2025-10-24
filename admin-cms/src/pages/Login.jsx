import React, { useState } from "react";
import { motion as Motion } from "framer-motion";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

/**
 * Styled, accessible login form for Care India Welfare Trust admin panel.
 * - Tailwind CSS for layout & responsive styles
 * - Framer Motion for subtle entrance / button / input interactions
 * - Loading state, client validation, show-password, remember-me
 * - Keeps original setAuth(res.data.user, res.data.token) behavior
 */

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const setAuth = useAuthStore((s) => s.setAuth);
  const nav = useNavigate();

  const validate = () => {
    if (!email.trim()) return "Please enter your email.";
    // basic email pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address.";
    if (!password) return "Please enter your password.";
    if (password.length < 6) return "Password should be at least 6 characters.";
    return null;
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    const v = validate();
    if (v) {
      setErr(v);
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email: email.trim(), password });
      // expected: res.data.user, res.data.token
      setAuth(res.data.user, res.data.token, { remember }); // if your store supports options
      nav("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setErr(error?.response?.data?.message || "Login failed. Check credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-slate-50 p-6">
      <Motion.div
        initial={{ opacity: 0, y: 12, scale: 0.995 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl ring-1 ring-slate-100 overflow-hidden"
        aria-live="polite"
      >
        {/* Header */}
        <div className="px-6 py-6 sm:px-8 sm:py-8 bg-gradient-to-r from-emerald-50 to-amber-50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-white/80 shadow-sm">
              {/* simple logo mark */}
              <svg className="w-7 h-7 text-amber-600" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M12 2v20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5 8h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-900">Admin Sign in</h1>
              <p className="text-xs text-slate-500">Care India Welfare Trust — CMS</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <Motion.form
          onSubmit={submit}
          initial="rest"
          whileTap="pressed"
          className="px-6 py-6 sm:px-8 sm:py-8"
          aria-label="Admin login form"
        >
          {/* error */}
          {err ? (
            <Motion.div
              className="mb-4 rounded-md bg-rose-50 border border-rose-100 text-rose-700 px-3 py-2 text-sm"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {err}
            </Motion.div>
          ) : null}

          {/* email */}
          <label className="block text-xs font-medium text-slate-600 mb-2" htmlFor="email">
            Email
          </label>
          <Motion.input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300 transition"
            placeholder="you@organization.org"
            aria-required="true"
            aria-invalid={!!err}
            whileFocus={{ scale: 1.01 }}
          />

          <div className="mt-4 flex items-center justify-between">
            <label className="block text-xs font-medium text-slate-600 mb-2" htmlFor="password">
              Password
            </label>
            <a
              href="/forgot-password"
              className="text-xs text-slate-500 hover:text-emerald-600"
              onClick={() => {
                /* If using react-router, handle client-side route if needed */
              }}
            >
              Forgot?
            </a>
          </div>

          <div className="relative">
            <Motion.input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300 transition"
              placeholder="Your password"
              aria-required="true"
              whileFocus={{ scale: 1.01 }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-700"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* remember & spacer */}
          <div className="mt-4 flex items-center justify-between">
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-300"
              />
              <span className="text-sm text-slate-600">Remember me</span>
            </label>

            <div className="text-xs text-slate-400">Powered by Care India</div>
          </div>

          {/* submit */}
          <div className="mt-6">
            <Motion.button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-3 rounded-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white px-4 py-2 text-sm font-semibold shadow-lg"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              aria-disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.4)" strokeWidth="3" />
                    <path d="M22 12a10 10 0 00-10-10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign in</span>
              )}
            </Motion.button>
          </div>

          {/* small footer */}
          <div className="mt-4 text-center text-xs text-slate-400">
            By continuing you agree to the{" "}
            <a href="/terms" className="text-emerald-600 hover:underline">
              Terms & Conditions
            </a>
          </div>
        </Motion.form>
      </Motion.div>
    </div>
  );
}
