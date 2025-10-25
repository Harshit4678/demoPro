// src/models/Story.js
import mongoose from "mongoose";

const BlockSchema = new mongoose.Schema({
  type: { type: String, required: true }, // paragraph, heading, media, quote...
  data: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { _id: false });

const StorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  cardExcerpt: { type: String },
  cardImage: { type: String }, // url -> /uploads/...
  heroImage: { type: String },
  location: { type: String },
  tags: [String],
  publishedAt: { type: Date, default: Date.now },
  contentBlocks: { type: [BlockSchema], default: [] },
  meta: { type: mongoose.Schema.Types.Mixed, default: {} }
}, {
  timestamps: true
});

export default mongoose.models.Story || mongoose.model("Story", StorySchema);
