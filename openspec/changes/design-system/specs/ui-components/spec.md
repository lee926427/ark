## ADDED Requirements

### Requirement: AmountDisplay formats currency values

AmountDisplay SHALL render monetary values with thousand separators, currency symbol, and color-coded positive/negative.

#### Scenario: Positive TWD amount

- **WHEN** AmountDisplay receives `amount=12345.67, currency="TWD"`
- **THEN** it SHALL render "NT$12,345.67" in green/positive color

#### Scenario: Negative amount

- **WHEN** AmountDisplay receives `amount=-500, currency="TWD"`
- **THEN** it SHALL render "-NT$500" in red/destructive color

### Requirement: AccountIcon renders type-based icons

AccountIcon SHALL render a distinct icon for each account type (bank, cash, e_payment, credit_card, investment, insurance, loan).

#### Scenario: Bank account icon

- **WHEN** AccountIcon receives `type="bank"`
- **THEN** it SHALL render the bank building icon with the account's color
