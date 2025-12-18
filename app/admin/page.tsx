"use client";

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

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tổng quan</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 mb-2">Danh mục</h3>
          <p className="text-3xl font-bold text-primary-600">{stats.categories}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 mb-2">Sản phẩm</h3>
          <p className="text-3xl font-bold text-primary-600">{stats.products}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 mb-2">Ưu đãi</h3>
          <p className="text-3xl font-bold text-primary-600">{stats.promotions}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 mb-2">Banner</h3>
          <p className="text-3xl font-bold text-primary-600">{stats.banners}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Chào mừng đến với trang quản trị</h2>
        <p className="text-gray-600 mb-4">
          Sử dụng menu bên trái để quản lý danh mục, sản phẩm, ưu đãi và banner của cửa hàng.
        </p>
      </div>
    </div>
  );
}
