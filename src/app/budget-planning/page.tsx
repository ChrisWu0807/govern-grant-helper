"use client";

import Image from "next/image";
import Link from "next/link";

export default function BudgetPlanning() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-yellow-600 hover:text-yellow-800 font-medium mb-4 transition-colors duration-200"
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
              💰 預算編列
            </h1>
            <p className="text-lg text-gray-600">
              完整的財務預算規劃工具
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
            我們正在努力開發預算編列功能，敬請期待！
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              即將推出的功能
            </h3>
            <ul className="text-yellow-700 space-y-2 text-left max-w-md mx-auto">
              <li>• 預算模板生成</li>
              <li>• 成本分析工具</li>
              <li>• 財務報表生成</li>
              <li>• 資金需求評估</li>
              <li>• 投資報酬率計算</li>
            </ul>
          </div>
          <Link
            href="/"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold text-lg rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            🏠 返回中控版
          </Link>
        </div>
      </div>
    </div>
  );
}
