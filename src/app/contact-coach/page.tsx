"use client";

import Image from "next/image";
import Link from "next/link";

export default function ContactCoach() {
  return (
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
              專業創業教練諮詢
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              獲得專業指導，提升您的創業成功率
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-indigo-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-indigo-800 mb-4">
                🎯 服務內容
              </h3>
              <ul className="text-indigo-700 space-y-2">
                <li>• 創業計劃書審核</li>
                <li>• 商業模式優化</li>
                <li>• 市場分析指導</li>
                <li>• 財務規劃建議</li>
                <li>• 申請流程協助</li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-blue-800 mb-4">
                💡 教練優勢
              </h3>
              <ul className="text-blue-700 space-y-2">
                <li>• 10年以上創業經驗</li>
                <li>• 成功案例超過100件</li>
                <li>• 政府補助案專家</li>
                <li>• 一對一專屬指導</li>
                <li>• 全程陪伴服務</li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-lg p-8 mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                📞 立即聯繫
              </h3>
              <p className="text-indigo-100 mb-6">
                專業教練將在24小時內回覆您的諮詢
              </p>
              <a
                href="https://calendly.com/your-coach/consultation"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 bg-white text-indigo-600 font-bold text-lg rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                📅 預約諮詢時間
              </a>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:coach@example.com"
                className="inline-flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors duration-200"
              >
                📧 發送郵件
              </a>
              <a
                href="tel:+886-2-1234-5678"
                className="inline-flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors duration-200"
              >
                📞 電話諮詢
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
