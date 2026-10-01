# UI/UX Design System: Personal Expense Tracker

This document outlines the comprehensive design system, UI/UX philosophy, and component specifications for the Personal Expense Tracker web application. 

**Tech Stack**: Next.js, Tailwind CSS, shadcn/ui
**Target Audience / Region**: Bangladesh
**Primary Currency**: BDT (৳)

---

## 1. Design Philosophy

The core principle of this application is **Financial Trust Through Visual Clarity**. Users are managing their personal finances, which can often be a source of stress. The UI must invoke calmness, professionalism, and reliability. 

### Core Tenets

*   **Reduce Cognitive Load**: Display only what is necessary at any given moment. Hide complex settings or secondary actions behind logical menus or hover states. The interface should feel breathable, not dense.
*   **Speed of Interaction**: Adding a transaction is the most frequent action. It must be blazingly fast. Speed over feature density. Keyboard accessibility and smart defaults are prioritized.
*   **Consistent Patterns**: A predictable interface reduces the learning curve. If a destructive action is red and on the right in one modal, it must be exactly the same everywhere else.
*   **Data-First Design**: Numbers are the hero of this application. Typography and spacing must ensure that balances, expenses, and incomes are instantly readable.
*   **Delight Through Polish**: Avoid flashy animations or gimmicky interactions. Instead, focus on subtle micro-interactions—a gentle scale on a button press, a crisp layout shift, or a perfectly timed toast notification.

---

## 2. Color System

The color palette is designed to be minimal, allowing semantic colors (green, red, blue) to draw attention only when necessary.

### 2.1 Light Theme
The light theme feels airy, clean, and highly legible.

| Token | Hex | Tailwind Equivalent | Usage |
| :--- | :--- | :--- | :--- |
| **Background (Primary)** | `#FFFFFF` | `bg-white` | Card backgrounds, active elements |
| **Background (Secondary)**| `#F8FAFC` | `bg-slate-50` | Page backgrounds, sidebar, table headers |
| **Foreground (Primary)** | `#0F172A` | `text-slate-900` | Primary text, headings, balances |
| **Foreground (Secondary)**| `#475569` | `text-slate-600` | Secondary text, subheadings, table data |
| **Foreground (Muted)** | `#94A3B8` | `text-slate-400` | Captions, placeholders, disabled text |
| **Border** | `#E2E8F0` | `border-slate-200` | Card borders, dividers, input borders |
| **Card** | `#FFFFFF` | `bg-white` | Main content containers |
| **Primary (Brand)** | `#2563EB` | `bg-blue-600` | Primary buttons, active tabs, main links |
| **Primary (Hover)** | `#1D4ED8` | `bg-blue-700` | Hover state for primary actions |

### 2.2 Dark Theme
The dark theme provides a premium, low-glare experience, perfect for nighttime reviewing of finances.

| Token | Hex | Tailwind Equivalent | Usage |
| :--- | :--- | :--- | :--- |
| **Background (Primary)** | `#0B1120` | `bg-slate-950` | App background |
| **Background (Secondary)**| `#111827` | `bg-slate-900` | Sidebar, secondary panels |
| **Foreground (Primary)** | `#F1F5F9` | `text-slate-100` | Primary text, headings |
| **Foreground (Secondary)**| `#94A3B8` | `text-slate-400` | Secondary text |
| **Foreground (Muted)** | `#64748B` | `text-slate-500` | Captions, placeholders |
| **Border** | `#1E293B` | `border-slate-800` | Dividers, subtle outlines |
| **Card** | `#1E293B` | `bg-slate-800` | Content containers |
| **Primary (Brand)** | `#3B82F6` | `bg-blue-500` | Primary buttons, active states |

### 2.3 Semantic Colors
Used strictly to convey meaning regarding financial data and system status.

