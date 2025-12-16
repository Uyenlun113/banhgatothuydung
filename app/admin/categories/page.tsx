"use client";

import ImageUpload from "@/components/ImageUpload";
import { useEffect, useState } from "react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
    isActive: true,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    if (data.success) {
      setCategories(data.data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingCategory ? `/api/categories/${editingCategory._id}` : "/api/categories";
    const method = editingCategory ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (data.success) {
      fetchCategories();
      setShowForm(false);
      setEditingCategory(null);
      setFormData({ name: "", slug: "", description: "", image: "", isActive: true });
    } else {
      alert("Lỗi: " + data.error);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      image: category.image || "",
      isActive: category.isActive,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return;

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Xóa thất bại");
      }
      setCategories((prev) => prev.filter((c) => c._id !== id));

      alert("✅ Đã xóa danh mục");
    } catch (error) {
      console.error(error);
      alert("❌ Xóa danh mục thất bại");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 rounded-3xl border border-gray-100 bg-white/80 p-6 shadow-sm backdrop-blur lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-gray-400">Danh mục</p>
          <h1 className="text-2xl font-semibold text-gray-900">Quản lý danh mục sản phẩm</h1>
          <p className="text-sm text-gray-500">Tạo và cập nhật các nhóm sản phẩm để hiển thị trên trang chủ.</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingCategory(null);
            setFormData({ name: "", slug: "", description: "", image: "", isActive: true });
          }}
          className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
        >
          <span aria-hidden>＋</span> Thêm danh mục
        </button>
      </div>

      {showForm && (
        <div className="rounded-3xl border border-gray-100 bg-white/90 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
            </h2>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingCategory(null);
              }}
              className="text-sm text-gray-500 hover:text-gray-800"
            >
              Đóng
            </button>
          </div>
          <form onSubmit={handleSubmit} className="mt-6 grid gap-5 lg:grid-cols-2">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Tên danh mục</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setFormData({
                      ...formData,
                      name,
                      slug: name
                        .toLowerCase()
                        .replace(/\s+/g, "-")
                        .replace(/[^a-z0-9-]/g, ""),
                    });
                  }}
                  className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:border-primary-400 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:border-primary-400 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Mô tả</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:border-primary-400 focus:outline-none"
                  rows={4}
                />
              </div>
              <label className="inline-flex items-center gap-3 rounded-2xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                Kích hoạt danh mục
              </label>
            </div>
            <div className="space-y-4 rounded-2xl border border-gray-200 p-4">
              <ImageUpload
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                label="Hình ảnh danh mục"
              />
              <button
                type="submit"
                className="w-full rounded-2xl bg-primary-600 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
              >
                {editingCategory ? "Cập nhật danh mục" : "Tạo danh mục"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="rounded-3xl border border-gray-100 bg-white/90 shadow-sm">
        <div className="overflow-x-auto rounded-3xl">
          <table className="min-w-full divide-y divide-gray-100">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                <th className="px-6 py-4">Danh mục</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((category) => (
                <tr key={category._id} className="text-sm text-gray-700">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {category.image && (
                        <img src={category.image} alt={category.name} className="h-10 w-10 rounded-xl object-cover" />
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">{category.name}</p>
                        <p className="text-xs uppercase tracking-[0.3em] text-gray-400">ID: {category._id.slice(-6)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{category.slug}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                        category.isActive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                      }`}
                    >
                      {category.isActive ? "Đang hiển thị" : "Đang ẩn"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-semibold">
                    <button onClick={() => handleEdit(category)} className="text-primary-600 hover:text-primary-800">
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(category._id)}
                      className="ml-4 text-rose-500 hover:text-rose-600"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
