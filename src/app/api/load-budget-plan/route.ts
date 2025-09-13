import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/database";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: "未提供認證令牌" }, { status: 401 });
    }

    // 驗證 JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const userId = decoded.userId;

    // 查詢用戶的專案
    const projectQuery = `
      SELECT id FROM projects 
      WHERE user_id = $1 
      ORDER BY created_at DESC 
      LIMIT 1
    `;
    const projectResult = await pool.query(projectQuery, [userId]);
    
    if (projectResult.rows.length === 0) {
      return NextResponse.json({
        success: false,
        message: "沒有找到專案"
      });
    }

    const projectId = projectResult.rows[0].id;

    // 查詢預算規劃
    const budgetQuery = `
      SELECT * FROM budget_plans 
      WHERE project_id = $1 
      ORDER BY created_at DESC 
      LIMIT 1
    `;
    const budgetResult = await pool.query(budgetQuery, [projectId]);
    
    if (budgetResult.rows.length === 0) {
      return NextResponse.json({
        success: false,
        message: "沒有找到預算規劃"
      });
    }

    const budgetData = budgetResult.rows[0];
    
    // 重構資料格式
    const formData = {
      totalBudget: budgetData.total_budget || 0,
      selfFundRatio: budgetData.self_fund_ratio || 0,
      subsidyRatio: budgetData.subsidy_ratio || 0,
      personnelCostRatio: budgetData.personnel_cost_ratio || 0,
      researchCostRatio: budgetData.research_cost_ratio || 0,
      marketValidationRatio: budgetData.market_validation_ratio || 0
    };

    return NextResponse.json({
      success: true,
      data: {
        formData
      }
    });

  } catch (error) {
    console.error('載入預算規劃錯誤:', error);
    return NextResponse.json(
      { error: "載入預算規劃失敗" },
      { status: 500 }
    );
  }
}
