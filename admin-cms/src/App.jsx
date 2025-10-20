import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/auth/Login.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import ForceChangePassword from "./pages/auth/ForceChangePassword.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import UserManagement from "./pages/users/UserManagement.jsx";
import ResetRequests from "./pages/resets/ResetRequests.jsx";
import AdminLayout from "./layout/AdminLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import useAuth from "./store/authStore.js";

export default function App() {
  const { hydrate } = useAuth();
  const loc = useLocation();

  useEffect(() => { hydrate(); }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/forgot" element={<ForgotPassword />} />
      <Route path="/force-change-password" element={
        <ProtectedRoute anyRole>
          <ForceChangePassword />
        </ProtectedRoute>
      }/>

      {/* Admin Area */}
      <Route path="/" element={
        <ProtectedRoute roles={["superadmin","administrator","reviewer"]}>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="users" element={
          <ProtectedRoute roles={["superadmin"]}><UserManagement /></ProtectedRoute>
        }/>
        <Route path="resets" element={
          <ProtectedRoute roles={["superadmin"]}><ResetRequests /></ProtectedRoute>
        }/>
      </Route>

      <Route path="*" element={<Navigate to={loc?.pathname === "/login" ? "/login" : "/"} replace />} />
    </Routes>
  );
}
