'use client';

import { useState } from 'react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUpload({ value, onChange, label = 'Hình ảnh' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 giây timeout

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Kiểm tra Content-Type để đảm bảo là JSON
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        console.error('Server returned non-JSON response:', text.substring(0, 200));
        throw new Error(`Server trả về lỗi không hợp lệ (${res.status}). Vui lòng kiểm tra cấu hình Cloudinary.`);
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Lỗi kết nối server' }));
        throw new Error(errorData.error || `Lỗi ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      if (data.success) {
        onChange(data.url);
        setPreview(data.url);
      } else {
        throw new Error(data.error || 'Upload thất bại');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      const errorMessage = error.name === 'AbortError' 
        ? 'Upload quá thời gian chờ. Vui lòng thử lại với file nhỏ hơn.'
        : error.message || 'Lỗi không xác định';
      alert('Lỗi upload ảnh: ' + errorMessage);
      setPreview(value || null); // Khôi phục preview cũ nếu có
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="space-y-2">
        {preview && (
          <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex items-center gap-4">
          <label className="cursor-pointer bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
            {uploading ? 'Đang tải...' : 'Chọn ảnh'}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={uploading}
            />
          </label>
          {value && (
            <button
              type="button"
              onClick={() => {
                onChange('');
                setPreview(null);
              }}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Xóa ảnh
            </button>
          )}
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setPreview(e.target.value);
          }}
          placeholder="Hoặc nhập URL hình ảnh"
          className="w-full px-4 py-2 border rounded-lg text-sm"
        />
      </div>
    </div>
  );
}

