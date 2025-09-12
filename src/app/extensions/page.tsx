"use client";

import Image from "next/image";
import Link from "next/link";

export default function Extensions() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-800 font-medium mb-4 transition-colors duration-200"
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
              🔧 擴充功能
            </h1>
            <p className="text-lg text-gray-600">
              更多實用工具與功能
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
            我們正在努力開發擴充功能，敬請期待！
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              即將推出的功能
            </h3>
            <ul className="text-gray-700 space-y-2 text-left max-w-md mx-auto">
              <li>• 文件範本庫</li>
              <li>• 進度追蹤系統</li>
              <li>• 團隊協作工具</li>
              <li>• 數據分析儀表板</li>
              <li>• 第三方整合</li>
            </ul>
          </div>
          <Link
            href="/"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold text-lg rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            🏠 返回中控版
          </Link>
        </div>
      </div>
    </div>
  );
}
