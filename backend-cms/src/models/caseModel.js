// src/models/caseModel.js
import mongoose from "mongoose";

const ContentBlockSchema = new mongoose.Schema({
  type: { type: String, required: true }, // heading|paragraph|media|gallery|embed|file|quote|cta
  // flexible payload for each block type
  data: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { _id: false });

const CaseSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  cardImage: { type: String },   // public url to /uploads/...
  cardSubtitle: { type: String },
  cardExcerpt: { type: String },
  heroImage: { type: String },   // optional override
  status: { type: String, enum: ["draft","published","archived"], default: "draft" },
  tags: [{ type: String }],
  featured: { type: Boolean, default: false },
  listOrder: { type: Number, default: 0 },
  detailLayout: { type: String, default: "layout-A" }, // layout-A|B|C|D
  contentBlocks: { type: [ContentBlockSchema], default: [] },
  mediaFiles: [{ // optional simple list of uploaded media attached to this case
    url: String,
    originalName: String,
    mimeType: String,
    size: Number
  }],
  meta: {
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "AdminUser" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "AdminUser" }
  }
}, { timestamps: true });

export default mongoose.models.Case || mongoose.model("Case", CaseSchema);
