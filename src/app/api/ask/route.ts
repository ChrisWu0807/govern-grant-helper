import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // 檢查環境變數
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 }
      );
    }

    // 在函數內部初始化 OpenAI 客戶端
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const body = await request.json();
    const {
      product,
      service,
      feature,
      target,
      situation,
      ability,
      detail_number,
      analogy,
      differentiation,
      opportunity,
      uniqueness,
      correction_notes,
      previous_result
    } = body;

    // 判斷是否為修正請求
    const isCorrection = correction_notes && previous_result;

    let prompt = "";
    let systemMessage = "";

    if (isCorrection) {
      // 修正模式
      systemMessage = `你是一位資深的政府補助案審查委員和創業顧問，具有以下專業能力：

🎯 專業背景：
- 10年以上政府補助案審查經驗
- 熟悉SBIR、SITI、經濟部等各類補助案標準
- 深度了解新創企業發展模式和商業模式設計
- 具備量化分析、KPI設計、財務規劃專業

📊 審查標準：
- 重視具體量化指標和可測量成果
- 關注市場機會、技術創新、商業可行性
- 要求明確的時程規劃和里程碑設定
- 重視團隊能力與資源配置合理性

💡 寫作要求：
- 使用專業術語但保持易懂
- 強調數字化成果和具體效益
- 突出創新性和差異化優勢
- 符合政府補助案審查標準
- 內容要有說服力和可信度

🔄 修正要求：
- 仔細分析用戶的修正備註
- 保持原有內容的優點
- 根據修正建議進行調整
- 確保修正後的內容更加精準和專業
- 維持整體結構和格式的一致性

請根據修正備註，重新生成更符合要求的政府補助案計畫摘要。`;

      prompt = `
【原始創業內容】
我的產品是【${product}】，提供【${service}】的【服務】，我們的特色是【${feature}】，主要客群是【${target}】，他們在【${situation}】情況下會需要我們的產品，因為我們具備【${ability}】的能力，所以我們可以提供最好的產品或服務。

【加強調教資訊】
1. 具體數字：${detail_number}
2. 比喻描述：${analogy}
3. 競爭對手分析：請分析主要競爭對手
4. 差異化優勢：${differentiation}
5. 市場機會：${opportunity}
6. 獨特差異化：${uniqueness}

【之前生成的結果】
創業動機及計畫目標：${previous_result.motivation_and_goal}
產品描述：${previous_result.product_description}
重要工作項目：${previous_result.key_tasks}
產出及效益：${previous_result.outcomes_and_benefits}

【用戶修正備註】
${correction_notes}

【修正要求】
請根據以上修正備註，重新生成以下四個部分，確保內容更加精準和專業：

1. 創業動機及計畫目標（200字）
2. 創業計畫產品的描述（200字）
3. 創業計畫的重要工作項目（300字，至少5個大項目）
4. 產出及效益（300字，至少5個大項目，每個大項目包含3個子項目，並列出KPI查核指標和計畫比重%）

請以 JSON 格式回覆：
{
  "motivation_and_goal": "200字創業動機及計畫目標",
  "product_description": "200字產品描述",
  "key_tasks": "300字重要工作項目（至少5項）",
  "outcomes_and_benefits": "300字產出及效益（至少5項，含子項目、KPI和比重）"
}
      `;
    } else {
      // 初次生成模式
      systemMessage = `你是一位資深的政府補助案審查委員和創業顧問，具有以下專業能力：

🎯 專業背景：
- 10年以上政府補助案審查經驗
- 熟悉SBIR、SITI、經濟部等各類補助案標準
- 深度了解新創企業發展模式和商業模式設計
- 具備量化分析、KPI設計、財務規劃專業

📊 審查標準：
- 重視具體量化指標和可測量成果
- 關注市場機會、技術創新、商業可行性
- 要求明確的時程規劃和里程碑設定
- 重視團隊能力與資源配置合理性

💡 寫作要求：
- 使用專業術語但保持易懂
- 強調數字化成果和具體效益
- 突出創新性和差異化優勢
- 符合政府補助案審查標準
- 內容要有說服力和可信度

請根據以上標準，為創業者生成專業的政府補助案計畫摘要。`;

      prompt = `
【實戰模板公式1 - 項目介紹】
我的產品是【${product}】，提供【${service}】的【服務】，我們的特色是【${feature}】，主要客群是【${target}】，他們在【${situation}】情況下會需要我們的產品，因為我們具備【${ability}】的能力，所以我們可以提供最好的產品或服務。

【加強調教資訊】
1. 具體數字：${detail_number}
2. 比喻描述：${analogy}
3. 競爭對手分析：請分析主要競爭對手
4. 差異化優勢：${differentiation}
5. 市場機會：${opportunity}
6. 獨特差異化：${uniqueness}

【實戰模板公式2 - 計畫摘要生成】
請依據以上創業內容，完成以下四個部分：

1. 創業動機及計畫目標（200字）
2. 創業計畫產品的描述（200字）
3. 創業計畫的重要工作項目（300字，至少5個大項目）
4. 產出及效益（300字，至少5個大項目，每個大項目包含3個子項目，並列出KPI查核指標和計畫比重%）

請以 JSON 格式回覆：
{
  "motivation_and_goal": "200字創業動機及計畫目標",
  "product_description": "200字產品描述",
  "key_tasks": "300字重要工作項目（至少5項）",
  "outcomes_and_benefits": "300字產出及效益（至少5項，含子項目、KPI和比重）"
}
      `;
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    });

    const text = completion.choices[0].message?.content ?? "{}";
    
    // 清理 Markdown 格式的程式碼區塊
    let cleanText = text.trim();
    
    // 移除 ```json 和 ``` 標記
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    
    // 嘗試解析 JSON
    let parsed;
    try {
      parsed = JSON.parse(cleanText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Raw text:', text);
      console.error('Clean text:', cleanText);
      
      // 如果解析失敗，回傳錯誤訊息
      return NextResponse.json(
        { 
          error: "AI 回傳格式錯誤，請重新嘗試",
          raw_response: text 
        },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch from OpenAI" },
      { status: 500 }
    );
  }
}