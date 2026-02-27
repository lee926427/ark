## Context

ARKARK 使用 TanStack Start 預設範本建立，目前外觀為範本預設樣式。需要建立專屬的暗色系財務風格設計系統，並提供 App Shell 佈局框架讓後續功能頁面可快速組裝。

**約束**：

- 使用 Tailwind CSS v4 的 CSS-first 設定方式
- UI 元件基於 shadcn/ui (Radix primitives)
- 佈局需考慮手機瀏覽器 safe area

## Goals / Non-Goals

**Goals:**

- 建立 ARKARK 暗色系財務風格色彩與排版系統
- 客製化 shadcn/ui 元件
- 建立 App Shell（底部導航 + 頂部標題 + 內容區）
- 建立共用業務元件（AmountDisplay, AccountIcon）
- 清除範本頁面，建立空白路由骨架
- 設定 recharts 圖表主題

**Non-Goals:**

- 不實作業務邏輯（帳戶管理、記帳等）
- 不處理資料庫連接
- 不建立複雜表單（留給功能分支）

## Decisions

### 1. Tailwind v4 CSS-first 而非 JS config

- **選擇**：`@theme` 指令在 CSS 中定義 tokens
- **原因**：Tailwind v4 推薦方式，更直覺且支援 CSS 變數

### 2. shadcn/ui 而非自建元件庫

- **選擇**：shadcn/ui
- **原因**：基於 Radix primitives 提供無障礙支援，可逐個 copy-paste 客製化

### 3. 底部導航而非側邊欄

- **選擇**：底部 Tab Bar（4 tabs）
- **原因**：目標用戶為通勤族，手機操作為主，底部導航更符合使用習慣

## Risks / Trade-offs

- **recharts bundle size**：recharts 較大（~40KB gzip），但圖表為核心功能不可省略。替代方案 Chart.js 的 React wrapper 不如 recharts 原生
- **暗色模式為主**：財務 App 慣例為暗色系，但需確保亮色模式也能正常使用
