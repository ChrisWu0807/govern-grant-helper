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
    } = body;

    const prompt = `
以下是某使用者的創業項目資訊：
產品：${product}
提供：${service}
特色：${feature}
主要客群：${target}
使用情境：${situation}
能力：${ability}

補充資訊：
數字化描述：${detail_number}
比喻：${analogy}
差異化：${differentiation}
機會：${opportunity}
獨特差異化：${uniqueness}

請根據以上資訊，產出以下內容，並以 JSON 格式回覆：
{
  "motivation_and_goal": "200字，創業動機及計畫目標",
  "product_description": "200字，創業計畫產品的描述",
  "key_tasks": "300字，創業計畫的重要工作項目（至少 5 項）",
  "outcomes_and_benefits": "300字，產出及效益（至少 5 項）"
}
    `;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "你是一位專業的創業顧問。" },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    });

    const text = completion.choices[0].message?.content ?? "{}";
    const parsed = JSON.parse(text);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch from OpenAI" },
      { status: 500 }
    );
  }
}
