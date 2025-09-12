"use client";

import { useState } from "react";

const exampleData = {
  product: "智能健康監測手環",
  service: "提供24小時健康數據監測與AI健康建議服務",
  feature: "心率監測、睡眠分析、運動追蹤、健康預警",
  target: "25-45歲注重健康的上班族和運動愛好者",
  situation: "日常佩戴監測健康狀況，運動時追蹤數據，睡眠時分析睡眠品質",
  ability: "擁有AI算法開發、硬體設計、醫療數據分析等專業團隊",
  detail_number: "準確率達95%以上，電池續航7天，支援50種運動模式",
  analogy: "就像隨身的健康管家，隨時守護您的健康",
  differentiation: "結合AI算法提供個人化健康建議，而非僅數據記錄",
  opportunity: "全球可穿戴設備市場年增長率15%，健康監測需求持續上升",
  uniqueness: "首創AI健康預警系統，可提前7天預測健康風險"
};

const exampleResult = {
  motivation_and_goal: "基於現代人對健康管理的迫切需求，我們致力於開發智能健康監測手環，目標是成為用戶最信賴的健康夥伴。透過AI技術與醫療數據的結合，我們希望幫助用戶提前發現健康問題，實現預防醫學的理念，讓每個人都能擁有更健康的生活方式。",
  product_description: "智能健康監測手環是一款結合AI算法的可穿戴設備，具備心率監測、睡眠分析、運動追蹤等核心功能。產品採用先進的感測器技術，準確率達95%以上，電池續航7天，支援50種運動模式。獨特的AI健康預警系統可提前7天預測健康風險，為用戶提供個人化的健康建議，就像隨身的健康管家，隨時守護用戶的健康。",
  key_tasks: "1. 硬體研發：開發高精度感測器與低功耗晶片設計\n2. AI算法開發：建立健康數據分析模型與預警系統\n3. 軟體開發：設計用戶友好的APP介面與數據可視化\n4. 醫療合作：與醫療機構合作驗證產品準確性\n5. 市場推廣：建立品牌知名度與銷售渠道\n6. 數據安全：建立完善的用戶隱私保護機制",
  outcomes_and_benefits: "1. 產品上市：推出市場首創AI健康預警手環\n2. 用戶獲取：目標第一年獲得10萬用戶\n3. 技術突破：申請5項以上專利技術\n4. 市場份額：在健康監測設備市場佔有率達3%\n5. 社會效益：幫助用戶提前發現健康問題，降低醫療成本\n6. 商業價值：預估年營收達5000萬元"
};

export default function ExampleSection() {
  const [showExample, setShowExample] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          💡 範例展示
        </h2>
        <p className="text-gray-600 mb-4">
          看看填寫範例資料後會產生什麼樣的結果
        </p>
        <button
          onClick={() => setShowExample(!showExample)}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          {showExample ? "隱藏範例" : "查看範例"}
        </button>
      </div>

      {showExample && (
        <div className="space-y-8">
          {/* 範例輸入 */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              📝 範例輸入資料
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(exampleData).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <span className="text-sm font-medium text-gray-600">
                    {key === 'product' ? '產品' :
                     key === 'service' ? '提供' :
                     key === 'feature' ? '特色' :
                     key === 'target' ? '主要客群' :
                     key === 'situation' ? '使用情境' :
                     key === 'ability' ? '能力' :
                     key === 'detail_number' ? '數字化描述' :
                     key === 'analogy' ? '比喻' :
                     key === 'differentiation' ? '差異化' :
                     key === 'opportunity' ? '機會' :
                     key === 'uniqueness' ? '獨特差異化' : key}：
                  </span>
                  <p className="text-sm text-gray-800 bg-white p-2 rounded border">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 範例輸出 */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              📋 範例生成結果
            </h3>
            
            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  🎯 創業動機及計畫目標
                </h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {exampleResult.motivation_and_goal}
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  📦 產品描述
                </h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {exampleResult.product_description}
                </p>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  ⚙️ 重要工作項目
                </h4>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                  {exampleResult.key_tasks}
                </p>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  📈 產出及效益
                </h4>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                  {exampleResult.outcomes_and_benefits}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
