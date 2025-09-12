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

    const {
      projectName = "我的創業專案",
      formData,
      result,
      isCorrection = false
    } = await request.json();

    // 查找或創建專案
    let projectId;
    if (isCorrection) {
      // 如果是修正，使用現有專案
      const projectResult = await pool.query(
        "SELECT id FROM projects WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 1",
        [decoded.userId]
      );
      
      if (projectResult.rows.length === 0) {
        return NextResponse.json({ error: "找不到專案" }, { status: 404 });
      }
      projectId = projectResult.rows[0].id;
    } else {
      // 如果是新生成，創建新專案
      const projectResult = await pool.query(
        "INSERT INTO projects (user_id, name, status) VALUES ($1, $2, 'draft') RETURNING id",
        [decoded.userId, projectName]
      );
      projectId = projectResult.rows[0].id;
    }

    // 儲存或更新計劃摘要
    const planSummaryData = {
      project_id: projectId,
      product: formData.product || "",
      service: formData.service || "",
      feature: formData.feature || "",
      target: formData.target || "",
      situation: formData.situation || "",
      ability: formData.ability || "",
      detail_number: formData.detail_number || "",
      analogy: formData.analogy || "",
      differentiation: formData.differentiation || "",
      opportunity: formData.opportunity || "",
      uniqueness: formData.uniqueness || "",
      motivation_and_goal: result.motivation_and_goal || "",
      product_description: result.product_description || "",
      key_tasks: result.key_tasks || "",
      outcomes_and_benefits: result.outcomes_and_benefits || ""
    };

    if (isCorrection) {
      // 更新現有記錄
      await pool.query(`
        UPDATE plan_summaries SET
          product = $2, service = $3, feature = $4, target = $5,
          situation = $6, ability = $7, detail_number = $8, analogy = $9,
          differentiation = $10, opportunity = $11, uniqueness = $12,
          motivation_and_goal = $13, product_description = $14,
          key_tasks = $15, outcomes_and_benefits = $16,
          updated_at = CURRENT_TIMESTAMP
        WHERE project_id = $1
      `, [
        projectId,
        planSummaryData.product, planSummaryData.service, planSummaryData.feature,
        planSummaryData.target, planSummaryData.situation, planSummaryData.ability,
        planSummaryData.detail_number, planSummaryData.analogy, planSummaryData.differentiation,
        planSummaryData.opportunity, planSummaryData.uniqueness,
        planSummaryData.motivation_and_goal, planSummaryData.product_description,
        planSummaryData.key_tasks, planSummaryData.outcomes_and_benefits
      ]);
    } else {
      // 插入新記錄
      await pool.query(`
        INSERT INTO plan_summaries (
          project_id, product, service, feature, target, situation, ability,
          detail_number, analogy, differentiation, opportunity, uniqueness,
          motivation_and_goal, product_description, key_tasks, outcomes_and_benefits
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      `, [
        projectId,
        planSummaryData.product, planSummaryData.service, planSummaryData.feature,
        planSummaryData.target, planSummaryData.situation, planSummaryData.ability,
        planSummaryData.detail_number, planSummaryData.analogy, planSummaryData.differentiation,
        planSummaryData.opportunity, planSummaryData.uniqueness,
        planSummaryData.motivation_and_goal, planSummaryData.product_description,
        planSummaryData.key_tasks, planSummaryData.outcomes_and_benefits
      ]);
    }

    return NextResponse.json({
      success: true,
      message: isCorrection ? "計劃摘要已更新" : "計劃摘要已儲存",
      projectId
    });

  } catch (error) {
    console.error("儲存計劃摘要錯誤:", error);
    return NextResponse.json(
      { error: "儲存失敗，請稍後再試" },
      { status: 500 }
    );
  }
}
