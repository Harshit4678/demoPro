SectionGallery.jsx// FILE: src/components/admin/SectionGallery.jsx
// Tailwind-only, @dnd-kit based component. Uses src/api/galleryApi.js (axios wrapper).

import React, { useEffect, useRef, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import {
  fetchSectionAndItems,
  uploadImages,
  deleteImage,
  replaceImage,
  updateMeta,
  bulkReorder,
  updateSectionConfig
} from "../services/galleryApi";

const PAGE_OPTIONS = [
  { label: "Education", slug: "education" },
  { label: "Health", slug: "health" },
  { label: "Livelihood", slug: "livelihood" },
  { label: "Old Age Assistance", slug: "old-age-assistance" },
  { label: "Women Empowerment", slug: "women-empowerment" },
  { label: "Homepage", slug: "homepage" }
];

function SortableCard({ item, onReplace, onDelete, onMetaSave }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item._id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  const fileInputRef = useRef();

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-56 border rounded-lg bg-white shadow-sm p-3 flex flex-col gap-3"
    >
      <div className="h-36 w-full rounded-md bg-gray-100 overflow-hidden flex items-center justify-center">
        <img src={item.url} alt={item.alt || ""} className="object-cover w-full h-full" />
      </div>

      <div className="flex flex-col gap-2">
        <input
          type="text"
          defaultValue={item.caption || ""}
          placeholder="Caption"
          onBlur={(e) => onMetaSave(item._id, { caption: e.target.value })}
          className="w-full px-2 py-1 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
        <input
          type="text"
          defaultValue={item.alt || ""}
          placeholder="Alt text"
          onBlur={(e) => onMetaSave(item._id, { alt: e.target.value })}
          className="w-full px-2 py-1 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current.click()}
            className="px-2 py-1 bg-indigo-600 text-white text-sm rounded"
          >
            Replace
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onReplace(item._id, f);
              e.target.value = "";
            }}
          />
          <button
            onClick={() => onDelete(item._1d)}
            className="px-2 py-1 bg-red-500 text-white text-sm rounded"
          >
            Delete
          </button>
        </div>

        <div
          {...attributes}
          {...listeners}
          className="p-1 text-gray-500 cursor-grab select-none"
          title="Drag to reorder"
        >
          ⠿
        </div>
      </div>
    </div>
  );
}

export default function SectionGallery() {
  const [pageSlug, setPageSlug] = useState(PAGE_OPTIONS[0].slug);
  const [section, setSection] = useState({ limit: 6, layout: "grid" });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    load(pageSlug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSlug]);

  async function load(slug) {
    setLoading(true);
    try {
      const data = await fetchSectionAndItems(slug, { all: true });
      setSection(data.section || { limit: 6, layout: "grid" });
      setItems(Array.isArray(data.items) ? data.items : []);
    } catch (err) {
      console.error(err);
      alert("Failed to load gallery. Check console.");
    } finally {
      setLoading(false);
    }
  }

  function willExceedLimit(fileCount) {
    const limit = section?.limit ?? 6;
    return (items.length + fileCount) > limit;
  }

  async function handleUpload(e) {
    e.preventDefault();
    const files = fileInputRef.current.files;
    if (!files || files.length === 0) return alert("Select files first");
    if (willExceedLimit(files.length)) return alert(`Limit exceeded: ${section.limit}. Current: ${items.length}`);
    setUploading(true);
    try {
      const res = await uploadImages(pageSlug, files);
      setItems(prev => [...prev, ...(res.created || [])]);
      fileInputRef.current.value = "";
      alert("Uploaded");
    } catch (err) {
      console.error(err);
      alert("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this image?")) return;
    try {
      await deleteImage(id);
      setItems(prev => prev.filter(i => i._id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  }

  async function handleReplace(id, file) {
    if (!file) return;
    if (!confirm("Replace this image?")) return;
    try {
      const res = await replaceImage(id, file);
      const newItem = res.item || res;
      setItems(prev => prev.map(it => it._id === id ? newItem : it));
      alert("Replaced");
    } catch (err) {
      console.error(err);
      alert("Replace failed");
    }
  }

  async function handleMetaSave(id, meta) {
    try {
      const res = await updateMeta(id, meta);
      setItems(prev => prev.map(it => it._id === id ? res : it));
    } catch (err) {
      console.error(err);
      alert("Save failed");
    }
  }

  async function handleLimitUpdate(e) {
    const val = Number(e.target.value);
    if (!Number.isInteger(val) || val < 1) return alert("Limit must be positive integer");
    if (val < items.length) return alert(`New limit ${val} is less than current images ${items.length}. Delete some images first.`);
    try {
      const res = await updateSectionConfig(pageSlug, { limit: val });
      setSection(res);
      alert("Limit updated");
    } catch (err) {
      console.error(err);
      alert("Failed to update limit");
    }
  }

  async function onDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex(i => i._id === active.id);
    const newIndex = items.findIndex(i => i._id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const newItems = arrayMove(items, oldIndex, newIndex).map((it, idx) => ({ ...it, order: idx }));
    setItems(newItems);

    try {
      await bulkReorder(pageSlug, newItems.map(it => ({ id: it._id, order: it.order })));
    } catch (err) {
      console.error(err);
      alert("Failed to save order. Reloading.");
      load(pageSlug);
    }
  }

  return (
    <div className="p-6 bg-gray-50 rounded-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Section Gallery (Admin)</h3>

        <div className="flex items-center gap-3">
          <label className="text-sm">Page</label>
          <select
            value={pageSlug}
            onChange={(e) => setPageSlug(e.target.value)}
            className="px-3 py-1 border rounded"
          >
            {PAGE_OPTIONS.map(p => <option key={p.slug} value={p.slug}>{p.label}</option>)}
          </select>

          <label className="text-sm">Limit</label>
          <input
            type="number"
            min={1}
            value={section.limit || 6}
            onChange={(e) => setSection(s => ({ ...(s||{}), limit: Number(e.target.value) }))}
            onBlur={handleLimitUpdate}
            className="w-20 px-2 py-1 border rounded"
          />
        </div>
      </div>

      <form className="flex items-center gap-3 mb-4" onSubmit={handleUpload}>
        <input ref={fileInputRef} type="file" multiple accept="image/*" className="text-sm" />
        <button type="submit" disabled={uploading} className="px-3 py-1 bg-indigo-600 text-white rounded">
          {uploading ? "Uploading..." : "Upload"}
        </button>
        <div className="text-sm text-gray-600">Current: <span className="font-medium">{items.length}</span> / <span className="font-medium">{section.limit}</span></div>
      </form>

      <div>
        {loading ? (
          <div className="text-sm text-gray-600">Loading...</div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={items.map(i => i._id)} strategy={rectSortingStrategy}>
              <div className="flex flex-wrap gap-4">
                {items.map((it) => (
                  <SortableCard
                    key={it._id}
                    item={it}
                    onReplace={handleReplace}
                    onDelete={handleDelete}
                    onMetaSave={handleMetaSave}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}


