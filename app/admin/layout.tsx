"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, loading, logout } = useAuth(true);

  // Skip auth check for login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const menuItems = [
    { href: "/admin", label: "Tổng quan", icon: "📊" },
    { href: "/admin/categories", label: "Danh mục", icon: "📁" },
    { href: "/admin/products", label: "Sản phẩm", icon: "🍰" },
    { href: "/admin/promotions", label: "Ưu đãi", icon: "🎁" },
    { href: "/admin/banners", label: "Banner", icon: "🖼️" },
  ];

  const Sidebar = (
    <aside className="flex h-full flex-col gap-6 bg-[#0f172a] px-6 py-10 text-white">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-white/50">Bánh Gato Thúy Dung</p>
        <p className="text-2xl font-semibold">Control Center</p>
      </div>
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                active ? "bg-white text-[#0f172a]" : "text-white/70 hover:bg-white/10"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto rounded-2xl bg-white/10 p-4 text-sm text-white/80">
        <p className="font-semibold">Hỗ trợ 24/7</p>
        <p className="text-white/60">hello@banhgathuydung.vn</p>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="lg:flex">
        <div className="hidden lg:fixed lg:bottom-0 lg:left-0 lg:top-0 lg:block lg:w-72">{Sidebar}</div>

        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <div className="absolute left-0 top-0 h-full w-64" onClick={(e) => e.stopPropagation()}>
              {Sidebar}
            </div>
          </div>
        )}

        <div className="flex-1 lg:ml-72">
          <header className="sticky top-0 z-30 border-b border-white/50 bg-white/80 backdrop-blur-xl">
            <div className="flex items-center justify-between px-4 py-4 lg:px-8">
              <div className="flex items-center gap-3">
                <button
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 text-gray-600 lg:hidden"
                  onClick={() => setMobileOpen((prev) => !prev)}
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-gray-400">Bánh Gato Thúy Dung</p>
                  <p className="text-xl font-semibold text-gray-900">Bảng điều khiển</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/"
                  className="hidden items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-primary-200 hover:text-primary-600 lg:flex"
                >
                  <span aria-hidden>↗</span> Về trang chủ
                </Link>
                <button 
                  onClick={logout}
                  className="rounded-full bg-primary-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-primary-200/50"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          </header>

          <main className="px-4 py-8 lg:px-10">
            <div className="rounded-[40px] border border-white bg-white/90 p-6 shadow-[0_25px_60px_rgba(15,23,42,0.08)]">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
