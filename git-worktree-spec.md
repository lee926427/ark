# Feature Spec: Crypto Module

> 此文件由 Git Worktree Design 自動產生，供 AI Agent 作為開發指引。

## 分支資訊

| 項目          | 值                                                  |
| ------------- | --------------------------------------------------- |
| 分支名稱      | `feature/crypto-module`                             |
| 基於分支      | `main`                                              |
| Worktree 路徑 | `/Users/recoil/Desktop/side-project/ark/ark-crypto` |
| 建立時間      | `2026-02-27T21:09:54+08:00`                         |

## 目標

封裝 Web Crypto API 提供端到端加密（E2EE）工具與數據指紋生成函式，確保雲端同步資料的安全性與隱私保護。

## 實作範圍

- [ ] 實作 `src/lib/crypto/e2ee.ts` — AES-256-GCM 加解密封裝
  - `deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey>` — PBKDF2 密鑰派生
  - `encrypt(data: string, key: CryptoKey): Promise<EncryptedPayload>` — 加密（含 IV）
  - `decrypt(payload: EncryptedPayload, key: CryptoKey): Promise<string>` — 解密
  - `generateSalt(): Uint8Array` — 產生隨機 salt
- [ ] 實作 `src/lib/crypto/fingerprint.ts` — 數據指紋生成
  - `generateFingerprint(healthData: HealthCheckData): DataFingerprint` — 聚合資產比例與健康指標
  - `hashFingerprint(fingerprint: DataFingerprint): Promise<string>` — SHA-256 雜湊
- [ ] 實作 `src/lib/crypto/types.ts` — 型別定義
  - `EncryptedPayload` — `{ ciphertext: string, iv: string, salt: string }`
  - `DataFingerprint` — `{ assetRatio: Record<string, number>, healthMetrics: HealthMetrics, timestamp: string }`
  - `HealthMetrics` — `{ emergencyFundMonths, riskAssetRatio, netWorth, ... }`
- [ ] 撰寫單元測試 `tests/crypto/e2ee.test.ts`
  - 加密 → 解密往返正確性
  - 不同密碼產生不同密文
  - 相同密碼 + 相同 salt → 相同密鑰（確定性）
  - 錯誤密碼解密失敗
  - 空字串 / 超長字串 / Unicode 內容處理
- [ ] 撰寫單元測試 `tests/crypto/fingerprint.test.ts`
  - 相同輸入產生相同指紋
  - 指紋僅包含比例資料，不包含原始金額
  - 雜湊結果為固定長度 hex 字串

## 驗收標準

- `pnpm test` 全部通過
- 加解密往返：任意 UTF-8 字串加密後解密回原文，100% 正確
- 密鑰派生確定性：相同 password + salt 產生 byte-identical 的密鑰
- 錯誤密碼解密拋出明確錯誤（不 silent fail）
- 指紋不洩漏原始金額：`DataFingerprint` 只含比例 (%) 與指標，無絕對數值
- 所有函式有完整 JSDoc 註解

## 技術約束

- 僅使用 Web Crypto API（`crypto.subtle`），不引入第三方加密庫
- 加密演算法：AES-256-GCM（128-bit auth tag）
- 密鑰派生：PBKDF2 with SHA-256, 100,000 iterations
- 所有 buffer 操作使用 `Uint8Array`，序列化使用 Base64
- 需相容 Chrome / Firefox / Safari 的 Web Crypto API 實作

## 跨分支備註

- 此分支完全獨立，不依賴 DB 層或 UI 層
- 合併順序最後即可（PRO 訂閱功能才需要）
- 未來 `sync/engine.ts` 會引用 `e2ee.ts` 的 encrypt/decrypt
- `fingerprint.ts` 的輸入型別需與 `v_financial_health_check` View 的輸出對齊（合併後調整）
