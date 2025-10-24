// src/pages/CaseCreate.jsx
import React from "react";
import CaseEditor from "../components/CaseEditor";

export default function CaseCreate() {
  const token = localStorage.getItem("admin_token") || localStorage.getItem("token");
  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Create Case</h1>
      <CaseEditor token={token} />
    </div>
  );
}
