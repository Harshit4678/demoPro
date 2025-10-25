// src/admin/components/StoryEditor.jsx
import React, { useState, useRef, useEffect } from "react";
import api from "../services/api"; // your axios instance

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function StoryEditor({ initial = null, onSaved = null, onCancel = null }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [slugInput, setSlugInput] = useState(initial?.slug || "");
  const [cardImageFile, setCardImageFile] = useState(null);
  const [heroImageFile, setHeroImageFile] = useState(null);
  const [cardImagePreview, setCardImagePreview] = useState(initial?.cardImage || "");
  const [heroImagePreview, setHeroImagePreview] = useState(initial?.heroImage || "");
  const [tags, setTags] = useState((initial?.tags || []).join(","));
  const [contentBlocks, setContentBlocks] = useState(initial?.contentBlocks || []);
  const [cardExcerpt, setCardExcerpt] = useState(initial?.cardExcerpt || "");
  const [loading, setLoading] = useState(false);

  const dragItem = useRef();
  const dragOverItem = useRef();

  useEffect(() => {
    setTitle(initial?.title || "");
    setCardExcerpt(initial?.cardExcerpt || "");
    setTags((initial?.tags || []).join(","));
    setContentBlocks(initial?.contentBlocks || []);
    setSlugInput(initial?.slug || "");
    setCardImagePreview(initial?.cardImage || "");
    setHeroImagePreview(initial?.heroImage || "");
    setCardImageFile(null);
    setHeroImageFile(null);
  }, [initial]);

  function addBlock(type) {
    if (type === "media") setContentBlocks(prev => [...prev, { type, data: { url: "", originalName: "" } }]);
    else setContentBlocks(prev => [...prev, { type, data: { text: "" } }]);
  }

  function updateBlock(idx, newData) {
    setContentBlocks(prev => {
      const c = [...prev];
      c[idx] = { ...c[idx], data: { ...c[idx].data, ...newData } };
      return c;
    });
  }

  function removeBlock(idx) {
    setContentBlocks(prev => prev.filter((_, i) => i !== idx));
  }

  function handleDragStart(e, pos) { dragItem.current = pos; }
  function handleDragEnter(e, pos) { dragOverItem.current = pos; }
  function handleDrop() {
    const c = [...contentBlocks];
    const dragIdx = dragItem.current;
    const overIdx = dragOverItem.current;
    if (dragIdx === undefined || overIdx === undefined) return;
    const [m] = c.splice(dragIdx, 1);
    c.splice(overIdx, 0, m);
    dragItem.current = null;
    dragOverItem.current = null;
    setContentBlocks(c);
  }

  // upload helper used for per-block media upload
  async function uploadFiles(files, formType = "stories") {
    const fd = new FormData();
    files.forEach(f => fd.append("files", f));
    // pass formType so multer writes to uploads/<formType> folder
    const token = localStorage.getItem("admin_token") || localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}`, "x-form-type": formType } : { "x-form-type": formType };
    const res = await fetch(`${API_BASE}/api/stories/upload`, {
      method: "POST",
      headers,
      body: fd
    });
    return res.json();
  }

  async function handleMediaFileChange(e, idx) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const out = await uploadFiles([file], "stories");
      if (out?.ok && out.files?.[0]) {
        updateBlock(idx, { url: out.files[0].url, originalName: out.files[0].originalName });
      } else {
        alert("Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  }

  function handleCardImageSelect(e) {
    const f = e.target.files?.[0];
    setCardImageFile(f || null);
    if (f) setCardImagePreview(URL.createObjectURL(f));
  }
  function handleHeroImageSelect(e) {
    const f = e.target.files?.[0];
    setHeroImageFile(f || null);
    if (f) setHeroImagePreview(URL.createObjectURL(f));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      // If contentBlocks contains media blocks pointing to remote URLs
      // we don't need to re-upload them; card/hero are handled as files if selected
      const fd = new FormData();
      fd.append("title", title);
      fd.append("cardExcerpt", cardExcerpt || "");
      fd.append("tags", tags || "");
      fd.append("contentBlocks", JSON.stringify(contentBlocks || []));
      if (slugInput) fd.append("slug", slugInput);
      if (cardImageFile) fd.append("cardImage", cardImageFile);
      if (heroImageFile) fd.append("heroImage", heroImageFile);

      const isEdit = Boolean(initial && initial._id);
      const url = isEdit ? `/stories/${initial._id}` : `/stories`;
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      const res = await api[isEdit ? "put" : "post"](url, fd, config);
      if (res?.data?.ok) {
        alert("Saved");
        onSaved && onSaved(res.data.story);
      } else {
        console.error(res?.data);
        alert("Save failed");
      }
    } catch (err) {
      console.error("save error", err);
      alert("Save failed: " + (err?.message || ""));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-4xl">
      <div>
        <label>Title</label>
        <input value={title} onChange={e => setTitle(e.target.value)} className="w-full border p-2 rounded" required />
      </div>

      <div>
        <label>Card Excerpt</label>
        <textarea value={cardExcerpt} onChange={e => setCardExcerpt(e.target.value)} className="w-full border p-2 rounded" rows={3} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label>Slug (optional)</label>
          <input value={slugInput} onChange={e => setSlugInput(e.target.value)} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label>Tags (comma separated)</label>
          <input value={tags} onChange={e => setTags(e.target.value)} className="w-full border p-2 rounded" />
        </div>
      </div>

      <div>
        <label>Card Image</label>
        <input type="file" accept="image/*" onChange={handleCardImageSelect} />
        {cardImagePreview && <img src={cardImagePreview} alt="card preview" className="mt-2 rounded max-h-40" />}
      </div>

      <div>
        <label>Hero Image</label>
        <input type="file" accept="image/*" onChange={handleHeroImageSelect} />
        {heroImagePreview && <img src={heroImagePreview} alt="hero preview" className="mt-2 rounded max-h-40" />}
      </div>

      <div>
        <label className="mb-2 block">Content Blocks (drag to reorder)</label>
        <div className="space-y-3">
          {contentBlocks.map((b, idx) => (
            <div key={idx}
                 className="p-3 border rounded bg-white"
                 draggable
                 onDragStart={(e) => handleDragStart(e, idx)}
                 onDragEnter={(e) => handleDragEnter(e, idx)}
                 onDragOver={(e) => e.preventDefault()}
                 onDrop={handleDrop}
            >
              <div className="flex justify-between items-center mb-2">
                <strong>{b.type}</strong>
                <button type="button" onClick={() => removeBlock(idx)} className="text-sm text-red-600">Remove</button>
              </div>

              {b.type === "paragraph" && (
                <textarea value={b.data?.text || ""} onChange={e => updateBlock(idx, { text: e.target.value })} className="w-full border p-2 rounded" />
              )}

              {b.type === "heading" && (
                <input value={b.data?.text || ""} onChange={e => updateBlock(idx, { text: e.target.value })} className="w-full border p-2 rounded" />
              )}

              {b.type === "media" && (
                <>
                  <input type="file" onChange={e => handleMediaFileChange(e, idx)} />
                  <div className="mt-2 text-sm">
                    {b.data?.url ? <a href={b.data.url} target="_blank" rel="noreferrer">View uploaded</a> : "No media yet"}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="mt-3 flex gap-2">
          <button type="button" onClick={() => addBlock("heading")} className="px-3 py-1 bg-gray-100 rounded">+ Heading</button>
          <button type="button" onClick={() => addBlock("paragraph")} className="px-3 py-1 bg-gray-100 rounded">+ Paragraph</button>
          <button type="button" onClick={() => addBlock("media")} className="px-3 py-1 bg-gray-100 rounded">+ Media</button>
        </div>
      </div>

      <div className="flex gap-2">
        <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
          {loading ? (initial ? "Saving..." : "Creating...") : (initial ? "Save" : "Create")}
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">Cancel</button>
      </div>
    </form>
  );
}
