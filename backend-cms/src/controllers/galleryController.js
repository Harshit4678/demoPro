// src/controllers/galleryController.js
import path from "path";
import GalleryItem from "../models/GalleryItem.js";
import GallerySection from "../models/GallerySection.js";
import { safeUnlink } from "../utils/fileUtils.js";

/**
 * Upload images (admin)
 * - multer already saved files to disk (req.files)
 * - enforce section.limit, rollback on failure
 */
export async function uploadGallery(req, res) {
  const slug = req.params.slug;
  if (!req.files || req.files.length === 0) return res.status(400).json({ error: "No files uploaded" });

  let section = await GallerySection.findOne({ pageSlug: slug });
  if (!section) section = await GallerySection.create({ pageSlug: slug, limit: 6 });

  const existingCount = await GalleryItem.countDocuments({ pageSlug: slug });
  if (existingCount + req.files.length > section.limit) {
    // cleanup uploaded files
    for (const f of req.files) await safeUnlink(f.path);
    return res.status(400).json({
      error: `Limit exceeded. Existing ${existingCount}, trying to add ${req.files.length}. Max allowed: ${section.limit}`
    });
  }

  const created = [];
  try {
    for (const f of req.files) {
      const rel = path.relative(process.cwd(), f.path).replace(/\\/g, "/");
      const url = `/${rel}`;
      const doc = await GalleryItem.create({
        pageSlug: slug,
        sectionId: section._id,
        filePath: rel,
        fileName: f.filename,
        url
      });
      created.push(doc);
    }
    return res.json({ ok: true, created });
  } catch (err) {
    // rollback files if DB fails
    if (req.files && req.files.length) {
      for (const f of req.files) await safeUnlink(f.path);
    }
    console.error("Upload error:", err);
    return res.status(500).json({ error: "Upload failed and rolled back" });
  }
}

/**
 * List gallery items (public + admin)
 * - ?all=true requires admin (req.user from authOptional)
 * - otherwise returns section.limit items
 */
export async function listGallery(req, res) {
  try {
    const slug = req.params.slug;
    const section = await GallerySection.findOne({ pageSlug: slug }) || { limit: 6, layout: "grid" };
    let items = await GalleryItem.find({ pageSlug: slug }).sort({ order: 1, createdAt: 1 }).lean();

    if (req.query.all) {
      // require admin
      if (!req.user || !req.user.isAdmin) return res.status(403).json({ error: "Forbidden" });
      return res.json({ section, items });
    }

    items = items.slice(0, section.limit);
    return res.json({ section, items });
  } catch (err) {
    console.error("List gallery error:", err);
    return res.status(500).json({ error: "Failed to fetch gallery" });
  }
}

/**
 * Update metadata for single item (alt, caption, order)
 */
export async function updateMeta(req, res) {
  try {
    const id = req.params.id;
    const payload = (({ alt, caption, order }) => ({ alt, caption, order }))(req.body);
    const item = await GalleryItem.findByIdAndUpdate(id, payload, { new: true });
    if (!item) return res.status(404).json({ error: "Not found" });
    return res.json(item);
  } catch (err) {
    console.error("Update meta error:", err);
    return res.status(500).json({ error: "Update failed" });
  }
}

/**
 * Bulk reorder
 * body: { items: [{ id, order }, ...] }
 */
export async function reorderGallery(req, res) {
  try {
    const updates = req.body.items;
    if (!Array.isArray(updates)) return res.status(400).json({ error: "Invalid payload" });
    const ops = updates.map(u => ({
      updateOne: { filter: { _id: u.id }, update: { $set: { order: u.order } } }
    }));
    if (ops.length) await GalleryItem.bulkWrite(ops);
    return res.json({ ok: true });
  } catch (err) {
    console.error("Reorder error:", err);
    return res.status(500).json({ error: "Reorder failed" });
  }
}

/**
 * Replace image for an existing item
 * - multer stored new file at req.file
 * - update DB then delete old file (safe)
 */
export async function replaceImage(req, res) {
  try {
    const id = req.params.id;
    const item = await GalleryItem.findById(id);
    if (!item) {
      if (req.file) await safeUnlink(req.file.path);
      return res.status(404).json({ error: "Not found" });
    }
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const oldPath = item.filePath;
    const rel = path.relative(process.cwd(), req.file.path).replace(/\\/g, "/");
    const url = `/${rel}`;

    // update DB to new file
    item.filePath = rel;
    item.fileName = req.file.filename;
    item.url = url;
    await item.save();

    // delete old file
    if (oldPath && oldPath !== rel) await safeUnlink(oldPath);

    return res.json({ ok: true, item });
  } catch (err) {
    if (req.file) await safeUnlink(req.file.path);
    console.error("Replace error:", err);
    return res.status(500).json({ error: "Replace failed" });
  }
}

/**
 * Delete item (DB + file)
 */
export async function deleteImage(req, res) {
  try {
    const id = req.params.id;
    const item = await GalleryItem.findById(id);
    if (!item) return res.status(404).json({ error: "Not found" });

    await GalleryItem.deleteOne({ _id: id });
    if (item.filePath) await safeUnlink(item.filePath);
    return res.json({ ok: true });
  } catch (err) {
    console.error("Delete error:", err);
    return res.status(500).json({ error: "Delete failed" });
  }
}

/**
 * Update gallery section config (limit/layout)
 */
export async function updateSection(req, res) {
  try {
    const slug = req.params.slug;
    const { limit, layout } = req.body;
    let section = await GallerySection.findOne({ pageSlug: slug });
    if (!section) return res.status(404).json({ error: "Section not found" });

    if (typeof limit === "number") {
      const itemCount = await GalleryItem.countDocuments({ pageSlug: slug });
      if (limit < itemCount) {
        return res.status(400).json({
          error: `New limit ${limit} is less than current items ${itemCount}. Delete items first or set limit >= ${itemCount}.`
        });
      }
      section.limit = limit;
    }
    if (layout) section.layout = layout;
    await section.save();
    return res.json(section);
  } catch (err) {
    console.error("Update section error:", err);
    return res.status(500).json({ error: "Update section failed" });
  }
}
