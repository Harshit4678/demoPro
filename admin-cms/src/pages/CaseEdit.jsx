// src/pages/CaseEdit.jsx
import React, { useEffect, useState } from "react";
import CaseEditor from "../components/CaseEditor";
import api from "../api";
import { useParams } from "react-router-dom"; // use your router's hook

export default function CaseEdit() {
  const { id } = useParams();
  const [initial, setInitial] = useState(null);
  const token = localStorage.getItem("admin_token") || localStorage.getItem("token");

  useEffect(() => {
    if (!id) return;
    api.get(`/cases/${id}`).then(res => {
      if (res.data?.ok) setInitial(res.data.case);
    }).catch(console.error);
  }, [id]);

  if (!initial) return <div className="p-6">Loading...</div>;
  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Edit Case</h1>
      <CaseEditor initial={initial} token={token} />
    </div>
  );
}
