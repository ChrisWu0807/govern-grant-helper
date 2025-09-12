import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/lib/database";

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    // 驗證輸入
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "請填寫所有必要欄位" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "密碼至少需要6個字符" },
        { status: 400 }
      );
    }

    // 檢查用戶是否已存在
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: "此電子郵件已被註冊" },
        { status: 400 }
      );
    }

    // 加密密碼
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 創建用戶
    const result = await pool.query(
      "INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name, created_at",
      [email, passwordHash, name]
    );

    const user = result.rows[0];

    return NextResponse.json({
      message: "註冊成功",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        created_at: user.created_at
      }
    });

  } catch (error) {
    console.error("註冊錯誤:", error);
    return NextResponse.json(
      { error: "伺服器錯誤，請稍後再試" },
      { status: 500 }
    );
  }
}
