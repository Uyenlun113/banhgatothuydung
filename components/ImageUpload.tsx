"use client";

import { useState } from "react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUpload({ value, onChange, label = "Hình ảnh" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);

  const uploadToCloudinary = async (file: File): Promise<string> => {
    // 1. Lấy signature
    const signRes = await fetch("/api/upload", { method: "POST" });
    if (!signRes.ok) throw new Error("Không lấy được chữ ký upload");

    const { cloudName, apiKey, timestamp, signature } = await signRes.json();

    // 2. Upload trực tiếp Cloudinary
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

    if (!uploadRes.ok) {
      const text = await uploadRes.text();
      throw new Error(text);
    }

    const data = await uploadRes.json();
    return data.secure_url;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      const url = await uploadToCloudinary(file);
      onChange(url);
      setPreview(url);
    } catch (error: any) {
      alert("Lỗi upload ảnh: " + (error.message || "Không xác định"));
      setPreview(value || null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>

      <div className="space-y-2">
        {preview && (
          <div className="w-32 h-32 border rounded-lg overflow-hidden">
            <img src={preview} className="w-full h-full object-cover" />
          </div>
        )}

        <label className="cursor-pointer bg-primary-600 text-white px-4 py-2 rounded-lg inline-block">
          {uploading ? "Đang tải..." : "Chọn ảnh"}
          <input type="file" accept="image/*" onChange={handleFileChange} hidden disabled={uploading} />
        </label>

        {value && (
          <button
            type="button"
            onClick={() => {
              onChange("");
              setPreview(null);
            }}
            className="block text-sm text-red-600"
          >
            Xóa ảnh
          </button>
        )}
      </div>
    </div>
  );
}
