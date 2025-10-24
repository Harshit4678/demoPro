// src/controllers/mediaController.js
import fs from "fs";
import path from "path";
import Case from "../models/caseModel.js";

/**
 * Secure delete file by relative path.
 * Expects body: { filepath: "uploads/cases/2025-10-23/abc.jpg", caseId: "<optional>" }
 */
export async function deleteFile(req, res) {
  try {
    const { filepath, caseId } = req.body;
    if (!filepath) return res.status(400).json({ message: "filepath required" });

    // normalize and prevent path traversal
    const uploadsRoot = path.resolve(process.cwd(), "uploads");
    const targetPath = path.resolve(process.cwd(), filepath);

    if (!targetPath.startsWith(uploadsRoot)) {
      return res.status(400).json({ message: "Invalid filepath" });
    }

    // check exists
    if (!fs.existsSync(targetPath)) {
      return res.status(404).json({ message: "File not found on disk" });
    }

    // unlink
    await fs.promises.unlink(targetPath);

    // optionally remove from case.mediaFiles if caseId provided
    if (caseId) {
      const doc = await Case.findById(caseId);
      if (doc) {
        doc.mediaFiles = (doc.mediaFiles || []).filter(m => {
          // compare by url or originalName - try to match by url suffix
          if (!m.url) return true;
          const rel = m.url.split("/uploads/").pop();
          return rel !== filepath.split("/uploads/").pop();
        });
        await doc.save();
      }
    }

    return res.json({ ok: true, message: "Deleted" });
  } catch (err) {
    console.error("deleteFile err:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
}
