## Tasks

### 1. Implement E2EE encryption module

- [ ] Create `src/lib/crypto/types.ts` with EncryptedPayload, DataFingerprint, HealthMetrics types
- [ ] Create `src/lib/crypto/e2ee.ts` with deriveKey, encrypt, decrypt, generateSalt
- [ ] Use PBKDF2 (SHA-256, 100k iterations) for key derivation
- [ ] Use AES-256-GCM with random 12-byte IV per encryption
- [ ] Serialize ciphertext/IV/salt as Base64 strings
- [ ] Add comprehensive JSDoc for all exported functions

**Specs**: e2ee-encryption

### 2. Implement data fingerprint module

- [ ] Create `src/lib/crypto/fingerprint.ts` with generateFingerprint and hashFingerprint
- [ ] Ensure fingerprint only contains ratios (%) and normalized metrics, never absolute amounts
- [ ] Use SHA-256 for hashing fingerprints to fixed-length hex string

**Specs**: data-fingerprint

### 3. Write unit tests

- [ ] Test encrypt → decrypt roundtrip with various UTF-8 strings (ASCII, CJK, emoji, empty)
- [ ] Test wrong password decryption throws error
- [ ] Test same plaintext produces different ciphertext (random IV)
- [ ] Test deterministic key derivation (same password + salt = same key)
- [ ] Test different salts produce different keys
- [ ] Test fingerprint contains no absolute values
- [ ] Test fingerprint determinism (same input = same output)
- [ ] Test hash output is 64-char hex string

**Specs**: e2ee-encryption, data-fingerprint
