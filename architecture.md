# Technical Architecture Document: Personal Expense Tracker

This document outlines the architecture, technology stack, database design, and technical decisions for the Personal Expense Tracker web application. The primary currency used throughout the system and documentation is Bangladeshi Taka (BDT / ৳).

---

## 1. System Architecture Overview

The application follows a modern monolithic architecture utilizing Next.js (App Router) to deliver a seamless, high-performance user experience while simplifying deployment and maintenance.

### System Diagram

```text
       Browser / Client (Desktop & Mobile)
                │
                │ HTTPS (TLS 1.3)
                ▼
┌───────────────────────────────────────────────┐
│           Next.js Application                 │
│                                               │
│  ┌─────────────────┐     ┌─────────────────┐  │
│  │ React Server    │     │ Client          │  │
│  │ Components (RSC)│◄───►│ Components (CSR)│  │
│  │ (UI Rendering)  │     │ (Interactivity) │  │
│  └─────────────────┘     └─────────────────┘  │
│           │                       │           │
│           │                       │           │
│           ▼                       ▼           │
│  ┌─────────────────┐     ┌─────────────────┐  │
│  │ Server Actions  │     │ API Routes      │  │
│  │ (Mutations)     │     │ (Data fetching, │  │
│  │                 │     │ file uploads)   │  │
│  └─────────────────┘     └─────────────────┘  │
│           │                       │           │
└───────────┼───────────────────────┼───────────┘
            │                       │
            │ Node.js Runtime       │
            ▼                       ▼
┌───────────────────────────────────────────────┐
│                  Prisma ORM                   │
└───────────────────────┬───────────────────────┘
                        │
      ┌─────────────────┴─────────────────┐
      ▼                                   ▼
┌──────────────┐                  ┌───────────────┐
│ MySQL 8.0+   │                  │ File System   │
│ (Relational  │                  │ (/uploads)    │
│  Database)   │                  │ (Attachments) │
└──────────────┘                  └───────────────┘
```

### Architecture Explanation

The application is structured as a monolithic Next.js app with Server-Side Rendering (SSR). 

- **Next.js (App Router):** The core orchestrator. We use React Server Components (RSC) to handle UI rendering on the server, which drastically reduces the client-side JavaScript bundle and improves Initial Page Load times and SEO (though less critical for a dashboard).
- **Server Actions:** Handle form submissions and data mutations (e.g., creating a transaction, updating a budget) directly on the server. This removes the need to build and maintain a separate REST or GraphQL API layer for standard CRUD operations.
- **API Routes:** Used specifically for edge cases where Server Actions are less suitable, such as streaming file uploads, exporting CSV/JSON backups, and webhooks.
- **Prisma ORM:** Acts as the bridge between the Node.js runtime and the database, providing strict type-safety across the entire stack.
- **MySQL Database:** Stores all relational data, ensuring ACID compliance which is absolutely critical for financial data integrity.
- **File System:** Securely stores uploaded receipts and attachments outside the public web root.

### Justification

This architecture is chosen for:
1. **Simplicity:** A single repository and a single deployment unit significantly reduce DevOps overhead.
2. **Performance:** RSCs and server-side data fetching eliminate loading spinners and waterfall network requests common in SPAs.
3. **End-to-end Type Safety:** Using TypeScript with Prisma ensures that a change in the database schema is instantly reflected as type errors in the UI components if not handled properly.
4. **Developer Experience (DX):** Full-stack TypeScript allows developers to context-switch less between client and server paradigms.

---

## 2. Technology Stack

