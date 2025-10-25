// FILE: src/api/galleryApi.js
// axios wrapper using your existing src/api.js axios instance
import api from "./api";

async function handleRes(promise) {
  try {
    const res = await promise;
    return res.data;
  } catch (err) {
    if (err.response && err.response.data) throw err.response.data;
    throw err;
  }
}

export async function fetchSectionAndItems(slug, { all = false } = {}) {
  const q = all ? "?all=true" : "";
  return handleRes(api.get(`/pages/${slug}/gallery${q}`));
}

export async function uploadImages(slug, files) {
  const fd = new FormData();
  for (const f of files) fd.append("images", f);
  return handleRes(api.post(`/pages/${slug}/gallery`, fd, { headers: { "Content-Type": "multipart/form-data" } }));
}

export async function deleteImage(id) {
  return handleRes(api.delete(`/gallery/${id}`));
}

export async function replaceImage(id, file) {
  const fd = new FormData();
  fd.append("image", file);
  return handleRes(api.put(`/gallery/${id}/replace`, fd, { headers: { "Content-Type": "multipart/form-data" } }));
}

export async function updateMeta(id, payload) {
  return handleRes(api.put(`/gallery/${id}`, payload));
}

export async function bulkReorder(slug, items) {
  return handleRes(api.patch(`/pages/${slug}/gallery/reorder`, { items }));
}

export async function updateSectionConfig(slug, payload) {
  return handleRes(api.put(`/gallery-section/${slug}`, payload));
}


// FILE: PATCH: src/admin/pages/Dashboard.jsx
// Below is the patch snippet you can paste into your Dashboard.jsx to mount the SectionGallery tab

/*
1) Add this import at the top with other imports:
import SectionGallery from "../components/admin/SectionGallery";

2) Add "gallery" to your TABS list, example:
{ id: "gallery", label: "Section Gallery" }

3) In the tab content area, add:
{activeTab === "gallery" && (
  <div className="p-4">
    <SectionGallery />
  </div>
)}
*/
