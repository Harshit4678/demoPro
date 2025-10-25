// src/admin/components/ImageUploader.jsx
import React, { useState } from "react";

export default function ImageUploader({ label = "Upload Image", onFile }) {
  const [preview, setPreview] = useState("");

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    onFile && onFile(file);
  }

  return (
    <div>
      <label className="text-sm font-medium block mb-1">{label}</label>
      <input type="file" accept="image/*" onChange={handleFile} />
      {preview && (
        <img src={preview} alt="preview" className="mt-2 w-28 h-20 object-cover rounded" />
      )}
    </div>
  );
}