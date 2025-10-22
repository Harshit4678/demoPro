// src/models/Lead.js
import mongoose from "mongoose";
const { Schema } = mongoose;

const NoteSchema = new Schema({
  by: { type: Schema.Types.ObjectId, ref: "User", default: null },
  text: String,
  at: { type: Date, default: Date.now }
});

const AttachmentSchema = new Schema({
  url: String,
  path: String,
  name: String,
  size: Number,
  mime: String,
  uploadedAt: { type: Date, default: Date.now }
});

const LeadSchema = new Schema({
  formType: { type: String, required: true }, // career/intern/volunteer/ngo/csr/corporate
  referenceId: { type: String, index: true },
  name: String,
  email: String,
  phone: String,
  message: String,

  // career/intern
  jobProfileName: String,
  desiredJobProfile: String,
  resumeUrl: String,

  // org/company
  orgName: String,
  website: String,
  contactPerson: String,
  contactNumber: String,
  orgAddress: String,

  attachments: [AttachmentSchema],
  formData: { type: Schema.Types.Mixed },

  status: { type: String, default: "new", enum: ["new","reviewed","contacted","closed","spam"] },
  assignedTo: { type: Schema.Types.ObjectId, ref: "User", default: null },
  tags: [String],
  notes: [NoteSchema],
  source: String,
  ip: String,
  userAgent: String,
  deleted: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

LeadSchema.pre("save", function(next){
  this.updatedAt = Date.now();
  next();
});

LeadSchema.index({ formType: 1, status: 1, createdAt: -1 });
LeadSchema.index({ email: 1, phone: 1 });

export default mongoose.model("Lead", LeadSchema);