| Meaning | Light Theme Hex | Dark Theme Hex | Tailwind | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Income / Success** | `#16A34A` | `#22C55E` | `text-green-600` / `500` | Positive cash flow, success toasts, under budget |
| **Expense / Danger** | `#DC2626` | `#EF4444` | `text-red-600` / `500` | Negative cash flow, destructive actions, over budget |
| **Transfer / Info** | `#2563EB` | `#3B82F6` | `text-blue-600` / `500` | Internal movements, informational alerts |
| **Warning** | `#D97706` | `#F59E0B` | `text-amber-600` / `500` | Near budget limit, warnings |

### 2.4 Usage Rules
1.  **Income amounts** are ALWAYS green.
2.  **Expense amounts** are ALWAYS red and must include a minus sign (`-`).
3.  **Transfer amounts** are ALWAYS blue.
4.  **Neutral Default**: Do not overuse color. If an element doesn't represent one of the above states, it should use neutral foreground colors. Color should convey meaning, not act as decoration.

---

## 3. Typography

Typography is crucial for readability, especially for numerical data. 
- **Primary Font Family**: `Inter` (with `system-ui` fallback).
- **Monospace Font Family**: `JetBrains Mono`, `SF Mono`, or system monospace.

### 3.1 Typographic Scale

| Token | Size | Line Height | Weight | Font | Usage Example |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `display-lg` | 36px (2.25rem) | 2.5rem | 700 (Bold) | Inter | Dashboard total balance |
| `display-sm` | 30px (1.875rem)| 2.25rem | 700 (Bold) | Inter | Main page titles |
| `heading-lg` | 24px (1.5rem) | 2rem | 600 (Semibold)| Inter | Section headings |
| `heading-sm` | 20px (1.25rem) | 1.75rem | 600 (Semibold)| Inter | Card titles, modal headers |
| `body-lg` | 16px (1rem) | 1.5rem | 400 (Regular) | Inter | Primary body text |
| `body-md` | 14px (0.875rem)| 1.25rem | 400 (Regular) | Inter | Secondary text, table cells |
| `body-sm` | 12px (0.75rem) | 1rem | 400 (Regular) | Inter | Captions, labels, timestamps |
| `amount-lg` | 28px (1.75rem) | 2rem | 600 (Semibold)| Mono | Large amounts (dashboard) |
| `amount-md` | 16px (1rem) | 1.5rem | 500 (Medium) | Mono | Standard amounts (tables) |
| `amount-sm` | 14px (0.875rem)| 1.25rem | 500 (Medium) | Mono | Small amounts (dropdowns) |

### 3.2 Formatting Rules
*   **Monospace for Numbers**: All financial amounts MUST use the monospace font to ensure tabular alignment (digits align vertically).
*   **Right Alignment**: Amounts in tables or lists are ALWAYS right-aligned to allow users to easily compare magnitudes.
*   **Currency Symbol**: The BDT symbol (`৳`) ALWAYS precedes the amount with NO space. Example: `৳1,000.00`.
*   **Negative Amounts**: Formatted with a minus sign before the currency symbol, colored red. Example: `-৳500.00`.
*   **Large Numbers**: Use standard comma separators. Prefer Bangladeshi formatting (`৳1,00,000.00`) but support international (`৳100,000.00`) as a fallback or preference.

---

## 4. Spacing System

We utilize Tailwind CSS's default spacing scale, based on a 4px grid. This ensures rhythm and consistency.

| Token | Value | Tailwind | Usage Scenarios |
| :--- | :--- | :--- | :--- |
| `xs` | 4px | `1` | Inline element gaps, space between icon and text |
| `sm` | 8px | `2` | Tight spacing, list item gaps |
| `md` | 12px | `3` | Standard component padding (inputs, buttons) |
| `lg` | 16px | `4` | Card padding (mobile), standard section gaps |
| `xl` | 24px | `6` | Card padding (desktop), modal padding |
| `2xl` | 32px | `8` | Spacing between major page sections |
| `3xl` | 48px | `12`| Major layout breaks, empty state margins |

---

## 5. Component Design Tokens

This section details the precise styling of individual UI components, built on top of shadcn/ui.

