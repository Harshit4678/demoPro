import React from "react";
import useAuth from "../../store/authStore";

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card p-4">
          <div className="text-sm text-gray-500">Welcome</div>
          <div className="text-lg font-semibold">{user?.name || user?.email}</div>
          <div className="text-xs text-gray-600 mt-1">Role: {user?.role}</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-gray-500">Quick Links</div>
          <ul className="list-disc pl-5 text-sm mt-2 space-y-1">
            <li>Manage Users (SuperAdmin)</li>
            <li>Reset Requests (SuperAdmin)</li>
            <li>CMS coming soon…</li>
          </ul>
        </div>
        <div className="card p-4">
          <div className="text-sm text-gray-500">System</div>
          <div className="text-sm">Secure JWT (cookie)</div>
        </div>
      </div>
    </div>
  );
}
