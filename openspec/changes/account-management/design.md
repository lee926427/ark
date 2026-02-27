## Context

在目前的 codebase 中：

1. **DB 層**（`feature/sqlite-foundation`）已完成：`src/lib/db/repositories/accounts.ts` 提供了型別安全的 CRUD 介面。`sqlite` WASM 客戶端透過 `useDatabase` 在全域提供與初始化。
2. **UI 層**（`feature/design-system`）已完成：App Shell（頂端/底部導航）已經設置，`AmountDisplay`、`AccountIcon` 等設計系統元件已備齊。

我們現在需要把這兩者串聯起來，建立真實的帳戶管理功能頁面，取代原本的首頁 mock 資料。

## Goals / Non-Goals

**Goals:**

- 在 `/accounts` 頁面顯示所有帳戶與其目前真實餘額（透過 `accountRepo.list` 與視圖 `v_account_balances` / 關聯餘額，目前先用 Repo 的 `initialBalance` 加上後續交易計算，視現有 Repo 實作而定）。
- 提供建立新帳戶的表單介面（BottomSheet 或 Dialog）。
- 提供修改與封存現有帳戶的修改介面。
- 使用 `react-hook-form` + `zod` 處理表單驗證。
- 使用 `TanStack Query` 快取並管理從 SQLite 抓取的資料。

**Non-Goals:**

- 不處理「交易互轉」(Transfer) 的介面，這是記帳模組 (Transactions) 的負責範圍。
- 不實作多幣別即時匯率換算（目前僅記錄該帳戶原幣別餘額，後續 Phase 再拉外部 API 或在總覽換算）。
- 不調整已經確立好的 SQLite Schema。

## Decisions

### 1. TanStack Query 與 SQLite Repository 的整合

- **決策**：不直接在 Component 的 `useEffect` 中呼叫 Repository，而是將其包裝為 Query 函式庫 (`useQuery`, `useMutation`)。
- **原因**：即使是本地端 SQLite，也需要優雅的 loading 狀態、重新抓取 (refetch) 以觸發 React 渲染更新。TanStack Query 在此極為成熟，且完全相容非同步的 WASM API (`client.db.exec`)。
- **替代方案**：使用 React Context / Zustand 手綁狀態。太繁瑣，且無法處理自動失效 (invalidateQueries) 機制。

### 2. 交互介面設計（帳戶新增/編輯）

- **決策**：在行動裝置優先的原則下，新增與編輯將開啟由下往上滑出的 `Drawer` (shadcn) 或是全螢幕的 `Dialog` / `Sheet`。
- **原因**：減少頁面跳轉，保持使用者的上下文連貫性，這也是現行記帳軟體的標配體驗。

## Risks / Trade-offs

- **風險：非同步初始化 SQLite 的競態條件。**
  **緩解**：TanStack Query 查詢必須確保 `databaseId` (如果有的話) 或 `initialized` state 準備好後才 enabled (`enabled: isDbReady`)。
- **風險：WASM 回傳資料型別丟失。**
  **緩解**：`accounts` repository 已經封裝並定義了明確的回傳型別，呼叫這些函式時必定為預先設計的 `Account` 型別。
