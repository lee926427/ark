# e2ee-encryption Specification

## Purpose
TBD - created by archiving change crypto-module. Update Purpose after archive.
## Requirements
### Requirement: AES-256-GCM encrypt/decrypt

The system SHALL provide encrypt and decrypt functions using AES-256-GCM with 128-bit authentication tag.

#### Scenario: Encrypt then decrypt roundtrip

- **WHEN** a UTF-8 string is encrypted with a key and then decrypted with the same key
- **THEN** the decrypted output SHALL exactly match the original string

#### Scenario: Wrong password decryption

- **WHEN** data encrypted with key A is decrypted with key B
- **THEN** the system SHALL throw a clear error (not silently return garbage)

#### Scenario: Different IVs for same plaintext

- **WHEN** the same string is encrypted twice with the same key
- **THEN** the ciphertexts SHALL be different (due to random IV)

### Requirement: PBKDF2 key derivation

The system SHALL derive encryption keys from passwords using PBKDF2 with SHA-256 and 100,000 iterations.

#### Scenario: Deterministic key derivation

- **WHEN** the same password and salt are used twice
- **THEN** the derived keys SHALL be identical

#### Scenario: Different salts produce different keys

- **WHEN** the same password is used with different salts
- **THEN** the derived keys SHALL be different

