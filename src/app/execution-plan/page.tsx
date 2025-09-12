"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

interface FormData {
  product: string;
  service: string;
  feature: string;
  target: string;
  situation: string;
  ability: string;
  detail_number: string;
  analogy: string;
  differentiation: string;
  opportunity: string;
  uniqueness: string;
}

interface Result {
  motivation_and_goal: string;
  product_description: string;
  key_tasks: string;
  outcomes_and_benefits: string;
}

interface ExecutionPlanData {
  majorProjects: number;
  subProjectsPerMajor: number;
  startYear: number;
  startMonth: number;
  startDay: number;
  durationMonths: number;
}

interface ExecutionResult {
  project_name: string;
  major_projects: Array<{
    name: string;
    sub_projects: Array<{
      name: string;
      kpi: string;
      start_date: string;
      end_date: string;
    }>;
    plan_percentage: number;
  }>;
  total_duration: string;
  execution_period: string;
}

const executionTemplate = [
  { key: "majorProjects", label: "大項目數量", placeholder: "例如：5", type: "number", position: 1, category: "執行規劃", description: "請填入您希望分為幾個大項目" },
  { key: "subProjectsPerMajor", label: "每個大項目的子項目數量", placeholder: "例如：3", type: "number", position: 2, category: "執行規劃", description: "請填入每個大項目包含幾個子項目" },
  { key: "startYear", label: "開始年份", placeholder: "例如：2024", type: "number", position: 3, category: "執行規劃", description: "請填入專案開始的年份" },
  { key: "startMonth", label: "開始月份", placeholder: "例如：1", type: "number", position: 4, category: "執行規劃", description: "請填入專案開始的月份" },
  { key: "startDay", label: "開始日期", placeholder: "例如：1", type: "number", position: 5, category: "執行規劃", description: "請填入專案開始的日期" },
  { key: "durationMonths", label: "執行期間（月數）", placeholder: "例如：12", type: "number", position: 6, category: "執行規劃", description: "請填入專案總執行期間（月數）" },
];

