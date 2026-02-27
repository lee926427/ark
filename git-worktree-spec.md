# Feature Spec: Design System

> 此文件由 Git Worktree Design 自動產生，供 AI Agent 作為開發指引。

## 分支資訊

| 項目          | 值                                                  |
| ------------- | --------------------------------------------------- |
| 分支名稱      | `feature/design-system`                             |
| 基於分支      | `main`                                              |
| Worktree 路徑 | `/Users/recoil/Desktop/side-project/ark/ark-design` |
| 建立時間      | `2026-02-27T21:09:54+08:00`                         |

## 目標

建立 ARK 視覺品牌識別與元件庫，包含暗色系財務風格主題、共用 UI 元件、App Shell 佈局框架與底部導航，讓後續功能頁面可快速組裝。

## 實作範圍

- [ ] 設計 Tailwind v4 主題設定 — 暗色系財務風格色彩 Tokens（primary, accent, surface, destructive）
- [ ] 設定 Google Fonts（Inter / Noto Sans TC）排版系統
- [ ] 客製化 shadcn/ui 元件樣式（Button, Card, Input, Dialog, Sheet, Tabs, Badge）
- [ ] 實作 App Shell 佈局 — `src/components/layout/AppShell.tsx`（含 safe area 處理）
- [ ] 實作底部導航列 — `src/components/layout/BottomNav.tsx`（首頁/記帳/資產/設定 四個 Tab）
- [ ] 實作頂部標題列 — `src/components/layout/TopBar.tsx`
- [ ] 實作金額顯示元件 — `src/components/ui/AmountDisplay.tsx`（千分位、正負色彩、幣別）
- [ ] 實作帳戶圖示元件 — `src/components/ui/AccountIcon.tsx`
- [ ] 設定 recharts 圖表基礎主題（配色對應 Tailwind Tokens）
- [ ] 清除 TanStack Start 範本頁面（demo 內容、blog 路由）
- [ ] 建立空白頁面路由骨架（/, /accounts, /transactions/new, /assets, /settings）
- [ ] 實作 `src/lib/utils/currency.ts` — 貨幣格式化工具（TWD / USD）

## 驗收標準

- `pnpm dev` 啟動後可看到完整 App Shell（頂部標題 + 內容區 + 底部導航）
- 底部導航四個 Tab 可點擊切換路由
- 各基礎元件在亮色/暗色模式下渲染正確
- AmountDisplay 正確顯示千分位格式與正負色彩
- 無 TypeScript 錯誤、無 ESLint 警告

## 技術約束

- 使用 Tailwind CSS v4 的 CSS-first 設定方式（`@theme` 指令）
- UI 元件基於 shadcn/ui（Radix UI primitives）
- 佈局需考慮手機瀏覽器的 safe area（bottom nav 避開 home indicator）
- 保留 ThemeToggle 暗色/亮色切換功能
- 不引入額外 CSS-in-JS 或元件庫

## 跨分支備註

- 此分支與 `feature/sqlite-foundation`、`feature/crypto-module` 完全獨立，可平行開發
- 合併順序建議在 `sqlite-foundation` 之後，以便後續 feature 可同時使用 DB + UI
- 路由骨架只建空白頁面，實際頁面邏輯留給後續 feature branch
