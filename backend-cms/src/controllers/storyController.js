// src/controllers/storyController.js
import Story from "../models/Story.js";
import slugify from "slugify";
import path from "path";

const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

// ---------- Helper ----------
function fileToUrl(file) {
  if (!file) return "";
  const p = file.path || "";
  const idx = p.indexOf(`${path.sep}uploads${path.sep}`);
  if (idx >= 0) {
    const rel = p.slice(idx + 1).replace(/\\/g, "/");
    return `${BASE_URL}/${rel}`; // ✅ Full URL fix
  }
  return `${BASE_URL}/uploads/${file.filename || ""}`;
}

// ---------- List ----------
export const listStories = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit || "100");
    const stories = await Story.find().sort({ createdAt: -1 }).limit(limit).lean();
    res.json({ ok: true, stories });
  } catch (err) {
    next(err);
  }
};

// ---------- Get by slug ----------
export const getStoryBySlug = async (req, res, next) => {
  try {
    const story = await Story.findOne({ slug: req.params.slug }).lean();
    if (!story) return res.status(404).json({ ok: false, message: "Not found" });
    res.json({ ok: true, story });
  } catch (err) {
    next(err);
  }
};

// ---------- Get by ID ----------
export const getStoryById = async (req, res, next) => {
  try {
    const story = await Story.findById(req.params.id).lean();
    if (!story) return res.status(404).json({ ok: false, message: "Not found" });
    res.json({ ok: true, story });
  } catch (err) {
    next(err);
  }
};

// ---------- Create ----------
export const createStory = async (req, res, next) => {
  try {
    const b = req.body;
    const title = b.title || "Untitled";
    const baseSlug = slugify(b.slug || title, { lower: true, strict: true });
    let slug = baseSlug;
    let i = 0;
    while (await Story.findOne({ slug })) slug = `${baseSlug}-${++i}`;

    const data = {
      title,
      slug,
      cardExcerpt: b.cardExcerpt || "",
      tags: b.tags ? String(b.tags).split(",").map(s=>s.trim()).filter(Boolean) : [],
      contentBlocks: b.contentBlocks ? JSON.parse(b.contentBlocks) : [],
      cardImage: req.files?.cardImage?.[0] ? fileToUrl(req.files.cardImage[0]) : "",
      heroImage: req.files?.heroImage?.[0] ? fileToUrl(req.files.heroImage[0]) : "",
      createdAt: new Date()
    };

    const story = await Story.create(data);
    res.status(201).json({ ok: true, story });
  } catch (err) {
    console.error("createStory error:", err);
    next(err);
  }
};

// ---------- Update ----------
export const updateStory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const b = req.body;
    const upd = {};

    if (b.title) upd.title = b.title;
    if (b.cardExcerpt) upd.cardExcerpt = b.cardExcerpt;
    if (b.tags) upd.tags = String(b.tags).split(",").map(s=>s.trim()).filter(Boolean);
    if (b.contentBlocks) upd.contentBlocks = JSON.parse(b.contentBlocks);
    if (b.slug) upd.slug = slugify(b.slug, { lower: true, strict: true });

    if (req.files?.cardImage?.[0]) upd.cardImage = fileToUrl(req.files.cardImage[0]);
    if (req.files?.heroImage?.[0]) upd.heroImage = fileToUrl(req.files.heroImage[0]);

    const story = await Story.findByIdAndUpdate(id, upd, { new: true });
    if (!story) return res.status(404).json({ ok: false, message: "Not found" });
    res.json({ ok: true, story });
  } catch (err) {
    console.error("updateStory error:", err);
    next(err);
  }
};

// ---------- Delete ----------
export const deleteStory = async (req, res, next) => {
  try {
    const story = await Story.findByIdAndDelete(req.params.id);
    if (!story) return res.status(404).json({ ok: false, message: "Not found" });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};

// ---------- Upload ----------
export const uploadFilesForStories = (uploadMiddleware) => [
  uploadMiddleware.array("files", 12),
  (req, res) => {
    try {
      const files = (req.files || []).map(f => ({
        originalName: f.originalname,
        filename: f.filename,
        url: fileToUrl(f)
      }));
      res.json({ ok: true, files });
    } catch (err) {
      console.error("uploadFilesForStories:", err);
      res.status(500).json({ ok: false, message: "Upload failed" });
    }
  }
];
