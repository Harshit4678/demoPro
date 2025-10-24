// src/middleware/setFormType.js
export default function setFormType(type) {
  return (req, res, next) => {
    try {
      // avoid assigning to req.query (it's read-only in some setups)
      // set header so multer destination can read it
      if (!req.headers) req.headers = {};
      req.headers["x-form-type"] = type;
      // also set a custom field for multer to read if needed
      req._formType = type;
    } catch (err) {
      // don't fail the request just because middleware couldn't set something
      console.warn("setFormType warning:", err);
    }
    return next();
  };
}
