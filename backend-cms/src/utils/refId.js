// src/utils/refId.js
import Lead from "../models/Lead.js";

/**
 * CI-YYYYMMDD-0001
 */
export default async function generateReferenceId() {
  const now = new Date();

  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(now.getUTCDate()).padStart(2, "0");
  const day = `${yyyy}${mm}${dd}`;

  const todayStart = new Date(Date.UTC(yyyy, now.getUTCMonth(), now.getUTCDate(), 0, 0, 0));
  const todayEnd = new Date(Date.UTC(yyyy, now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));

  const count = await Lead.countDocuments({ createdAt: { $gte: todayStart, $lte: todayEnd } }).exec();
  const seq = String(count + 1).padStart(4, "0");

  return `CI-${day}-${seq}`;
}
