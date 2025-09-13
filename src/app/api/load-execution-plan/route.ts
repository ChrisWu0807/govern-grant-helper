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

    // 查詢執行規劃
    const executionQuery = `
      SELECT * FROM execution_plans 
      WHERE project_id = $1 
      ORDER BY created_at DESC 
      LIMIT 1
    `;
    const executionResult = await pool.query(executionQuery, [projectId]);
    
    if (executionResult.rows.length === 0) {
      return NextResponse.json({
        success: false,
        message: "沒有找到執行規劃"
      });
    }

    const executionData = executionResult.rows[0];
    
    // 重構資料格式
    const formData = {
      majorProjects: executionData.major_projects?.length || 0,
      subProjectsPerMajor: executionData.sub_projects_per_major || 0,
      startYear: executionData.start_year || new Date().getFullYear(),
      startMonth: executionData.start_month || 1,
      startDay: executionData.start_day || 1,
      durationMonths: executionData.duration_months || 12
    };

    const result = {
      project_name: executionData.project_name,
      major_projects: executionData.major_projects || [],
      total_duration: executionData.total_duration,
      execution_period: executionData.execution_period
    };

    return NextResponse.json({
      success: true,
      data: {
        formData,
        result
      }
    });

  } catch (error) {
    console.error('載入執行規劃錯誤:', error);
    return NextResponse.json(
      { error: "載入執行規劃失敗" },
      { status: 500 }
    );
  }
}
