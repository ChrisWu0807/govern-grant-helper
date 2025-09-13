import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/database";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "未提供認證令牌" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; email: string };

    const {
      projectName = "我的創業專案",
      budgetData,
      isCorrection = false
    } = await request.json();

    // 驗證必要資料
    if (!budgetData) {
      return NextResponse.json(
        { error: "缺少必要資料" },
        { status: 400 }
      );
    }

    // 查找或創建專案
    let projectId;
    
    // 先嘗試找到現有專案
    const existingProjectResult = await pool.query(
      "SELECT id FROM projects WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 1",
      [decoded.userId]
    );
    
    if (existingProjectResult.rows.length > 0) {
      // 使用現有專案
      projectId = existingProjectResult.rows[0].id;
    } else {
      // 如果沒有現有專案，創建新專案
      const projectResult = await pool.query(
        "INSERT INTO projects (user_id, name, status) VALUES ($1, $2, 'draft') RETURNING id",
        [decoded.userId, projectName]
      );
      projectId = projectResult.rows[0].id;
    }

    // 檢查是否已存在記錄
    const existingRecord = await pool.query(
      "SELECT id FROM budget_plans WHERE project_id = $1",
      [projectId]
    );

    if (existingRecord.rows.length > 0) {
      // 更新現有記錄
      await pool.query(`
        UPDATE budget_plans SET
          total_budget = $2,
          self_fund_ratio = $3,
          subsidy_ratio = $4,
          personnel_cost_ratio = $5,
          research_cost_ratio = $6,
          market_validation_ratio = $7,
          updated_at = CURRENT_TIMESTAMP
        WHERE project_id = $1
      `, [
        projectId,
        budgetData.totalBudget,
        budgetData.selfFundRatio,
        budgetData.subsidyRatio,
        budgetData.personnelCostRatio,
        budgetData.researchCostRatio,
        budgetData.marketValidationRatio
      ]);
    } else {
      // 插入新記錄
      await pool.query(`
        INSERT INTO budget_plans (
          project_id, total_budget, self_fund_ratio, subsidy_ratio,
          personnel_cost_ratio, research_cost_ratio, market_validation_ratio
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        projectId,
        budgetData.totalBudget,
        budgetData.selfFundRatio,
        budgetData.subsidyRatio,
        budgetData.personnelCostRatio,
        budgetData.researchCostRatio,
        budgetData.marketValidationRatio
      ]);
    }

    return NextResponse.json({
      success: true,
      message: isCorrection ? "預算規劃已更新" : "預算規劃已儲存",
      projectId
    });

  } catch (error) {
    console.error("儲存預算規劃錯誤:", error);
    return NextResponse.json(
      { error: "儲存失敗，請稍後再試" },
      { status: 500 }
    );
  }
}
