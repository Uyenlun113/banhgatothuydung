"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

export function useAuth(requireAdmin = false) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/admin/login");
      return;
    }

    try {
      const parsed = JSON.parse(userData) as User;
      
      if (requireAdmin && parsed.role !== "admin") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/admin/login");
        return;
      }

      setUser(parsed);
    } catch {
      router.push("/admin/login");
    } finally {
      setLoading(false);
    }
  }, [router, requireAdmin]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/admin/login");
  };

  return { user, loading, logout };
}
