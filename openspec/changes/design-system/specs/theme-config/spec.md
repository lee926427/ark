## ADDED Requirements

### Requirement: Dark-mode financial color tokens

The system SHALL define Tailwind v4 `@theme` tokens for a dark-mode financial UI including primary, accent, surface, destructive, muted, and card color scales.

#### Scenario: Theme tokens loaded

- **WHEN** the application starts
- **THEN** all color tokens SHALL be available as Tailwind utilities (e.g., `bg-surface`, `text-primary`)

### Requirement: Light/dark mode toggle

The system SHALL support toggling between dark and light color schemes.

#### Scenario: User switches to light mode

- **WHEN** the user toggles the theme
- **THEN** all color tokens SHALL update to their light-mode values without page reload
