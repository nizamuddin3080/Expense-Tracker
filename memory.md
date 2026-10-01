# Project Context & Memory

This document serves as the persistent memory and context file for the Expense Tracker (FinTrack) web application. It is designed to ensure the AI coding agent retains important decisions, scope, and technical context between sessions.

---

## 1. Project Identity

- **Project Name**: FinTrack (Personal Expense Tracker)
- **Purpose**: Personal financial management web application for tracking expenses, income, accounts, budgets, and savings goals.
- **Type**: Full-stack web application (Next.js)
- **Current Version**: 0.0.0 (Pre-development / Documentation phase)
- **Current Phase**: Phase 0 — Documentation
- **Repository**: (To be initialized)
- **Target Deployment**: Linux VPS (Hostinger)
- **Primary User**: Single personal user (architecture supports future multi-user)
- **Primary Currency**: BDT (৳) — Bangladeshi Taka
- **Created**: September 2026

---

## 2. Product Decisions

Record all important product decisions:

### Transaction Model
- **Decision**: Unified transaction model with three types: EXPENSE, INCOME, TRANSFER
- **Rationale**: Simpler than separate tables, easier to query and report, single source of truth
- **Rules**: 
  - Amount is ALWAYS positive
  - Type field determines direction (credit/debit)
  - Transfers require both `accountId` and `toAccountId`
  - Transfers do NOT count as income or expense in any report
  - Transfers do NOT affect net cash flow
  - `CategoryId` is NULL for transfers
  - Soft delete (`isDeleted` flag) — soft-deleted transactions excluded from ALL calculations

### Account Balance
- **Decision**: Balance is CALCULATED, not stored as a separate mutable value
- **Formula**: `openingBalance + SUM(income) - SUM(expense) + SUM(transfersIn) - SUM(transfersOut)`
- **Note**: May cache balance on Account model for performance, but must always be reconcilable from transactions
- **Rationale**: Prevents balance drift, ensures accuracy, maintains audit trail

### MVP Scope
- **V1 MVP includes**: Auth, Dashboard, Transactions (CRUD), Accounts, Categories, Budgets, Basic Reports, Search/Filter, CSV Export, Responsive design, Dark/Light theme
- **V1.1 includes**: Recurring transactions, Savings goals, CSV import, Attachments, In-app notifications
- **V2 includes**: Advanced reports, PWA, Multi-currency, Email notifications
- **Future**: AI analysis, NLP input, OCR, Forecasting
- **Rule**: Do NOT implement V1.1/V2/Future features during MVP unless explicitly requested

### Notification Strategy
- **V1**: No notifications (not in MVP)
- **V1.1**: In-app notifications (budget warnings, recurring reminders, goal milestones)
- **V2**: Optional email notifications

---

## 3. Technical Decisions

Record all technology and architecture decisions:

### Framework & Runtime
- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript (strict mode)
- **Runtime**: Node.js 18+
- **Rationale**: Full-stack framework, SSR for performance, server actions for mutations, single codebase

### UI & Styling
- **CSS**: Tailwind CSS 3+
- **Component Library**: shadcn/ui (built on Radix UI primitives)
- **Icons**: Lucide React
- **Charts**: Recharts (or Chart.js — evaluate during implementation)
- **Forms**: React Hook Form + Zod
- **Font**: Inter (primary), monospace for amounts
- **Rationale**: Tailwind for rapid development, shadcn for accessible components that are customizable, Radix for accessibility

### Database & ORM
- **Database**: MySQL 8.0+
- **ORM**: Prisma
- **ID Strategy**: CUID (collision-resistant, sortable)
- **Money Storage**: DECIMAL(15,2) — NEVER floating point
- **Money Arithmetic**: Decimal.js in TypeScript
- **Timestamps**: UTC, auto-managed by Prisma (`@default(now())`, `@updatedAt`)
- **Soft Delete**: Transactions only (`isDeleted` + `deletedAt`)
- **Rationale**: MySQL for ACID compliance and financial data integrity, Prisma for type-safe queries

