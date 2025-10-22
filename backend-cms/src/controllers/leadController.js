// src/controllers/leadController.js
import Lead from "../models/Lead.js";
import generateReferenceId from "../utils/refId.js";
import path from "path";
import { Parser } from "json2csv";

/**
 * createLead
 * - expects multipart/form-data with optional files under 'files'
 */
export const createLead = async (req, res) => {
  try {
    const payload = req.body || {};
    const formType = (payload.formType || "general").toLowerCase();

    const referenceId = await generateReferenceId();

    const doc = {
      formType,
      referenceId,
      name: payload.name || payload.fullName || "",
      email: payload.email || "",
      phone: payload.phone || payload.contactNumber || payload.mobile || "",
      message: payload.message || "",
      orgName: payload.orgName || payload.ngoName || payload.companyName || "",
      website: payload.website || "",
      contactPerson: payload.contactPerson || payload.contactName || "",
      contactNumber: payload.contactNumber || payload.mobile || "",
      formData: payload,
      source: payload.source || null,
      ip: req.ip || req.headers["x-forwarded-for"] || null,
      userAgent: req.get("User-Agent") || "",
      attachments: []
    };

    // map files -> attachments with public URL
    const BASE_URL = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;

    if (req.files && req.files.length) {
      const saved = req.files.map((f) => {
        const absolute = f.path || (f.destination && path.join(f.destination, f.filename)) || null;
        let webPath = `/uploads/${formType}/${f.filename}`; // fallback
        if (absolute) {
          const idx = absolute.indexOf(path.sep + "uploads" + path.sep);
          if (idx !== -1) {
            webPath = absolute.slice(idx).split(path.sep).join("/");
          }
        }
        const publicUrl = `${BASE_URL}${webPath}`;
        return {
          url: publicUrl,
          path: webPath,
          name: f.originalname || f.filename,
          size: f.size,
          mime: f.mimetype,
          uploadedAt: new Date()
        };
      });
      doc.attachments = saved;

      const resume = saved.find(a => /resume|cv|\.pdf|\.docx?|\.doc/i.test(a.name));
      if (resume) doc.resumeUrl = resume.url;
    }

    const lead = new Lead(doc);
    await lead.save();

    // fire async notifications here (queue/email/socket) - not blocking
    return res.status(201).json({
      success: true,
      id: lead._id,
      referenceId: lead.referenceId,
      message: "Submission received"
    });
  } catch (err) {
    console.error("createLead error", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

export const getLeads = async (req, res) => {
  try {
    const { page = 1, limit = 20, formType, status, q, from, to, assigned } = req.query;
    const filter = { deleted: false };

    if (formType) filter.formType = formType;
    if (status) filter.status = status;
    if (assigned) filter.assignedTo = assigned;
    if (q) filter.$or = [
      { name: new RegExp(q, "i") },
      { email: new RegExp(q, "i") },
      { phone: new RegExp(q, "i") },
      { referenceId: new RegExp(q, "i") }
    ];
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Lead.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
      Lead.countDocuments(filter)
    ]);

    res.json({ success: true, items, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    console.error("getLeads", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export const getLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).lean();
    if (!lead) return res.status(404).json({ success: false, error: "Not found" });
    res.json({ success: true, item: lead });
  } catch (err) {
    console.error("getLead", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export const updateLead = async (req, res) => {
  try {
    const update = req.body || {};
    const allowed = {}; // note: removed TypeScript type for JS file
    if (update.status) allowed.status = update.status;
    if (update.assignedTo) allowed.assignedTo = update.assignedTo;
    if (update.tags) allowed.tags = update.tags;
    if (update.message) allowed.message = update.message;
    if (update.note) {
      allowed.$push = { notes: { by: req.user ? req.user._id : null, text: update.note } };
    }
    const lead = await Lead.findByIdAndUpdate(req.params.id, allowed, { new: true });
    if (!lead) return res.status(404).json({ success: false, error: "Not found" });
    res.json({ success: true, item: lead });
  } catch (err) {
    console.error("updateLead", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, { deleted: true }, { new: true });
    if (!lead) return res.status(404).json({ success: false, error: "Not found" });
    res.json({ success: true });
  } catch (err) {
    console.error("deleteLead", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export const exportLeadsCSV = async (req, res) => {
  try {
    const filter = { deleted: false };
    if (req.query.formType) filter.formType = req.query.formType;
    if (req.query.status) filter.status = req.query.status;

    const items = await Lead.find(filter).sort({ createdAt: -1 }).limit(10000).lean();
    const fields = ["referenceId","formType","name","email","phone","status","createdAt","orgName","contactPerson"];
    const parser = new Parser({ fields });
    const csv = parser.parse(items);

    res.header("Content-Type", "text/csv");
    res.attachment(`leads-${Date.now()}.csv`);
    return res.send(csv);
  } catch (err) {
    console.error("exportLeadsCSV", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export const bulkAction = async (req, res) => {
  try {
    const { ids, action, payload } = req.body;
    if (!Array.isArray(ids) || !ids.length) return res.status(400).json({ success:false, error:"ids required" });

    if (action === "assign") {
      await Lead.updateMany({ _id: { $in: ids } }, { assignedTo: payload.assignedTo });
    } else if (action === "status") {
      await Lead.updateMany({ _id: { $in: ids } }, { status: payload.status });
    } else if (action === "delete") {
      await Lead.updateMany({ _id: { $in: ids } }, { deleted: true });
    } else {
      return res.status(400).json({ success:false, error:"unknown action" });
    }
    res.json({ success: true });
  } catch (err) {
    console.error("bulkAction", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};
