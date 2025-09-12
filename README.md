# 🚀 政府補助案小助手

一個基於 AI 的政府補助案申請助手，幫助創業者快速生成專業的計畫摘要。

## ✨ 功能特色

- 🤖 使用 OpenAI GPT-4o-mini 生成專業內容
- 📝 11 個詳細欄位收集創業項目資訊
- 🎯 自動生成四大核心內容：
  - 創業動機及計畫目標
  - 產品描述
  - 重要工作項目
  - 產出及效益
- 💡 內建範例展示功能
- 🎨 現代化響應式 UI 設計

## 🛠️ 技術棧

- **前端**: Next.js 14 + TypeScript + Tailwind CSS
- **後端**: Next.js API Routes
- **AI**: OpenAI GPT-4o-mini
- **部署**: 支援 Vercel、Zeabur 等平台

## 🚀 快速開始

### 1. 安裝依賴

```bash
npm install
```

### 2. 設定環境變數

複製 `.env.example` 並重新命名為 `.env.local`：

```bash
cp .env.example .env.local
```

在 `.env.local` 中設定您的 OpenAI API Key：

```
OPENAI_API_KEY=sk-your-openai-api-key-here
```

### 3. 本地開發

```bash
npm run dev
```

打開瀏覽器訪問 [http://localhost:3000](http://localhost:3000)

### 4. 建置生產版本

```bash
npm run build
npm start
```

## 📋 使用方式

1. 填寫 11 個欄位的創業項目資訊
2. 點擊「生成計畫摘要」按鈕
3. AI 將自動生成專業的計畫摘要
4. 查看生成的四大核心內容

## 🌐 部署

### Vercel 部署

1. 將專案推送到 GitHub
2. 在 Vercel 中導入專案
3. 設定環境變數 `OPENAI_API_KEY`
4. 部署完成

### Zeabur 部署

1. 將專案推送到 GitHub
2. 在 Zeabur 中創建新專案
3. 選擇「Import from GitHub」
4. 選擇專案並設定環境變數
5. 點擊 Deploy

## 📝 環境變數

| 變數名稱 | 說明 | 必填 |
|---------|------|------|
| `OPENAI_API_KEY` | OpenAI API 金鑰 | ✅ |

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

## 📄 授權

MIT License