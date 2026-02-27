## Tasks

### 1. Implement E2EE encryption module

- [x] Create `src/lib/crypto/types.ts` with EncryptedPayload, DataFingerprint, HealthMetrics types
- [x] Create `src/lib/crypto/e2ee.ts` with deriveKey, encrypt, decrypt, generateSalt
- [x] Use PBKDF2 (SHA-256, 100k iterations) for key derivation
- [x] Use AES-256-GCM with random 12-byte IV per encryption
- [x] Serialize ciphertext/IV/salt as Base64 strings
- [x] Add comprehensive JSDoc for all exported functions

**Specs**: e2ee-encryption

### 2. Implement data fingerprint module

- [x] Create `src/lib/crypto/fingerprint.ts` with generateFingerprint and hashFingerprint
- [x] Ensure fingerprint only contains ratios (%) and normalized metrics, never absolute amounts
- [x] Use SHA-256 for hashing fingerprints to fixed-length hex string

**Specs**: data-fingerprint

### 3. Write unit tests

- [x] Test encrypt → decrypt roundtrip with various UTF-8 strings (ASCII, CJK, emoji, empty)
- [x] Test wrong password decryption throws error
- [x] Test same plaintext produces different ciphertext (random IV)
- [x] Test deterministic key derivation (same password + salt = same key)
- [x] Test different salts produce different keys
- [x] Test fingerprint contains no absolute values
- [x] Test fingerprint determinism (same input = same output)
- [x] Test hash output is 64-char hex string

**Specs**: e2ee-encryption, data-fingerprint
