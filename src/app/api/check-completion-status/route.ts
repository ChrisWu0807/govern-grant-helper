import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/database";

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: "未提供認證令牌" }, { status: 401 });
    }

    // 驗證 JWT token
    const jwt = require('jsonwebtoken');
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
      // 沒有專案，所有功能都是待填寫
      return NextResponse.json({
        success: true,
        data: {
          planSummary: false,
          executionPlan: false,
          budgetPlanning: false,
          trafficAcquisition: false,
          contactCoach: false,
          additionalFeatures: false
        }
      });
    }

    const projectId = projectResult.rows[0].id;

    // 檢查各功能的完成狀態
    const statusQuery = `
      SELECT 
        (SELECT COUNT(*) FROM plan_summaries WHERE project_id = $1) > 0 as plan_summary,
        (SELECT COUNT(*) FROM execution_plans WHERE project_id = $1) > 0 as execution_plan,
        (SELECT COUNT(*) FROM budget_plans WHERE project_id = $1) > 0 as budget_planning,
        (SELECT COUNT(*) FROM traffic_acquisitions WHERE project_id = $1) > 0 as traffic_acquisition,
        (SELECT COUNT(*) FROM contact_coaches WHERE project_id = $1) > 0 as contact_coach,
        (SELECT COUNT(*) FROM additional_features WHERE project_id = $1) > 0 as additional_features
    `;

    const statusResult = await pool.query(statusQuery, [projectId]);
    const status = statusResult.rows[0];

    return NextResponse.json({
      success: true,
      data: {
        planSummary: status.plan_summary,
        executionPlan: status.execution_plan,
        budgetPlanning: status.budget_planning,
        trafficAcquisition: status.traffic_acquisition,
        contactCoach: status.contact_coach,
        additionalFeatures: status.additional_features
      }
    });

  } catch (error) {
    console.error('檢查完成狀態錯誤:', error);
    return NextResponse.json(
      { error: "檢查完成狀態失敗" },
      { status: 500 }
    );
  }
}
