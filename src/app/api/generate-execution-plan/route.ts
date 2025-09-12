import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 }
      );
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const body = await request.json();
    const {
      executionData,
      planSummary,
      correction_notes,
      previous_result
    } = body;

    let prompt = `
以下是某使用者的創業項目資訊和計劃摘要：

創業項目資訊：
產品：${planSummary.formData.product}
服務：${planSummary.formData.service}
特色：${planSummary.formData.feature}
主要客群：${planSummary.formData.target}
使用情境：${planSummary.formData.situation}
能力：${planSummary.formData.ability}

計劃摘要：
創業動機及計畫目標：${planSummary.result.motivation_and_goal}
產品描述：${planSummary.result.product_description}
重要工作項目：${planSummary.result.key_tasks}
產出及效益：${planSummary.result.outcomes_and_benefits}

執行規劃參數：
大項目數量：${executionData.majorProjects}
每個大項目的子項目數量：${executionData.subProjectsPerMajor}
開始日期：${executionData.startYear}年${executionData.startMonth}月${executionData.startDay}日
執行期間：${executionData.durationMonths}個月
`;

    if (correction_notes && previous_result) {
      prompt += `
---
這是您之前生成的執行規劃：
${JSON.stringify(previous_result, null, 2)}

使用者提供的修正備註：
${correction_notes}

請根據原始創業項目資訊、計劃摘要、之前的執行規劃，並嚴格依照使用者提供的修正備註，重新優化並生成執行規劃。
`;
    } else {
      prompt += `
請根據以上資訊，產出以下內容，並以 JSON 格式回覆：
`;
    }

    prompt += `{
  "project_name": "專案名稱",
  "major_projects": [
    {
      "name": "大項目名稱",
      "sub_projects": [
        {
          "name": "子項目名稱",
          "kpi": "具體的KPI指標，必須包含數字或百分比",
          "start_date": "YYYY-MM-DD",
          "end_date": "YYYY-MM-DD"
        }
      ],
      "plan_percentage": 數字（計畫比重百分比）
    }
  ],
  "total_duration": "總時程描述",
  "execution_period": "執行期間描述"
}

重要要求：
1. 查核項目 KPI，必須加入具體數字或百分比，以量化方式呈現，讓審查委員能夠清楚查核與評估。
2. 每個大項目的計畫比重總和必須等於100%
3. 時程安排要合理，不能重疊
4. 子項目要具體且可執行
5. 根據計劃摘要的內容來設計執行項目`;

    const systemMessageContent = `你是一位資深的政府補助案審查委員和專案管理專家，具有以下專業能力：

🎯 專業背景：
- 10年以上政府補助案審查經驗
- 專案管理專業認證（PMP）
- 熟悉SBIR、SITI、經濟部等各類補助案標準
- 深度了解創業專案執行規劃和時程管理

審查標準：
- 重視具體量化指標和可測量成果
- 要求明確的時程規劃和里程碑設定
- 關注專案可行性和資源配置合理性
- 重視KPI的具體性和可查核性

寫作要求：
- 使用專業術語但保持易懂
- 強調數字化成果和具體效益
- 突出專案的可執行性和時程合理性
- 符合政府補助案審查標準
- 內容要有說服力和可信度

請根據以上標準，為創業者生成專業的執行規劃。`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemMessageContent },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    });

    const text = completion.choices[0].message?.content ?? "{}";

    let cleanText = text.trim();
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    let parsed;
    try {
      parsed = JSON.parse(cleanText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Raw text:', text);
      console.error('Clean text:', cleanText);
      console.error('Clean text length:', cleanText.length);
      console.error('First 200 chars:', cleanText.substring(0, 200));
      console.error('Last 200 chars:', cleanText.substring(cleanText.length - 200));
      
      // 嘗試修復常見的 JSON 格式問題
      let fixedText = cleanText;
      
      // 修復可能的尾隨逗號問題
      fixedText = fixedText.replace(/,(\s*[}\]])/g, '$1');
      
      // 修復可能的單引號問題
      fixedText = fixedText.replace(/'/g, '"');
      
      try {
        parsed = JSON.parse(fixedText);
        console.log('Successfully parsed after fixing');
      } catch (secondParseError) {
        console.error('Second parse also failed:', secondParseError);
        return NextResponse.json(
          {
            error: "AI 回傳格式錯誤，請重新嘗試",
            raw_response: text,
            clean_text: cleanText,
            parse_error: parseError instanceof Error ? parseError.message : String(parseError)
          },
          { status: 500 }
        );
      }
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
