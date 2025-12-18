"use client";

import { useEffect, useState } from "react";
import ImageUpload from "@/components/ImageUpload";

interface Banner {
  _id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  link?: string;
  position: "hero" | "sidebar" | "footer" | "promotion";
  isActive: boolean;
  order: number;
}

export default function AdminBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    image: "",
    link: "",
    position: "hero" as "hero" | "sidebar" | "footer" | "promotion",
    isActive: true,
    order: "0",
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await fetch("/api/banners?all=true");
      const data = await res.json();
      if (data.success) {
        setBanners(data.data);
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const bannerData = {
      ...formData,
      order: parseInt(formData.order),
    };

    const url = editingBanner ? `/api/banners/${editingBanner._id}` : "/api/banners";
    const method = editingBanner ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bannerData),
      });

      const data = await res.json();

      if (data.success) {
        fetchBanners();
        setShowForm(false);
        setEditingBanner(null);
        resetForm();
      } else {
        alert("Lỗi: " + data.error);
      }
    } catch (error: any) {
      alert("Lỗi kết nối: " + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      description: "",
      image: "",
      link: "",
      position: "hero",
      isActive: true,
      order: "0",
    });
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || "",
      description: banner.description || "",
      image: banner.image,
      link: banner.link || "",
      position: banner.position,
      isActive: banner.isActive,
      order: banner.order.toString(),
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa banner này?")) return;

    const res = await fetch(`/api/banners/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      fetchBanners();
    } else {
      alert("Lỗi: " + data.error);
    }
  };

  const positionLabels: Record<string, string> = {
    hero: "🏠 Hero",
    sidebar: "📌 Sidebar",
    footer: "📍 Footer",
    promotion: "🎁 Promotion",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Banner</h1>
          <p className="text-sm text-gray-500 mt-1">Tạo và quản lý các banner hiển thị trên website</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingBanner(null);
            resetForm();
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-400 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-200/50 transition hover:shadow-primary-300/50 hover:scale-[1.02]"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Thêm banner
        </button>
      </div>

      {showForm && (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">
              {editingBanner ? "✏️ Chỉnh sửa banner" : "🖼️ Thêm banner mới"}
            </h2>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingBanner(null);
              }}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Đóng
            </button>
          </div>
          <form onSubmit={handleSubmit} className="grid gap-5 lg:grid-cols-2">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Tiêu đề</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Phụ đề</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Mô tả</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Link (tùy chọn)</label>
                <input
                  type="text"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                />
              </div>
            </div>
            <div className="space-y-4">
              <ImageUpload
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                label="Hình ảnh banner"
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Vị trí</label>
                  <select
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value as any })}
                    className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary-400 focus:outline-none"
                  >
                    <option value="hero">🏠 Hero (Banner chính)</option>
                    <option value="sidebar">📌 Sidebar</option>
                    <option value="footer">📍 Footer</option>
                    <option value="promotion">🎁 Promotion</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Thứ tự</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary-400 focus:outline-none"
                  />
                </div>
              </div>
              <label className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                Kích hoạt banner
              </label>
              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-primary-500 to-primary-400 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary-200/50 transition hover:shadow-primary-300/50 hover:scale-[1.01]"
              >
                {editingBanner ? "💾 Cập nhật banner" : "✨ Tạo banner"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50/80">
            <tr className="text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
              <th className="px-6 py-4">Banner</th>
              <th className="px-6 py-4">Vị trí</th>
              <th className="px-6 py-4">Thứ tự</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {banners.map((banner) => (
              <tr key={banner._id} className="hover:bg-gray-50/50 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {banner.image && (
                      <img src={banner.image} alt={banner.title} className="h-12 w-20 rounded-lg object-cover" />
                    )}
                    <div>
                      <p className="font-semibold text-gray-900">{banner.title}</p>
                      {banner.subtitle && <p className="text-xs text-gray-500">{banner.subtitle}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded-lg bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                    {positionLabels[banner.position]}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{banner.order}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                      banner.isActive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                    }`}
                  >
                    {banner.isActive ? "Hoạt động" : "Tắt"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-sm font-semibold">
                  <button onClick={() => handleEdit(banner)} className="text-primary-600 hover:text-primary-800">
                    Sửa
                  </button>
                  <button onClick={() => handleDelete(banner._id)} className="ml-4 text-rose-500 hover:text-rose-600">
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
