"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
}

export default function PopularCategories() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCategories(data.data);
        }
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const displayCategories = categories.length > 0 ? categories : [];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 flex flex-col gap-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-500">Danh mục</p>
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Hương vị được yêu thích</h2>
          <p className="text-base text-gray-500 md:text-lg">
            Lựa chọn từ hơn 20 hương vị thủ công được cập nhật mỗi tuần
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {displayCategories.slice(0, 8).map((category, index) => (
            <Link
              key={"_id" in category ? category._id : category.slug || index}
              href={`/products?category=${"_id" in category ? category._id : category.slug}`}
              className="group rounded-3xl border border-gray-100 bg-white p-5 shadow-[0_25px_60px_rgba(0,0,0,0.05)] transition hover:-translate-y-2 hover:border-primary-200"
            >
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 overflow-hidden rounded-2xl bg-primary-50">
                  {category.image ? (
                    <img src={category.image} alt={category.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-3xl">🍰</div>
                  )}
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-gray-400">Category</p>
                  <h3 className="text-xl font-semibold text-gray-900">{category.name}</h3>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary-500">
                    Xem tất cả
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
