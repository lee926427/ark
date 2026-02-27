## Tasks

### 1. Configure Tailwind v4 theme

- [x] Define dark-mode color tokens in `src/styles.css` using `@theme` directive
- [x] Set up Google Fonts (Inter + Noto Sans TC) with `@font-face`
- [x] Configure spacing, border-radius, and shadow tokens
- [x] Verify ThemeToggle switches light/dark correctly

**Specs**: theme-config

### 2. Build App Shell layout

- [x] Create `src/components/layout/AppShell.tsx` with TopBar + content + BottomNav structure
- [x] Create `src/components/layout/BottomNav.tsx` with 4 tabs (首頁/記帳/資產/設定)
- [x] Create `src/components/layout/TopBar.tsx` with contextual page title
- [x] Add safe-area-inset handling for mobile browsers
- [x] Integrate AppShell into `__root.tsx`

**Specs**: app-shell

### 3. Build shared UI components

- [x] Create `src/components/ui/AmountDisplay.tsx` — currency formatting + positive/negative colors
- [x] Create `src/components/ui/AccountIcon.tsx` — type-based icon rendering
- [x] Install `recharts` and configure chart theme to match Tailwind tokens
- [x] Customize shadcn/ui components (Button, Card, Input, Dialog, Sheet, Tabs, Badge)

**Specs**: ui-components

### 4. Create route skeletons and cleanup

- [x] Remove template pages (about, blog routes, content directory, content-collections)
- [x] Create empty route files: `/`, `/accounts`, `/transactions/new`, `/assets`, `/settings`
- [x] Create `src/lib/utils/currency.ts` with `formatCurrency()` function

**Specs**: currency-utils

### 5. Verify design system

- [x] Run `pnpm dev` and verify App Shell renders correctly
- [x] Verify bottom nav tab switching works across all routes
- [x] Verify AmountDisplay with various amounts and currencies
- [x] Verify light/dark mode toggle
- [x] Check no TypeScript errors or ESLint warnings
