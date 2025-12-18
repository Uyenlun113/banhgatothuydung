"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    categories: 0,
    products: 0,
    promotions: 0,
    banners: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = () => {
    Promise.all([
      fetch("/api/categories").then((res) => res.json()),
      fetch("/api/products").then((res) => res.json()),
      fetch("/api/promotions").then((res) => res.json()),
      fetch("/api/banners").then((res) => res.json()),
    ]).then(([categories, products, promotions, banners]) => {
      setStats({
        categories: categories.success ? categories.data.length : 0,
        products: products.success ? products.data.length : 0,
        promotions: promotions.success ? promotions.data.length : 0,
        banners: banners.success ? banners.data.length : 0,
      });
    });
  };

  const statCards = [
    {
      title: "Danh mục",
      value: stats.categories,
      icon: "📁",
      color: "from-blue-500 to-blue-400",
      href: "/admin/categories",
    },
    {
      title: "Sản phẩm",
      value: stats.products,
      icon: "🍰",
      color: "from-primary-500 to-primary-400",
      href: "/admin/products",
    },
    {
      title: "Ưu đãi",
      value: stats.promotions,
      icon: "🎁",
      color: "from-green-500 to-green-400",
      href: "/admin/promotions",
    },
    {
      title: "Banner",
      value: stats.banners,
      icon: "🖼️",
      color: "from-purple-500 to-purple-400",
      href: "/admin/banners",
    },
  ];

  const quickActions = [
    { label: "Thêm sản phẩm", href: "/admin/products", icon: "➕" },
    { label: "Thêm danh mục", href: "/admin/categories", icon: "📂" },
    { label: "Quản lý banner", href: "/admin/banners", icon: "🖼️" },
    { label: "Tạo ưu đãi", href: "/admin/promotions", icon: "🎉" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Xin chào! 👋</h1>
        <p className="mt-1 text-gray-500">Chào mừng bạn quay trở lại với bảng điều khiển</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br p-5 text-white transition-all hover:scale-[1.02] hover:shadow-xl"
            style={{
              backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
            }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${card.color}`}></div>
            <div className="relative">
              <div className="flex items-center justify-between">
                <span className="text-4xl">{card.icon}</span>
                <svg
                  className="h-5 w-5 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="mt-4 text-4xl font-bold">{card.value}</p>
              <p className="mt-1 text-sm text-white/80">{card.title}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Thao tác nhanh</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 transition hover:border-primary-200 hover:bg-primary-50"
              >
                <span className="text-2xl">{action.icon}</span>
                <span className="text-sm font-medium text-gray-700">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-gradient-to-br from-primary-50 to-white p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Hướng dẫn sử dụng</h2>
          <p className="text-sm text-gray-600 mb-4">
            Sử dụng menu bên trái để quản lý danh mục, sản phẩm, ưu đãi và banner của cửa hàng.
          </p>
          <div className="space-y-3">
            {[
              "Thêm danh mục trước khi thêm sản phẩm",
              "Upload hình ảnh chất lượng cao cho sản phẩm",
              "Tạo banner để hiển thị trên trang chủ",
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-500 text-xs text-white flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-sm text-gray-600">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
