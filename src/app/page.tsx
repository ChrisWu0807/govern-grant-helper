"use client";

import { useState } from "react";
import ExampleSection from "./components/ExampleSection";

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

const storyTemplate = [
  { key: "product", label: "產品", placeholder: "例如：智能健康監測手環", position: 1, category: "基礎資訊" },
  { key: "service", label: "服務", placeholder: "例如：24小時健康數據監測", position: 2, category: "基礎資訊" },
  { key: "feature", label: "特色", placeholder: "例如：心率監測、睡眠分析、運動追蹤", position: 3, category: "基礎資訊" },
  { key: "target", label: "主要客群", placeholder: "例如：25-45歲注重健康的上班族", position: 4, category: "基礎資訊" },
  { key: "situation", label: "使用情境", placeholder: "例如：日常佩戴監測健康狀況", position: 5, category: "基礎資訊" },
  { key: "ability", label: "能力", placeholder: "例如：AI算法開發、硬體設計", position: 6, category: "基礎資訊" },
  { key: "detail_number", label: "數字化描述", placeholder: "例如：準確率達95%以上，電池續航7天", position: 7, category: "詳細資訊" },
  { key: "analogy", label: "比喻", placeholder: "例如：就像隨身的健康管家", position: 8, category: "詳細資訊" },
  { key: "differentiation", label: "差異化", placeholder: "例如：結合AI算法提供個人化建議", position: 9, category: "詳細資訊" },
  { key: "opportunity", label: "機會", placeholder: "例如：全球可穿戴設備市場年增長率15%", position: 10, category: "詳細資訊" },
  { key: "uniqueness", label: "獨特差異化", placeholder: "例如：首創AI健康預警系統", position: 11, category: "詳細資訊" },
];

// 格式化文字，將數字列表分行顯示
const formatText = (text: string) => {
  if (!text) return text;
  
  // 處理數字列表格式：1. 2. 3. 等
  let formatted = text.replace(/(\d+)\.\s/g, '\n$1. ');
  
  // 處理中文數字列表格式：一、二、三、等
  formatted = formatted.replace(/([一二三四五六七八九十]+)\.\s/g, '\n$1. ');
  
  // 清理多餘的換行
  formatted = formatted.replace(/\n+/g, '\n').trim();
  
  return formatted;
};

export default function Home() {
  const [form, setForm] = useState<FormData>({
    product: "",
    service: "",
    feature: "",
    target: "",
    situation: "",
    ability: "",
    detail_number: "",
    analogy: "",
    differentiation: "",
    opportunity: "",
    uniqueness: "",
  });

  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [correctionNotes, setCorrectionNotes] = useState("");
  const [isCorrecting, setIsCorrecting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (currentStep < storyTemplate.length - 1) {
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
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      
      if (data.error) {
        setError(data.error);
        console.error("API Error:", data);
      } else {
        setResult(data);
        setShowSuccess(true);
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
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
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

  const getStoryText = () => {
    const currentField = storyTemplate[currentStep];
    const filledFields = storyTemplate.slice(0, currentStep + 1);
    
    let story = "我的產品是【";
    story += form.product || "______";
    story += "】，提供【";
    story += form.service || "______";
    story += "】的【服務】，我們的特色是【";
    story += form.feature || "______";
    story += "】，主要客群是【";
    story += form.target || "______";
    story += "】，他們在【";
    story += form.situation || "______";
    story += "】情況下會需要我們的產品，因為我們具備【";
    story += form.ability || "______";
    story += "】的能力，所以我們可以提供最好的產品或服務。";
    
    return story;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🚀 政府補助案小助手
          </h1>
          <p className="text-lg text-gray-600">
            讓我們一起完成您的創業故事，AI 將幫您生成專業的計畫摘要
          </p>
        </div>

        <ExampleSection />

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          {/* 進度條 */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">
                步驟 {currentStep + 1} / {storyTemplate.length} - {storyTemplate[currentStep].category}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(((currentStep + 1) / storyTemplate.length) * 100)}% 完成
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((currentStep + 1) / storyTemplate.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* 故事填空區域 */}
          <div className="mb-8">
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                📝 您的創業故事
              </h3>
              <div className="text-lg leading-relaxed text-gray-700 whitespace-pre-line">
                {getStoryText()}
              </div>
            </div>

            {/* 當前輸入欄位 */}
            <div className="space-y-4">
              <div className="text-center">
                <div className="inline-flex items-center bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full mb-3 animate-pulse">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-ping"></span>
                  正在填寫：{storyTemplate[currentStep].label}
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                  💡 請填寫：{storyTemplate[currentStep].label}
                </h4>
                <p className="text-gray-600 mb-4 bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400">
                  💭 {storyTemplate[currentStep].placeholder}
                </p>
              </div>
              
              <textarea
                name={storyTemplate[currentStep].key}
                value={form[storyTemplate[currentStep].key as keyof FormData]}
                onChange={handleChange}
                placeholder={storyTemplate[currentStep].placeholder}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-lg text-gray-900 placeholder-gray-500"
                rows={4}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (form[storyTemplate[currentStep].key as keyof FormData].trim()) {
                      handleNext();
                    }
                  }
                }}
              />
            </div>
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
              {currentStep === storyTemplate.length - 1 ? (
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
                    "🎯 生成計畫摘要"
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!form[storyTemplate[currentStep].key as keyof FormData].trim()}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-blue-300 disabled:to-blue-400 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl"
                >
                  下一步 →
                </button>
              )}
            </div>
          </div>
        </div>

        {/* AI 分析中提示 */}
        {isAnalyzing && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8 animate-pulse">
            <div className="flex items-center justify-center">
              <div className="text-blue-600 text-3xl mr-4">
                <div className="animate-spin">🤖</div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  正在請 AI 分析中...
                </h3>
                <p className="text-blue-700">
                  請稍候，我們正在為您生成專業的計畫摘要
                </p>
                <div className="flex justify-center mt-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
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
                  {isCorrecting ? "您的計畫摘要已根據修正備註重新生成" : "您的計畫摘要已成功生成，請查看下方結果"}
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
              📋 生成結果
            </h2>
            
            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  🎯 創業動機及計畫目標
                </h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{formatText(result.motivation_and_goal)}</p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  📦 產品描述
                </h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{formatText(result.product_description)}</p>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  ⚙️ 重要工作項目
                </h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{formatText(result.key_tasks)}</p>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  📈 產出及效益
                </h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{formatText(result.outcomes_and_benefits)}</p>
              </div>
            </div>

            {/* 修正備注區 */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                ✏️ 修正備註區
              </h3>
              <p className="text-gray-600 text-center mb-4">
                請閱讀上方報告，如有需要修正的地方，請在下方輸入您的修正建議
              </p>
              
              <div className="space-y-4">
                <textarea
                  value={correctionNotes}
                  onChange={(e) => setCorrectionNotes(e.target.value)}
                  placeholder="請輸入您希望修正的內容，例如：&#10;- 希望更強調技術創新部分&#10;- 需要增加更多量化指標&#10;- 調整市場定位描述&#10;- 加強競爭優勢說明"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-500"
                  rows={5}
                />
                
                <div className="text-center">
                  <button
                    onClick={handleCorrection}
                    disabled={isCorrecting || !correctionNotes.trim()}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-orange-300 disabled:to-orange-400 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl"
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
  );
}