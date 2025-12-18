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

    // Check file sizes
    for (const file of Array.from(files)) {
      if (file.size > 3 * 1024 * 1024) {
        alert("Một số file quá lớn! Vui lòng chọn file nhỏ hơn 3MB");
        return;
      }
    }

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
      {label && <label className="block text-sm font-medium text-gray-700 mb-3">{label}</label>}

      <div className="space-y-4">
        {value.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {value.map((url, index) => (
              <div key={index} className="relative group">
                <img src={url} alt={`Image ${index + 1}`} className="w-full h-24 object-cover rounded-xl" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-rose-500 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-lg"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        <label className="cursor-pointer group block">
          <input type="file" accept="image/*" multiple onChange={handleFileChange} hidden disabled={uploading} />
          
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center hover:border-primary-400 hover:bg-primary-50/50 transition">
            {uploading ? (
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 border-3 border-primary-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                <span className="text-sm text-gray-500">Đang tải lên...</span>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3 group-hover:bg-primary-100 transition">
                  <svg className="w-6 h-6 text-gray-400 group-hover:text-primary-500 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-600 group-hover:text-primary-600 transition">
                  Thêm ảnh sản phẩm
                </span>
                <span className="text-xs text-gray-400 mt-1">Có thể chọn nhiều ảnh</span>
              </>
            )}
          </div>
        </label>

        <p className="text-xs text-gray-400 text-center">
          Allowed *.jpeg, *.jpg, *.png, *.gif • max size of 3 Mb
        </p>
      </div>
    </div>
  );
}