| Category | Technology | Version | Justification |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js (App Router) | 14+ | Full-stack React framework with excellent performance, built-in routing, Server Components, and Server Actions. |
| **Language** | TypeScript | 5+ | Provides strict static typing, catching potential runtime errors at compile time, which is essential for financial logic. |
| **UI Library** | React | 18+ | De facto standard for building interactive UIs, leveraging concurrent features. |
| **Styling** | Tailwind CSS | 3+ | Utility-first CSS framework that allows rapid UI development without context-switching to separate CSS files. |
| **UI Components**| shadcn/ui | latest | Accessible, unstyled component primitives built on Radix UI. Provides full control over component code unlike traditional component libraries. |
| **ORM** | Prisma | 5+ | Offers a highly readable schema definition and generates a fully type-safe database client. Excellent migration system. |
| **Database** | MySQL | 8.0+ | Robust, ACID-compliant relational database. Crucial for ensuring financial transactions are processed reliably. |
| **Authentication**| NextAuth.js (Auth.js) | 5+ | Secure, flexible authentication library tailored for Next.js. Handles session management and encryption out of the box. |
| **Validation** | Zod | 3+ | Schema declaration and runtime validation library. Used on both client (forms) and server (actions/APIs) to ensure data integrity. |
| **Date Utils** | date-fns | 3+ | Lightweight, modular date manipulation library. Better bundle size than Moment.js. |
| **Charts** | Recharts (or Chart.js) | latest | Composable charting library built on React components. Great for visualizing income/expense trends. |
| **Forms** | React Hook Form | 7+ | Performant, flexible, and extensible forms with easy-to-use validation. Integrates perfectly with Zod. |
| **Icons** | Lucide React | latest | Clean, consistent, and customizable SVG icons that match shadcn/ui well. |
| **Image Proc.** | sharp | latest | High-performance image processing for generating standardized, optimized receipt thumbnails. |
| **Math / Money** | Decimal.js | latest | Arbitrary-precision decimal arithmetic. **Crucial:** prevents floating-point errors inherent in JavaScript numbers when calculating money (BDT). |

---

## 3. Folder Structure

The project follows a feature-grouped architecture within the `src` directory to maintain scalability and organization.

```text
expense-tracker/
├── prisma/
│   ├── schema.prisma           # Database schema definition
│   ├── migrations/             # SQL migration files
│   └── seed.ts                 # Database seeding script for default categories/accounts
├── public/
│   └── icons/                  # Static public assets
├── src/
│   ├── app/                    # Next.js App Router root
│   │   ├── (auth)/             # Route group for authentication
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (dashboard)/        # Route group for main application (requires auth)
│   │   │   ├── layout.tsx      # Dashboard shell (Sidebar, Header)
│   │   │   ├── page.tsx        # Main dashboard overview
│   │   │   ├── transactions/   # Transaction list and management
│   │   │   ├── accounts/       # Account management
│   │   │   ├── categories/     # Category management
│   │   │   ├── budgets/        # Budgeting tools
│   │   │   ├── goals/          # Savings goals
│   │   │   ├── recurring/      # Recurring transactions
│   │   │   ├── reports/        # Analytics and reporting
│   │   │   └── settings/       # User preferences
│   │   ├── api/                # Edge case API routes
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── upload/route.ts # Handling receipt uploads
│   │   │   └── export/route.ts # Handling data exports
│   │   ├── layout.tsx          # Root layout (Providers, Fonts)
│   │   └── globals.css         # Global styles and Tailwind directives
│   ├── components/             # Reusable UI components
│   │   ├── ui/                 # Generated shadcn/ui components (buttons, dialogs)
│   │   ├── layout/             # Layout specific components
│   │   │   ├── sidebar.tsx
│   │   │   ├── mobile-nav.tsx
│   │   │   ├── header.tsx
│   │   │   └── app-shell.tsx
│   │   ├── dashboard/          # Feature-specific components
│   │   ├── transactions/
│   │   ├── accounts/
│   │   ├── categories/
│   │   ├── budgets/
│   │   ├── goals/
│   │   ├── reports/
│   │   └── shared/             # Shared components (e.g., CurrencyDisplay, StatusBadge)
│   ├── lib/                    # Core configuration and utilities
│   │   ├── db.ts               # Prisma client singleton instance
│   │   ├── auth.ts             # NextAuth configuration and callbacks
│   │   ├── money.ts            # Decimal.js utilities and safe math functions
│   │   ├── validators.ts       # Shared Zod schemas for client/server
│   │   ├── constants.ts        # App-wide constants (enums, default values)
│   │   ├── utils.ts            # General helpers
│   │   └── format.ts           # Date and currency string formatters
│   ├── server/                 # Server-side business logic
│   │   ├── actions/            # Next.js Server Actions (Mutations)
│   │   │   ├── transaction.actions.ts
│   │   │   ├── account.actions.ts
│   │   │   ├── category.actions.ts
│   │   │   ├── budget.actions.ts
│   │   │   ├── goal.actions.ts
│   │   │   ├── recurring.actions.ts
│   │   │   └── settings.actions.ts
│   │   ├── queries/            # Reusable database queries (Data Fetching)
│   │   │   ├── transaction.queries.ts
│   │   │   ├── account.queries.ts
│   │   │   ├── dashboard.queries.ts
│   │   │   └── report.queries.ts
│   │   └── services/           # Complex business logic orchestrators
│   │       ├── balance.service.ts
│   │       ├── budget.service.ts
│   │       ├── recurring.service.ts
│   │       └── export.service.ts
│   ├── hooks/                  # Custom React Hooks
│   │   ├── use-transactions.ts
│   │   ├── use-accounts.ts
│   │   └── ...
│   ├── types/                  # TypeScript interface/type definitions
│   │   ├── index.ts
│   │   ├── transaction.ts
│   │   ├── account.ts
│   │   └── ...
│   └── utils/                  # Client-side utility functions
│       └── cn.ts               # Tailwind class merge utility (clsx + twMerge)
├── uploads/                    # Local storage for receipts (must be gitignored)
├── .env                        # Environment variables (secret)
├── .env.example                # Template for environment variables
├── next.config.js              # Next.js configuration
├── tailwind.config.ts          # Tailwind styling configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies and scripts
└── README.md                   # Project documentation
```

