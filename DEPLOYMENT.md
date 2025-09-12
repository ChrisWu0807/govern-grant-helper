# 🚀 部署指南

## 📋 部署前準備

### 1. 環境變數設定

在部署前，請確保您已經準備好以下環境變數：

```
OPENAI_API_KEY=sk-your-openai-api-key-here
```

### 2. GitHub 準備

確保您的程式碼已經推送到 GitHub 儲存庫。

## 🌐 部署選項

### 選項 1: Vercel 部署 (推薦)

1. **登入 Vercel**
   - 前往 [vercel.com](https://vercel.com)
   - 使用 GitHub 帳號登入

2. **導入專案**
   - 點擊 "New Project"
   - 選擇您的 GitHub 儲存庫
   - 選擇 `gov-grant-helper` 專案

3. **設定環境變數**
   - 在專案設定中找到 "Environment Variables"
   - 新增 `OPENAI_API_KEY` 並填入您的 API Key

4. **部署**
   - 點擊 "Deploy"
   - 等待部署完成
   - 獲得部署網址，例如：`https://gov-grant-helper.vercel.app`

### 選項 2: Zeabur 部署

1. **登入 Zeabur**
   - 前往 [zeabur.com](https://zeabur.com)
   - 使用 GitHub 帳號登入

2. **創建專案**
   - 點擊 "New Project"
   - 選擇 "Import from GitHub"
   - 選擇您的 `gov-grant-helper` 專案

3. **設定環境變數**
   - 在專案設定中找到 "Environment Variables"
   - 新增 `OPENAI_API_KEY` 並填入您的 API Key

4. **部署**
   - 點擊 "Deploy"
   - 等待部署完成
   - 獲得部署網址，例如：`https://gov-grant-helper.zeabur.app`

### 選項 3: 其他平台

本專案也支援以下平台：
- **Netlify**: 支援 Next.js 靜態匯出
- **Railway**: 支援 Node.js 應用程式
- **Render**: 支援 Web 服務
- **DigitalOcean App Platform**: 支援 Node.js 應用程式

## 🔧 本地測試

在部署前，建議先在本地測試：

```bash
# 安裝依賴
npm install

# 設定環境變數
echo "OPENAI_API_KEY=sk-your-api-key" > .env.local

# 啟動開發伺服器
npm run dev
```

訪問 `http://localhost:3000` 測試功能。

## 📝 部署檢查清單

- [ ] 程式碼已推送到 GitHub
- [ ] 環境變數已設定
- [ ] 本地測試通過
- [ ] 選擇部署平台
- [ ] 完成部署設定
- [ ] 測試部署後的網站功能

## 🐛 常見問題

### 1. 環境變數未設定
**錯誤**: `Failed to fetch from OpenAI`
**解決**: 確保在部署平台正確設定了 `OPENAI_API_KEY`

### 2. API 請求失敗
**錯誤**: `500 Internal Server Error`
**解決**: 檢查 OpenAI API Key 是否有效，是否有足夠的額度

### 3. 建置失敗
**錯誤**: `Build failed`
**解決**: 檢查 `package.json` 中的依賴版本，確保所有套件都正確安裝

## 📞 支援

如果遇到部署問題，請檢查：
1. 環境變數設定
2. 網路連線
3. API 金鑰有效性
4. 平台服務狀態

## 🎉 部署完成

部署完成後，您將獲得一個公開的網址，可以分享給其他人使用您的政府補助案小助手！
