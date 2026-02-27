## Why

ARK 是一款離線優先的個人資產管理工具。在完成資料庫底層（SQLite WASM）與設計系統（Design System）後，我們需要建立核心的「帳戶管理」功能。使用者必須要能建立、編輯與查閱各存放資金的地點（銀行、現金、電子支付等），後續的記帳（交易）或投資持倉功能才能有資金流動的依託。

## What Changes

建立帳戶管理（Account Management）的相關頁面與互動邏輯：

- 新增 `/accounts` 或對應的帳戶列表檢視介面。
- 實作「新增/編輯帳戶」的表單，包含帳戶名稱、類型（銀行、現金、電子錢包等）、幣別、顏色標示與初始餘額設定。
- 使用 `feature/sqlite-foundation` 階段已完成的 `src/lib/db/repositories/accounts.ts` 進行資料庫 CRUD，**不引入任何 ORM (如 Prisma)**，確保純前端 WASM 的執行效能。
- 結合 `feature/design-system` 的元件，例如 `AccountIcon` 渲染不同類別的圖示，以及 `AmountDisplay` 呈現餘額。
- 實作帳戶狀態的切換（如封存）。

## Capabilities

### New Capabilities

- `account-management`: 帳戶的建立、修改、封存與列表顯示機制。支援設定幣別、類型與初始餘額，為後續交易關聯提供基礎實體。

### Modified Capabilities

- （無，這是全新引入的核心功能）

## Impact

- **UI 層**: 擴充了 `src/routes/` 下關於 Account 的介面。
- **資料層**: 開始正式寫入資料到 SQLite 資料庫中 的 `accounts` 表，並將觸發 `v_assets_summary` 與 `v_account_balances` 等 View 的資料變動。
- **依賴**: 使用剛升級整合好的 `sql.js` (資料層) 與 `react-hook-form` / `zod` (已內建於 shadcn / 專案依賴中) 來處理表單驗證。無新增第三方依賴。
