// src/controllers/who-we-are/aboutController.js
import TimelineItem from "../../models/who-we-are/TimelineItem.js";
import fs from "fs";
import path from "path";

// helper to convert multer file.path -> web path like /uploads/...
function fileWebPath(file) {
  if (!file) return undefined;
  const absolute = file.path || (file.destination && path.join(file.destination, file.filename)) || null;
  if (absolute) {
    const marker = path.sep + "uploads" + path.sep;
    const idx = absolute.indexOf(marker);
    if (idx !== -1) {
      return absolute.slice(idx).split(path.sep).join("/");
    }
  }
  // fallback
  return `/uploads/${file.filename}`;
}

export const getTimeline = async (req, res) => {
  try {
    const items = await TimelineItem.find().sort({ order: 1, createdAt: 1 });
    res.json(items);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const createTimelineItem = async (req, res) => {
  try {
    const { session, title, paragraph, order, side } = req.body;
    const imagePath = req.file ? fileWebPath(req.file) : undefined;
    const item = new TimelineItem({ session, title, paragraph, order, side, imagePath });
    await item.save();
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const updateTimelineItem = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await TimelineItem.findById(id);
    if (!existing) return res.status(404).json({ error: "Not found" });

    // if new file uploaded, remove old file (optional)
    if (req.file && existing.imagePath) {
      const oldRel = existing.imagePath.replace(/^\//, "");
      const oldPath = path.join(process.cwd(), oldRel);
      fs.unlink(oldPath, () => {});
      existing.imagePath = fileWebPath(req.file);
    }

    const { session, title, paragraph, order, side } = req.body;
    existing.session = session ?? existing.session;
    existing.title = title ?? existing.title;
    existing.paragraph = paragraph ?? existing.paragraph;
    existing.order = order ?? existing.order;
    existing.side = side ?? existing.side;
    await existing.save();
    res.json(existing);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const deleteTimelineItem = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await TimelineItem.findById(id);
    if (!existing) return res.status(404).json({ error: "Not found" });
    if (existing.imagePath) {
      const rel = existing.imagePath.replace(/^\//, "");
      const p = path.join(process.cwd(), rel);
      fs.unlink(p, () => {});
    }
    await TimelineItem.deleteOne({ _id: id });
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
