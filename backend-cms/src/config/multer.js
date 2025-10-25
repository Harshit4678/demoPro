// src/config/multer.js
import multer from "multer";
import path from "path";
import fs from "fs";

function ensureDirSync(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      const formTypeFromQuery = (req.query && typeof req.query === "object" && req.query.formType) ? req.query.formType : undefined;
      const formType = formTypeFromQuery || req.headers["x-form-type"] || req._formType || "misc";

      const now = new Date();
      const dateStr = now.toISOString().slice(0, 10); // YYYY-MM-DD
      const uploadsRoot = path.resolve(process.cwd(), "uploads");
      const dest = path.join(uploadsRoot, formType, dateStr);

      ensureDirSync(dest);
      cb(null, dest);
    } catch (err) {
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext).replace(/\s+/g, "-");
    const timestamp = Date.now();
    cb(null, `${timestamp}-${name}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|gif|pdf|mp4|mov|mpeg/;
  const ext = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;
  if (allowed.test(ext) || allowed.test(mimetype)) cb(null, true);
  else cb(null, false);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fieldSize: 10 * 1024 * 1024,
    fileSize: 200 * 1024 * 1024
  }
});
