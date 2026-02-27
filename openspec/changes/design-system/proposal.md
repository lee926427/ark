## Why

ARKARK 需要統一的視覺品牌識別與元件庫，為所有功能頁面提供一致的 UI 基礎。目前專案使用 TanStack Start 預設範本頁面，需要替換為 ARKARK 的暗色系財務風格設計系統，並建立 App Shell 佈局框架（底部導航 + 頁面骨架），讓後續功能開發可快速組裝。

## What Changes

- 設計 Tailwind v4 主題（暗色系財務風格色彩 Tokens、排版系統）
- 客製化 shadcn/ui 元件樣式（Button, Card, Input, Dialog, Sheet, Tabs, Badge）
- 建立 App Shell 佈局框架（底部導航列 + 頂部標題列 + 內容區）
- 建立共用業務元件（AmountDisplay 金額顯示、AccountIcon 帳戶圖示）
- 設定 recharts 圖表基礎主題
- 清除 TanStack Start 範本內容，建立空白頁面路由骨架
- 實作貨幣格式化工具函式

## Capabilities

### New Capabilities

- `theme-config`: Tailwind v4 主題設定（色彩 Tokens, 排版, 間距）
- `app-shell`: App Shell 佈局框架（BottomNav, TopBar, 頁面骨架）
- `ui-components`: 共用業務元件（AmountDisplay, AccountIcon, 圖表主題）
- `currency-utils`: 貨幣格式化工具函式（TWD/USD 千分位格式、正負色彩）

### Modified Capabilities

<!-- 無既有 spec 需要修改 -->

## Impact

- 修改檔案：`src/styles.css`（全域主題）、`src/routes/__root.tsx`（App Shell）
- 刪除檔案：範本頁面（about, blog 相關路由與 content 目錄）
- 新增檔案：`src/components/layout/`、`src/components/ui/`、`src/lib/utils/currency.ts`
- 新增依賴：`recharts`（圖表庫）
