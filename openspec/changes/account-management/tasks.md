## 1. Setup Query Layer

- [x] 1.1 建立 `src/lib/query/accounts.ts` 並實作抓取帳戶列表 Hook (`useAccounts`)
- [x] 1.2 在同一檔案加入建立帳戶 Mutation (`useCreateAccount`)
- [x] 1.3 在同一檔案加入編輯帳戶 Mutation (`useUpdateAccount`)
- [x] 1.4 在同一檔案加入封存帳戶 Mutation (`useArchiveAccount`)

## 2. Core UI Implementation

- [x] 2.1 實作帳戶表單元件 `src/components/features/accounts/AccountForm.tsx` (包含 react-hook-form + zod 驗證)
- [x] 2.2 實作由下往上滑出的建立帳戶元件 `src/components/features/accounts/CreateAccountSheet.tsx`
- [x] 2.3 實作由下往上滑出的編輯帳戶元件 `src/components/features/accounts/EditAccountSheet.tsx`
- [x] 2.4 翻新 `src/routes/accounts.tsx`，替換掉原本的 static/mock 畫面，改用 `useAccounts` 抓取並顯示列表

## 3. Empty & Loading States

- [x] 3.1 替 `/accounts` 加上 Loading Skeleton 骨架屏
- [x] 3.2 替 `/accounts` 加上當 SQLite `accounts` table 沒有資料時的 Empty State，並加上明顯的建立按鈕

## 4. Final Integration & Verification

- [x] 4.1 在首頁 `/index.tsx` 中把原先的 Mock 資料換成 `useAccounts`，讓首頁帳戶清單跟著連動
- [x] 4.2 驗證建立現金帳戶、銀行帳戶後，首頁與帳戶頁是否能成功渲染正確內容與 `AccountIcon`
- [x] 4.3 驗證封存帳戶後，該項目是否成功隱藏