### 5.1 Border Radius
*   **None** (`0px`, `rounded-none`): Tables, full-bleed mobile elements.
*   **Small** (`6px`, `rounded-sm`): Badges, tags, small UI accents.
*   **Medium** (`8px`, `rounded-md`): Buttons, form inputs, dropdown menus.
*   **Large** (`12px`, `rounded-xl`): Standard cards, dialogs/modals.
*   **Extra Large** (`16px`, `rounded-2xl`): Large prominent layout cards (e.g., main balance card).
*   **Full** (`9999px`, `rounded-full`): Avatars, notification pills, progress bar tracks.

### 5.2 Shadows (Light Mode Only)
Shadows are disabled in Dark Mode (use borders instead).
*   **Small** (`shadow-sm`): `0 1px 2px rgba(0,0,0,0.05)` — Subtle elevation for interactive cards.
*   **Medium** (`shadow-md`): `0 4px 6px -1px rgba(0,0,0,0.1)` — Standard cards, floating action buttons.
*   **Large** (`shadow-lg`): `0 10px 15px -3px rgba(0,0,0,0.1)` — Dropdowns, popovers, modals.

### 5.3 Cards
*   **Background**: `bg-white` (light) / `bg-slate-800` (dark).
*   **Border**: 1px solid `border-slate-200` (light) / `border-slate-800` (dark).
*   **Border Radius**: `lg` (12px).
*   **Padding**: `p-6` (24px) for desktop, `p-4` (16px) for mobile.
*   **Hover State**: If the card is clickable (e.g., a transaction row), apply `hover:shadow-md` (light) or `hover:bg-slate-750` (dark) with a transition of 150ms.

### 5.4 Buttons

| Variant | Light Mode | Dark Mode | Usage |
| :--- | :--- | :--- | :--- |
| **Primary** | `bg-blue-600 text-white hover:bg-blue-700` | `bg-blue-500 text-white hover:bg-blue-600` | Save, Submit, primary CTA |
| **Secondary** | `bg-slate-100 text-slate-900 hover:bg-slate-200`| `bg-slate-700 text-slate-100 hover:bg-slate-600`| Cancel, Back, secondary actions |
| **Destructive**| `bg-red-600 text-white hover:bg-red-700` | `bg-red-500 text-white hover:bg-red-600` | Delete, Remove |
| **Ghost** | `bg-transparent hover:bg-slate-100` | `bg-transparent hover:bg-slate-800` | Icon buttons, tertiary actions |
| **Outline** | `border border-slate-200 hover:bg-slate-50` | `border border-slate-700 hover:bg-slate-800` | Alternative secondary |

*   **Heights**: `sm` (32px), `md` (36px - default), `lg` (40px).
*   **Radius**: `md` (8px).
*   **Min Width**: 80px (ensures clickable area).
*   **Icon Buttons**: Square aspect ratio (e.g., 36x36px).
*   **Loading**: Render a subtle spinner replacing the icon, maintain button width, apply `opacity-50` and `cursor-not-allowed`.

### 5.5 Inputs
*   **Height**: 40px (`h-10`).
*   **Border**: 1px solid `border-slate-200` (light).
*   **Radius**: `md` (8px).
*   **Focus State**: `focus:ring-2 focus:ring-blue-500 focus:border-transparent`.
*   **Error State**: `ring-2 ring-red-500 border-transparent`. Must be accompanied by a red error message below the field.
*   **Disabled**: `opacity-50 cursor-not-allowed`.
*   **Placeholder**: `text-slate-400`.

### 5.6 Dropdowns / Select
*   Share the same base styles as Inputs.
*   **Menu**: Card style, `shadow-lg`, max-height 300px with custom scrollbar.
*   **Items**: 36px height, `hover:bg-slate-100` (light).
*   **Active Item**: Display a checkmark icon aligned right.

### 5.7 Tables
*   **Header**: `bg-slate-50`, uppercase labels, `text-[12px] font-semibold tracking-wider text-slate-500`.
*   **Rows**: No alternating background (keep it clean). Border bottom `border-slate-200`.
*   **Row Hover**: `hover:bg-slate-50` (light) / `hover:bg-slate-800/50` (dark).
*   **Alignment**: Text left, Amounts right, Actions right.
*   **Mobile Behavior**: Tables must transform into a stacked card layout on screens `< 768px`.

