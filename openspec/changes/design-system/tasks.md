## Tasks

### 1. Configure Tailwind v4 theme

- [ ] Define dark-mode color tokens in `src/styles.css` using `@theme` directive
- [ ] Set up Google Fonts (Inter + Noto Sans TC) with `@font-face`
- [ ] Configure spacing, border-radius, and shadow tokens
- [ ] Verify ThemeToggle switches light/dark correctly

**Specs**: theme-config

### 2. Build App Shell layout

- [ ] Create `src/components/layout/AppShell.tsx` with TopBar + content + BottomNav structure
- [ ] Create `src/components/layout/BottomNav.tsx` with 4 tabs (首頁/記帳/資產/設定)
- [ ] Create `src/components/layout/TopBar.tsx` with contextual page title
- [ ] Add safe-area-inset handling for mobile browsers
- [ ] Integrate AppShell into `__root.tsx`

**Specs**: app-shell

### 3. Build shared UI components

- [ ] Create `src/components/ui/AmountDisplay.tsx` — currency formatting + positive/negative colors
- [ ] Create `src/components/ui/AccountIcon.tsx` — type-based icon rendering
- [ ] Install `recharts` and configure chart theme to match Tailwind tokens
- [ ] Customize shadcn/ui components (Button, Card, Input, Dialog, Sheet, Tabs, Badge)

**Specs**: ui-components

### 4. Create route skeletons and cleanup

- [ ] Remove template pages (about, blog routes, content directory, content-collections)
- [ ] Create empty route files: `/`, `/accounts`, `/transactions/new`, `/assets`, `/settings`
- [ ] Create `src/lib/utils/currency.ts` with `formatCurrency()` function

**Specs**: currency-utils

### 5. Verify design system

- [ ] Run `pnpm dev` and verify App Shell renders correctly
- [ ] Verify bottom nav tab switching works across all routes
- [ ] Verify AmountDisplay with various amounts and currencies
- [ ] Verify light/dark mode toggle
- [ ] Check no TypeScript errors or ESLint warnings
