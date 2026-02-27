# Feature Spec: SQLite Foundation

> 此文件由 Git Worktree Design 自動產生，供 AI Agent 作為開發指引。

## 分支資訊

| 項目          | 值                                                  |
| ------------- | --------------------------------------------------- |
| 分支名稱      | `feature/sqlite-foundation`                         |
| 基於分支      | `main`                                              |
| Worktree 路徑 | `/Users/recoil/Desktop/side-project/ark/ark-sqlite` |
| 建立時間      | `2026-02-27T21:09:54+08:00`                         |

## 目標

建立完整的本地資料庫層，包含 sql.js WASM 引擎初始化、OPFS 持久化、完整 Schema、三層 View 與 Repository 封裝，讓其他功能模組可直接呼叫型別安全的 Database API。

## 實作範圍

- [ ] 安裝 `sql.js` 依賴，設定 Vite WASM loader
- [ ] 實作 `src/lib/db/client.ts` — SQLite WASM 初始化（Singleton）+ OPFS 持久化
- [ ] 實作 `src/lib/db/schema.ts` — 8 張表 DDL（accounts, categories, transactions, securities, holdings, insurance_policies, budgets, sync_log）+ 索引
- [ ] 實作 `src/lib/db/migrations.ts` — 版本化 Migration 機制（`user_version` pragma）
- [ ] 實作 `src/lib/db/views.ts` — 3 層 View（v_assets_summary, v_account_balances, v_financial_health_check）
- [ ] 實作 `src/lib/db/repositories/accounts.ts` — create / update / archive / list / getById
- [ ] 實作 `src/lib/db/repositories/transactions.ts` — create / update / delete / listByDate / listByAccount
- [ ] 實作 `src/lib/db/repositories/holdings.ts` — create / update / delete / listByAccount
- [ ] 實作 `src/lib/db/repositories/budgets.ts` — create / update / getByCategory / getActive
- [ ] 實作 `src/lib/db/repositories/insurance.ts` — create / update / listByAccount
- [ ] 實作 `src/lib/db/types.ts` — 所有 DB 實體的 TypeScript 型別定義
- [ ] 撰寫單元測試 `tests/db/` — Schema、Migration、各 Repository CRUD、View 查詢

## 驗收標準

- `pnpm test` 全部通過
- Schema migration 從版本 0 升級至目標版本無錯誤
- 各 Repository 的 CRUD 操作回傳正確型別與資料
- 三層 View 在有交易 / 持倉 / 保單資料時回傳正確計算結果
- 邊界條件覆蓋：空帳戶、零餘額、無交易、轉帳雙向金額正確

## 技術約束

- 使用 `sql.js`（非 wa-sqlite），確保 Safari 相容
- 所有 Repository 方法必須回傳 TypeScript 強型別結果
- 不引入 ORM，直接操作 SQL
- DDL 語句參考 `implementation_plan.md` 中的 Schema 定義

## 跨分支備註

- 此分支為**最基礎**的資料層，建議**最優先合併**回 `main`
- `feature/design-system` 和 `feature/crypto-module` 不依賴此分支，可完全平行開發
- 合併後，後續 feature（帳戶管理、記帳、資產總覽）可直接引用 Repository API
