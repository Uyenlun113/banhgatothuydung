"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Banner {
  _id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  link?: string;
}

export default function Hero() {
  const [banner, setBanner] = useState<Banner | null>(null);

  useEffect(() => {
    fetch("/api/banners?position=hero")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data.length > 0) {
          setBanner(data.data[0]);
        }
      })
      .catch((err) => console.error("Error fetching banner:", err));
  }, []);

  const highlightFlavors = ["Strawberry", "Matcha", "Blueberry", "Caramel"];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary-500">
              Bộ sưu tập bánh Gato
              <span className="h-2 w-2 rounded-full bg-green-500" />
            </span>

            <h1 className="text-4xl font-bold leading-tight text-gray-900 md:text-5xl lg:text-6xl">
              Món ngon cho mọi <span className="text-primary-500">lễ kỷ niệm</span>
            </h1>

            <p className="text-lg text-gray-600 md:text-xl">
              {banner?.description ||
                "Chúng tôi tạo ra những chiếc bánh thủ công với nguyên liệu tươi, màu sắc hiện đại và hương vị tinh tế."}
            </p>

            <div className="flex flex-wrap gap-3">
              {highlightFlavors.map((flavor) => (
                <span
                  key={flavor}
                  className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700"
                >
                  {flavor}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-500 to-primary-400 px-6 py-3 font-semibold text-white shadow-lg shadow-primary-200/60 transition hover:scale-[1.02]"
              >
                Mua ngay
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-6 py-3 font-semibold text-gray-700 transition hover:border-primary-200 hover:text-primary-600"
              >
                Khám phá hương vị
              </Link>
            </div>

            <div className="flex flex-wrap gap-6 rounded-2xl border border-gray-100 bg-white/70 p-4 shadow-sm backdrop-blur">
              <div>
                <p className="text-sm text-gray-500">Đánh giá</p>
                <p className="text-2xl font-semibold text-gray-900">4.9/5</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Khách hàng hài lòng</p>
                <p className="text-2xl font-semibold text-gray-900">2.5K+</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Giao hàng trong</p>
                <p className="text-2xl font-semibold text-gray-900">30 phút</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-[32px] border border-white shadow-[0_30px_80px_rgba(236,72,153,0.2)]">
              {banner?.image ? (
                <img src={banner.image} alt={banner.title} className="h-[520px] w-full object-cover" />
              ) : (
                <div className="flex h-[520px] items-center justify-center bg-gradient-to-br from-primary-200 to-primary-300 text-8xl">
                  🍰
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 rounded-3xl bg-white/90 px-6 py-5 shadow-lg backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary-500">Bánh gato Thúy Dung</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">Hãy nhấc máy gọi điện ngay cho chúng tôi !</p>
                <p className="mt-1 text-sm text-gray-500">Được làm mới mỗi sáng • Số lượng có hạn</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
