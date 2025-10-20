import React from "react";
import { NavLink } from "react-router-dom";
import useAuth from "../store/authStore";
import { hasRole } from "../utils/roleUtils";

const LinkItem = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `block px-4 py-2 rounded-lg ${isActive ? "bg-gray-200" : "hover:bg-gray-100"}`
    }
  >
    {children}
  </NavLink>
);

export default function Sidebar() {
  const { user } = useAuth();
  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-3">
      <div className="mb-2 text-xs uppercase text-gray-500 font-medium">Main</div>
      <div className="space-y-1">
        <LinkItem to="/">Dashboard</LinkItem>
        {hasRole(user, ["superadmin"]) && <LinkItem to="/users">User Management</LinkItem>}
        {hasRole(user, ["superadmin"]) && <LinkItem to="/resets">Reset Requests</LinkItem>}
      </div>
    </aside>
  );
}
