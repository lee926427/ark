## ADDED Requirements

### Requirement: Bottom navigation with 4 tabs

The App Shell SHALL include a fixed bottom navigation bar with 4 tabs: 首頁, 記帳, 資產, 設定.

#### Scenario: Navigation between tabs

- **WHEN** user taps a tab icon
- **THEN** the application SHALL navigate to the corresponding route and highlight the active tab

#### Scenario: Safe area handling

- **WHEN** displayed on a device with home indicator (e.g., iPhone)
- **THEN** the bottom nav SHALL respect the safe-area-inset-bottom

### Requirement: Top bar with contextual title

The App Shell SHALL include a top bar that displays the current page title.

#### Scenario: Page navigation

- **WHEN** user navigates to the accounts page
- **THEN** the top bar SHALL display "帳戶"

### Requirement: Content area with scroll

The content area SHALL fill the space between TopBar and BottomNav and support vertical scrolling.

#### Scenario: Content overflow

- **WHEN** content exceeds the visible area
- **THEN** the content area SHALL scroll vertically while TopBar and BottomNav remain fixed
