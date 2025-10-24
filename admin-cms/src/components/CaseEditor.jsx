// src/admin/components/CaseEditor.jsx
import React, { useState, useRef, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function CaseEditor({ initial = null, token, onSaved = null }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [slugInput, setSlugInput] = useState(initial?.slug || "");
  const [cardImageFile, setCardImageFile] = useState(null);
  const [heroImageFile, setHeroImageFile] = useState(null);
  const [tags, setTags] = useState((initial?.tags || []).join(","));
  const [contentBlocks, setContentBlocks] = useState(initial?.contentBlocks || []);
  const [cardExcerpt, setCardExcerpt] = useState(initial?.cardExcerpt || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTitle(initial?.title || "");
    setCardExcerpt(initial?.cardExcerpt || "");
    setTags((initial?.tags || []).join(","));
    setContentBlocks(initial?.contentBlocks || []);
    setSlugInput(initial?.slug || "");
  }, [initial]);

  const dragItem = useRef();
  const dragOverItem = useRef();

  function addBlock(type) {
    const b = { type, data: type === "paragraph" ? { text: "" } : {} };
    setContentBlocks(prev => [...prev, b]);
  }

  function updateBlock(idx, patch) {
    setContentBlocks(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], data: { ...(copy[idx].data || {}), ...patch } };
      return copy;
    });
  }

  function removeBlock(idx) {
    setContentBlocks(prev => prev.filter((_, i) => i !== idx));
  }

  function handleDragStart(e, position) {
    dragItem.current = position;
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragEnter(e, position) {
    dragOverItem.current = position;
  }

  function handleDrop() {
    const copy = [...contentBlocks];
    const dragIdx = dragItem.current;
    const overIdx = dragOverItem.current;
    if (dragIdx === undefined || overIdx === undefined) return;
    const [dragged] = copy.splice(dragIdx, 1);
    copy.splice(overIdx, 0, dragged);
    dragItem.current = null;
    dragOverItem.current = null;
    setContentBlocks(copy);
  }

  async function uploadFiles(files) {
    const fd = new FormData();
    for (const f of files) fd.append("files", f);
    const headers = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE}/api/cases/upload`, {
      method: "POST",
      headers,
      body: fd
    });
    return res.json();
  }

  async function handleMediaFileChange(e, idx) {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const out = await uploadFiles([file]);
      if (out.ok && out.files && out.files[0]) {
        updateBlock(idx, { url: out.files[0].url, originalName: out.files[0].originalName });
      } else {
        alert("Upload failed");
      }
    } catch (err) {
      console.error("uploadFiles err:", err);
      alert("Upload failed");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("cardExcerpt", cardExcerpt);
      fd.append("tags", tags);
      fd.append("contentBlocks", JSON.stringify(contentBlocks));
      if (slugInput) fd.append("slug", slugInput);
      if (cardImageFile) fd.append("cardImage", cardImageFile);
      if (heroImageFile) fd.append("heroImage", heroImageFile);

      const isEdit = Boolean(initial && initial._id);
      const url = isEdit ? `${API_BASE}/api/cases/${initial._id}` : `${API_BASE}/api/cases`;
      const method = isEdit ? "PUT" : "POST";

      const headers = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(url, {
        method,
        headers,
        body: fd
      });

      const text = await res.text();
      let data;
      try { data = text ? JSON.parse(text) : null; } catch { data = null; }

      if (!res.ok) {
        const msg = (data && data.message) || `Server responded ${res.status}`;
        throw new Error(msg);
      }

      alert("Saved successfully");
      onSaved && onSaved(data?.case || {});
    } catch (err) {
      console.error("save err:", err);
      alert("Save failed: " + (err.message || ""));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-4xl">
      <div>
        <label className="block text-sm font-medium">Title</label>
        <input value={title} onChange={e => setTitle(e.target.value)} className="w-full border p-2 rounded" />
      </div>

      <div>
        <label className="block text-sm font-medium">Card Excerpt (2-line text)</label>
        <textarea value={cardExcerpt} onChange={e => setCardExcerpt(e.target.value)} className="w-full border p-2 rounded" />
      </div>

      <div>
        <label className="block text-sm font-medium">Slug (optional — will be generated from Card Excerpt if empty)</label>
        <input value={slugInput} onChange={e => setSlugInput(e.target.value)} placeholder="e.g. cases-Support Saurav in His Battle..." className="w-full border p-2 rounded" />
        <div className="text-xs text-gray-500 mt-1">If left empty, slug will be generated from Card Excerpt (or Title). Spaces will be URL encoded.</div>
      </div>

      <div>
        <label className="block text-sm font-medium">Tags (comma separated)</label>
        <input value={tags} onChange={e => setTags(e.target.value)} className="w-full border p-2 rounded" />
      </div>

      <div>
        <label className="block text-sm font-medium">Card Image</label>
        <input type="file" accept="image/*" onChange={e => setCardImageFile(e.target.files[0])} />
        {initial?.cardImage && !cardImageFile && <div className="text-sm text-gray-500">Current: <a href={initial.cardImage} target="_blank" rel="noreferrer">view</a></div>}
      </div>

      <div>
        <label className="block text-sm font-medium">Hero Image</label>
        <input type="file" accept="image/*" onChange={e => setHeroImageFile(e.target.files[0])} />
        {initial?.heroImage && !heroImageFile && <div className="text-sm text-gray-500">Current: <a href={initial.heroImage} target="_blank" rel="noreferrer">view</a></div>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Content Blocks (drag to reorder)</label>
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
              <div className="flex justify-between mb-2">
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
                  <div className="mt-2 text-sm">{b.data?.url ? <a href={b.data.url} target="_blank" rel="noreferrer">Uploaded</a> : "No media yet"}</div>
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

      <div>
        <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
          {loading ? "Saving..." : initial ? "Update Case" : "Create Case"}
        </button>
      </div>
    </form>
  );
}
