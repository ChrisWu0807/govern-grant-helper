"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";

interface BudgetData {
  totalBudget: number;
  selfFundRatio: number;
  subsidyRatio: number;
  personnelCostRatio: number;
  researchCostRatio: number;
  marketValidationRatio: number;
}

const budgetTemplate = [
  { key: "totalBudget", label: "總預算金額（萬元）", placeholder: "例如：200", type: "number", position: 1, category: "預算編列", description: "請填入您的總預算金額（單位：萬元）" },
  { key: "selfFundRatio", label: "自籌款比例（%）", placeholder: "例如：50", type: "number", position: 2, category: "預算編列", description: "請填入自籌款佔總預算的比例（%）" },
  { key: "subsidyRatio", label: "補助款比例（%）", placeholder: "例如：50", type: "number", position: 3, category: "預算編列", description: "請填入補助款佔總預算的比例（%）" },
  { key: "personnelCostRatio", label: "人事成本比例（%）", placeholder: "例如：30", type: "number", position: 4, category: "預算編列", description: "請填入人事成本佔總預算的比例（%）" },
  { key: "researchCostRatio", label: "委外研究費比例（%）", placeholder: "例如：30", type: "number", position: 5, category: "預算編列", description: "請填入委外研究費佔總預算的比例（%）" },
  { key: "marketValidationRatio", label: "市場驗證費比例（%）", placeholder: "例如：40", type: "number", position: 6, category: "預算編列", description: "請填入市場驗證費佔總預算的比例（%）" },
];

export default function BudgetPlanning() {
  const [form, setForm] = useState<BudgetData>({
    totalBudget: 0,
    selfFundRatio: 0,
    subsidyRatio: 0,
    personnelCostRatio: 0,
    researchCostRatio: 0,
    marketValidationRatio: 0,
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: parseFloat(value) || 0 });
  };

  const handleNext = () => {
    if (currentStep < budgetTemplate.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    setShowResult(true);
  };

  const generateBudgetTable = () => {
    const totalBudget = form.totalBudget * 10000; // 轉換為元
    const selfFundAmount = totalBudget * (form.selfFundRatio / 100);
    const subsidyAmount = totalBudget * (form.subsidyRatio / 100);
    
    const personnelCost = totalBudget * (form.personnelCostRatio / 100);
    const researchCost = totalBudget * (form.researchCostRatio / 100);
    const marketValidationCost = totalBudget * (form.marketValidationRatio / 100);
    
    const personnelSelfFund = personnelCost * (form.selfFundRatio / 100);
    const personnelSubsidy = personnelCost * (form.subsidyRatio / 100);
    
    const researchSelfFund = researchCost * (form.selfFundRatio / 100);
    const researchSubsidy = researchCost * (form.subsidyRatio / 100);
    
    const marketSelfFund = marketValidationCost * (form.selfFundRatio / 100);
    const marketSubsidy = marketValidationCost * (form.subsidyRatio / 100);

    return {
      totalBudget,
      selfFundAmount,
      subsidyAmount,
      personnelCost,
      researchCost,
      marketValidationCost,
      personnelSelfFund,
      personnelSubsidy,
      researchSelfFund,
      researchSubsidy,
      marketSelfFund,
      marketSubsidy,
    };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (showResult) {
    const budgetData = generateBudgetTable();
    
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-100 py-8">
          <div className="max-w-6xl mx-auto px-4">
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
                  💰 預算編列結果
                </h1>
                <p className="text-lg text-gray-600">
                  根據您的輸入參數生成的預算規劃表
                </p>
              </div>
            </div>

            {/* 預算表格 */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                📊 預算規劃表
              </h2>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-yellow-50">
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-800">項目</th>
                      <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-800">比例</th>
                      <th className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-800">總金額</th>
                      <th className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-800">自籌款</th>
                      <th className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-800">補助款</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-medium text-gray-800">人事成本</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">{form.personnelCostRatio}%</td>
                      <td className="border border-gray-300 px-4 py-3 text-right text-gray-700">{formatCurrency(budgetData.personnelCost)}</td>
                      <td className="border border-gray-300 px-4 py-3 text-right text-gray-700">{formatCurrency(budgetData.personnelSelfFund)}</td>
                      <td className="border border-gray-300 px-4 py-3 text-right text-gray-700">{formatCurrency(budgetData.personnelSubsidy)}</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-medium text-gray-800">委外研究費</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">{form.researchCostRatio}%</td>
                      <td className="border border-gray-300 px-4 py-3 text-right text-gray-700">{formatCurrency(budgetData.researchCost)}</td>
                      <td className="border border-gray-300 px-4 py-3 text-right text-gray-700">{formatCurrency(budgetData.researchSelfFund)}</td>
                      <td className="border border-gray-300 px-4 py-3 text-right text-gray-700">{formatCurrency(budgetData.researchSubsidy)}</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-medium text-gray-800">市場驗證費</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">{form.marketValidationRatio}%</td>
                      <td className="border border-gray-300 px-4 py-3 text-right text-gray-700">{formatCurrency(budgetData.marketValidationCost)}</td>
                      <td className="border border-gray-300 px-4 py-3 text-right text-gray-700">{formatCurrency(budgetData.marketSelfFund)}</td>
                      <td className="border border-gray-300 px-4 py-3 text-right text-gray-700">{formatCurrency(budgetData.marketSubsidy)}</td>
                    </tr>
                    <tr className="bg-yellow-100 font-bold">
                      <td className="border border-gray-300 px-4 py-3 text-gray-800">合計</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-gray-800">100%</td>
                      <td className="border border-gray-300 px-4 py-3 text-right text-gray-800">{formatCurrency(budgetData.totalBudget)}</td>
                      <td className="border border-gray-300 px-4 py-3 text-right text-gray-800">{formatCurrency(budgetData.selfFundAmount)}</td>
                      <td className="border border-gray-300 px-4 py-3 text-right text-gray-800">{formatCurrency(budgetData.subsidyAmount)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowResult(false)}
                  className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                  🔄 重新填寫
                </button>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-100 py-8">
        <div className="max-w-6xl mx-auto px-4">
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

          {/* 填空區域 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            {/* 進度條 */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  步驟 {currentStep + 1} / {budgetTemplate.length} - {budgetTemplate[currentStep].category}
                </span>
                <span className="text-sm text-gray-500">
                  {Math.round(((currentStep + 1) / budgetTemplate.length) * 100)}% 完成
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / budgetTemplate.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="mb-8">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  💡 請填寫：{budgetTemplate[currentStep].label}
                </h3>
                <p className="text-gray-600 mb-2 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                  📝 {budgetTemplate[currentStep].description}
                </p>
                <p className="text-gray-500 mb-4 bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400">
                  💭 {budgetTemplate[currentStep].placeholder}
                </p>
              </div>
              
              <input
                name={budgetTemplate[currentStep].key}
                type={budgetTemplate[currentStep].type}
                value={form[budgetTemplate[currentStep].key as keyof BudgetData]}
                onChange={handleChange}
                placeholder={budgetTemplate[currentStep].placeholder}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-lg text-gray-900 placeholder-gray-500"
                autoFocus
              />
            </div>

            {/* 導航按鈕 */}
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="px-6 py-3 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
              >
                ← 上一步
              </button>

              <div className="flex space-x-4">
                {currentStep === budgetTemplate.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    📊 生成預算表
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!form[budgetTemplate[currentStep].key as keyof BudgetData]}
                    className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 disabled:from-yellow-300 disabled:to-yellow-400 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl"
                  >
                    下一步 →
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
