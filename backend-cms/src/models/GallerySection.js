// src/models/GallerySection.js
import mongoose from "mongoose";

const GallerySectionSchema = new mongoose.Schema({
  pageSlug: { type: String, required: true, unique: true }, // one section per pageSlug
  limit: { type: Number, default: 6 },
  layout: { type: String, default: "grid" },
  settings: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

export default mongoose.models?.GallerySection || mongoose.model("GallerySection", GallerySectionSchema);
