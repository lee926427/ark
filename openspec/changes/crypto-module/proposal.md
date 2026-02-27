## Why

ARKARK 的 PRO 訂閱方案需要 E2EE 跨裝置同步功能，確保雲端儲存的資料即使被攔截也無法被第三方（含開發者）讀取。同時需要「數據指紋化」機制，僅同步聚合後的資產比例與健康指標而非原始金額，實現隱私保護的同儕對照服務。

## What Changes

- 封裝 Web Crypto API 提供 AES-256-GCM 端到端加解密工具
- 實作 PBKDF2 密鑰派生（100,000 iterations, SHA-256）
- 實作數據指紋生成函式（將絕對金額聚合為比例與指標）
- 實作 SHA-256 指紋雜湊
- 完整型別定義（EncryptedPayload, DataFingerprint, HealthMetrics）
- 撰寫單元測試覆蓋加解密往返與指紋確定性

## Capabilities

### New Capabilities

- `e2ee-encryption`: AES-256-GCM 端到端加解密封裝（deriveKey, encrypt, decrypt, generateSalt）
- `data-fingerprint`: 數據指紋生成與雜湊（generateFingerprint, hashFingerprint）

### Modified Capabilities

<!-- 無既有 spec 需要修改 -->

## Impact

- 新增檔案：`src/lib/crypto/e2ee.ts`、`src/lib/crypto/fingerprint.ts`、`src/lib/crypto/types.ts`
- 測試：`tests/crypto/` 目錄下所有單元測試
- 無外部依賴（僅使用瀏覽器原生 Web Crypto API）
- 未來 `src/lib/sync/engine.ts` 會引用此模組的 encrypt/decrypt
