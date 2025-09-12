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
  { key: "product", label: "產品", placeholder: "例如：智能健康監測手環", position: 1 },
  { key: "service", label: "服務", placeholder: "例如：24小時健康數據監測", position: 2 },
  { key: "feature", label: "特色", placeholder: "例如：心率監測、睡眠分析、運動追蹤", position: 3 },
  { key: "target", label: "主要客群", placeholder: "例如：25-45歲注重健康的上班族", position: 4 },
  { key: "situation", label: "使用情境", placeholder: "例如：日常佩戴監測健康狀況", position: 5 },
  { key: "ability", label: "能力", placeholder: "例如：AI算法開發、硬體設計", position: 6 },
  { key: "detail_number", label: "數字化描述", placeholder: "例如：準確率達95%以上，電池續航7天", position: 7 },
  { key: "analogy", label: "比喻", placeholder: "例如：就像隨身的健康管家", position: 8 },
  { key: "differentiation", label: "差異化", placeholder: "例如：結合AI算法提供個人化建議", position: 9 },
  { key: "opportunity", label: "機會", placeholder: "例如：全球可穿戴設備市場年增長率15%", position: 10 },
  { key: "uniqueness", label: "獨特差異化", placeholder: "例如：首創AI健康預警系統", position: 11 },
];

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
    setLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
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
                步驟 {currentStep + 1} / {storyTemplate.length}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(((currentStep + 1) / storyTemplate.length) * 100)}% 完成
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
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
                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                  請填寫：{storyTemplate[currentStep].label}
                </h4>
                <p className="text-gray-600 mb-4">
                  {storyTemplate[currentStep].placeholder}
                </p>
              </div>
              
              <textarea
                name={storyTemplate[currentStep].key}
                value={form[storyTemplate[currentStep].key as keyof FormData]}
                onChange={handleChange}
                placeholder={storyTemplate[currentStep].placeholder}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-lg"
                rows={4}
                autoFocus
              />
            </div>
          </div>

          {/* 導航按鈕 */}
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="px-6 py-3 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200"
            >
              ← 上一步
            </button>

            <div className="flex space-x-4">
              {currentStep === storyTemplate.length - 1 ? (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors duration-200"
                >
                  {loading ? "生成中..." : "🎯 生成計畫摘要"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!form[storyTemplate[currentStep].key as keyof FormData].trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  下一步 →
                </button>
              )}
            </div>
          </div>
        </div>

        {result && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              📋 生成結果
            </h2>
            
            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  🎯 創業動機及計畫目標
                </h3>
                <p className="text-gray-700 leading-relaxed">{result.motivation_and_goal}</p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  📦 產品描述
                </h3>
                <p className="text-gray-700 leading-relaxed">{result.product_description}</p>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  ⚙️ 重要工作項目
                </h3>
                <p className="text-gray-700 leading-relaxed">{result.key_tasks}</p>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  📈 產出及效益
                </h3>
                <p className="text-gray-700 leading-relaxed">{result.outcomes_and_benefits}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
