"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  images: string[];
  rating?: number;
  category?: {
    _id: string;
    name: string;
  };
  description?: string;
}

export default function BestSellers() {
  const [products, setProducts] = useState<Product[]>([]);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    fetch("/api/products?limit=8")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.data);
        }
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  useEffect(() => {
    if (!products.length) return;
    const interval = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % products.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [products.length]);

  const visibleProducts = () => {
    if (!products.length) return [];
    const result: Product[] = [];
    for (let i = 0; i < Math.min(4, products.length); i++) {
      const index = (startIndex + i) % products.length;
      result.push(products[index]);
    }
    return result;
  };

  const handlePrev = () => {
    if (!products.length) return;
    setStartIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  const handleNext = () => {
    if (!products.length) return;
    setStartIndex((prev) => (prev + 1) % products.length);
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-500">Best sellers</p>
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Những cái tên được yêu thích nhất</h2>
          <p className="text-base text-gray-500 md:text-lg">
            Danh sách được cập nhật dựa trên doanh số và lượt đánh giá của khách hàng
          </p>
        </div>
        <div className="relative">
          <button
            onClick={handlePrev}
            className="absolute left-[-50px] top-1/2 hidden -translate-y-1/2 rounded-full border border-gray-200 bg-white/80 p-3 text-gray-600 shadow-lg transition hover:border-primary-200 hover:text-primary-600 xl:flex"
            aria-label="Sản phẩm trước"
          >
            ‹
          </button>
          <button
            onClick={handleNext}
            className="absolute right-[-50px] top-1/2 hidden -translate-y-1/2 rounded-full border border-gray-200 bg-white/80 p-3 text-gray-600 shadow-lg transition hover:border-primary-200 hover:text-primary-600 xl:flex"
            aria-label="Sản phẩm tiếp theo"
          >
            ›
          </button>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleProducts().map((product) => (
              <div
                key={product._id}
                className="flex h-full flex-col rounded-3xl border border-gray-100 bg-white shadow-[0_25px_60px_rgba(0,0,0,0.05)] transition hover:-translate-y-2"
              >
                <Link href={`/products/${product.slug}`} className="relative block h-60 overflow-hidden rounded-t-3xl">
                  {product?.images && product?.images.length > 0 ? (
                    <img
                      src={product?.images[0]}
                      alt={product?.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-primary-50 text-6xl">🍰</div>
                  )}
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-red-500">
                      -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </span>
                  )}
                </Link>

                <div className="flex flex-1 flex-col gap-4 p-5">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>
                      {product.category && typeof product.category !== "string"
                        ? product?.category?.name
                        : "Bánh Gato Thúy Dung"}
                    </span>
                    {product.rating && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2 py-1 text-primary-600">
                        ★ {product.rating.toFixed(1)}
                      </span>
                    )}
                  </div>
                  <Link
                    href={`/products/${product.slug}`}
                    className="text-lg font-semibold text-gray-900 hover:text-primary-600"
                  >
                    {product.name}
                  </Link>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {product.description || "Hương vị thủ công, nguyên liệu tươi mới mỗi ngày."}
                  </p>
                  <div className="mt-auto flex flex-col gap-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-primary-600">
                        ₫{product.price.toLocaleString("vi-VN")}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-sm text-gray-400 line-through">
                          ₫{product.originalPrice.toLocaleString("vi-VN")}
                        </span>
                      )}
                    </div>
                    <Link
                      href={`/products/${product.slug}`}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700"
                    >
                      Xem chi tiết
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
