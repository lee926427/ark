# data-fingerprint Specification

## Purpose
TBD - created by archiving change crypto-module. Update Purpose after archive.
## Requirements
### Requirement: Generate privacy-safe fingerprint

The system SHALL generate a DataFingerprint from financial data that contains only percentage ratios and normalized metrics, never absolute monetary values.

#### Scenario: Fingerprint from health check data

- **WHEN** `generateFingerprint()` receives total_assets=$1,000,000 with risk_assets=$300,000
- **THEN** the fingerprint SHALL contain `riskAssetRatio: 30` (percentage) but NOT the absolute values

#### Scenario: Deterministic fingerprint

- **WHEN** the same financial data is fingerprinted twice
- **THEN** the fingerprints SHALL be identical

### Requirement: SHA-256 fingerprint hashing

The system SHALL hash fingerprints to a fixed-length hex string using SHA-256.

#### Scenario: Hash output format

- **WHEN** `hashFingerprint()` is called
- **THEN** it SHALL return a 64-character lowercase hex string