### 5.8 Modals / Dialogs
*   **Overlay**: `bg-black/50 backdrop-blur-sm`.
*   **Container**: Card styling, max-width varies (`max-w-md` for standard, `max-w-2xl` for complex forms). Centered vertically and horizontally.
*   **Header**: Title (heading-sm) + `Ghost` variant close button (X) top right.
*   **Footer**: Right-aligned action buttons (Cancel on left, Primary Action on right).
*   **Animation**: Subtle fade-in (`opacity-0` to `opacity-100`) and scale-up (`scale-95` to `scale-100`) over 150ms `ease-out`.

### 5.9 Toasts / Notifications
*   **Position**: Bottom-right (desktop), Bottom-center (mobile).
*   **Duration**: 3 seconds (Info/Success), 5 seconds (Error/Warning).
*   **Design**: Small card layout, left border color indicating type.
*   **Types**:
    *   Success: Green border + Check icon.
    *   Error: Red border + X icon.
    *   Warning: Amber border + Alert icon.
    *   Info: Blue border + Info icon.
*   **Interaction**: Auto-dismiss or manual click of X button.

### 5.10 Badges / Tags
*   **Radius**: `sm` (6px).
*   **Padding**: `px-2 py-0.5`.
*   **Typography**: `body-sm` (12px).
*   **Transaction Types**:
    *   `EXPENSE`: `bg-red-100 text-red-700`
    *   `INCOME`: `bg-green-100 text-green-700`
    *   `TRANSFER`: `bg-blue-100 text-blue-700`

### 5.11 Status Indicators
*   Small `8px` circle (`w-2 h-2 rounded-full`).
*   Active: Green.
*   Inactive: Gray/Slate-400.
*   Warning/Pending: Amber.

### 5.12 Progress Bars (Budgets & Goals)
*   **Height**: 8px (`h-2`).
*   **Radius**: Full (`rounded-full`).
*   **Track Background**: `bg-slate-200` (light) / `bg-slate-700` (dark).
*   **Fill Color**: Dynamic based on percentage.
    *   `0% - 79%`: Green (`bg-green-500`)
    *   `80% - 99%`: Amber (`bg-amber-500`)
    *   `100%+`: Red (`bg-red-500`)

---

## 6. Layout System

### 6.1 Desktop Layout (≥ 1024px)
A standard sidebar layout for professional dashboard applications.

```text
┌────────────────────────────────────────────────────────────┐
│  ┌────────────┐  ┌──────────────────────────────────────┐  │
│  │            │  │           Header Bar                 │  │
│  │ Sidebar    │  ├──────────────────────────────────────┤  │
│  │ (240px)    │  │                                      │  │
│  │            │  │                                      │  │
│  │ ⌂ Home     │  │           Main Content               │  │
│  │ ☰ Transact │  │           (max-w-7xl)                │  │
│  │ 💼 Account │  │           (centered)                 │  │
│  │ 📊 Budgets │  │                                      │  │
│  │            │  │                                      │  │
│  │            │  │                                      │  │
│  └────────────┘  └──────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```
*   **Sidebar**: Fixed width 240px. Collapsible to 64px (icons only) for power users.
*   **Main Content Area**: Fluid width, with a maximum width constraint (e.g., 1400px) and centered to maintain readability on ultra-wide monitors.
*   **Header**: 64px height, sticky at the top. Contains breadcrumbs/title, global search, user profile, and theme toggle.

### 6.2 Mobile Layout (< 1024px)
Optimized for one-handed thumb use.

