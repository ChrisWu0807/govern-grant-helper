"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  // 如果正在載入，顯示載入畫面
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">載入中...</p>
        </div>
      </div>
    );
  }

  // 如果未登入，顯示登入提示
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <Image
              src="/logo.png"
              alt="政府補助案小寫手 Logo"
              width={80}
              height={80}
              className="rounded-full shadow-lg"
              priority
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🔐 需要登入
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            請先登入以使用此功能
          </p>
          <Link
            href="/login"
            className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            🔐 立即登入
          </Link>
        </div>
      </div>
    );
  }

  // 如果已登入，顯示內容
  return <>{children}</>;
}
