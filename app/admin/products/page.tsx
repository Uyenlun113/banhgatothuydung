"use client";

import MultiImageUpload from "@/components/MultiImageUpload";
import { useEffect, useState } from "react";

interface Category {
  _id: string;
  name: string;
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  images?: string[];
  category: Category | string;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    originalPrice: "",
    images: [] as string[],
    category: "",
    stock: "",
    isActive: true,
    isFeatured: false,
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

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
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
      images: formData.images,
      stock: parseInt(formData.stock),
    };

    const url = editingProduct ? `/api/products/${editingProduct._id}` : "/api/products";
    const method = editingProduct ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });

    const data = await res.json();
    if (data.success) {
      fetchProducts();
      setShowForm(false);
      setEditingProduct(null);
      resetForm();
    } else {
      alert("Lỗi: " + data.error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      price: "",
      originalPrice: "",
      images: [],
      category: "",
      stock: "",
      isActive: true,
      isFeatured: false,
    });
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    const categoryId = typeof product.category === "object" ? product.category._id : product.category;
    setFormData({
      name: product.name,
      slug: product.slug,
      description: "",
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || "",
      images: (product as any).images || [],
      category: categoryId,
      stock: product.stock.toString(),
      isActive: product.isActive,
      isFeatured: product.isFeatured,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Xóa thất bại");
      }

      // 🔥 XÓA NGAY TRÊN UI
      setProducts((prev) => prev.filter((p) => p._id !== id));

      alert("✅ Đã xóa sản phẩm");
    } catch (error) {
      console.error(error);
      alert("❌ Xóa sản phẩm thất bại");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h1>
          <p className="text-sm text-gray-500 mt-1">Theo dõi và cập nhật danh sách sản phẩm đang được bán</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingProduct(null);
            resetForm();
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-400 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-200/50 transition hover:shadow-primary-300/50 hover:scale-[1.02]"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Thêm sản phẩm
        </button>
      </div>

      {showForm && (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">
              {editingProduct ? "✏️ Chỉnh sửa sản phẩm" : "🍰 Thêm sản phẩm mới"}
            </h2>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingProduct(null);
              }}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Đóng
            </button>
          </div>
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Tên sản phẩm</label>
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
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Giá</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:border-primary-400 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Giá gốc</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                      className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:border-primary-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-4 rounded-2xl border border-gray-200 p-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Danh mục</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:border-primary-400 focus:outline-none"
                    required
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Tồn kho</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:border-primary-400 focus:outline-none"
                    required
                  />
                </div>
                <MultiImageUpload
                  value={formData.images}
                  onChange={(urls) => setFormData({ ...formData, images: urls })}
                  label="Hình ảnh sản phẩm"
                />
                <div className="flex flex-wrap gap-4 rounded-2xl bg-gray-50 px-4 py-3">
                  <label className="flex flex-1 items-center gap-2 text-sm font-medium text-gray-600">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    Hiển thị trên website
                  </label>
                  <label className="flex flex-1 items-center gap-2 text-sm font-medium text-gray-600">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    Đánh dấu nổi bật
                  </label>
                </div>
                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-primary-500 to-primary-400 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary-200/50 transition hover:shadow-primary-300/50 hover:scale-[1.01]"
                >
                  {editingProduct ? "💾 Cập nhật sản phẩm" : "✨ Tạo sản phẩm"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="rounded-3xl border border-gray-100 bg-white/90 shadow-sm">
        <div className="overflow-x-auto rounded-3xl">
          <table className="min-w-full divide-y divide-gray-100 text-sm text-gray-700">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                <th className="px-6 py-4">Sản phẩm</th>
                <th className="px-6 py-4">Danh mục</th>
                <th className="px-6 py-4">Giá</th>
                <th className="px-6 py-4">Tồn kho</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => {
                const categoryName = typeof product.category === "object" ? product?.category?.name : "Danh mục";
                return (
                  <tr key={product._id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="h-10 w-10 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-xl">
                            🍰
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-900">{product.name}</p>
                          <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
                            ID: {product._id.slice(-6)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{categoryName}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-baseline gap-2">
                        <span className="font-semibold text-gray-900">₫{product.price.toLocaleString("vi-VN")}</span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-xs text-gray-400 line-through">
                            ₫{product.originalPrice.toLocaleString("vi-VN")}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">{product.stock}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                            product.isActive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                          }`}
                        >
                          {product.isActive ? "Đang bán" : "Tạm ẩn"}
                        </span>
                        {product.isFeatured && (
                          <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-primary-600 bg-primary-50">
                            ♡ Nổi bật
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-semibold">
                      <button onClick={() => handleEdit(product)} className="text-primary-600 hover:text-primary-800">
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="ml-4 text-rose-500 hover:text-rose-600"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