```text
┌────────────────────────┐
│      Header Bar        │
├────────────────────────┤
│                        │
│                        │
│     Main Content       │
│     (Full width,       │
│      16px padding)     │
│                        │
│                        │
├────────────────────────┤
│                        │
│  [⌂]  [☰]  [+]  [💼]  [⋯]│
└────────────────────────┘
```
*   **Header**: 56px height, sticky. Contains page title and user avatar.
*   **Bottom Navigation**: 64px height, fixed to the bottom.
*   **Items**: Dashboard, Transactions, FAB (Add), Accounts, More (menu).
*   **FAB (Floating Action Button)**: The central `+` button is prominent, raised (`shadow-md`), and uses the primary brand color to encourage logging transactions.

### 6.3 Navigation Items
*   **Dashboard** (Icon: Home)
*   **Transactions** (Icon: List)
*   **Accounts** (Icon: Wallet)
*   **Categories** (Icon: Grid)
*   **Budgets** (Icon: PieChart)
*   **Goals** (Icon: Target)
*   **Recurring** (Icon: Repeat)
*   **Reports** (Icon: BarChart)
*   **Settings** (Icon: Settings)

**States**:
*   *Active*: `bg-blue-50 text-blue-600` (light) / `bg-blue-500/10 text-blue-400` (dark).
*   *Hover*: `hover:bg-slate-100` (light) / `hover:bg-slate-800` (dark).

---

## 7. Page-by-Page UX Design

### 7.1 `/dashboard`
**Purpose**: Provide an immediate, at-a-glance overview of the user's financial health.

**Layout Architecture**:
*   **Row 1 (Stats)**: 4 metric cards (Total Balance, Monthly Income, Monthly Expense, Net Cash Flow).
    *   *Desktop*: 4 columns.
    *   *Tablet*: 2x2 grid.
    *   *Mobile*: Horizontal scrolling row (snap scroll).
*   **Row 2 (Insights)**: Savings Rate card, Today's Spending, Active Budget Usage.
*   **Row 3 (Visuals)**: Spending by Category (Donut Chart) + Monthly Trend (Bar Chart). Side-by-side on desktop, stacked vertically on mobile.
*   **Row 4 (Activity)**: Upcoming Recurring Transactions (List) + Recent Transactions (List).
*   **Floating Action**: Quick Add button (bottom right) always accessible.

**Stat Card Design**:
*   Top-left: Muted context icon.
*   Top-left (below icon): Label (`body-sm`, `text-slate-500`).
*   Center: Value (`amount-lg`, monospace, e.g., `৳1,50,000.00`).
*   Bottom: Trend indicator comparing to the previous period (`body-sm`). Green `↑12%` or Red `↓5%`.

**States**:
*   *Loading*: Display skeleton cards with a soft, pulsing opacity animation.
*   *Empty*: Welcome message illustration + Prominent "Add your first account" CTA button.

### 7.2 `/transactions`
**Purpose**: The central ledger. View, search, filter, and manage all transactions.

**Layout Architecture**:
*   **Header Area**: Page Title (left), "Add Transaction" button (right).
*   **Filter Bar**:
    *   Type Tabs: `All | Expense | Income | Transfer`.
    *   Date Range Picker (defaults to Current Month).
    *   "More Filters" dropdown (Account, Category, Tags).
*   **Search**: Full-width or prominent input field searching merchants, notes, and exact amounts.
*   **List View**:
    *   *Desktop*: Data table.
    *   *Mobile*: Stacked cards.
*   **Pagination**: Cursor-based infinite scroll or a clear "Load More" button.

**Desktop Table Row Structure**:
| Date (Mon, 12 Oct) | Merchant (Line 1) / Category (Line 2, muted) | Account (with Icon) | Tags (Badges) | Amount (Right, Monospace) | Actions (Hover) |

**Mobile Card Structure**:
*   Left: Large category icon in a circular container.
*   Center: Merchant name (bold), Category name below (muted).
*   Right: Amount (colored by type).
*   Bottom: Date and Account name (small, muted text).

### 7.3 `/transactions/new` (Add Transaction)
**Purpose**: Logging an entry quickly. **This is the MOST IMPORTANT UX in the application.** Target time to log: < 10 seconds.

**Format**: Slide-over panel (right side) on desktop, full-screen modal on mobile.