### Authentication
- **Library**: NextAuth.js (Auth.js v5)
- **Provider**: Credentials (email + password)
- **Password Hashing**: bcrypt, 12 rounds
- **Session**: Database-stored, HTTP-only cookie
- **Future Providers**: Google OAuth, GitHub OAuth
- **Rationale**: Established library, handles session management, extensible

### Deployment
- **Platform**: Linux VPS (Hostinger)
- **Process Manager**: PM2
- **Reverse Proxy**: Nginx
- **SSL**: Let's Encrypt (Certbot)
- **Database**: MySQL on same server
- **File Storage**: Local filesystem (uploads directory)
- **CI/CD**: Manual deployment script (V1)
- **Rationale**: Cost-effective, full control, suitable for personal app

### Key Dependencies
| Package | Purpose | Critical? |
|---------|---------|----------|
| next | Framework | Yes |
| react / react-dom | UI library | Yes |
| typescript | Type safety | Yes |
| tailwindcss | Styling | Yes |
| @prisma/client + prisma | ORM | Yes |
| next-auth | Authentication | Yes |
| zod | Validation | Yes |
| decimal.js | Money arithmetic | Yes |
| bcrypt | Password hashing | Yes |
| date-fns | Date utilities | Yes |
| react-hook-form | Form management | Yes |
| @hookform/resolvers | Zod + RHF integration | Yes |
| recharts | Charts | Yes |
| lucide-react | Icons | Yes |
| sharp | Image processing | No (V1.1) |
| sonner | Toast notifications | Yes |
| @radix-ui/* | Accessible primitives (via shadcn) | Yes |

---

## 4. UX Decisions

### Design Philosophy
- Modern, clean, premium, financially trustworthy
- Data-first: numbers are the hero
- Speed over feature density
- Consistent patterns reduce learning curve

### Layout
- Desktop: Sidebar (240px, collapsible) + main content
- Mobile: Header + content + bottom navigation (5 items)
- Breakpoint: 1024px switches between desktop/mobile layout

### Transaction Entry
- **Decision**: Modal/slide-over for quick add, full page available for complex entries
- **Target**: < 10 seconds for a simple transaction
- **Defaults**: Type=Expense, Account=user's default, Date=today, Amount field auto-focused
- **Keyboard**: N to open, Ctrl+Enter to save, Escape to close

### Color System
- Income: Green (#16A34A light / #22C55E dark)
- Expense: Red (#DC2626 light / #EF4444 dark)
- Transfer: Blue (#2563EB light / #3B82F6 dark)
- Warning: Amber (#D97706 light / #F59E0B dark)
- Primary brand: Blue (#2563EB)

### Amount Display
- Always monospace font
- Always right-aligned in tables
- Currency prefix: ৳ (no space)
- Thousands separator: comma (৳1,000.00)
- Expense: red with minus sign (-৳500.00)
- Income: green (৳5,000.00)
- Transfer: blue (৳1,000.00)

### Dark Mode
- System preference detection by default
- Manual toggle available
- All components must support both themes

---

## 5. Known Issues
(Empty — no issues yet, project is in documentation phase)

---

## 6. Assumptions Made
Document ALL assumptions:
1. **Single currency V1**: BDT only. Multi-currency is V2.
2. **Single user V1**: One user. Architecture supports future multi-user via `userId` FK on all tables.
3. **No real-time features**: No WebSockets, no live updates from external sources.
4. **Local file storage**: Attachments stored on server filesystem, not cloud storage (S3, etc.).
5. **Manual deployment**: No CI/CD pipeline in V1. Shell script for deployment.
6. **No bank integration**: No automatic bank transaction import. All entries are manual.
7. **No mobile app**: Web only (responsive). PWA in V2.
8. **No offline support V1**: Requires internet connection.
9. **BDT format**: Using international comma format (৳1,000.00) not Bangladeshi lakh format (৳1,00,000.00). Can be reconsidered.
10. **Soft delete for transactions only**: Other entities (accounts, categories) use active/inactive flag or restrict delete.
11. **No data encryption at rest**: MySQL default storage. Consider for V2 if needed.
12. **Session-based auth**: Using database sessions, not JWT. Better for server-rendered app.

---

## 7. Future Ideas
(Separate from committed requirements — these are ideas to evaluate later)

1. **Natural Language Input**: "500 food cash" → Amount: 500, Category: Food, Account: Cash, Type: Expense
2. **AI Spending Analysis**: Use AI to identify spending patterns, anomalies, and provide insights
3. **OCR Receipt Scanning**: Upload receipt photo → auto-extract amount, merchant, date
4. **Automatic Categorization**: ML model trained on user's categorization patterns
5. **Financial Forecasting**: Predict future expenses based on historical patterns
6. **Bank Statement Import**: Parse PDF/CSV bank statements
7. **Spending Anomaly Detection**: Alert when spending is unusually high
8. **Shared Expense Splitting**: Split expenses with others (family/roommates)
9. **Investment Tracking**: Track investment accounts and returns
10. **Multi-Currency with Live Rates**: Convert between currencies with live exchange rates
11. **Widget / Quick Entry**: Desktop widget or browser extension for fast entry
12. **Telegram Bot Integration**: Add transactions via Telegram messages
13. **Yearly Financial Report**: Auto-generated annual financial summary
14. **Goal-linked Transactions**: Automatically allocate savings to goals from income
15. **Custom Dashboard Widgets**: Let user customize dashboard layout

---

## 8. Change Log

### 2026-09-29
- **Project Created**: Documentation phase initiated
- **All 6 documentation files created**: `prd.md`, `architecture.md`, `rules.md`, `design.md`, `tasks.md`, `memory.md`
- **Technology stack decided**: Next.js + TypeScript + Tailwind + shadcn/ui + MySQL + Prisma + NextAuth.js
- **MVP scope defined**: Auth, Dashboard, Transactions, Accounts, Categories, Budgets, Basic Reports, CSV Export
- **Transaction model decided**: Unified model with EXPENSE/INCOME/TRANSFER types
- **Financial integrity rules established**: DECIMAL(15,2), Decimal.js, no floating point for money
- **Design system defined**: Color palette, typography, component tokens, layout system
- **Documentation consistency audit completed** — No critical issues found. Minor clarifications:
  - **Project Name**: "FinTrack" confirmed as the brand name (full: "FinTrack — Personal Expense Tracker")
  - **Number Format**: International comma format (৳1,000.00) chosen for V1
  - **Chart Library**: Recharts committed (not Chart.js) — React-native, SSR-friendly
  - **currentBalance**: Confirmed as a computed value, NOT a stored database field
  - **Settings Storage**: User preferences (currency, dateFormat, theme) stored on the User model — no separate Settings table needed

---

## Quick Reference

### File Map
| File | Purpose |
|------|---------|
| `prd.md` | What are we building? |
| `architecture.md` | How are we building it? |
| `design.md` | How should it look and behave? |
| `rules.md` | How must code be written? |
| `tasks.md` | What should be built next? |
| `memory.md` | What context must never be forgotten? |

### Current Status
- **Phase**: 0 — Documentation ✅
- **Next Phase**: 1 — Project Setup
- **MVP Target**: Phases 1-8, 11 (basic reports), 12 (CSV export), 14 (mobile responsive), 16 (security), 17 (deployment)
- **Blockers**: None

### Critical Rules (Never Forget)
1. Money is DECIMAL(15,2) in DB, Decimal.js in code — NEVER floating point
2. Transfers are NEVER income or expense
3. All queries MUST filter by `userId`
4. All server actions MUST validate input with Zod
5. Soft-deleted transactions excluded from ALL calculations
6. Do NOT implement features not in `prd.md`
7. Update `tasks.md` and `memory.md` after completing work
