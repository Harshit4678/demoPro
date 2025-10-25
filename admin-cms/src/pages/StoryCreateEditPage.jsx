// src/admin/pages/StoryCreateEditPage.jsx
import React, { useEffect, useState } from "react";
import StoryEditor from "../components/StoryEditor";
import api from "../services/api";
import { useParams, useNavigate } from "react-router-dom";

export function StoryCreatePage() {
  const navigate = useNavigate();
  const handleSaved = () => { alert("Created"); navigate("/admin/stories"); };
  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Create Story</h2>
      <StoryEditor initial={null} onSaved={handleSaved} onCancel={() => navigate("/admin/stories")} />
    </div>
  );
}

export function StoryEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initial, setInitial] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await api.get(`/stories/${id}`);
        if (res?.data?.ok) setInitial(res.data.story);
        else { alert("Load failed"); navigate("/admin/stories"); }
      } catch (err) {
        console.error(err); alert("Load error"); navigate("/admin/stories");
      } finally { setLoading(false); }
    })();
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!initial) return <div className="p-6">Not found</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Edit Story</h2>
      <StoryEditor initial={initial} onSaved={() => navigate("/admin/stories")} onCancel={() => navigate("/admin/stories")} />
    </div>
  );
}