**Form Design & Flow**:
1.  **Type Selector**: Segmented control/pills at the top (`Expense | Income | Transfer`). Defaults to `Expense`.
2.  **Amount**: LARGE numeric input. **Auto-focused immediately upon opening.** This is the first thing a user thinks about.
3.  **Account**: Dropdown. Pre-selects the user's default account. Shows recently used accounts first.
4.  **To Account**: (Visible ONLY if type is `Transfer`).
5.  **Category**: Searchable dropdown menu with icons. Displays most frequently used categories based on the selected account or time of day.
6.  **Subcategory**: Conditional dropdown, appears only after a parent category is selected.
7.  **Date**: Native date picker. Defaults to `Today`.
8.  **Merchant/Payee**: Text input. Must feature autocomplete based on previous entries.
9.  **Note**: Optional textarea.
10. **Tags**: Multi-select tag input.
11. **Attachment**: File upload area (receipts). Optional.
12. **Submit**: Prominent `Primary` button.

**Speed Optimizations (The "10-Second Rule")**:
*   `Amount` field is active the millisecond the panel opens.
*   Tab index perfectly ordered: `Amount` → `Account` → `Category` → `Date` → `Merchant` → `Save`.
*   Global Keyboard Shortcut: Pressing `N` from anywhere opens this modal.
*   Save Shortcut: `Cmd+Enter` or `Ctrl+Enter` submits the form.
*   Post-Save Action: Display a success toast and immediately clear the form for another entry (or close, based on a user preference setting).

### 7.4 `/transactions/[id]`
**Purpose**: Detailed view and editing of a specific transaction.
*   Layout mirrors the creation form but is pre-populated.
*   Displays metadata: `Created At`, `Last Updated At`.
*   Shows receipt attachment previews.
*   Contains a destructive `Delete` button (requires a confirmation dialog).

### 7.5 `/accounts`
**Purpose**: High-level management of bank accounts, cash, and credit cards.

**Layout Architecture**:
*   **Header**: Total Net Worth / Balance summary card.
*   **Grid**: Cards representing individual accounts.
    *   *Desktop*: 3-column grid.
    *   *Tablet*: 2-column grid.
    *   *Mobile*: 1-column stack.

**Account Card UI**:
```text
┌──────────────────────────────────────┐
│ 🏦 Prime Bank                        │
│ Checking Account         [Active ●]  │
│                                      │
│ ৳1,25,000.00                         │
│ Initial Balance: ৳100,000.00         │
└──────────────────────────────────────┘
```
*   Clicking a card routes to `/accounts/[id]`.

### 7.6 `/accounts/[id]`
**Purpose**: Isolate data for a single account.
*   Header showing Account Name, Icon, and Current Balance.
*   A localized version of the `/transactions` table, pre-filtered for this specific account.
*   Settings to edit account details or deactivate it.

### 7.7 `/categories`
**Purpose**: Organization and taxonomy of spending.
*   Tabs for `Expense` and `Income` categories.
*   List view showing Category Icon, Name, number of associated subcategories, and total transaction count.
*   *V1.1 Feature*: Drag-and-drop handles for reordering category priorities.

### 7.8 `/budgets`
**Purpose**: Proactive financial planning.

**Layout Architecture**:
*   **Header Controls**: Month/Year pagination (`← September 2026 →`).
*   **Summary Card**: Total Budgeted vs. Total Spent vs. Remaining (Visualized with a master progress bar).
*   **Budget Cards**: Individual cards for budgeted categories.

**Budget Card UI**:
```text
┌──────────────────────────────────────────────┐
│ 🍔 Food & Dining                             │
│ ৳8,000 spent of ৳10,000 budget         80%   │
│ [████████████████████████░░░░░░]             │
│ ৳2,000 remaining                             │
└──────────────────────────────────────────────┘
```
*   The progress bar color shifts dynamically: Green (<80%) → Amber (80-99%) → Red (100%+).
*   Action: "Set Budget" for categories lacking one.
*   Action: "Copy from Previous Month" for quick setup.

