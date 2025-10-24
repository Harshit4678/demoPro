// src/controllers/casesController.js
import path from "path";
import fs from "fs";
import slugify from "slugify"; // optional but kept for safety
import Case from "../models/caseModel.js";

/**
 * helper to build public URL for uploaded file path returned by multer
 */
function fileToPublicUrl(file) {
  if (!file) return null;
  const baseUrl = process.env.BASE_URL || "http://localhost:5000";
  const parts = file.path.split(path.sep);
  const uploadsIndex = parts.indexOf("uploads");
  const rel = uploadsIndex >= 0 ? parts.slice(uploadsIndex).join("/") : file.filename;
  return `${baseUrl}/${rel.replace(/\\/g, "/")}`;
}

/* CREATE CASE */
export async function createCase(req, res) {
  try {
    const {
      title = "",
      slug: incomingSlug,
      cardSubtitle,
      cardExcerpt,
      tags,
      detailLayout,
      status,
      contentBlocks
    } = req.body;

    if (!title && !cardExcerpt) return res.status(400).json({ message: "Title or Card Excerpt required" });

    const doc = new Case({
      title,
      cardSubtitle,
      cardExcerpt,
      detailLayout,
      status: status || "draft",
      tags: tags ? tags.split(",").map(t => t.trim()).filter(Boolean) : []
    });

    // files from multer
    if (req.files) {
      if (req.files.cardImage && req.files.cardImage[0]) {
        doc.cardImage = fileToPublicUrl(req.files.cardImage[0]);
      }
      if (req.files.heroImage && req.files.heroImage[0]) {
        doc.heroImage = fileToPublicUrl(req.files.heroImage[0]);
      }
      if (req.files.contentFiles && req.files.contentFiles.length) {
        doc.mediaFiles = req.files.contentFiles.map(f => ({
          url: fileToPublicUrl(f),
          originalName: f.originalname,
          mimeType: f.mimetype,
          size: f.size
        }));
      }
    }

    // parse contentBlocks if provided
    if (contentBlocks) {
      try {
        doc.contentBlocks = typeof contentBlocks === "string" ? JSON.parse(contentBlocks) : contentBlocks;
      } catch (err) {
        return res.status(400).json({ message: "Invalid contentBlocks JSON" });
      }
    }

    // --- SLUG generation: use incoming slug (if given), else cardExcerpt (first 120 chars), else title
    const incomingSlugRaw = (incomingSlug || "").toString().trim();
    let baseForSlug;
    if (incomingSlugRaw) {
      baseForSlug = incomingSlugRaw;
    } else if (cardExcerpt) {
      baseForSlug = cardExcerpt.toString().trim().slice(0, 120);
    } else {
      baseForSlug = title.toString().trim().slice(0, 120);
    }

    let generatedSlug = encodeURIComponent(baseForSlug);
    let uniqueSlug = generatedSlug;
    let i = 1;
    while (await Case.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${generatedSlug}-${i++}`;
    }
    doc.slug = uniqueSlug;

    if (req.userId) doc.meta = { ...(doc.meta || {}), createdBy: req.userId };

    await doc.save();
    return res.status(201).json({ ok: true, case: doc });
  } catch (err) {
    console.error("createCase error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
}

/* LIST CASES */
export async function listCases(req, res) {
  try {
    const { page = 1, limit = 12, q, tags, status } = req.query;
    const filter = {};

    if (q) filter.$or = [
      { title: { $regex: q, $options: "i" } },
      { cardExcerpt: { $regex: q, $options: "i" } },
      { cardSubtitle: { $regex: q, $options: "i" } }
    ];
    if (tags) filter.tags = { $in: tags.split(",").map(t => t.trim()) };
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Case.countDocuments(filter);
    const items = await Case.find(filter)
      .sort({ featured: -1, listOrder: 1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    return res.json({ ok: true, total, page: Number(page), limit: Number(limit), items });
  } catch (err) {
    console.error("listCases error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

/* GET detail by slug */
export async function getCaseBySlug(req, res) {
  try {
    let { slug } = req.params;
    if (!slug) return res.status(400).json({ message: "Missing slug" });

    // Try exact
    let doc = await Case.findOne({ slug }).lean();

    // Try encoded (if request sent decoded)
    if (!doc) {
      const enc = encodeURIComponent(slug);
      if (enc !== slug) {
        doc = await Case.findOne({ slug: enc }).lean();
      }
    }

    // Try decoded (if DB stored raw/decoded somehow)
    if (!doc) {
      try {
        const dec = decodeURIComponent(slug);
        if (dec !== slug) {
          doc = await Case.findOne({ slug: dec }).lean();
        }
      } catch {
        // ignore decode errors
      }
    }

    if (!doc) return res.status(404).json({ message: "Not found" });
    return res.json({ ok: true, case: doc });
  } catch (err) {
    console.error("getCaseBySlug error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}


/* UPDATE case */
export async function updateCase(req, res) {
  try {
    const { id } = req.params;
    const doc = await Case.findById(id);
    if (!doc) return res.status(404).json({ message: "Not found" });

    const {
      title,
      slug, // optional admin-provided slug
      cardSubtitle,
      cardExcerpt,
      tags,
      detailLayout,
      status,
      contentBlocks
    } = req.body;

    if (title !== undefined) doc.title = title;
    if (cardSubtitle !== undefined) doc.cardSubtitle = cardSubtitle;
    if (cardExcerpt !== undefined) doc.cardExcerpt = cardExcerpt;
    if (detailLayout !== undefined) doc.detailLayout = detailLayout;
    if (status !== undefined) doc.status = status;
    if (tags !== undefined) doc.tags = tags ? tags.split(",").map(t => t.trim()).filter(Boolean) : [];

    // files
    if (req.files) {
      if (req.files.cardImage && req.files.cardImage[0]) {
        doc.cardImage = fileToPublicUrl(req.files.cardImage[0]);
      }
      if (req.files.heroImage && req.files.heroImage[0]) {
        doc.heroImage = fileToPublicUrl(req.files.heroImage[0]);
      }
      if (req.files.contentFiles && req.files.contentFiles.length) {
        const newFiles = req.files.contentFiles.map(f => ({
          url: fileToPublicUrl(f),
          originalName: f.originalname,
          mimeType: f.mimetype,
          size: f.size
        }));
        doc.mediaFiles = (doc.mediaFiles || []).concat(newFiles);
      }
    }

    if (contentBlocks !== undefined) {
      try {
        doc.contentBlocks = typeof contentBlocks === "string" ? JSON.parse(contentBlocks) : contentBlocks;
      } catch (err) {
        return res.status(400).json({ message: "Invalid contentBlocks JSON" });
      }
    }

    // SLUG update logic: if admin provided slug use it (unique), else if cardExcerpt provided regenerate from it
    if (slug !== undefined) {
      const inSlug = (slug || "").toString().trim();
      if (inSlug) {
        let candidate = encodeURIComponent(inSlug);
        let u = candidate;
        let k = 1;
        while (await Case.findOne({ slug: u, _id: { $ne: doc._id } })) {
          u = `${candidate}-${k++}`;
        }
        doc.slug = u;
      }
    } else if (cardExcerpt !== undefined && cardExcerpt) {
      const base = cardExcerpt.toString().trim().slice(0, 120);
      let candidate = encodeURIComponent(base);
      let u = candidate;
      let k = 1;
      while (await Case.findOne({ slug: u, _id: { $ne: doc._id } })) {
        u = `${candidate}-${k++}`;
      }
      doc.slug = u;
    }
    // else keep existing

    if (req.userId) doc.meta = { ...(doc.meta || {}), updatedBy: req.userId };

    await doc.save();
    return res.json({ ok: true, case: doc });
  } catch (err) {
    console.error("updateCase error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
}

/* DELETE */
export async function deleteCase(req, res) {
  try {
    const { id } = req.params;
    const doc = await Case.findByIdAndDelete(id);
    if (!doc) return res.status(404).json({ message: "Not found" });
    return res.json({ ok: true, message: "Deleted" });
  } catch (err) {
    console.error("deleteCase error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

/* uploadMediaOnly */
export async function uploadMediaOnly(req, res) {
  try {
    if (!req.files || (!req.files.files && !req.files.contentFiles)) return res.status(400).json({ message: "No files uploaded" });
    const filesList = (req.files.files || req.files.contentFiles || []).map(f => ({
      url: fileToPublicUrl(f),
      originalName: f.originalname,
      mimeType: f.mimetype,
      size: f.size
    }));
    return res.json({ ok: true, files: filesList });
  } catch (err) {
    console.error("uploadMediaOnly error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
}
