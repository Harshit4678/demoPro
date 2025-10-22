// src/admin/pages/AboutTimeline.jsx
import React, { useEffect, useState } from "react";
import api from "../../services/api";

function TimelineForm({ onSaved, initial = null }) {
  const [form, setForm] = useState(
    initial ?? { session: "", title: "", paragraph: "", order: 0, side: "left" }
  );
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const isEdit = Boolean(initial && initial._id);

  useEffect(() => {
    if (initial) {
      setForm({
        session: initial.session || "",
        title: initial.title || "",
        paragraph: initial.paragraph || "",
        order: initial.order ?? 0,
        side: initial.side || "left",
      });
      setFile(null);
    }
  }, [initial]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("session", form.session);
      fd.append("title", form.title);
      fd.append("paragraph", form.paragraph);
      fd.append("order", form.order);
      fd.append("side", form.side);
      if (file) fd.append("image", file);

      const url = isEdit ? `/about/timeline/${initial._id}` : "/about/timeline";
      if (isEdit) {
        await api.put(url, fd);
      } else {
        await api.post(url, fd);
      }

      setForm({ session: "", title: "", paragraph: "", order: 0, side: "left" });
      setFile(null);
      onSaved?.();
    } catch (err) {
      console.error(err);
      alert("Error saving. Check console.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 bg-white p-4 rounded shadow">
      <div className="grid grid-cols-2 gap-2">
        <input
          value={form.session}
          onChange={(e) => setForm({ ...form, session: e.target.value })}
          placeholder="Session"
          className="p-2 border rounded"
          required
        />
        <select
          value={form.side}
          onChange={(e) => setForm({ ...form, side: e.target.value })}
          className="p-2 border rounded"
        >
          <option value="left">Image Right / Text Left</option>
          <option value="right">Image Left / Text Right</option>
        </select>
      </div>

      <input
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        placeholder="Main heading"
        className="w-full p-2 border rounded"
        required
      />

      <textarea
        value={form.paragraph}
        onChange={(e) => setForm({ ...form, paragraph: e.target.value })}
        placeholder="Paragraph"
        className="w-full p-2 border rounded"
        rows={4}
      />

      <div className="flex items-center gap-3">
        <input
          type="number"
          value={form.order}
          onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
          className="p-2 border rounded w-28"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-emerald-600 text-white rounded disabled:opacity-60"
          disabled={submitting}
        >
          {isEdit ? (submitting ? "Updating..." : "Update") : (submitting ? "Adding..." : "Add")}
        </button>
        {isEdit && (
          <button
            type="button"
            className="px-3 py-2 bg-gray-200 rounded"
            onClick={() => {
              setForm({ session: "", title: "", paragraph: "", order: 0, side: "left" });
              setFile(null);
              onSaved?.();
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default function AboutTimeline() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [imgStatus, setImgStatus] = useState({}); // per-item image load state
  const API_ORIGIN = api?.defaults?.baseURL
    ? api.defaults.baseURL.replace(/\/api\/?$/i, "")
    : "http://localhost:5000";

  // tolerant image builder — accepts many backend shapes
  const buildImageUrl = (it) => {
    const candidates = [
      it.imagePath,
      it.image,
      it.imageUrl,
      it.img,
      it.filename,
      it.fileName,
      it.picture,
      (it.image && it.image.path),
      (it.image && it.image.url),
    ];

    const raw =
      candidates.find((c) => typeof c === "string" && c.trim().length > 0) ||
      candidates.find((c) => c && typeof c === "object" && (c.path || c.url));
    if (!raw) return null;

    let s = typeof raw === "string" ? raw : raw.path || raw.url || "";
    s = s.replace(/\\\\/g, "/").trim();

    if (!s) return null;
    if (/^https?:\/\//i.test(s)) return s;

    if (!s.startsWith("/")) {
      if (s.startsWith("uploads/")) return `${API_ORIGIN}/${s}`;
      return `${API_ORIGIN}/uploads/${s}`;
    }

    return `${API_ORIGIN}${s}`;
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.get("/about/timeline");
      const data = res.data;
      console.log("TIMELINE DATA:", data);
      data.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      setItems(data);
    } catch (err) {
      console.error(err);
      alert("Error loading items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this timeline entry?")) return;
    try {
      await api.delete(`/about/timeline/${id}`);
      fetchItems();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Manage About → Timeline</h1>

      <TimelineForm
        key={editingItem?._id ?? "new"}
        initial={editingItem}
        onSaved={() => {
          setEditingItem(null);
          fetchItems();
        }}
      />

      <div className="mt-6 space-y-4">
        {loading ? (
          <div className="text-center py-6">Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-center text-sm text-gray-500 py-6">
            No timeline entries yet.
          </div>
        ) : (
          items.map((it) => (
            <div
              key={it._id}
              className="p-4 border rounded flex justify-between items-start"
            >
              <div>
                <div className="text-sm text-gray-500">{it.session}</div>
                <div className="font-semibold">{it.title}</div>
                <div className="text-sm text-slate-600">
                  {(it.paragraph || "").slice(0, 140)}
                </div>

                {/* Image section with skeleton and fallback */}
                {(() => {
                  const imgUrl = buildImageUrl(it);
                  return (
                    <div className="mt-2">
                      {(!imgUrl ||
                        imgStatus[it._id] === "loading" ||
                        imgStatus[it._id] === "idle") && (
                        <div className="w-40 h-24 rounded bg-gray-100 animate-pulse flex items-center justify-center">
                          <span className="text-xs text-gray-400">
                            Loading image...
                          </span>
                        </div>
                      )}

                      {imgUrl && (
                        <img
                          src={imgUrl}
                          alt={it.title || "timeline image"}
                          className={`mt-2 w-40 h-24 object-cover rounded transition-opacity duration-200 ${
                            imgStatus[it._id] === "loaded"
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                          onLoad={() => {
                            setImgStatus((p) => ({ ...p, [it._id]: "loaded" }));
                            console.log("Image loaded:", imgUrl);
                          }}
                          onError={() => {
                            setImgStatus((p) => ({ ...p, [it._id]: "error" }));
                            console.warn("Image failed:", imgUrl);
                          }}
                          onAbort={() => {
                            setImgStatus((p) => ({ ...p, [it._id]: "error" }));
                          }}
                        />
                      )}

                      {imgUrl && imgStatus[it._id] === "error" && (
                        <div className="w-40 h-24 rounded border border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-500 mt-2">
                          Image not available
                        </div>
                      )}

                      {!imgUrl && (
                        <div className="mt-2 text-xs text-gray-500">
                          No image for this timeline entry
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(it._id);
                    alert("ID copied");
                  }}
                  className="px-3 py-1 border rounded"
                >
                  ID
                </button>

                <button
                  onClick={() => setEditingItem(it)}
                  className="px-3 py-1 border rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(it._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
