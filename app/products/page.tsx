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
}

const ITEMS_PER_PAGE = 9;

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchProducts();
    setCurrentPage(1);
  }, [selectedCategory]);

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
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    }
    setLoading(false);
  };

  // Pagination
  const totalPages = Math.ceil(allProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = allProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50/30 to-white">
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-r from-primary-100 to-primary-50 py-12">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-500 mb-2">Bộ sưu tập</p>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Sản Phẩm Của Chúng Tôi</h1>
            <p className="mt-3 text-gray-600">Khám phá những chiếc bánh thủ công tuyệt vời</p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-[280px_1fr] gap-8">
              {/* Category Sidebar */}
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Danh mục sản phẩm</h2>
                
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${
                    selectedCategory === null
                      ? "bg-primary-500 text-white shadow-lg shadow-primary-200"
                      : "bg-white hover:bg-primary-50 border border-gray-100"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                    selectedCategory === null ? "bg-white/20" : "bg-primary-100"
                  }`}>
                    🍰
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">Tất cả sản phẩm</p>
                    <p className={`text-xs ${selectedCategory === null ? "text-white/70" : "text-gray-500"}`}>
                      {allProducts.length} sản phẩm
                    </p>
                  </div>
                </button>

                {categories.map((category) => (
                  <button
                    key={category._id}
                    onClick={() => setSelectedCategory(category._id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${
                      selectedCategory === category._id
                        ? "bg-primary-500 text-white shadow-lg shadow-primary-200"
                        : "bg-white hover:bg-primary-50 border border-gray-100"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                      {category.image ? (
                        <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className={`w-full h-full flex items-center justify-center text-xl ${
                          selectedCategory === category._id ? "bg-white/20" : "bg-primary-100"
                        }`}>
                          🎂
                        </div>
                      )}
                    </div>
                    <div className="text-left">
                      <p className="font-semibold">{category.name}</p>
                      <p className={`text-xs ${selectedCategory === category._id ? "text-white/70" : "text-gray-500"}`}>
                        Xem sản phẩm
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Products Grid */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-900">
                    {selectedCategory 
                      ? categories.find(c => c._id === selectedCategory)?.name || "Sản phẩm"
                      : "Tất cả sản phẩm"}
                    <span className="text-sm font-normal text-gray-500 ml-2">({allProducts.length} sản phẩm)</span>
                  </h2>
                </div>

                {loading ? (
                  <div className="flex justify-center py-20">
                    <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : currentProducts.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="text-gray-500">Không có sản phẩm nào</p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentProducts.map((product) => (
                      <Link
                        key={product._id}
                        href={`/products/${product.slug}`}
                        className="group bg-white rounded-3xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_50px_rgba(236,72,153,0.15)] transition-all hover:-translate-y-2"
                      >
                        <div className="relative h-52 overflow-hidden">
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary-50 text-6xl">🍰</div>
                          )}
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="absolute top-3 left-3 bg-rose-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                              -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                            </span>
                          )}
                          {product.rating && (
                            <span className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                              <span className="text-yellow-500">★</span> {product.rating}
                            </span>
                          )}
                        </div>
                        <div className="p-5">
                          <p className="text-xs text-primary-500 font-medium mb-1">{product.category?.name}</p>
                          <h3 className="font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-500 mb-3 line-clamp-1">{product.description}</p>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-xl font-bold text-primary-600">
                                ₫{product.price.toLocaleString("vi-VN")}
                              </span>
                              {product.originalPrice && product.originalPrice > product.price && (
                                <span className="text-sm text-gray-400 line-through ml-2">
                                  ₫{product.originalPrice.toLocaleString("vi-VN")}
                                </span>
                              )}
                            </div>
                            <button className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
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
                      className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-primary-300 hover:text-primary-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-10 h-10 rounded-full font-semibold transition ${
                          currentPage === i + 1
                            ? "bg-primary-500 text-white shadow-lg shadow-primary-200"
                            : "border border-gray-200 hover:border-primary-300 hover:text-primary-600"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-primary-300 hover:text-primary-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white">
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
