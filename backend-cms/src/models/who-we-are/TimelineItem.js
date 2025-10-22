// src/models/who-we-are/TimelineItem.js
import mongoose from "mongoose";

const TimelineItemSchema = new mongoose.Schema({
  session: { type: String, trim: true },
  title: { type: String, required: true, trim: true },
  paragraph: { type: String, trim: true },
  imagePath: { type: String }, // e.g. "/uploads/abc.jpg"
  order: { type: Number, default: 0 },
  side: { type: String, enum: ["left", "right"], default: "left" },
}, { timestamps: true });

export default mongoose.models.TimelineItem || mongoose.model("TimelineItem", TimelineItemSchema);
