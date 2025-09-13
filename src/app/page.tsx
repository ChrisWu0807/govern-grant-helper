"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";

interface CompletionStatus {
  planSummary: boolean;
  executionPlan: boolean;
  budgetPlanning: boolean;
  trafficAcquisition: boolean;
  contactCoach: boolean;
  additionalFeatures: boolean;
}

interface SubProject {
  name: string;
  kpi: string;
  start_date: string;
  end_date: string;
}

interface MajorProject {
  name: string;
  sub_projects: SubProject[];
  plan_percentage: number;
}

export default function Home() {
  const { user, logout, loading } = useAuth();
  const [completionStatus, setCompletionStatus] = useState<CompletionStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);

  // 載入完成狀態
  useEffect(() => {
    const loadCompletionStatus = async () => {
      if (!user) {
        setStatusLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          setStatusLoading(false);
          return;
        }

        const response = await fetch('/api/check-completion-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (data.success) {
          setCompletionStatus(data.data);
        }
      } catch (error) {
        console.error('載入完成狀態錯誤:', error);
      } finally {
        setStatusLoading(false);
      }
    };

    loadCompletionStatus();
  }, [user]);

  // 全部匯出功能
  const downloadCompleteReport = async () => {
    try {
      // 獲取所有資料
      const token = localStorage.getItem('auth_token');
      if (!token) {
        console.error('沒有認證令牌');
        return;
      }

      // 獲取計劃摘要
      const planSummaryResponse = await fetch('/api/load-plan-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const planSummaryData = await planSummaryResponse.json();

      // 獲取執行規劃
      const executionResponse = await fetch('/api/load-execution-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const executionData = await executionResponse.json();

      // 獲取預算編列
      const budgetResponse = await fetch('/api/load-budget-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const budgetData = await budgetResponse.json();

      // 生成完整報告
      let report = `📝 政府補助案完整報告\n`;
      report += `生成時間：${new Date().toLocaleString('zh-TW')}\n`;
      report += `═══════════════════════════════════════\n\n`;

      // 計劃摘要
      if (planSummaryData.success && planSummaryData.data) {
        const planSummary = planSummaryData.data.result;
        report += `📝 計劃摘要\n`;
        report += `═══════════════════════════════════════\n`;
        report += `🎯 創業動機及計畫目標\n${planSummary.motivation_and_goal}\n\n`;
        report += `📦 產品描述\n${planSummary.product_description}\n\n`;
        report += `⚙️ 重要工作項目\n${planSummary.key_tasks}\n\n`;
        report += `📈 產出及效益\n${planSummary.outcomes_and_benefits}\n\n`;
      }

      // 執行規劃
      if (executionData.success && executionData.data) {
        const execution = executionData.data.result;
        report += `⚙️ 執行規劃\n`;
        report += `═══════════════════════════════════════\n`;
        report += `📊 專案概覽\n`;
        report += `專案名稱：${execution.project_name || '未設定'}\n`;
        report += `執行期間：${execution.execution_period || '未設定'}\n`;
        report += `總時程：${execution.total_duration || '未設定'}\n\n`;

        if (execution.major_projects && execution.major_projects.length > 0) {
          report += `📋 大項目\n`;
          execution.major_projects.forEach((majorProject: MajorProject, index: number) => {
            report += `${index + 1}. ${majorProject.name || '未設定'}\n`;
            if (majorProject.sub_projects && majorProject.sub_projects.length > 0) {
              report += `   子項目：\n`;
              majorProject.sub_projects.forEach((subProject: SubProject, subIndex: number) => {
                report += `   ${subIndex + 1}. ${subProject.name || '未設定'}\n`;
                report += `      KPI：${subProject.kpi || '未設定'}\n`;
                report += `      期間：${subProject.start_date || '未設定'} - ${subProject.end_date || '未設定'}\n`;
              });
            }
            report += `\n`;
          });
        }
      }

      // 預算編列
      if (budgetData.success && budgetData.data) {
        const budget = budgetData.data.formData;
        const totalBudget = budget.totalBudget * 10000; // 轉換為元
        const selfFundAmount = totalBudget * (budget.selfFundRatio / 100);
        const subsidyAmount = totalBudget * (budget.subsidyRatio / 100);
        const personnelCost = totalBudget * (budget.personnelCostRatio / 100);
        const researchCost = totalBudget * (budget.researchCostRatio / 100);
        const marketValidationCost = totalBudget * (budget.marketValidationRatio / 100);

        const formatCurrency = (amount: number) => {
          return new Intl.NumberFormat('zh-TW', {
            style: 'currency',
            currency: 'TWD',
            minimumFractionDigits: 0,
          }).format(amount);
        };

        report += `💰 預算編列\n`;
        report += `═══════════════════════════════════════\n`;
        report += `📊 預算總覽\n`;
        report += `總預算：${formatCurrency(totalBudget)}\n`;
        report += `自籌款：${formatCurrency(selfFundAmount)} (${budget.selfFundRatio}%)\n`;
        report += `補助款：${formatCurrency(subsidyAmount)} (${budget.subsidyRatio}%)\n\n`;
        
        report += `📋 預算分配\n`;
        report += `人事成本：${formatCurrency(personnelCost)} (${budget.personnelCostRatio}%)\n`;
        report += `委外研究費：${formatCurrency(researchCost)} (${budget.researchCostRatio}%)\n`;
        report += `市場驗證費：${formatCurrency(marketValidationCost)} (${budget.marketValidationRatio}%)\n\n`;
        
        report += `📈 預算明細表\n`;
        report += `項目\t\t金額\t\t比例\n`;
        report += `────────────────────────────\n`;
        report += `總預算\t\t${formatCurrency(totalBudget)}\t\t100%\n`;
        report += `自籌款\t\t${formatCurrency(selfFundAmount)}\t\t${budget.selfFundRatio}%\n`;
        report += `補助款\t\t${formatCurrency(subsidyAmount)}\t\t${budget.subsidyRatio}%\n`;
        report += `────────────────────────────\n`;
        report += `人事成本\t\t${formatCurrency(personnelCost)}\t\t${budget.personnelCostRatio}%\n`;
        report += `委外研究費\t\t${formatCurrency(researchCost)}\t\t${budget.researchCostRatio}%\n`;
        report += `市場驗證費\t\t${formatCurrency(marketValidationCost)}\t\t${budget.marketValidationRatio}%\n\n`;
      }

      report += `═══════════════════════════════════════\n`;
      report += `感謝使用政府補助案小寫手！\n`;
      report += `祝您的創業計畫順利成功！\n`;

      // 下載文件
      const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `政府補助案完整報告_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('下載報告失敗:', error);
    }
  };
  
  // 如果正在載入，顯示載入畫面
  if (loading || statusLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">載入中...</p>
        </div>
      </div>
    );
  }

  // 如果未登入，重定向到登入頁面
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
            📝 政府補助案小寫手
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            請先登入以使用完整功能
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
  
  const features = [
    {
      id: "plan-summary",
      title: "計劃摘要",
      description: "AI 驅動的創業計劃摘要生成",
      icon: "📝",
      href: "/plan-summary",
      color: "from-blue-500 to-blue-600",
      hoverColor: "from-blue-600 to-blue-700",
      isCompleted: completionStatus?.planSummary || false
    },
    {
      id: "execution-plan",
      title: "執行規劃",
      description: "詳細的項目執行計劃制定",
      icon: "⚙️",
      href: "/execution-plan",
      color: "from-green-500 to-green-600",
      hoverColor: "from-green-600 to-green-700",
      isCompleted: completionStatus?.executionPlan || false
    },
    {
      id: "budget-planning",
      title: "預算編列",
      description: "完整的財務預算規劃工具",
      icon: "💰",
      href: "/budget-planning",
      color: "from-yellow-500 to-yellow-600",
      hoverColor: "from-yellow-600 to-yellow-700",
      isCompleted: completionStatus?.budgetPlanning || false
    },
    {
      id: "traffic-acquisition",
      title: "流量獲取",
      description: "市場推廣與客戶獲取策略",
      icon: "📈",
      href: "/traffic-acquisition",
      color: "from-purple-500 to-purple-600",
      hoverColor: "from-purple-600 to-purple-700"
    },
    {
      id: "contact-coach",
      title: "預約諮詢",
      description: "專業創業教練諮詢服務",
      icon: "👨‍🏫",
      href: "https://artherbooking.zeabur.app/",
      color: "from-indigo-500 to-indigo-600",
      hoverColor: "from-indigo-600 to-indigo-700",
      isExternal: true
    },
    {
      id: "extensions",
      title: "擴充功能",
      description: "更多實用工具與功能",
      icon: "🔧",
      href: "/extensions",
      color: "from-gray-500 to-gray-600",
      hoverColor: "from-gray-600 to-gray-700"
    }
  ];

  const getStatusBadge = (isCompleted: boolean) => {
    if (isCompleted) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          ✅ 已完成
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
          📝 待填寫
        </span>
      );
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
            從計劃摘要到預算編列，AI 助您完成整個申請流程
          </p>
          
          {/* 用戶狀態 */}
          <div className="mt-6 flex items-center justify-center space-x-4">
            <span className="text-lg text-gray-700">
              歡迎回來，{user.name}！
            </span>
            {/* 全部匯出按鈕 - 只有當三個主要功能都完成時才顯示 */}
            {completionStatus?.planSummary && completionStatus?.executionPlan && completionStatus?.budgetPlanning && (
              <button
                onClick={downloadCompleteReport}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span className="mr-2">📄</span>
                全部匯出
              </button>
            )}
            <button
              onClick={logout}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
            >
              登出
            </button>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            if (feature.isExternal) {
              return (
                <a
                  key={feature.id}
                  href={feature.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl cursor-pointer"
                >
                  {/* Status Badge - 只有主要功能顯示狀態 */}
                  {feature.isCompleted !== undefined && (
                    <div className="absolute top-4 right-4">
                      {getStatusBadge(feature.isCompleted)}
                    </div>
                  )}

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
                </a>
              );
            } else {
              return (
                <Link
                  key={feature.id}
                  href={feature.href}
                  className="group relative bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl cursor-pointer"
                >
                  {/* Status Badge - 只有主要功能顯示狀態 */}
                  {feature.isCompleted !== undefined && (
                    <div className="absolute top-4 right-4">
                      {getStatusBadge(feature.isCompleted)}
                    </div>
                  )}

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
              );
            }
          })}
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

        {/* LINE 按鈕 - 固定在右下角 */}
        <div className="fixed bottom-6 right-6 z-50">
          <a
            href="https://lin.ee/ArjK3Yx"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <svg
              className="w-6 h-6 mr-2"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
            </svg>
            LINE 諮詢
          </a>
        </div>
      </div>
    </div>
  );
}