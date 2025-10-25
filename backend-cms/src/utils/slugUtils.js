// utils/slugUtils.js
import slugify from "slugify";
import shortid from "shortid";

export function makeStorySlug(title = "", prefix = "stories_of_change") {
  const base = slugify(title || "story", {
    lower: true,
    remove: /[*+~.()'"!:@]/g,
    replacement: "-",
  }).replace(/-+/g, "-");
  const clean = base.replace(/(^-|-$)/g, "");
  return `${prefix}-${clean}`;
}

export async function ensureUniqueSlug(Model, slug) {
  let candidate = slug;
  let attempts = 0;
  while (await Model.findOne({ slug: candidate })) {
    attempts++;
    const suffix = shortid.generate().slice(0, 4).toLowerCase();
    candidate = `${slug}-${suffix}`;
    if (attempts > 8) break;
  }
  return candidate;
}