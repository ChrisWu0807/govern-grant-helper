import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "政府補助案小寫手",
  description: "AI 驅動的政府補助案申請助手，幫助創業者快速生成專業的計畫摘要",
  keywords: "政府補助案, SBIR, 創業, AI, 計畫摘要, 補助申請",
  authors: [{ name: "政府補助案小寫手團隊" }],
  openGraph: {
    title: "政府補助案小寫手",
    description: "AI 驅動的政府補助案申請助手，幫助創業者快速生成專業的計畫摘要",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}