### Rationale for Structure
- **Domain-Driven Grouping:** Inside `server/actions`, `server/queries`, and `components/`, files are grouped by domain (transactions, accounts, etc.). This makes finding related code much easier as the app grows.
- **Strict Client/Server Separation:** Placing mutations in `server/actions` and database reads in `server/queries` ensures that secure, server-only code doesn't accidentally leak to the client bundle.
- **Shared Lib:** The `lib/validators.ts` file acts as the single source of truth for both client form validation and server payload validation.

---

## 4. Database Architecture

The database is built on MySQL using Prisma. Consistency and data integrity are paramount.

### ER Diagram

```mermaid
erDiagram
    USER ||--o{ ACCOUNT : owns
    USER ||--o{ CATEGORY : creates
    USER ||--o{ TRANSACTION : records
    USER ||--o{ BUDGET : sets
    USER ||--o{ RECURRING_TRANSACTION : schedules
    USER ||--o{ SAVINGS_GOAL : targets
    USER ||--o{ TAG : manages
    USER ||--o{ NOTIFICATION : receives

    ACCOUNT ||--o{ TRANSACTION : "source (expense/transfer) or dest (income)"
    ACCOUNT ||--o{ TRANSACTION : "dest (transfer only)"
    
    CATEGORY ||--o{ CATEGORY : "parent/child"
    CATEGORY ||--o{ TRANSACTION : categorizes
    CATEGORY ||--o{ BUDGET : tracks
    CATEGORY ||--o{ RECURRING_TRANSACTION : categorizes

    TRANSACTION ||--o{ ATTACHMENT : contains
    TRANSACTION }o--o{ TAG : has
    TRANSACTION ||--o| RECURRING_TRANSACTION : generated_from

    SAVINGS_GOAL ||--o{ GOAL_TRANSACTION : contains
```

### Prisma Schema Definitions

> **Note:** All money values are stored as `Decimal(15,2)` to guarantee precision. We do not use floats.

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

