// src/admin/pages/StoriesAdmin.jsx
import React, { useEffect, useState } from "react";
import api from "../services/api";
import StoryEditor from "../components/StoryEditor";

export default function StoriesAdmin() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/stories?limit=200");
      if (res?.data?.ok) setStories(res.data.stories || []);
      else setStories([]);
    } catch (err) {
      console.error(err);
      setStories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this story?")) return;
    try {
      const res = await api.delete(`/stories/${id}`);
      if (res?.data?.ok) {
        alert("Deleted");
        load();
      } else alert("Delete failed");
    } catch (err) {
      console.error(err);
      alert("Delete error");
    }
  };

  const openCreate = () => { setEditing(null); setShowEditor(true); };
  const openEdit = (s) => { setEditing(s); setShowEditor(true); };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-lg font-semibold">Stories</h4>
          <div className="text-sm text-gray-500">Create / edit stories for main site</div>
        </div>
        <div>
          <button onClick={openCreate} className="px-3 py-2 bg-blue-600 text-white rounded">+ New Story</button>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded">
        {loading ? (
          <div>Loading...</div>
        ) : !stories.length ? (
          <div>No stories yet.</div>
        ) : (
          <div className="space-y-3">
            {stories.map(s => (
              <div key={s._id} className="flex items-center gap-4 p-3 bg-white rounded shadow-sm">
                <img src={s.cardImage || s.heroImage || "/images/placeholder.png"} alt="" style={{width:96,height:64,objectFit:"cover"}} className="rounded" />
                <div className="flex-1">
                  <div className="font-medium">{s.title}</div>
                  <div className="text-sm text-gray-600">{s.cardExcerpt}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(s)} className="px-2 py-1 border rounded">Edit</button>
                  <button onClick={() => handleDelete(s._id)} className="px-2 py-1 border rounded text-red-600">Delete</button>
                  <a className="px-2 py-1 border rounded" href={`${(import.meta.env.VITE_SITE_BASE || "http://localhost:3000")}/stories/${s.slug}`} target="_blank" rel="noreferrer">View</a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showEditor && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16">
          <div className="absolute inset-0 bg-black/40" onClick={() => { setShowEditor(false); setEditing(null); }} />
          <div className="relative bg-white w-[95%] md:w-3/4 max-h-[85vh] overflow-y-auto rounded shadow-lg p-4 z-10">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-semibold">{editing ? "Edit Story" : "Create Story"}</h4>
              <button className="text-sm text-gray-600" onClick={() => { setShowEditor(false); setEditing(null); }}>Close</button>
            </div>

            <StoryEditor
              initial={editing || null}
              onSaved={() => { setShowEditor(false); setEditing(null); load(); }}
              onCancel={() => { setShowEditor(false); setEditing(null); }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