### 7.9 `/goals` (V1.1)
**Purpose**: Tracking savings targets (e.g., "New Laptop", "Emergency Fund").
*   Grid of goal cards.
*   Visualized as circular progress rings or linear bars.
*   Metrics: Target Amount, Current Saved, Percentage Complete.
*   Quick "Add Funds" button on each card.

### 7.10 `/recurring` (V1.1)
**Purpose**: Managing subscriptions and automated entries.
*   List of recurring tasks (e.g., Netflix, Rent).
*   Columns: Merchant, Amount, Frequency (Monthly, Weekly), Next Due Date, Status (Active toggle).

### 7.11 `/reports`
**Purpose**: Deep analytics and visualization.
*   **Controls**: Robust date range selector.
*   **Visualizations** (rendered inside individual cards):
    *   Income vs. Expense (Grouped Bar Chart).
    *   Expense Breakdown (Donut/Pie Chart).
    *   Spending Trend (Line Chart, 6-12 month view).
    *   Cash Flow Waterfall.
*   Data tables accompanying charts for accessibility.
*   Export to CSV/PDF buttons for each report.

### 7.12 `/settings`
**Purpose**: Application configuration.
*   Vertical tabs (desktop) or stacked sections (mobile).
*   **Profile**: User details.
*   **Preferences**: Base Currency (default `BDT`), Date Format, Theme toggle (Light/Dark/System).
*   **Data**: Export JSON, Export CSV, Import Data.
*   **Danger Zone**: "Delete All Data" button (styled heavily destructive, requires typing confirmation).

---

## 8. Interaction Patterns

Consistency in interactions builds user confidence.

### 8.1 Confirmation Dialogs
Never perform destructive actions without confirmation.
*   **Required for**: Deleting a transaction, deactivating an account, deleting a category, importing data (overwrite warning).
*   **Design**:
    *   Title: Clear action statement ("Delete transaction?").
    *   Body: Explain consequences ("This will remove ৳500 from your Food category. This cannot be undone.").
    *   Footer: `Cancel` (Secondary, Left), `Delete` (Destructive Red, Right).
*   **Critical Actions** (e.g., deleting an account): Require the user to type the account name or "DELETE" into an input field to enable the confirm button.

### 8.2 Loading States
*   **Initial Page Load**: Use Skeleton UI (gray, rounded rectangles matching the shape of the content). NO full-page spinners.
*   **Button Actions**: Replace the button icon or text with a small spinning indicator. Disable the button to prevent double-clicks.
*   **Optimistic UI**: For non-destructive actions (like toggling a setting or marking a notification read), update the UI instantly and sync with the server in the background.

### 8.3 Empty States
Every list or page must gracefully handle having no data.
*   Use a subtle, context-appropriate icon or illustration.
*   Provide a clear, friendly message ("You haven't added any accounts yet.").
*   **Crucial**: Always provide a primary CTA button right below the message ("+ Add Account").

### 8.4 Error Handling
*   **Form Validation**: Display errors inline, directly beneath the offending input field in red (`body-sm`). Highlight the input border red.
*   **Action Failures**: Use a red Toast notification ("Failed to save transaction. Please try again.").
*   **Fatal Errors**: Display a full-page error state with a clear "Retry" or "Go to Dashboard" button.

### 8.5 Keyboard Shortcuts (V1 Focus)
*   `N` or `c` - Open New Transaction modal.
*   `/` - Focus global search.
*   `Escape` - Close any active modal, dropdown, or panel.
*   `Cmd + Enter` / `Ctrl + Enter` - Submit active form.

---

## 9. Animation & Motion

Motion should feel snappy, not sluggish. It serves to guide the eye, not distract.

*   **Duration Scale**:
    *   Micro-interactions (hover, focus): `150ms`.
    *   Entrances (modals, dropdowns): `200ms`.
    *   Page Layout shifts: `300ms`.
*   **Easing**:
    *   Entrances: `ease-out` (starts fast, slows down).
    *   Exits: `ease-in` (starts slow, speeds up).