// -----------------------------------------------------------------------------
// 4.1 Entity: User
// -----------------------------------------------------------------------------
model User {
  id                 String   @id @default(cuid())
  name               String
  email              String   @unique
  passwordHash       String
  defaultCurrency    String   @default("BDT")
  defaultAccountId   String?
  dateFormat         String   @default("DD/MM/YYYY")
  theme              String   @default("system")
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  accounts           Account[]
  categories         Category[]
  transactions       Transaction[]
  budgets            Budget[]
  recurringTxs       RecurringTransaction[]
  tags               Tag[]
  goals              SavingsGoal[]
  notifications      Notification[]
}

// -----------------------------------------------------------------------------
// 4.2 Entity: Account
// -----------------------------------------------------------------------------
enum AccountType {
  CASH
  BANK
  MOBILE_BANKING
  CREDIT_CARD
  DIGITAL_WALLET
  OTHER
}

model Account {
  id               String      @id @default(cuid())
  userId           String
  name             String
  type             AccountType
  icon             String?
  openingBalance   Decimal     @db.Decimal(15, 2)
  currency         String      @default("BDT")
  isActive         Boolean     @default(true)
  sortOrder        Int         @default(0)
  createdAt        DateTime    @default(now())
  updatedAt        DateTime    @updatedAt

  user             User          @relation(fields: [userId], references: [id], onDelete: Restrict)
  sourceTxs        Transaction[] @relation("SourceAccount")
  destTxs          Transaction[] @relation("DestAccount")
  recurringTxs     RecurringTransaction[]

  @@index([userId])
}

// -----------------------------------------------------------------------------
// 4.3 Entity: Category
// -----------------------------------------------------------------------------
enum CategoryType {
  EXPENSE
  INCOME
}

model Category {
  id               String       @id @default(cuid())
  userId           String?      // Null means system default
  name             String
  type             CategoryType
  icon             String?
  color            String?
  parentId         String?
  isDefault        Boolean      @default(false)
  isActive         Boolean      @default(true)
  sortOrder        Int          @default(0)
  createdAt        DateTime     @default(now())
  updatedAt        DateTime     @updatedAt

  user             User?        @relation(fields: [userId], references: [id], onDelete: Cascade)
  parent           Category?    @relation("Subcategories", fields: [parentId], references: [id], onDelete: Restrict)
  subcategories    Category[]   @relation("Subcategories")
  transactions     Transaction[] @relation("Category")
  subTransactions  Transaction[] @relation("Subcategory")
  budgets          Budget[]
  recurringTxs     RecurringTransaction[] @relation("RecCategory")
  recSubTxs        RecurringTransaction[] @relation("RecSubcategory")

  @@index([userId, type])
}

// -----------------------------------------------------------------------------
// 4.4 Entity: Transaction (UNIFIED MODEL - CRITICAL)
// -----------------------------------------------------------------------------
enum TransactionType {
  EXPENSE
  INCOME
  TRANSFER
}

model Transaction {
  id                     String           @id @default(cuid())
  userId                 String
  type                   TransactionType
  amount                 Decimal          @db.Decimal(15, 2) // ALWAYS POSITIVE
  
  // Source account for expenses/transfers, destination for income
  accountId              String
  
  // Destination account for transfers ONLY
  toAccountId            String?
  
  // Null for transfers
  categoryId             String?
  subcategoryId          String?
  
  date                   DateTime
  merchant               String?
  paymentMethod          String?
  note                   String?          @db.Text
  
  isRecurring            Boolean          @default(false)
  recurringTransactionId String?
  
  isDeleted              Boolean          @default(false)
  deletedAt              DateTime?
  
  createdAt              DateTime         @default(now())
  updatedAt              DateTime         @updatedAt

  user                   User             @relation(fields: [userId], references: [id], onDelete: Restrict)
  account                Account          @relation("SourceAccount", fields: [accountId], references: [id], onDelete: Restrict)
  toAccount              Account?         @relation("DestAccount", fields: [toAccountId], references: [id], onDelete: Restrict)
  category               Category?        @relation("Category", fields: [categoryId], references: [id], onDelete: Restrict)
  subcategory            Category?        @relation("Subcategory", fields: [subcategoryId], references: [id], onDelete: Restrict)
  recurringTx            RecurringTransaction? @relation(fields: [recurringTransactionId], references: [id], onDelete: SetNull)
  
  tags                   TransactionTag[]
  attachments            Attachment[]

  @@index([userId, date])
  @@index([userId, type])
  @@index([userId, categoryId])
  @@index([userId, accountId])
  @@index([userId, isDeleted])
}

