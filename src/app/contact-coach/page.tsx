"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function ContactCoach() {
  useEffect(() => {
    // 直接重定向到亞瑟教練預約系統
    window.location.href = "https://artherbooking.zeabur.app/";
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium mb-4 transition-colors duration-200"
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
              👨‍🏫 聯繫教練
            </h1>
            <p className="text-lg text-gray-600">
              專業創業教練諮詢服務
            </p>
          </div>
        </div>

        {/* Contact Card */}
        <div className="bg-white rounded-2xl shadow-xl p-12">
          <div className="text-center mb-8">
            <div className="text-6xl mb-6">👨‍🏫</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              關於亞瑟教練
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              擁有豐富的企業諮詢經驗，專精於政府補助案、營運效率提升等領域，協助眾多企業實現轉型與成長
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-indigo-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-indigo-800 mb-4">
                🎯 服務內容
              </h3>
              <ul className="text-indigo-700 space-y-2">
                <li>• 政府補助案執行細節</li>
                <li>• 營運流程改善</li>
                <li>• 團隊優勢天賦提升</li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-blue-800 mb-4">
                💡 教練經歷
              </h3>
              <ul className="text-blue-700 space-y-2 text-sm">
                <li>• 現任資策會數位轉型顧問、蓋洛普優勢教練、BzDNA測評教練</li>
                <li>• 前趨勢科技台灣研發站負責人（15年）</li>
                <li>• 前Musically（現在的抖音）美國歐洲區商業總經理（3年）</li>
                <li>• 前獵豹移動（NYSE：CMCM）商業變現資深總監（6年）</li>
                <li>• MATCH網紅媒合平台創辦人</li>
                <li>• 共享衣櫥平台創辦人</li>
                <li>• 美國卡內基美隆大學 - 移動廣告變現講師</li>
                <li>• 北科大資訊財經碩士班</li>
              </ul>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-green-800 mb-4 text-center">
              🌟 願景
            </h3>
            <p className="text-green-700 text-center text-lg">
              打造創業諮詢第一品牌，提高十倍的創業成功機率
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              📋 諮詢流程
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-2">1</div>
                <p className="text-gray-700">選擇合適時段預約</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-2">2</div>
                <p className="text-gray-700">填寫企業基本資訊</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-2">3</div>
                <p className="text-gray-700">進行專業諮詢對話</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-2">4</div>
                <p className="text-gray-700">獲得實用建議與後續規劃</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                📞 立即聯繫
              </h3>
              <p className="text-indigo-100 mb-6">
                專業教練將在24小時內回覆您的諮詢
              </p>
              <a
                href="https://artherbooking.zeabur.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 bg-white text-indigo-600 font-bold text-lg rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                📅 預約諮詢時間
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}
