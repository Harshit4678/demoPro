// src/utils/fileUtils.js
import fs from "fs/promises";
import path from "path";

const UPLOADS_ROOT = path.resolve(process.cwd(), "uploads");

function isPathInsideUploads(resolvedPath) {
  const rel = path.relative(UPLOADS_ROOT, resolvedPath);
  // if rel starts with .. or isAbsolute -> outside
  if (!rel) return false; // same path -> uploads root (we don't delete root)
  return !rel.startsWith("..") && !path.isAbsolute(rel);
}

export async function safeUnlink(relOrAbsPath) {
  try {
    const resolved = path.isAbsolute(relOrAbsPath)
      ? path.resolve(relOrAbsPath)
      : path.resolve(process.cwd(), relOrAbsPath);

    if (!isPathInsideUploads(resolved)) {
      console.warn("safeUnlink: refusing to delete outside uploads:", resolved);
      return false;
    }

    await fs.unlink(resolved);
    await removeEmptyFoldersUpwards(path.dirname(resolved));
    return true;
  } catch (err) {
    if (err.code === "ENOENT") {
      // already gone
      return false;
    }
    console.error("safeUnlink error:", err);
    return false;
  }
}

async function removeEmptyFoldersUpwards(dir) {
  try {
    const uploadsRoot = UPLOADS_ROOT;
    let current = path.resolve(dir);

    while (current.startsWith(uploadsRoot) && current !== uploadsRoot) {
      const files = await fs.readdir(current);
      if (files.length === 0) {
        await fs.rmdir(current);
        current = path.dirname(current);
      } else {
        break;
      }
    }
  } catch (err) {
    // ignore
  }
}
