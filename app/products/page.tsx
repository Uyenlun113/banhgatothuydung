"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: {
    _id: string;
    name: string;
  };
  rating?: number;
  description?: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  productCount?: number;
}

const ITEMS_PER_PAGE = 9;

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000000]);
  const [maxPrice, setMaxPrice] = useState(5000000);
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchProducts();
    setCurrentPage(1);
  }, [selectedCategory]);

  useEffect(() => {
    filterProducts();
  }, [allProducts, searchQuery, priceRange, sortBy]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = "/api/products";
      if (selectedCategory) {
        url += `?category=${selectedCategory}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setAllProducts(data.data);
        const max = Math.max(...data.data.map((p: Product) => p.price), 5000000);
        setMaxPrice(max);
        setPriceRange([0, max]);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    }
    setLoading(false);
  };

  const filterProducts = () => {
    let result = [...allProducts];

    // Search filter
    if (searchQuery) {
      result = result.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    // Price filter
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sort
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    setFilteredProducts(result);
    setCurrentPage(1);
  };

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Top products (by price or rating)
  const topProducts = [...allProducts].sort((a, b) => b.price - a.price).slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        {/* Hero Banner */}
        <section className="bg-gradient-to-r from-primary-100 to-primary-50 py-12">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-500 mb-2">Bộ sưu tập</p>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Sản Phẩm Của Chúng Tôi</h1>
            <p className="mt-3 text-gray-600">Khám phá những chiếc bánh thủ công tuyệt vời</p>
          </div>
        </section>

        <div className="py-8">
          <div className="container mx-auto px-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <p className="text-gray-600">
                Hiển thị {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredProducts.length)} của{" "}
                {filteredProducts.length} kết quả
              </p>
              <div className="flex items-center gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:border-primary-400"
                >
                  <option value="default">Mặc định</option>
                  <option value="price-asc">Giá: Thấp đến cao</option>
                  <option value="price-desc">Giá: Cao đến thấp</option>
                  <option value="name-asc">Tên: A-Z</option>
                </select>
                <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 ${viewMode === "grid" ? "bg-primary-500 text-white" : "bg-white text-gray-600"}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 ${viewMode === "list" ? "bg-primary-500 text-white" : "bg-white text-gray-600"}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-[380px_1fr] gap-8">
              {/* Sidebar */}
              <div className="space-y-6">
                {/* Search */}
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Tìm kiếm..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-400"
                    />
                    <svg
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>

                {/* Categories */}
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4 pb-2 border-b">Danh mục</h3>
                  <ul className="space-y-2">
                    <li>
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className={`w-full flex items-center justify-between py-2 px-1 text-left hover:text-primary-500 transition ${
                          selectedCategory === null ? "text-primary-500 font-semibold" : "text-gray-600"
                        }`}
                      >
                        <span>Tất cả sản phẩm</span>
                        <span className="text-sm text-gray-400">{allProducts.length}</span>
                      </button>
                    </li>
                    {categories.map((category) => (
                      <li key={category._id}>
                        <button
                          onClick={() => setSelectedCategory(category._id)}
                          className={`w-full flex items-center justify-between py-2 px-1 text-left hover:text-primary-500 transition ${
                            selectedCategory === category._id ? "text-primary-500 font-semibold" : "text-gray-600"
                          }`}
                        >
                          <span>{category.name}</span>
                          <span className="text-sm text-gray-400">{category.productCount || 0}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price Filter */}
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4 pb-2 border-b">Lọc theo giá</h3>
                  <div className="space-y-4">
                    <input
                      type="range"
                      min={0}
                      max={maxPrice}
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full accent-primary-500"
                    />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">₫{priceRange[0].toLocaleString()}</span>
                      <span className="text-gray-600">₫{priceRange[1].toLocaleString()}</span>
                    </div>
                    <button
                      onClick={filterProducts}
                      className="w-full py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition text-sm font-medium"
                    >
                      Áp dụng
                    </button>
                  </div>
                </div>

                {/* Top Products */}
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4 pb-2 border-b">Sản phẩm nổi bật</h3>
                  <div className="space-y-4">
                    {topProducts.map((product) => (
                      <Link
                        key={product._id}
                        href={`/products/${product.slug}`}
                        className="flex items-center gap-3 group"
                      >
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                          {product.images?.[0] ? (
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl">🍰</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate group-hover:text-primary-500 transition">
                            {product.name}
                          </p>
                          <p className="text-sm text-primary-500 font-semibold">₫{product.price.toLocaleString()}</p>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <p className="text-xs text-gray-400 line-through">
                              ₫{product.originalPrice.toLocaleString()}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              <div>
                {loading ? (
                  <div className="flex justify-center py-20">
                    <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : currentProducts.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-xl">
                    <p className="text-gray-500">Không có sản phẩm nào</p>
                  </div>
                ) : (
                  <div className={viewMode === "grid" ? "grid sm:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
                    {currentProducts.map((product) => (
                      <Link
                        key={product._id}
                        href={`/products/${product.slug}`}
                        className={`group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all ${
                          viewMode === "list" ? "flex" : ""
                        }`}
                      >
                        <div
                          className={`relative overflow-hidden bg-gray-50 ${
                            viewMode === "list" ? "w-48 h-48" : "h-52"
                          }`}
                        >
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-6xl">🍰</div>
                          )}
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="absolute top-3 left-3 bg-rose-500 text-white px-2 py-1 rounded text-xs font-bold">
                              -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                            </span>
                          )}
                        </div>
                        <div
                          className={`p-4 ${
                            viewMode === "list" ? "flex-1 flex flex-col justify-center" : "text-center"
                          }`}
                        >
                          <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-500 transition">
                            {product.name}
                          </h3>
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-lg font-bold text-primary-500">
                              ₫{product.price.toLocaleString()}
                            </span>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <span className="text-sm text-gray-400 line-through">
                                ₫{product.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-10">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-200 rounded-lg hover:border-primary-400 transition disabled:opacity-50"
                    >
                      ← Trước
                    </button>
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-10 h-10 rounded-lg font-medium transition ${
                          currentPage === i + 1
                            ? "bg-primary-500 text-white"
                            : "border border-gray-200 hover:border-primary-400"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-200 rounded-lg hover:border-primary-400 transition disabled:opacity-50"
                    >
                      Sau →
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50">
          <Header />
          <div className="container mx-auto px-4 py-12">
            <div className="flex justify-center">
              <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
          <Footer />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
