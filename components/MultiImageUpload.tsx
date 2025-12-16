"use client";

import { useState } from "react";

interface MultiImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  label?: string;
}

export default function MultiImageUpload({ value, onChange, label = "Hình ảnh" }: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const signRes = await fetch("/api/upload", { method: "POST" });
    if (!signRes.ok) throw new Error("Không lấy được chữ ký upload");

    const { cloudName, apiKey, timestamp, signature } = await signRes.json();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
    formData.append("folder", "ap-cake");

    const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });

    if (!uploadRes.ok) throw new Error(await uploadRes.text());

    const data = await uploadRes.json();
    return data.secure_url;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const results = await Promise.allSettled(Array.from(files).map(uploadToCloudinary));

      const successUrls = results
        .filter((r): r is PromiseFulfilledResult<string> => r.status === "fulfilled")
        .map((r) => r.value);

      const errors = results.filter((r) => r.status === "rejected");

      if (errors.length > 0) {
        alert(`Có ${errors.length} ảnh upload thất bại`);
      }

      if (successUrls.length > 0) {
        onChange([...value, ...successUrls]);
      }
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>

      {value.length > 0 && (
        <div className="grid grid-cols-4 gap-4 mb-3">
          {value.map((url, index) => (
            <div key={index} className="relative">
              <img src={url} className="w-full h-32 object-cover rounded-lg" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-red-600 text-white w-6 h-6 rounded-full"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <label className="cursor-pointer bg-primary-600 text-white px-4 py-2 rounded-lg inline-block">
        {uploading ? "Đang tải..." : "Thêm ảnh"}
        <input type="file" accept="image/*" multiple onChange={handleFileChange} hidden disabled={uploading} />
      </label>
    </div>
  );
}