// -----------------------------------------------------------------------------
// 4.5 & 4.6 Entity: Tag and TransactionTag (Join Table)
// -----------------------------------------------------------------------------
model Tag {
  id           String           @id @default(cuid())
  userId       String
  name         String
  createdAt    DateTime         @default(now())

  user         User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  transactions TransactionTag[]

  @@unique([userId, name])
  @@index([userId, name])
}

model TransactionTag {
  transactionId String
  tagId         String

  transaction   Transaction @relation(fields: [transactionId], references: [id], onDelete: Cascade)
  tag           Tag         @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([transactionId, tagId])
}

// -----------------------------------------------------------------------------
// 4.7 Entity: Attachment
// -----------------------------------------------------------------------------
model Attachment {
  id             String      @id @default(cuid())
  transactionId  String
  fileName       String
  originalName   String
  mimeType       String
  size           Int
  path           String
  createdAt      DateTime    @default(now())

  transaction    Transaction @relation(fields: [transactionId], references: [id], onDelete: Cascade)
}

// -----------------------------------------------------------------------------
// 4.8 Entity: Budget
// -----------------------------------------------------------------------------
model Budget {
  id         String   @id @default(cuid())
  userId     String
  categoryId String
  amount     Decimal  @db.Decimal(15, 2)
  month      Int      // 1-12
  year       Int
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  category   Category @relation(fields: [categoryId], references: [id], onDelete: Restrict)

  @@unique([userId, categoryId, month, year])
  @@index([userId, month, year])
}

// -----------------------------------------------------------------------------
// 4.9 Entity: RecurringTransaction
// -----------------------------------------------------------------------------
enum Frequency {
  DAILY
  WEEKLY
  BIWEEKLY
  MONTHLY
  QUARTERLY
  YEARLY
  CUSTOM
}

model RecurringTransaction {
  id                 String       @id @default(cuid())
  userId             String
  type               TransactionType
  amount             Decimal      @db.Decimal(15, 2)
  accountId          String
  categoryId         String?
  subcategoryId      String?
  merchant           String?
  note               String?      @db.Text
  frequency          Frequency
  interval           Int          @default(1) // For custom: every N days
  startDate          DateTime
  endDate            DateTime?
  nextDueDate        DateTime
  lastProcessedDate  DateTime?
  isActive           Boolean      @default(true)
  createdAt          DateTime     @default(now())
  updatedAt          DateTime     @updatedAt

  user               User         @relation(fields: [userId], references: [id], onDelete: Restrict)
  account            Account      @relation(fields: [accountId], references: [id], onDelete: Restrict)
  category           Category?    @relation("RecCategory", fields: [categoryId], references: [id], onDelete: Restrict)
  subcategory        Category?    @relation("RecSubcategory", fields: [subcategoryId], references: [id], onDelete: Restrict)
  transactions       Transaction[]

  @@index([userId, nextDueDate])
}

// -----------------------------------------------------------------------------
// 4.10 & 4.11 Entity: SavingsGoal & GoalTransaction
// -----------------------------------------------------------------------------
model SavingsGoal {
  id             String    @id @default(cuid())
  userId         String
  name           String
  targetAmount   Decimal   @db.Decimal(15, 2)
  currentAmount  Decimal   @db.Decimal(15, 2) @default(0)
  targetDate     DateTime?
  icon           String?
  color          String?
  isCompleted    Boolean   @default(false)
  completedAt    DateTime?
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  user           User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  transactions   GoalTransaction[]
}

model GoalTransaction {
  id        String      @id @default(cuid())
  goalId    String
  amount    Decimal     @db.Decimal(15, 2) // positive=deposit, negative=withdrawal
  note      String?
  date      DateTime
  createdAt DateTime    @default(now())

  goal      SavingsGoal @relation(fields: [goalId], references: [id], onDelete: Cascade)
}

