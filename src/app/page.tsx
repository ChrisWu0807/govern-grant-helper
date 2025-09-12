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

const formFields = [
  { key: "product", label: "產品", placeholder: "請描述您的產品" },
  { key: "service", label: "提供", placeholder: "請描述您提供的服務" },
  { key: "feature", label: "特色", placeholder: "請描述產品/服務的特色" },
  { key: "target", label: "主要客群", placeholder: "請描述目標客群" },
  { key: "situation", label: "使用情境", placeholder: "請描述使用情境" },
  { key: "ability", label: "能力", placeholder: "請描述團隊能力" },
  { key: "detail_number", label: "數字化描述", placeholder: "請提供具體數字或數據" },
  { key: "analogy", label: "比喻", placeholder: "請用比喻來描述您的產品" },
  { key: "differentiation", label: "差異化", placeholder: "請描述與競爭對手的差異" },
  { key: "opportunity", label: "機會", placeholder: "請描述市場機會" },
  { key: "uniqueness", label: "獨特差異化", placeholder: "請描述獨特的競爭優勢" },
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🚀 政府補助案小助手
          </h1>
          <p className="text-lg text-gray-600">
            填寫以下資訊，AI 將幫你生成專業的計畫摘要
          </p>
        </div>

        <ExampleSection />

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formFields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {field.label}
                  </label>
                  <textarea
                    name={field.key}
                    value={form[field.key as keyof FormData]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors duration-200"
              >
                {loading ? "生成中..." : "生成計畫摘要"}
              </button>
            </div>
          </form>
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
