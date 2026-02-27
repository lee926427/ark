## ADDED Requirements

### Requirement: Format TWD currency

The currency utility SHALL format numbers as TWD with thousand separators and "NT$" prefix.

#### Scenario: Standard TWD formatting

- **WHEN** `formatCurrency(12345.67, "TWD")` is called
- **THEN** it SHALL return "NT$12,345"

#### Scenario: USD formatting

- **WHEN** `formatCurrency(1234.56, "USD")` is called
- **THEN** it SHALL return "$1,234.56"

#### Scenario: Zero value

- **WHEN** `formatCurrency(0, "TWD")` is called
- **THEN** it SHALL return "NT$0"
