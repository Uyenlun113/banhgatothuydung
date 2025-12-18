"use client";

import { useEffect, useState } from "react";

interface Product {
  _id: string;
  name: string;
}

interface Category {
  _id: string;
  name: string;
}

interface Promotion {
  _id: string;
  title: string;
  description?: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export default function AdminPromotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    discountType: "percentage" as "percentage" | "fixed",
    discountValue: "",
    startDate: "",
    endDate: "",
    products: [] as string[],
    categories: [] as string[],
    isActive: true,
  });

  useEffect(() => {
    fetchPromotions();
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchPromotions = async () => {
    const res = await fetch("/api/promotions");
    const data = await res.json();
    if (data.success) {
      setPromotions(data.data);
    }
  };

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    if (data.success) {
      setProducts(data.data);
    }
  };

  const fetchCategories = async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    if (data.success) {
      setCategories(data.data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const promotionData = {
      ...formData,
      discountValue: parseFloat(formData.discountValue),
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
    };

    const url = editingPromotion ? `/api/promotions/${editingPromotion._id}` : "/api/promotions";
    const method = editingPromotion ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(promotionData),
    });

    const data = await res.json();
    if (data.success) {
      fetchPromotions();
      setShowForm(false);
      setEditingPromotion(null);
      resetForm();
    } else {
      alert("Lỗi: " + data.error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      discountType: "percentage",
      discountValue: "",
      startDate: "",
      endDate: "",
      products: [],
      categories: [],
      isActive: true,
    });
  };

  const handleEdit = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    setFormData({
      title: promotion.title,
      description: promotion.description || "",
      discountType: promotion.discountType,
      discountValue: promotion.discountValue.toString(),
      startDate: promotion.startDate.split("T")[0],
      endDate: promotion.endDate.split("T")[0],
      products: [],
      categories: [],
      isActive: promotion.isActive,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa ưu đãi này?")) return;

    const res = await fetch(`/api/promotions/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      fetchPromotions();
    } else {
      alert("Lỗi: " + data.error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý ưu đãi</h1>
          <p className="text-sm text-gray-500 mt-1">Tạo và quản lý các chương trình khuyến mãi</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingPromotion(null);
            resetForm();
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-400 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-200/50 transition hover:shadow-primary-300/50 hover:scale-[1.02]"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Thêm ưu đãi
        </button>
      </div>

      {showForm && (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">
              {editingPromotion ? "✏️ Chỉnh sửa ưu đãi" : "🎁 Thêm ưu đãi mới"}
            </h2>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingPromotion(null);
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
                <label className="text-sm font-medium text-gray-700">Mô tả</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Loại giảm giá</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) =>
                      setFormData({ ...formData, discountType: e.target.value as "percentage" | "fixed" })
                    }
                    className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary-400 focus:outline-none"
                  >
                    <option value="percentage">📊 Phần trăm (%)</option>
                    <option value="fixed">💰 Số tiền cố định</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Giá trị giảm</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary-400 focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Ngày bắt đầu</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary-400 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Ngày kết thúc</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary-400 focus:outline-none"
                    required
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
                Kích hoạt ưu đãi
              </label>
              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-primary-500 to-primary-400 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary-200/50 transition hover:shadow-primary-300/50 hover:scale-[1.01]"
              >
                {editingPromotion ? "💾 Cập nhật ưu đãi" : "✨ Tạo ưu đãi"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50/80">
            <tr className="text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
              <th className="px-6 py-4">Ưu đãi</th>
              <th className="px-6 py-4">Loại</th>
              <th className="px-6 py-4">Giá trị</th>
              <th className="px-6 py-4">Thời gian</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {promotions.map((promotion) => (
              <tr key={promotion._id} className="hover:bg-gray-50/50 transition">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-semibold text-gray-900">{promotion.title}</p>
                    {promotion.description && <p className="text-xs text-gray-500 mt-1">{promotion.description}</p>}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded-lg bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                    {promotion.discountType === "percentage" ? "📊 Phần trăm" : "💰 Số tiền"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-lg font-bold text-primary-600">
                    {promotion.discountType === "percentage"
                      ? `${promotion.discountValue}%`
                      : `₫${promotion.discountValue.toLocaleString("vi-VN")}`}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <div className="flex flex-col">
                    <span>{new Date(promotion.startDate).toLocaleDateString("vi-VN")}</span>
                    <span className="text-gray-400">đến</span>
                    <span>{new Date(promotion.endDate).toLocaleDateString("vi-VN")}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                      promotion.isActive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                    }`}
                  >
                    {promotion.isActive ? "Hoạt động" : "Tắt"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-sm font-semibold">
                  <button onClick={() => handleEdit(promotion)} className="text-primary-600 hover:text-primary-800">
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(promotion._id)}
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
  );
}
