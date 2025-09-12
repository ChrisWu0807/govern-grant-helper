import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import pool from "@/lib/database";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: "未提供認證令牌" },
        { status: 401 }
      );
    }

    // 驗證 JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };

    // 查找用戶
    const result = await pool.query(
      "SELECT id, email, name FROM users WHERE id = $1",
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "用戶不存在" },
        { status: 401 }
      );
    }

    const user = result.rows[0];

    return NextResponse.json({
      valid: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });

  } catch (error) {
    console.error("令牌驗證錯誤:", error);
    return NextResponse.json(
      { error: "無效的認證令牌" },
      { status: 401 }
    );
  }
}
