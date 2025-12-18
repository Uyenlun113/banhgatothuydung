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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-white">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Đang tải...</p>
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
    <aside className="flex h-full flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 px-5 py-8 text-white">
      <div className="flex items-center gap-3 mb-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-500 text-2xl shadow-lg shadow-primary-500/30">
          🍰
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Bánh Gato</p>
          <p className="text-lg font-bold">Thúy Dung</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                active
                  ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30"
                  : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
              {active && (
                <span className="ml-auto h-2 w-2 rounded-full bg-white"></span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 rounded-xl bg-slate-700/50 p-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary-500/20 flex items-center justify-center text-lg">
            👤
          </div>
          <div>
            <p className="font-semibold text-sm">{user?.name || "Admin"}</p>
            <p className="text-xs text-slate-400">{user?.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50/50 via-white to-white">
      <div className="lg:flex">
        <div className="hidden lg:fixed lg:bottom-0 lg:left-0 lg:top-0 lg:block lg:w-64">{Sidebar}</div>

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

        <div className="flex-1 lg:ml-64">
          <header className="sticky top-0 z-30 border-b border-primary-100/50 bg-white/80 backdrop-blur-xl">
            <div className="flex items-center justify-between px-4 py-4 lg:px-8">
              <div className="flex items-center gap-3">
                <button
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary-200 text-primary-600 lg:hidden hover:bg-primary-50 transition"
                  onClick={() => setMobileOpen((prev) => !prev)}
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-primary-400">Admin Panel</p>
                  <p className="text-xl font-bold text-gray-900">Bảng điều khiển</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/"
                  className="hidden items-center gap-2 rounded-full border border-primary-200 bg-white px-4 py-2 text-sm font-semibold text-primary-600 transition hover:bg-primary-50 lg:flex"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Xem trang chủ
                </Link>
                <button
                  onClick={logout}
                  className="rounded-full bg-gradient-to-r from-primary-500 to-primary-400 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-200/50 hover:shadow-primary-300/50 transition-all hover:scale-[1.02]"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          </header>

          <main className="p-4 lg:p-8">
            <div className="rounded-3xl border border-white bg-white p-6 shadow-[0_20px_50px_rgba(236,72,153,0.08)]">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
