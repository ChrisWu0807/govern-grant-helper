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
      executionData,
      result,
      isCorrection = false
    } = await request.json();

    // 驗證必要資料
    if (!executionData || !result) {
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

    // 儲存或更新執行規劃
    const executionPlanData = {
      project_id: projectId,
      major_projects: result.major_projects,
      sub_projects_per_major: executionData.subProjectsPerMajor,
      start_year: executionData.startYear,
      start_month: executionData.startMonth,
      start_day: executionData.startDay,
      duration_months: executionData.durationMonths,
      project_name: result.project_name,
      total_duration: result.total_duration,
      execution_period: result.execution_period,
      created_at: new Date(),
      updated_at: new Date()
    };

    // 檢查是否已存在記錄
    const existingRecord = await pool.query(
      "SELECT id FROM execution_plans WHERE project_id = $1",
      [projectId]
    );

    if (existingRecord.rows.length > 0) {
      // 更新現有記錄
      await pool.query(`
        UPDATE execution_plans SET
          major_projects = $2,
          sub_projects_per_major = $3,
          start_year = $4,
          start_month = $5,
          start_day = $6,
          duration_months = $7,
          project_name = $8,
          total_duration = $9,
          execution_period = $10,
          updated_at = CURRENT_TIMESTAMP
        WHERE project_id = $1
      `, [
        projectId,
        JSON.stringify(executionPlanData.major_projects),
        executionPlanData.sub_projects_per_major,
        executionPlanData.start_year,
        executionPlanData.start_month,
        executionPlanData.start_day,
        executionPlanData.duration_months,
        executionPlanData.project_name,
        executionPlanData.total_duration,
        executionPlanData.execution_period
      ]);
    } else {
      // 插入新記錄
      await pool.query(`
        INSERT INTO execution_plans (
          project_id, major_projects, sub_projects_per_major, start_year,
          start_month, start_day, duration_months, project_name,
          total_duration, execution_period
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `, [
        projectId,
        JSON.stringify(executionPlanData.major_projects),
        executionPlanData.sub_projects_per_major,
        executionPlanData.start_year,
        executionPlanData.start_month,
        executionPlanData.start_day,
        executionPlanData.duration_months,
        executionPlanData.project_name,
        executionPlanData.total_duration,
        executionPlanData.execution_period
      ]);
    }

    return NextResponse.json({
      success: true,
      message: isCorrection ? "執行規劃已更新" : "執行規劃已儲存",
      projectId
    });

  } catch (error) {
    console.error("儲存執行規劃錯誤:", error);
    return NextResponse.json(
      { error: "儲存失敗，請稍後再試" },
      { status: 500 }
    );
  }
}
