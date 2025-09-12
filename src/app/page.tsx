"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const { user, logout, loading } = useAuth();
  
  const features = [
    {
      id: "plan-summary",
      title: "計劃摘要",
      description: "AI 驅動的創業計劃摘要生成",
      icon: "📝",
      status: "completed",
      href: "/plan-summary",
      color: "from-blue-500 to-blue-600",
      hoverColor: "from-blue-600 to-blue-700"
    },
    {
      id: "execution-plan",
      title: "執行規劃",
      description: "詳細的項目執行計劃制定",
      icon: "⚙️",
      status: "coming-soon",
      href: "/execution-plan",
      color: "from-green-500 to-green-600",
      hoverColor: "from-green-600 to-green-700"
    },
    {
      id: "budget-planning",
      title: "預算編列",
      description: "完整的財務預算規劃工具",
      icon: "💰",
      status: "coming-soon",
      href: "/budget-planning",
      color: "from-yellow-500 to-yellow-600",
      hoverColor: "from-yellow-600 to-yellow-700"
    },
    {
      id: "traffic-acquisition",
      title: "流量獲取",
      description: "市場推廣與客戶獲取策略",
      icon: "📈",
      status: "coming-soon",
      href: "/traffic-acquisition",
      color: "from-purple-500 to-purple-600",
      hoverColor: "from-purple-600 to-purple-700"
    },
    {
      id: "contact-coach",
      title: "聯繫教練",
      description: "專業創業教練諮詢服務",
      icon: "👨‍🏫",
      status: "available",
      href: "/contact-coach",
      color: "from-indigo-500 to-indigo-600",
      hoverColor: "from-indigo-600 to-indigo-700"
    },
    {
      id: "extensions",
      title: "擴充功能",
      description: "更多實用工具與功能",
      icon: "🔧",
      status: "coming-soon",
      href: "/extensions",
      color: "from-gray-500 to-gray-600",
      hoverColor: "from-gray-600 to-gray-700"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            ✅ 已完成
          </span>
        );
      case "available":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            🔗 可用
          </span>
        );
      case "coming-soon":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            🚧 開發中
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Image
                src="/logo.png"
                alt="政府補助案小寫手 Logo"
                width={100}
                height={100}
                className="rounded-full shadow-lg"
                priority
              />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            📝 政府補助案小寫手
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            一站式創業補助申請解決方案
          </p>
          <p className="text-lg text-gray-500">
            從計劃摘要到執行規劃，AI 助您完成整個申請流程
          </p>
          
          {/* 用戶狀態 */}
          <div className="mt-6">
            {loading ? (
              <div className="text-gray-500">載入中...</div>
            ) : user ? (
              <div className="flex items-center justify-center space-x-4">
                <span className="text-lg text-gray-700">
                  歡迎回來，{user.name}！
                </span>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
                >
                  登出
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-4">
                <Link
                  href="/login"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  登入 / 註冊
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Link
              key={feature.id}
              href={feature.href}
              className={`group relative bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${
                feature.status === "coming-soon" ? "cursor-not-allowed opacity-75" : "cursor-pointer"
              }`}
            >
              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                {getStatusBadge(feature.status)}
              </div>

              {/* Icon */}
              <div className="text-center mb-6">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r ${feature.color} text-white text-3xl shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                  {feature.icon}
                </div>
              </div>

              {/* Content */}
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Hover Effect */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.hoverColor} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              🚀 開始您的創業之旅
            </h3>
            <p className="text-gray-600 mb-6">
              選擇「計劃摘要」開始填寫您的創業故事，AI 將為您生成專業的政府補助案申請文件
            </p>
            <Link
              href="/plan-summary"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-lg rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              📝 開始填寫計劃摘要
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}