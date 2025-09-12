import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "@/lib/database";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // 驗證輸入
    if (!email || !password) {
      return NextResponse.json(
        { error: "請填寫電子郵件和密碼" },
        { status: 400 }
      );
    }

    // 查找用戶
    const result = await pool.query(
      "SELECT id, email, password_hash, name FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "電子郵件或密碼錯誤" },
        { status: 401 }
      );
    }

    const user = result.rows[0];

    // 驗證密碼
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "電子郵件或密碼錯誤" },
        { status: 401 }
      );
    }

    // 生成 JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email 
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json({
      message: "登入成功",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });

  } catch (error) {
    console.error("登入錯誤:", error);
    return NextResponse.json(
      { error: "伺服器錯誤，請稍後再試" },
      { status: 500 }
    );
  }
}