*   **Skeletons**: Pulse opacity from `0.4` to `1` over `1.5s` `ease-in-out` infinitely.
*   **Accessibility**: Respect CSS `@media (prefers-reduced-motion: reduce)`. Disable structural animations if true.

---

## 10. Responsive Breakpoints

Utilize Tailwind's default breakpoint system.

| Breakpoint Name | CSS Width | Layout Adjustments |
| :--- | :--- | :--- |
| `mobile` (default) | `< 640px` | Single column. Bottom navigation bar active. Data tables convert to card lists. Modals become full-screen slide-ups. |
| `sm` (Tablet Port.) | `≥ 640px` | Multi-column grid for cards. Modals take windowed form. Bottom nav remains. |
| `md` (Tablet Land.) | `≥ 768px` | Data tables become visible. |
| `lg` (Desktop) | `≥ 1024px`| Bottom navigation hidden. Left Sidebar becomes visible. Complex multi-column layouts enabled. |
| `xl` (Wide) | `≥ 1280px`| Sidebar expanded by default. Max content width applied to prevent excessive stretching. |
| `2xl` (Ultra-wide) | `≥ 1536px`| Content remains centered in viewport. |

---

## 11. Accessibility (a11y) Design

The financial tool must be usable by everyone.

*   **Keyboard Navigation**: Every interactive element must be reachable via the `Tab` key.
*   **Focus Rings**: Clear, visible focus states (`ring-2 ring-blue-500`) must be applied on keyboard focus. Do NOT suppress outline on `:focus-visible`.
*   **Color Contrast**:
    *   Normal Text: Minimum ratio of `4.5:1` against background.
    *   Large Text (18pt+): Minimum ratio of `3:1`.
    *   Check contrast of Semantic Colors (red/green/amber) especially in Dark Mode.
*   **Screen Readers**:
    *   Use appropriate semantic HTML (`<nav>`, `<main>`, `<article>`).
    *   Ensure all icon-only buttons have descriptive `aria-label` attributes.
    *   Use `aria-live="polite"` for toast notifications and dynamic form errors.
*   **Touch Targets**: Minimum interactive area of `44x44px` on mobile devices.
*   **Forms**: Labels must always be visible (no placeholder-only patterns). Input fields must use `aria-describedby` to link to their respective error message IDs.

---

## 12. Dark Mode Design

Dark mode is a first-class citizen, crucial for users checking finances at night.

*   **Implementation**: Use Tailwind's `dark:` variant and CSS variables.
*   **Detection**: Default to user's system preference via `prefers-color-scheme`.
*   **FOUC Prevention**: Ensure a tiny blocking script in the `<head>` sets the correct theme class before the React tree renders to prevent the "white flash".
*   **Visual Adjustments**:
    *   Remove all `shadow-*` utility classes. Rely on subtle `border-slate-800` to separate overlapping elements.
    *   Desaturate primary colors slightly (e.g., Blue-600 in light mode becomes Blue-500 in dark mode) to prevent eye strain.
    *   Ensure charts (Chart.js or Recharts) receive updated color palettes suitable for dark backgrounds (axis lines, grid lines, tooltips).

---

## 13. FUTURE UX FEATURE: Natural Language Input

*(Note: This is outside the scope of the MVP but documented here for future architectural planning.)*

**Concept**: A single text input that parses human language into structured transaction data.

**User Journey**:
1.  User focuses the "Smart Add" input field on the dashboard.
2.  User types: `"Spent 500 on food from cash"` or `"Got salary 50000 in bank"`.
3.  As the user types, a popover displays a real-time parsed preview:
    *   **Amount**: `৳500`
    *   **Category**: `Food & Dining` (auto-mapped from "food")
    *   **Account**: `Cash`
    *   **Type**: `Expense` (auto-mapped from "Spent")
4.  User hits `Enter`. The transaction is saved instantly.

**Design Implications**:
*   Requires a highly prominent, centralized input field.
*   Needs clear visual feedback when parsing succeeds (green highlights on recognized words) or fails (underline unmapped words).
*   Needs an "Edit Details" fallback button if the parser gets it wrong.
