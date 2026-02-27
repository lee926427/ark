## Why

ARKARK 需要一個完整的本地資料庫層作為所有功能的基礎。選用 sql.js (SQLite WASM) 在瀏覽器內實現真正的 SQL 查詢與 OPFS 持久化，確保「數據留在本地」的核心隱私承諾。沒有這一層，帳戶管理、記帳、資產總覽等核心功能都無法運作。

## What Changes

- 引入 `sql.js` 依賴，設定 Vite WASM loader 支援瀏覽器內 SQLite
- 建立 8 張核心資料表（accounts, categories, transactions, securities, holdings, insurance_policies, budgets, sync_log）
- 建立 3 層 SQLite View 封裝複雜計算邏輯（資產總覽、帳戶餘額、財務健康檢查）
- 實作版本化 Migration 機制（基於 `user_version` pragma）
- 封裝 5 個 Repository（Account, Transaction, Holding, Budget, Insurance）提供型別安全 CRUD API
- 撰寫完整單元測試覆蓋

## Capabilities

### New Capabilities

- `sqlite-client`: SQLite WASM 引擎初始化與 OPFS 持久化管理
- `db-schema`: 8 張核心資料表定義與版本化 Migration
- `db-views`: 三層 View（v_assets_summary, v_account_balances, v_financial_health_check）
- `db-repositories`: 型別安全的 CRUD Repository 封裝（Account, Transaction, Holding, Budget, Insurance）

### Modified Capabilities

<!-- 無既有 spec 需要修改 -->

## Impact

- 新增依賴：`sql.js`
- 新增檔案：`src/lib/db/` 整個目錄結構
- Vite 設定：需新增 WASM file loader 設定
- 測試：`tests/db/` 目錄下所有單元測試
