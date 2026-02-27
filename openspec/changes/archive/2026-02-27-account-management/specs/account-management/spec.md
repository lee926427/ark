## ADDED Requirements

### Requirement: List Accounts View

The system SHALL display a list of all non-archived accounts inside `/accounts` by default, including their current balance.

#### Scenario: View account list with accounts

- **WHEN** user visits the `/accounts` page and there are existing accounts
- **THEN** system displays the list of accounts categorized by type or as a flat list
- **THEN** each account card displays the account name, icon, currency, and formatted balance

#### Scenario: View account list with empty state

- **WHEN** user visits the `/accounts` page and no accounts exist
- **THEN** system displays an empty state with a call-to-action to "Add Account"

### Requirement: Add New Account Form

The system SHALL allow users to create a new account by providing the account name, type, currency, and initial balance.

#### Scenario: Successfully create an account

- **WHEN** user opens the add account form
- **WHEN** user fills in valid details (e.g., name="Cash", type="cash", currency="TWD", balance=1000) and submits
- **THEN** system successfully creates the account in the local SQLite database
- **THEN** the form closes and the account list refreshes to show the new account

#### Scenario: Validation fails on empty account name

- **WHEN** user attempts to submit the form without providing an account name
- **THEN** system prevents submission
- **THEN** system displays a validation error message indicating the name is required

### Requirement: Edit Account Form

The system SHALL allow users to modify the properties of an existing account.

#### Scenario: Successfully edit an account

- **WHEN** user clicks on an existing account's edit or options button
- **WHEN** user modifies the account name or type and submits
- **THEN** system successfully updates the account in the database
- **THEN** the account list reflects the updated details

### Requirement: Archive Account

The system SHALL allow users to archive (soft delete) an account or permanently delete it if it has no associated transactions.

#### Scenario: Archive an active account

- **WHEN** user clicks "Archive" on an existing account
- **THEN** system marks the account's `is_archived` status to true
- **THEN** the account is removed from the active accounts list view
