"use client";

import Image from "next/image";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function ExecutionPlan() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-green-600 hover:text-green-800 font-medium mb-4 transition-colors duration-200"
          >
            ← 返回中控版
          </Link>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <Image
                  src="/logo.png"
                  alt="政府補助案小寫手 Logo"
                  width={80}
                  height={80}
                  className="rounded-full shadow-lg"
                  priority
                />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              ⚙️ 執行規劃
            </h1>
            <p className="text-lg text-gray-600">
              詳細的項目執行計劃制定工具
            </p>
          </div>
        </div>

        {/* Coming Soon Card */}
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          <div className="text-6xl mb-6">🚧</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            功能開發中
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            我們正在努力開發執行規劃功能，敬請期待！
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              即將推出的功能
            </h3>
            <ul className="text-green-700 space-y-2 text-left max-w-md mx-auto">
              <li>• 專案時程規劃</li>
              <li>• 里程碑設定</li>
              <li>• 資源配置管理</li>
              <li>• 風險評估工具</li>
              <li>• 進度追蹤系統</li>
            </ul>
          </div>
          <Link
            href="/"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-lg rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            🏠 返回中控版
          </Link>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}