export default function ExecutionPlan() {
  const { user } = useAuth();
  const [form, setForm] = useState<ExecutionPlanData>({
    majorProjects: 0,
    subProjectsPerMajor: 0,
    startYear: 2024,
    startMonth: 1,
    startDay: 1,
    durationMonths: 12,
  });

  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [correctionNotes, setCorrectionNotes] = useState("");
  const [isCorrecting, setIsCorrecting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [planSummary, setPlanSummary] = useState<{
    formData: FormData;
    result: Result;
    projectName: string;
  } | null>(null);

  // 載入現有資料
  useEffect(() => {
    loadExistingData();
  }, []);

  const loadExistingData = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        console.log('沒有認證令牌');
        return;
      }

      console.log('開始載入計劃摘要資料...');
      const response = await fetch('/api/load-plan-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      console.log('API 回傳資料:', data);
      
      if (data.success && data.data) {
        console.log('成功載入計劃摘要:', data.data);
        console.log('formData 內容:', data.data.formData);
        setPlanSummary(data.data);
      } else {
        console.log('沒有找到計劃摘要資料:', data.message || '未知錯誤');
        console.log('完整 API 回應:', data);
      }
    } catch (error) {
      console.error('載入資料錯誤:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: parseInt(value) || 0 });
  };

  const handleNext = () => {
    if (currentStep < executionTemplate.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);
    setError(null);
    setShowSuccess(false);
    setIsAnalyzing(true);
    setLoading(true);

    try {
      const res = await fetch("/api/generate-execution-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          executionData: form,
          planSummary: planSummary
        }),
      });

      const data = await res.json();
      
      if (data.error) {
        setError(data.error);
        console.error("API Error:", data);
      } else {
        setResult(data);
        setShowSuccess(true);
        // 儲存到資料庫
        await saveToDatabaseWithData(data, false);
        // 3秒後隱藏成功提示
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("網路錯誤，請檢查連線後重試");
    } finally {
      setLoading(false);
      setIsAnalyzing(false);
    }
  };

  const handleCorrection = async () => {
    if (!correctionNotes.trim()) {
      setError("請輸入修正備註");
      return;
    }

    setIsCorrecting(true);
    setError(null);
    setShowSuccess(false);

    try {
      const res = await fetch("/api/generate-execution-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          executionData: form,
          planSummary: planSummary,
          correction_notes: correctionNotes,
          previous_result: result
        }),
      });

      const data = await res.json();
      
      if (data.error) {
        setError(data.error);
        console.error("API Error:", data);
      } else {
        setResult(data);
        setShowSuccess(true);
        setCorrectionNotes("");
        // 儲存到資料庫（修正模式）
        await saveToDatabaseWithData(data, true);
        // 3秒後隱藏成功提示
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("網路錯誤，請檢查連線後重試");
    } finally {
      setIsCorrecting(false);
    }
  };

  const saveToDatabaseWithData = async (resultData: ExecutionResult, isCorrection = false) => {
    if (!user || !resultData) return;

    setIsSaving(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/save-execution-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          projectName: "我的創業專案",
          executionData: form,
          result: resultData,
          isCorrection
        })
      });

      const data = await response.json();
      
      if (data.success) {
        console.log(isCorrection ? '執行規劃已更新' : '執行規劃已儲存');
      } else {
        console.error('儲存失敗:', data.error);
      }
    } catch (error) {
      console.error('儲存錯誤:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // 檢查是否有計劃摘要
  if (!planSummary) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8">
          <div className="max-w-4xl mx-auto px-4">
            <div className="mb-8">
              <Link
                href="/"
                className="inline-flex items-center text-green-600 hover:text-green-800 font-medium mb-4 transition-colors duration-200"
              >
                ← 返回中控版
              </Link>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <div className="text-6xl mb-6">📝</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                請先完成計劃摘要
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                執行規劃需要基於您的計劃摘要來生成，請先完成計劃摘要
              </p>
              <Link
                href="/plan-summary"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-lg rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                📝 前往計劃摘要
              </Link>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8">
        <div className="max-w-6xl mx-auto px-4">
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
                基於您的計劃摘要，制定詳細的執行計劃
              </p>
            </div>
          </div>


          {/* 填空區域 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            {/* 進度條 */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  步驟 {currentStep + 1} / {executionTemplate.length} - {executionTemplate[currentStep].category}
                </span>
                <span className="text-sm text-gray-500">
                  {Math.round(((currentStep + 1) / executionTemplate.length) * 100)}% 完成
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / executionTemplate.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="mb-8">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  💡 請填寫：{executionTemplate[currentStep].label}
                </h3>
                <p className="text-gray-600 mb-2 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                  📝 {executionTemplate[currentStep].description}
                </p>
                <p className="text-gray-500 mb-4 bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400">
                  💭 {executionTemplate[currentStep].placeholder}
                </p>
              </div>
              
              <input
                name={executionTemplate[currentStep].key}
                type={executionTemplate[currentStep].type}
                value={form[executionTemplate[currentStep].key as keyof ExecutionPlanData]}
                onChange={handleChange}
                placeholder={executionTemplate[currentStep].placeholder}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg text-gray-900 placeholder-gray-500"
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
                {currentStep === executionTemplate.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-green-300 disabled:to-green-400 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        生成中...
                      </span>
                    ) : (
                      "🎯 生成執行規劃"
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!form[executionTemplate[currentStep].key as keyof ExecutionPlanData]}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-green-300 disabled:to-green-400 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl"
                  >
                    下一步 →
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* AI 分析中提示 */}
          {isAnalyzing && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8 animate-pulse">
              <div className="flex items-center justify-center">
                <div className="text-green-600 text-3xl mr-4">
                  <div className="animate-spin">🤖</div>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    正在生成執行規劃...
                  </h3>
                  <p className="text-green-700">
                    請稍候，我們正在為您生成詳細的執行計劃
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 完成提示 */}
          {showSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8 animate-bounce">
              <div className="flex items-center justify-center">
                <div className="text-green-600 text-3xl mr-4">
                  ✅
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    {isCorrecting ? "修正完成！" : "完成輸出！"}
                  </h3>
                  <p className="text-green-700">
                    {isCorrecting ? "您的執行規劃已根據修正備註重新生成並儲存" : "您的執行規劃已成功生成並儲存，請查看下方結果"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 儲存中提示 */}
          {isSaving && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-center">
                <div className="text-blue-600 text-3xl mr-4">
                  <div className="animate-spin">💾</div>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">
                    正在儲存...
                  </h3>
                  <p className="text-blue-700">
                    請稍候，我們正在將您的資料儲存到資料庫
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
              <div className="flex items-center">
                <div className="text-red-600 text-2xl mr-3">⚠️</div>
                <div>
                  <h3 className="text-lg font-semibold text-red-800 mb-2">
                    發生錯誤
                  </h3>
                  <p className="text-red-700">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="mt-3 text-red-600 hover:text-red-800 underline"
                  >
                    關閉
                  </button>
                </div>
              </div>
            </div>
          )}

          {result && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                📋 執行規劃結果
              </h2>
              
              <div className="space-y-6">
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-green-800 mb-4">
                    📊 專案概覽
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-900">
                    <div><strong className="text-gray-900">專案名稱：</strong><span className="text-gray-800">{result.project_name}</span></div>
                    <div><strong className="text-gray-900">執行期間：</strong><span className="text-gray-800">{result.execution_period}</span></div>
                    <div><strong className="text-gray-900">總時程：</strong><span className="text-gray-800">{result.total_duration}</span></div>
                    <div><strong className="text-gray-900">大項目數：</strong><span className="text-gray-800">{result.major_projects.length} 個</span></div>
                  </div>
                </div>

                {result.major_projects.map((majorProject, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {index + 1}. {majorProject.name}
                      </h3>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        {majorProject.plan_percentage}%
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      {majorProject.sub_projects.map((subProject, subIndex) => (
                        <div key={subIndex} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-gray-800">
                              {subProject.name}
                            </h4>
                            <div className="text-sm text-gray-600">
                              {subProject.start_date} - {subProject.end_date}
                            </div>
                          </div>
                          <div className="text-sm text-gray-700">
                            <strong>KPI：</strong>{subProject.kpi}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* 修正備注區 */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                  ✏️ 修正備註區
                </h3>
                <p className="text-gray-600 text-center mb-4">
                  請閱讀上方執行規劃，如有需要修正的地方，請在下方輸入您的修正建議
                </p>
                
                <div className="space-y-4">
                  <textarea
                    value={correctionNotes}
                    onChange={(e) => setCorrectionNotes(e.target.value)}
                    placeholder="請輸入您希望修正的內容，例如：&#10;- 希望調整時程安排&#10;- 需要修改KPI指標&#10;- 調整計畫比重分配&#10;- 增加風險評估項目"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-500"
                    rows={5}
                  />
                  
                  <div className="text-center">
                    <button
                      onClick={handleCorrection}
                      disabled={isCorrecting || !correctionNotes.trim()}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-green-300 disabled:to-green-400 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl"
                    >
                      {isCorrecting ? (
                        <span className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          修正中...
                        </span>
                      ) : (
                        "🔄 根據備註重新生成"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
