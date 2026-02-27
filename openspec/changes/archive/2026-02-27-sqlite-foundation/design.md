## Context

ARK 是隱私優先的個人資產管理 Web App，所有原始數據留在瀏覽器本地 SQLite。目前專案已完成 TanStack Start 腳手架，但尚無資料庫層。此 feature branch (`feature/sqlite-foundation`) 負責建立完整的本地資料庫基礎設施。

**現狀**：專案無任何資料持久化能力，前端元件無法存取或操作財務數據。

**約束**：

- 必須使用 `sql.js`（非 wa-sqlite），確保 Safari 相容
- 不引入 ORM，直接操作 SQL 以保持對 View 的完全控制
- 所有 API 必須是 TypeScript 強型別

## Goals / Non-Goals

**Goals:**

- 在瀏覽器內初始化 sql.js WASM 引擎，支援 OPFS 持久化
- 設計完整的 8 張表 Schema + 索引，覆蓋所有財務實體
- 建立 3 層 View 封裝複雜計算（資產加總、餘額計算、健康指標）
- 提供版本化 Migration 機制，支援未來 Schema 演進
- 封裝 Repository 層，對外提供型別安全的 CRUD API
- 撰寫完整單元測試

**Non-Goals:**

- 不處理 UI 層（屬 `feature/design-system`）
- 不處理加密同步（屬 `feature/crypto-module`）
- 不實作遠端 API 或 BFF server functions
- 不處理多裝置資料衝突解決

## Decisions

### 1. sql.js 而非 wa-sqlite

- **選擇**：sql.js
- **原因**：Safari 對 OPFS 的支援較晚且有限，sql.js 有更成熟的 fallback 機制（可退回 IndexedDB 或 localStorage）。wa-sqlite 的 OPFS VFS 在 Safari 上仍有已知 bug。

### 2. Singleton DB 實例

- **選擇**：全域 Singleton + lazy init
- **原因**：WASM 初始化成本高（~50ms），避免重複載入。用 `getDB()` 封裝 lazy initialization，首次呼叫時初始化，後續直接回傳。

### 3. 版本化 Migration 使用 `user_version` pragma

- **選擇**：SQLite 內建 `PRAGMA user_version`
- **替代方案考慮**：建立 `_migrations` 表 — 但對於單機 app 過於複雜
- **原因**：輕量、原子性、無額外表開銷

### 4. Repository Pattern 而非直接 SQL

- **選擇**：每個實體一個 Repository class
- **原因**：集中 SQL 邏輯、提供型別安全介面、方便單元測試 mock

## Risks / Trade-offs

- **sql.js bundle size (~1.3MB WASM)**：可接受，僅首次載入一次，後續從瀏覽器快取
- **OPFS 瀏覽器支援**：Chrome 86+, Firefox 111+, Safari 15.2+，涵蓋主流版本。做 fallback 到 IndexedDB 以防萬一
- **單執行緒 SQL**：sql.js 在主執行緒運行，大量查詢可能阻塞 UI → 未來可移至 Web Worker，但目前資料量不大暫不處理
