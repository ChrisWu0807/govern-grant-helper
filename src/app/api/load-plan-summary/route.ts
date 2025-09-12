import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import pool from "@/lib/database";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "未提供認證令牌" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };

    // 查找用戶最新的專案和計劃摘要
    const result = await pool.query(`
      SELECT 
        p.id as project_id,
        p.name as project_name,
        p.status,
        p.created_at as project_created_at,
        p.updated_at as project_updated_at,
        ps.product,
        ps.service,
        ps.feature,
        ps.target,
        ps.situation,
        ps.ability,
        ps.detail_number,
        ps.analogy,
        ps.differentiation,
        ps.opportunity,
        ps.uniqueness,
        ps.motivation_and_goal,
        ps.product_description,
        ps.key_tasks,
        ps.outcomes_and_benefits,
        ps.created_at as summary_created_at,
        ps.updated_at as summary_updated_at
      FROM projects p
      LEFT JOIN plan_summaries ps ON p.id = ps.project_id
      WHERE p.user_id = $1
      ORDER BY p.updated_at DESC
      LIMIT 1
    `, [decoded.userId]);

    if (result.rows.length === 0) {
      return NextResponse.json({ 
        success: true, 
        data: null,
        message: "沒有找到專案資料" 
      });
    }

    const row = result.rows[0];
    
    // 組織表單資料
    const formData = {
      product: row.product || "",
      service: row.service || "",
      feature: row.feature || "",
      target: row.target || "",
      situation: row.situation || "",
      ability: row.ability || "",
      detail_number: row.detail_number || "",
      analogy: row.analogy || "",
      differentiation: row.differentiation || "",
      opportunity: row.opportunity || "",
      uniqueness: row.uniqueness || ""
    };

    // 組織結果資料
    const resultData = {
      motivation_and_goal: row.motivation_and_goal || "",
      product_description: row.product_description || "",
      key_tasks: row.key_tasks || "",
      outcomes_and_benefits: row.outcomes_and_benefits || ""
    };

    return NextResponse.json({
      success: true,
      data: {
        projectId: row.project_id,
        projectName: row.project_name,
        status: row.status,
        projectCreatedAt: row.project_created_at,
        projectUpdatedAt: row.project_updated_at,
        summaryCreatedAt: row.summary_created_at,
        summaryUpdatedAt: row.summary_updated_at,
        formData,
        result: resultData
      }
    });

  } catch (error) {
    console.error("載入計劃摘要錯誤:", error);
    return NextResponse.json(
      { error: "載入失敗，請稍後再試" },
      { status: 500 }
    );
  }
}
