// src/models/GalleryItem.js
import mongoose from "mongoose";

const GalleryItemSchema = new mongoose.Schema({
  pageSlug: { type: String, required: true, index: true }, // 'education','health',...
  sectionId: { type: mongoose.Schema.Types.ObjectId, ref: "GallerySection", default: null }, // optional link
  filePath: { type: String, required: true }, // relative path like "uploads/education/2025-10-25/123-f.jpg"
  fileName: { type: String, required: true },
  url: { type: String, required: true }, // public URL like "/uploads/education/2025-10-25/123-f.jpg"
  alt: { type: String, default: "" },
  caption: { type: String, default: "" },
  order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models?.GalleryItem || mongoose.model("GalleryItem", GalleryItemSchema);
