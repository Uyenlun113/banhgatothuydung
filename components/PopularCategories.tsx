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
        <div className="grid gap-8 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {displayCategories.slice(0, 6).map((category, index) => (
            <Link
              key={"_id" in category ? category._id : index}
              href={`/products?category=${"_id" in category ? category._id : ""}`}
              className="group flex flex-col items-center text-center"
            >
              <div className="w-28 h-28 md:w-32 md:h-32 overflow-hidden rounded-full bg-primary-50 border-4 border-primary-100 shadow-lg group-hover:border-primary-300 group-hover:shadow-xl transition-all group-hover:scale-105">
                {category.image ? (
                  <img src={category.image} alt={category.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-4xl">🍰</div>
                )}
              </div>
              <h3 className="mt-4 text-base font-semibold text-gray-900 group-hover:text-primary-500 transition">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
