## Context

ARKARK PRO 訂閱需要 E2EE 雲端同步。此模組為純工具函式庫，不依賴 UI 或 DB 層。

**約束**：

- 僅使用 Web Crypto API，不引入第三方加密庫
- 需相容 Chrome / Firefox / Safari

## Goals / Non-Goals

**Goals:**

- 封裝 AES-256-GCM 加解密（deriveKey, encrypt, decrypt）
- 實作 PBKDF2 密鑰派生（100,000 iterations）
- 實作數據指紋生成（聚合為比例，不含絕對金額）
- 完整型別定義與 JSDoc 註解
- 完整單元測試覆蓋

**Non-Goals:**

- 不實作同步引擎（留給後續）
- 不建立 UI（無設定頁面）
- 不處理密鑰儲存策略

## Decisions

### 1. AES-256-GCM 而非 AES-CBC

- **選擇**：AES-GCM (Galois/Counter Mode)
- **原因**：提供認證加密（AEAD），一次操作同時保證機密性與完整性。AES-CBC 需要額外 HMAC

### 2. PBKDF2 而非 Argon2

- **選擇**：PBKDF2 with SHA-256
- **原因**：Web Crypto API 原生支援 PBKDF2，Argon2 需要第三方 WASM lib

### 3. Base64 序列化而非 Hex

- **選擇**：Base64
- **原因**：同等 binary 資料，Base64 比 Hex 節省 33% 空間

## Risks / Trade-offs

- **PBKDF2 iteration count**：100,000 iterations 在低端手機可能花 200-500ms → 可接受，密鑰派生僅在登入/解鎖時執行一次
- **指紋不含絕對金額**：隱私保護設計，但也意味著同儕對照只能比較比例而非絕對值