// -----------------------------------------------------------------------------
// 4.12 Entity: Notification (V1.1)
// -----------------------------------------------------------------------------
enum NotificationType {
  BUDGET_EXCEEDED
  BUDGET_WARNING
  RECURRING_UPCOMING
  GOAL_MILESTONE
}

model Notification {
  id        String           @id @default(cuid())
  userId    String
  type      NotificationType
  title     String
  message   String
  isRead    Boolean          @default(false)
  data      Json?            // Extra context payload
  createdAt DateTime         @default(now())

  user      User             @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### Important Database Rules
- **Decimal Types:** All monetary values are strictly `DECIMAL(15,2)`.
- **Soft Deletion:** Transactions utilize an `isDeleted` flag. Financial records should rarely be hard-deleted to prevent audit gaps.
- **Hard Deletion:** Other non-financial entities (Tags, Goals) can cascade delete, provided there is no orphaned financial data.
- **Timezones:** All timestamps (`createdAt`, `updatedAt`, `date`) are stored in UTC and converted to the user's local timezone on the client.
- **Primary Keys:** Uses CUIDs to prevent ID guessing and for better collision resistance in distributed scenarios.
- **Foreign Keys:** Use `RESTRICT` for critical financial linkages (cannot delete an account if transactions exist) and `CASCADE` for join tables or user deletions.

---

## 5. Transaction Model Deep Dive

The core of the system is the **Unified Transaction Model**. Instead of having separate tables for Incomes, Expenses, and Transfers, a single `Transaction` table handles all types cleanly via rules.

### How the Unified Model Works
1. **EXPENSE:** Money leaving the system.
   - `amount`: Strictly positive value.
   - `accountId`: The source account from which money is deducted.
   - `categoryId`: Required.
2. **INCOME:** Money entering the system.
   - `amount`: Strictly positive value.
   - `accountId`: The destination account receiving the money.
   - `categoryId`: Required.
3. **TRANSFER:** Money moving between internal accounts.
   - `amount`: Strictly positive value.
   - `accountId`: The source account.
   - `toAccountId`: The destination account.
   - `categoryId`: `NULL` (Transfers are not categorized as income/expense).

### Balance Calculation Logic

The real-time balance of an account is always calculable from the source of truth (opening balance + transaction history).

```sql
Account Balance = 
    openingBalance
  + SUM(amount) WHERE type = 'INCOME' AND accountId = this
  - SUM(amount) WHERE type = 'EXPENSE' AND accountId = this
  + SUM(amount) WHERE type = 'TRANSFER' AND toAccountId = this
  - SUM(amount) WHERE type = 'TRANSFER' AND accountId = this
```
*Note: In code, this should exclude transactions where `isDeleted = true`.*

### Report Calculations
- **Total Income** = `SUM(amount)` WHERE `type = 'INCOME'`
- **Total Expense** = `SUM(amount)` WHERE `type = 'EXPENSE'`
- **Net Cash Flow** = `Total Income - Total Expense`
- **Savings Rate** = `(Net Cash Flow / Total Income) × 100`

### Transfer Rules
Transfers represent a shift of liquidity, not a change in net worth.
- NEVER counted in income/expense reports.
- Do NOT affect net cash flow.
- DO affect individual account balances (e.g., Cash goes down, Bank goes up).
- Total balance across the entire portfolio remains unchanged.

---

## 6. Financial Integrity

### Money Storage & Arithmetic
- **Storage:** MySQL `DECIMAL(15,2)` ensures exact decimal representation without binary floating-point approximation.
- **Logic Level:** In TypeScript, the `Decimal.js` library is strictly enforced for all math.
- **Rule:** NEVER use the native JavaScript `Number` type or `parseFloat` for mathematical operations on money.
- **Presentation:** Formatting to strings (e.g., `৳1,000.00`) occurs *only* at the UI layer using `Intl.NumberFormat`.

### Currency Handling
- **V1:** System defaults to single currency: **Bangladeshi Taka (BDT / ৳)**.
- **Extensibility:** The `currency` field is stored per account. Future multi-currency support will rely on this field plus a daily exchange rate table.
- **Input:** UI accepts plain numbers (`1500.50`). Formatting is applied `onBlur` for better UX.

### Rounding Rules
- Use `ROUND_HALF_UP` strategy.
- Rounding occurs at the point of storage generation, avoiding cumulative drift during intermediate calculations.

### Negative Values
- Transaction `amount` fields are ALWAYS positive. The `type` enum defines the mathematical vector (addition or subtraction).
- The exception is `GoalTransaction`, where a withdrawal from a savings goal is represented as a negative amount.

### Deleted Transactions
- Setting `isDeleted = true` removes the transaction from all balance, budget, and report calculations.
- Soft deletion acts as a safety net against accidental data loss and allows for an "Undo" feature.
- Optionally (V1.1), a cron job can permanently purge transactions where `deletedAt < 30 days ago`.

### Balance Integrity
Account balances must be entirely reconcilable. If an aggregate query of transactions plus the opening balance does not match the cached current balance, it constitutes a critical bug. We rely on the ledger as the ultimate source of truth.

---

## 7. Authentication Architecture

- **Provider:** NextAuth.js (Auth.js v5) configured with the `Credentials` provider.
- **Strategy:** Standard Email + Password.
- **Session:** Sessions are stateful, stored in the MySQL database, providing the ability to revoke sessions securely.
- **Tokens:** Passed via secure, HTTP-only, SameSite cookies.
- **Middleware:** Next.js middleware (`middleware.ts`) protects all routes under `/(dashboard)` and forces redirects for unauthenticated users. `/login` and `/register` are excluded.
- **Security:** Passwords are hashed using `bcrypt` with a minimum of 12 salt rounds.

---

## 8. Server Actions & API Design

### Server Actions (Primary Mutation Strategy)
Server actions are utilized to avoid creating boilerplate API routes for standard form submissions.

```typescript
// Example Action Signature
export async function createTransaction(data: CreateTransactionInput): Promise<ActionResult<Transaction>> {
  // 1. Authenticate user
  // 2. Validate data with Zod
  // 3. Perform database transaction
  // 4. Revalidate Next.js cache paths
  // 5. Return success/error object
}
```

### API Routes (Specialized Use Cases)
Standard Next.js Route Handlers (`app/api/`) are reserved for tasks unsuitable for Server Actions:
- `POST /api/upload`: Handling `multipart/form-data` for receipt uploads.
- `GET /api/export/csv`: Streaming large database queries into a downloadable CSV file.
- `GET /api/export/json`: Providing full account JSON backups.
- `POST /api/import/csv`: Processing bulk uploads.

### Universal Response Format
All actions and APIs follow a predictable return structure:
```typescript
type ActionResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }
```

### Validation
- **Zod** is the single source of truth.
- Client uses `zodResolver` with React Hook Form for immediate UX feedback.
- Server re-validates the exact same schema to ensure security against bypassed client validation.

---

## 9. Security Architecture

- **Authentication:** Enforced via NextAuth middleware.
- **Authorization:** Multi-tenant isolation. Every database query implicitly includes a `where: { userId: session.user.id }` clause.
- **CSRF:** Automatically mitigated by Next.js Server Actions.
- **Input Validation:** Strict Zod schemas prevent malformed or malicious payloads.
- **SQL Injection:** Impossible by default as Prisma utilizes prepared parameterized queries. Avoid `Prisma.$queryRaw` unless strictly parameterized.
- **XSS:** React automatically escapes string variables in JSX. We will enforce strict Content Security Policy (CSP) headers in `next.config.js`.
- **File Upload Security:**
  - Validate MIME types (only images/pdfs).
  - Verify file extensions.
  - Strict size limits (Max 5MB).
  - Store files outside the `public` directory to prevent direct execution. Serve them via a protected API route.
- **Rate Limiting:** Implemented on authentication routes to prevent brute-force attacks (e.g., 5 attempts / minute / IP).
- **HTTPS:** Enforced at the Nginx reverse proxy level.

---

## 10. Performance Architecture

- **Database Indexes:** Critical for query speed. Indexes are placed on `[userId, date]`, `[userId, type]`, `[userId, categoryId]`, etc.
- **Pagination:** Implement cursor-based pagination for the transactions list to maintain performance as user data grows indefinitely.
- **React Server Components (RSC):** Dashboards and reports are pre-rendered on the server, sending HTML rather than large JS bundles to the client.
- **Lazy Loading:** Libraries like Recharts are dynamically imported via `next/dynamic` so they only load when the user views a report.
- **Image Optimization:** Uploaded receipts are immediately passed through `sharp` to generate lightweight, 300px wide thumbnails for list views.
- **Caching:** Next.js Data Cache is used sparingly for relatively static user data (e.g., categories list), with targeted `revalidatePath` calls when mutations occur.
- **Query Optimization:** Prisma `select` statements are used to fetch only required columns, preventing over-fetching. Avoid N+1 query problems by using Prisma's `include` appropriately.

---

## 11. Deployment Architecture

- **Target Host:** Linux VPS (e.g., Hostinger).
- **Runtime Environment:** Node.js 18+ LTS.
- **Process Manager:** PM2 ensures the Node app runs continuously and restarts on crash.
- **Reverse Proxy:** Nginx routes external HTTP/HTTPS traffic to the internal PM2 port (e.g., 3000).
- **SSL/TLS:** Let's Encrypt managed automatically via Certbot.
- **Database:** MySQL 8.0 running locally on the same VPS (reduces latency for V1).
- **File Storage:** Local filesystem storage configured at `/var/uploads/expense-tracker/`.
- **Environment:** Secure `.env` file maintained strictly on the server.
- **Build Process:**
  ```bash
  npm ci
  npx prisma generate
  npx prisma migrate deploy
  npm run build
  pm2 restart expense-tracker
  ```

---

## 12. Backup & Recovery

Because financial data is highly sensitive, strict backup routines are required.

- **Database Backups:** A cron job runs `mysqldump` daily.
- **Attachment Backups:** Receipts are archived using `tar` or synced via `rsync`.
- **Storage Locations:** Backups are saved on the server and ideally shipped offsite (e.g., AWS S3 or a separate cloud storage volume).
- **Retention Policy:** Keep 30 days of daily backups, and 12 months of monthly backups.
- **Recovery Procedure:** Documented manual process to import a SQL dump and extract the attachments archive.
- **User-initiated Backups:** The app provides a "Download Data" button allowing users to download their entire ledger as a JSON/CSV file.

---

## 13. Error Handling Architecture

- **Server Actions:** Wrapped in `try/catch` blocks. Known errors return the standardized `ActionResult` with `success: false`.
- **API Routes:** Return appropriate HTTP status codes (400 Bad Request, 401 Unauthorized, 500 Internal Server Error) with JSON error details.
- **Client Components:** Utilize React Error Boundaries for localized fallback UIs (e.g., if a chart fails to render, the rest of the dashboard remains usable).
- **Global Handling:** Next.js `error.tsx` catches unhandled page-level exceptions.
- **Database Transactions:** Complex operations involving multiple tables (e.g., deleting a category and reassigning its transactions) are wrapped in Prisma `$transaction` blocks to ensure automatic rollback upon failure.

---

## 14. Environment Variables

The application requires the following environment variables. A `.env.example` file must be maintained in the repository.

```env
# Node Environment
NODE_ENV="development" # or "production"

# Database connection string
DATABASE_URL="mysql://user:password@localhost:3306/expense_tracker"

# NextAuth Configuration
# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET="<random-32-char-string>"
NEXTAUTH_URL="http://localhost:3000"

# Application Specific
UPLOAD_DIR="./uploads"          # In production: /var/uploads/expense-tracker
MAX_UPLOAD_SIZE="5242880"       # 5MB in bytes
DEFAULT_CURRENCY="BDT"
```

---
*End of Document*
