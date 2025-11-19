'use client';

import { useState } from 'react';

interface MultiImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  label?: string;
}

export default function MultiImageUpload({ value, onChange, label = 'Hình ảnh' }: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newUrls: string[] = [...value];

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        try {
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
            throw new Error(errorData.error || `Lỗi ${res.status}`);
          }

          const data = await res.json();
          if (data.success) {
            return data.url;
          } else {
            throw new Error(data.error || 'Upload thất bại');
          }
        } catch (error: any) {
          if (error.name === 'AbortError') {
            throw new Error(`Upload ${file.name} quá thời gian chờ`);
          }
          throw error;
        }
      });

      const uploadedUrls = await Promise.allSettled(uploadPromises);
      
      uploadedUrls.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          newUrls.push(result.value);
        } else {
          alert(`Lỗi upload ${files[index]?.name}: ${result.reason?.message || 'Unknown error'}`);
        }
      });

      if (newUrls.length > 0) {
        onChange(newUrls);
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      alert('Lỗi upload ảnh: ' + (error.message || 'Lỗi không xác định'));
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newUrls = value.filter((_, i) => i !== index);
    onChange(newUrls);
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="space-y-4">
        {value.length > 0 && (
          <div className="grid grid-cols-4 gap-4">
            {value.map((url, index) => (
              <div key={index} className="relative group">
                <img src={url} alt={`Image ${index + 1}`} className="w-full h-32 object-cover border rounded-lg" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        <div>
          <label className="cursor-pointer bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors inline-block">
            {uploading ? 'Đang tải...' : 'Thêm ảnh'}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Hoặc nhập URLs (phân cách bằng dấu phẩy)</label>
          <input
            type="text"
            value={value.join(', ')}
            onChange={(e) => {
              const urls = e.target.value.split(',').map((url) => url.trim()).filter(Boolean);
              onChange(urls);
            }}
            placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
            className="w-full px-4 py-2 border rounded-lg text-sm"
          />
        </div>
      </div>
    </div>
  );
}

