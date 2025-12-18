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

    if (file.size > 3 * 1024 * 1024) {
      alert("File quá lớn! Vui lòng chọn file nhỏ hơn 3MB");
      return;
    }

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
      {label && <label className="block text-sm font-medium text-gray-700 mb-3">{label}</label>}

      <div className="flex flex-col items-center">
        <label className="cursor-pointer group">
          <input type="file" accept="image/*" onChange={handleFileChange} hidden disabled={uploading} />
          
          {preview ? (
            <div className="relative">
              <div className="w-40 h-40 rounded-full overflow-hidden border-2 border-dashed border-gray-300 group-hover:border-primary-400 transition">
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              </div>
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                  <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          ) : (
            <div className="w-40 h-40 rounded-full border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center group-hover:border-primary-400 group-hover:bg-primary-50 transition">
              {uploading ? (
                <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-2 group-hover:bg-primary-100 transition">
                    <svg className="w-7 h-7 text-gray-400 group-hover:text-primary-500 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div className="absolute ml-6 mt-6 w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center group-hover:bg-primary-200 transition">
                      <svg className="w-3 h-3 text-gray-500 group-hover:text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 group-hover:text-primary-600 transition">Upload photo</span>
                </>
              )}
            </div>
          )}
        </label>

        <p className="mt-4 text-xs text-gray-400 text-center">
          Allowed *.jpeg, *.jpg, *.png, *.gif<br />
          max size of 3 Mb
        </p>

        {value && (
          <button
            type="button"
            onClick={() => {
              onChange("");
              setPreview(null);
            }}
            className="mt-3 text-sm text-rose-500 hover:text-rose-600 transition"
          >
            Xóa ảnh
          </button>
        )}
      </div>
    </div>
  );
}
