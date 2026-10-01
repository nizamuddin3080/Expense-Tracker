# Development Roadmap & Task Checklist

This document is the actionable development checklist for the Personal Expense Tracker web application. It is organized into chronological phases. 

**Stack:** Next.js 14+, TypeScript, Tailwind CSS, shadcn/ui, MySQL, Prisma, NextAuth.js.
**Currency:** All examples and defaults use BDT (৳).

## Priority Levels
- **P0** = Critical (must have for MVP)
- **P1** = High (important for MVP)
- **P2** = Medium (nice to have, can defer)
- **P3** = Low (future enhancement)

---

## Phase 0 — Documentation ✅
- [x] Create prd.md — P0
  - Dependencies: None
  - AC: Product requirements are clearly defined and documented.
- [x] Create architecture.md — P0
  - Dependencies: PRD
  - AC: Tech stack, data models, and system architecture are documented.
- [x] Create rules.md — P0
  - Dependencies: Architecture
  - AC: Coding standards, naming conventions, and project rules are defined.
- [x] Create design.md — P0
  - Dependencies: PRD
  - AC: UI/UX guidelines, color palettes, and component library decisions are documented.
- [x] Create tasks.md — P0
  - Dependencies: All above docs
  - AC: This actionable checklist is created with all phases.
- [x] Create memory.md — P0
  - Dependencies: None
  - AC: AI context memory file is initialized.
- [x] Documentation consistency audit — P0
  - Dependencies: All docs
  - AC: All markdown files cross-reference correctly and use consistent terminology.

## Phase 1 — Project Setup
- [x] Initialize Next.js 14+ project with TypeScript — P0
  - Dependencies: None
  - AC: Project runs with `npm run dev` on localhost. TypeScript strict mode is enabled in `tsconfig.json`. App router is used.
- [x] Configure Tailwind CSS — P0
  - Dependencies: Project init
  - AC: Tailwind directives are in `globals.css`. Configuration in `tailwind.config.ts` includes custom theme colors defined in design.md. Tailwind classes apply correctly to a test page.
- [x] Install and configure shadcn/ui — P0
  - Dependencies: Tailwind
  - AC: `components.json` is configured. At least one shadcn component (e.g., Button) is installed and renders correctly on the page.
- [x] Set up Prisma with MySQL connection — P0
  - Dependencies: Project init, MySQL database created
  - AC: `.env` has valid `DATABASE_URL`. `schema.prisma` is initialized. `npx prisma db push` succeeds. Prisma client generates without errors.
- [x] Configure environment variables — P0
  - Dependencies: Project init
  - AC: `.env.example` exists with all required variables documented (DB URL, Auth secret, etc.).
- [x] Set up project folder structure — P0
  - Dependencies: Project init
  - AC: All directories (e.g., `app/`, `components/`, `lib/`, `actions/`, `types/`) from architecture.md exist and are correctly structured.
- [x] Configure ESLint and Prettier — P1
  - Dependencies: Project init
  - AC: `.eslintrc.json` and `.prettierrc` are configured. Linting runs without errors via `npm run lint`. Formatting works via `npm run format`.
- [x] Set up Git repository with .gitignore — P0
  - Dependencies: Project init
  - AC: `.gitignore` covers `node_modules`, `.env`, `uploads`, `.next`, coverage reports. Initial commit is pushed.
- [x] Create base layout (app shell) — P0
  - Dependencies: Tailwind, shadcn
  - AC: App shell with a responsive sidebar (desktop) and bottom nav (mobile) renders. Uses shadcn components where applicable.
- [x] Implement dark/light theme toggle — P1
  - Dependencies: Tailwind, Layout
  - AC: `next-themes` is installed. Theme toggle button works, persists choice across page loads in local storage, and respects OS system preference initially.
- [x] Set up utility functions (cn, formatCurrency, formatDate) — P0
  - Dependencies: Project init
  - AC: `lib/utils.ts` contains `cn` for Tailwind. Currency formatter defaults to BDT (৳) and formats correctly. Date formatter uses `date-fns` or similar and returns standard format.
- [x] Install and configure Decimal.js for money operations — P0
  - Dependencies: Project init
  - AC: `decimal.js` is installed. Money utility functions use `Decimal` class to avoid JS floating-point issues, never native floats.
- [x] Create shared types (TypeScript interfaces) — P0
  - Dependencies: Project init
  - AC: Types defined for Transaction, Account, Category, Budget in `types/index.ts`. Enums match database structures.

## Phase 2 — Database
- [x] Design and create complete Prisma schema — P0
  - Dependencies: Phase 1
  - AC: Schema exactly matches data models in architecture.md. All entities (User, Account, Category, Transaction, etc.) are defined with correct 1:N and N:M relations.
- [x] Create initial migration — P0
  - Dependencies: Prisma schema
  - AC: `npx prisma migrate dev --name init` applies successfully. All tables and foreign keys are created in the MySQL database.
- [x] Create seed file with default categories — P0
  - Dependencies: Migration
  - AC: `prisma/seed.ts` is created. Running `npm run seed` creates default expense and income categories with appropriate icons and types. Seed script is idempotent (can run multiple times safely).
- [x] Create Prisma client singleton — P0
  - Dependencies: Prisma setup
  - AC: `lib/prisma.ts` exports a single Prisma instance, preventing connection exhaustion during hot reloading in development.
- [x] Verify all indexes and constraints — P1
  - Dependencies: Migration
  - AC: All requested indexes (e.g., `@@index([userId, date])`) from architecture.md are present in Prisma schema. Database engine enforces these constraints.
- [ ] Test cascade and restrict behaviors — P1
  - Dependencies: Migration
  - AC: Deleting an Account with related Transactions fails (Restrict). Deleting a User cascades and deletes their Accounts and Transactions.

## Phase 3 — Authentication
- [x] Install and configure NextAuth.js (Auth.js) — P0
  - Dependencies: Database
  - AC: `next-auth` installed. `app/api/auth/[...nextauth]/route.ts` is configured with a credentials provider. PrismaAdapter is set up with MySQL session store.
- [x] Create registration page (/register) — P0
  - Dependencies: NextAuth
  - AC: Form allows user to register with name, email, password. Zod validation on client. Server action hashes password with `bcryptjs` (12 rounds) and creates User record. Validation errors shown inline.
- [x] Create login page (/login) — P0
  - Dependencies: NextAuth
  - AC: Form allows login with email/password. Invalid credentials show generic error. Successful login redirects to `/dashboard`.
- [x] Implement auth middleware (protect routes) — P0
  - Dependencies: NextAuth
  - AC: `middleware.ts` configured. Unauthenticated users accessing protected routes (e.g., `/dashboard`) are redirected to `/login`. Authenticated users accessing `/login` are redirected to `/dashboard`.
- [x] Create logout functionality — P0
  - Dependencies: NextAuth
  - AC: Logout button calls `signOut()`. User session is destroyed, and user is redirected to `/login`.
- [ ] Implement rate limiting on auth endpoints — P2
  - Dependencies: Auth setup
  - AC: Implement basic rate limiting (e.g., using Upstash or memory). Max 5 login attempts per minute per IP. Returns 429 status code after limit reached.
- [x] Create user settings/profile management — P1
  - Dependencies: Auth, Settings page
  - AC: Profile page allows user to update name and email. Password change form requires current password to proceed.

## Phase 4 — Accounts
- [x] Create account Zod validation schemas — P0
  - Dependencies: Phase 2
  - AC: `schemas/account.ts` defines and exports Zod schema validating name (1-100 chars), type (enum), opening balance (decimal string), currency.
- [x] Create account server actions (CRUD) — P0
  - Dependencies: Schemas, Auth
  - AC: Server actions for Create, Read, Update, Deactivate accounts. All queries are strictly scoped to the authenticated `userId`.
- [x] Create account queries — P0
  - Dependencies: Prisma client
  - AC: Functions to list all accounts, get account by ID, and get account with calculated current balance based on transactions.
- [x] Build account list page (/accounts) — P0
  - Dependencies: Queries, Actions
  - AC: Page shows all accounts as cards displaying name, type, and current balance. Total aggregate balance is shown at the top. Includes loading skeletons and empty states.
- [x] Build create account form/modal — P0
  - Dependencies: Account list page
  - AC: Form component with fields for name, type (Cash, Bank, Mobile Money), opening balance. Validation errors display inline. Success redirects to list or closes modal.
- [ ] Build account detail page (/accounts/[id]) — P1
  - Dependencies: Account page
  - AC: Page shows detailed account info, current calculated balance, and a paginated list of transaction history specifically for this account.
- [ ] Build edit account form — P1
  - Dependencies: Account detail
  - AC: Form allows editing name and type. The opening balance cannot be edited if transactions already exist. Includes a deactivate/soft-delete option.
- [x] Implement balance calculation service — P0
  - Dependencies: Transaction model
  - AC: Utility function: Balance = opening + income - expense + transfersIn - transfersOut. Excludes soft-deleted transactions. Uses Decimal.js for precise math.

## Phase 5 — Transactions
- [x] Create transaction Zod validation schemas — P0
  - Dependencies: Phase 2
  - AC: Validates type (Expense, Income, Transfer), amount (positive decimal string), accountId, categoryId (required unless transfer), toAccountId (required if transfer), date, and optional note.
- [x] Create transaction server actions — P0
  - Dependencies: Schemas, Auth
  - AC: Actions to create, update, and soft-delete transactions. A transfer correctly creates associated logic. Database transactions (`prisma.$transaction`) are used to ensure atomicity.
- [x] Create transaction queries — P0
  - Dependencies: Prisma client
  - AC: Query to list transactions with pagination. Accepts filters: type, account, category, date range, amount range, merchant, tags, search text. Excludes soft-deleted records.
- [x] Build transaction list page (/transactions) — P0
  - Dependencies: Queries
  - AC: Paginated list view. Renders as a data table on desktop, and stacked cards on mobile. Includes type filter tabs, date range picker, and text search input. Shows loading/empty states.
- [x] Build transaction creation form — P0
  - Dependencies: Actions, Categories, Accounts
  - AC: Segmented control for Type (Expense/Income/Transfer). Amount field auto-focuses. Category dropdown includes search/filter. Submits successfully and clears in < 10 seconds.
- [ ] Build quick-add transaction modal — P0
  - Dependencies: Transaction form
  - AC: Modal/slide-over containing the transaction form. Accessible from a Floating Action Button (FAB) or keyboard shortcut globally.
- [ ] Build transaction detail/edit page — P1
  - Dependencies: Transaction form
  - AC: View mode for transaction details. Edit mode pre-populates the form. Delete button includes a confirmation dialog. Shows creation/update timestamps.
- [ ] Implement transaction search — P0
  - Dependencies: Transaction list
  - AC: Search input filters in real-time across merchant, note, and amount fields. Input is debounced (300ms) to prevent excessive DB calls. Combinable with other filters.
- [ ] Implement advanced filters — P1
  - Dependencies: Transaction list
  - AC: Expandable filter section: specific date range, select account, select category, min/max amount, tags, and has attachment checkbox.
- [ ] Implement transaction sorting — P1
  - Dependencies: Transaction list
  - AC: Table headers are clickable to sort by date (default desc), amount, and category. Toggles asc/desc.
- [ ] Implement bulk actions — P2
  - Dependencies: Transaction list
  - AC: Checkboxes added to list rows. Bulk select capabilities to delete multiple transactions (with confirmation) or bulk update their category.
- [ ] Implement duplicate transaction — P2
  - Dependencies: Transaction detail
  - AC: "Duplicate" button on a transaction opens the create form pre-filled with the same data, but date defaults to today.

## Phase 6 — Categories
- [x] Create category Zod validation schemas — P0
  - Dependencies: Phase 2
  - AC: Validates name (string), type (expense/income), icon (string identifier), optional color code, optional parentId.
- [x] Create category server actions (CRUD) — P0
  - Dependencies: Schemas
  - AC: Actions to create, update, delete categories. Deletion is blocked if transactions are linked to the category. Actions are scoped to the authenticated user.
- [x] Create category queries — P0
  - Dependencies: Prisma client
  - AC: Fetch lists by type (expense/income), structure hierarchically with subcategories, and include relation counts (number of transactions).
- [x] Seed default categories — P0
  - Dependencies: Seed file
  - AC: Ensure default expense and income categories are populated for new users upon registration, copying from global defaults. Include default icons.
- [x] Build category management page (/categories) — P0
  - Dependencies: Queries, Actions
  - AC: UI with Tabs for Expense/Income. Lists categories showing icons, names, and subcategory counts. Includes Add/Edit/Delete action buttons.
- [x] Build create/edit category form — P0
  - Dependencies: Category page
  - AC: Form fields for Name, Type, Icon Picker component, optional Hex color picker, optional Parent category dropdown. Inline Zod validation.
- [ ] Build subcategory management — P1
  - Dependencies: Category page
  - AC: Category list is expandable (accordion or tree view) to show subcategories. Allows adding a subcategory directly under a specific parent.
- [ ] Implement category reordering — P2
  - Dependencies: Category page
  - AC: Use drag-and-drop (`dnd-kit`) or up/down arrow buttons to reorder categories. New order index persists in the database.

## Phase 7 — Dashboard
- [x] Create dashboard queries (aggregations) — P0
  - Dependencies: Transactions, Accounts
  - AC: Optimized Prisma queries to calculate: Total balance across all accounts, current month's income, current month's expense, net cash flow. Excludes transfers from income/expense calculations.
- [x] Build stat cards row — P0
  - Dependencies: Dashboard queries
  - AC: Top of dashboard renders 4 metric cards: Total Balance, Monthly Income, Monthly Expense, Net Cash Flow. Values format properly in BDT. Responsive grid layout.
- [x] Build secondary metrics — P1
  - Dependencies: Dashboard queries
  - AC: Additional UI to show savings rate (%), today's spending total, and a high-level budget usage summary.
- [x] Build spending by category chart — P0
  - Dependencies: Dashboard queries, Chart library
  - AC: Use Recharts or shadcn/ui charts to render a Donut/Pie chart of current month's expenses grouped by category. Includes an interactive legend.
- [x] Build monthly trend chart — P1
  - Dependencies: Dashboard queries, Chart library
  - AC: Bar chart comparing total income vs total expense per month for the last 6 months. Responsive and clearly labeled.
- [x] Build recent transactions list — P0
  - Dependencies: Transaction queries
  - AC: A minimalist list of the 10 most recent transactions displayed on the dashboard. Shows date, merchant/category, and amount (red for expense, green for income). Link to `/transactions`.
- [ ] Build upcoming recurring list — P2
  - Dependencies: Recurring transactions
  - AC: A card displaying the next 5-7 upcoming recurring transactions with their estimated due date and amount.
- [ ] Implement dashboard loading state — P0
  - Dependencies: Dashboard
  - AC: Skeleton loader cards render immediately while dashboard data is fetched.
- [x] Implement dashboard empty state — P0
  - Dependencies: Dashboard
  - AC: If no accounts or transactions exist, dashboard shows a welcoming "Getting Started" message with clear CTA buttons to add an account and add a first transaction.

## Phase 8 — Budgets
- [x] Create budget Zod validation schemas — P0
  - Dependencies: Phase 2
  - AC: Schema validates categoryId, amount (positive decimal), month (1-12 integer), year (4-digit integer).
- [x] Create budget server actions (CRUD) — P0
  - Dependencies: Schemas
  - AC: Actions to create, update, delete budgets. Database constraints ensure only one budget exists per category per month/year combination.
- [x] Create budget queries — P0
  - Dependencies: Prisma client
  - AC: Fetch all budgets for a specific month/year. Query must aggregate actual spent amounts from transactions for that category and compare it against the budget limit.
- [x] Build budget management page (/budgets) — P0
  - Dependencies: Queries, Actions
  - AC: Page includes a Month/Year selector toggle. Renders budget cards for each configured category showing a visual progress bar. Includes an "Add Budget" form modal.
- [x] Build budget progress visualization — P0
  - Dependencies: Budget page
  - AC: Progress bars fill based on percentage spent. Color coding logic: Green (<80%), Amber (80-99%), Red (100%+). Text explicitly states "৳X spent of ৳Y budgeted".
- [ ] Implement copy budgets from previous month — P1
  - Dependencies: Budget CRUD
  - AC: Action button to duplicate all budget limits from the previous month into the currently selected month. Button is only active if current month has no configured budgets.
- [ ] Build budget vs actual report section — P2
  - Dependencies: Budget queries
  - AC: Visual report using a grouped bar chart comparing the budgeted amount versus the actual spent amount side-by-side for each categorized budget.

## Phase 9 — Recurring Transactions (V1.1)
- [ ] Create recurring transaction Zod schemas — P1
  - Dependencies: Phase 2
  - AC: Validates recurring template fields: type, amount, frequency (Daily, Weekly, Monthly, Yearly), interval, start date, end date, account, category.
- [ ] Create recurring transaction server actions — P1
  - Dependencies: Schemas
  - AC: Create, update, delete templates. Action to toggle template active/inactive state.
- [ ] Create recurring transaction processing service — P1
  - Dependencies: Actions
  - AC: Background service or check function that finds due templates, generates the actual transaction record, and updates the template's `nextDueDate` based on its frequency.
- [ ] Build recurring transactions page (/recurring) — P1
  - Dependencies: Queries, Actions
  - AC: View a list of all active/inactive recurring transactions showing frequency, next due date, amount, and a quick toggle switch for status.
- [ ] Build create/edit recurring transaction form — P1
  - Dependencies: Recurring page
  - AC: Form to define the template. Similar to standard transaction form but adds frequency selection and date range logic. Validates properly.
- [ ] Implement auto-processing of due recurring transactions — P2
  - Dependencies: Processing service
  - AC: Since background cron jobs can be tricky in serverless Next.js, implement a check that runs on user login or dashboard load to synchronously process any due recurring items.

## Phase 10 — Savings Goals (V1.1)
- [ ] Create savings goal Zod schemas — P1
  - Dependencies: Phase 2
  - AC: Schema validates goal name, target amount (decimal), target date, and initial/current amount.
- [ ] Create savings goal server actions — P1
  - Dependencies: Schemas
  - AC: Create, update, delete goals. Actions to add a contribution transaction or withdraw from a goal. Action to mark goal as complete.
- [ ] Build savings goals page (/goals) — P1
  - Dependencies: Queries, Actions
  - AC: Display goals as cards. Each card shows percentage complete, current vs target amounts, a visual progress bar, and an "Add Funds" button. Includes empty/loading states.
- [ ] Build goal detail view — P2
  - Dependencies: Goals page
  - AC: Detailed view showing goal metadata, large progress visualization, and a list of historical contribution/withdrawal transactions specific to this goal.

## Phase 11 — Reports
- [x] Build reports page shell (/reports) — P1
  - Dependencies: Chart library
  - AC: Layout includes a global date range selector component. Sidebar or tabs to switch between different report types. Fully responsive layout.
- [x] Implement income vs expense report — P0
  - Dependencies: Reports page
  - AC: Grouped bar chart comparing total income and total expense per month. Viewable for last 6 or 12 months. Strict exclusion of transfer transactions.
- [x] Implement expense by category report — P0
  - Dependencies: Reports page
  - AC: Detailed Pie/Donut chart of expenses grouped by category for the selected global date range. Interactive legend showing exact amounts and percentages.
- [x] Implement spending trend report — P1
  - Dependencies: Reports page
  - AC: Line chart showing daily or weekly expense trend over time within the selected date range.
- [ ] Implement account balance report — P2
  - Dependencies: Reports page
  - AC: Bar chart visualizing the current balances of all active accounts side-by-side.
- [ ] Implement budget vs actual report — P2
  - Dependencies: Budget queries
  - AC: A comprehensive side-by-side comparison chart for all budgeted categories.
- [ ] Implement top merchants report — P2
  - Dependencies: Reports page
  - AC: Horizontal bar chart showing the top 10 merchants or payees based on total spending volume.
- [ ] Implement report data export — P2
  - Dependencies: Reports
  - AC: A button to export the raw data currently visualized in the active report as a CSV file.

## Phase 12 — Import/Export
- [x] Implement CSV export — P0
  - Dependencies: Transaction queries
  - AC: Server action or API route that generates a CSV containing all user transactions. Includes all fields (Date, Amount, Type, Category, Account, Note). Formats BDT correctly. Downloads as a file to the client.
- [ ] Implement JSON backup export — P1
  - Dependencies: All entities
  - AC: Generates a single massive JSON payload containing all the user's data (accounts, categories, transactions, budgets, settings). Useful for account migration.
- [ ] Implement CSV import — P1
  - Dependencies: Transaction creation
  - AC: UI to upload a CSV file. A column mapping step allows the user to match their CSV columns to database fields. Implements duplicate detection logic based on matching date, amount, account, and merchant.
- [ ] Implement import validation and error reporting — P1
  - Dependencies: CSV import
  - AC: Pre-validates the CSV before inserting into DB. Shows specific errors per row (e.g., "Invalid amount on row 5"). Allows the user to choose to skip invalid rows and proceed, showing a success summary afterward.

## Phase 13 — Attachments (V1.1)
- [ ] Set up file upload API route — P1
  - Dependencies: Phase 1
  - AC: `POST /api/upload` accepts `multipart/form-data`. Validates MIME type (JPEG, PNG, PDF, WebP only) and enforces a 5MB size limit. Saves file to local disk or cloud bucket. Returns file metadata and URL.
- [ ] Create attachment database operations — P1
  - Dependencies: Upload route
  - AC: Create Attachment model in Prisma linked to Transaction. Handle deleting attachments (both removing the DB record and deleting the physical file from storage).
- [ ] Build attachment UI in transaction form — P1
  - Dependencies: Upload route, Transaction form
  - AC: Add a file input dropzone to the transaction creation/edit form. Shows thumbnail previews for image files. Displays a progress indicator during upload.
- [ ] Build attachment viewer — P2
  - Dependencies: Attachment storage
  - AC: Clicking an attachment thumbnail in the transaction detail view opens a full-size modal/lightbox for images, or opens PDFs in a new browser tab.

## Phase 14 — Mobile / PWA (V1.1)
- [ ] Optimize all pages for mobile viewport — P0
  - Dependencies: All pages built
  - AC: Audit every page at 320px, 375px, and 640px widths. Ensure no horizontal scrolling occurs. Buttons and inputs must have adequate touch targets (min 44px height).
- [x] Implement bottom navigation bar — P0
  - Dependencies: Layout
  - AC: On viewports < 768px, hide the sidebar and render a fixed bottom navigation bar with 5 icons: Dashboard, Transactions, Quick Add (centered, distinct styling), Accounts, More/Settings. Active route indicator works.
- [ ] Implement floating action button — P0
  - Dependencies: Quick-add modal
  - AC: A prominent FAB is persistently visible in the bottom right (or center of bottom nav) on mobile devices to trigger the quick-add transaction modal instantly.
- [ ] Convert tables to cards on mobile — P1
  - Dependencies: Transaction list, other tables
  - AC: All HTML `<table>` elements used for lists transform into stacked CSS Grid or Flexbox card layouts when the viewport is below the 640px breakpoint to ensure readability.
- [ ] Add PWA manifest and service worker — P3
  - Dependencies: All features
  - AC: Add `manifest.json` with icons. Configure `next-pwa` to register a service worker. The app prompts to "Add to Home Screen" on mobile devices. A custom offline fallback page is displayed when there is no network connection.

## Phase 15 — Testing
- [ ] Set up Vitest — P2
  - Dependencies: Phase 1
  - AC: Vitest and React Testing Library are installed and configured. A basic sample test (`expect(1+1).toBe(2)`) runs successfully via `npm run test`.
- [ ] Write balance calculation tests — P1
  - Dependencies: Balance service
  - AC: Write unit tests verifying: income adds to balance, expense subtracts, transfers appropriately move funds between two accounts, soft-deleted transactions are ignored, and decimal precision remains 100% accurate without floating-point errors.
- [ ] Write transaction validation tests — P1
  - Dependencies: Transaction schemas
  - AC: Write unit tests against the Zod schemas verifying: missing required fields fail, negative amounts fail, transfer types require a valid `toAccountId`, and date strings are parsed correctly.
- [ ] Write budget calculation tests — P2
  - Dependencies: Budget service
  - AC: Write unit tests verifying that the percentage spent calculations are accurate given various lists of transactions against a budget limit.
- [ ] Set up Playwright for E2E — P3
  - Dependencies: All features
  - AC: Playwright is installed. Basic E2E flows are scripted: user login, creating a new account, creating a transaction, and viewing the dashboard. Tests pass in headless mode.

## Phase 16 — Security Audit
- [ ] Verify all routes are protected — P0
  - Dependencies: Auth, All pages
  - AC: Manually and programmatically verify that navigating to any app route (except `/login`, `/register`) while logged out redirects to `/login`. Verify `/api` routes return 401 Unauthorized.
- [ ] Verify all queries are user-scoped — P0
  - Dependencies: All features
  - AC: Audit every Prisma query to ensure `where: { userId: currentUserId }` is present. Create two test accounts and verify Account A cannot access Account B's transactions by manually changing URL IDs.
- [ ] Verify input validation on all server actions — P1
  - Dependencies: All features
  - AC: Ensure no server action blindly trusts client data. Every input payload is parsed through Zod before Prisma execution. Invalid data gracefully returns an error payload, not a 500 crash.
- [ ] Verify file upload security — P1
  - Dependencies: Attachments
  - AC: Attempt to upload `.php`, `.exe`, or `.sh` files to ensure they are blocked. Verify files are stored in a non-executable directory outside the public root.
- [ ] Set up security headers — P1
  - Dependencies: Phase 1
  - AC: Configure `next.config.mjs` to inject secure HTTP headers: Content-Security-Policy (CSP), X-Frame-Options (DENY), X-Content-Type-Options (nosniff), and Referrer-Policy.
- [ ] Review and fix any SQL injection risks — P1
  - Dependencies: All features
  - AC: Confirm that `prisma.$queryRaw` is completely avoided or heavily parameterized. Ensure Prisma's ORM methods are used exclusively for DB interaction to prevent SQL injection natively.

## Phase 17 — Production Deployment
- [x] Create production build and test — P0
  - Dependencies: All MVP features
  - AC: Running `npm run build` locally outputs a successful production build with zero Next.js compilation errors. `npm run start` serves the build correctly.
- [ ] Set up MySQL on production server — P0
  - Dependencies: VPS access
  - AC: Access a production VPS (e.g., Ubuntu). Install MySQL 8.0. Create a production database. Create a specific database user with strong password and limited privileges restricted strictly to the app's database.
- [ ] Run Prisma migrations on production — P0
  - Dependencies: Production DB
  - AC: Execute `npx prisma migrate deploy` on the production server. Verify the database schema matches development identically.
- [ ] Configure Nginx reverse proxy — P0
  - Dependencies: VPS
  - AC: Install Nginx. Configure a server block listening on port 80 to proxy traffic to the Next.js process running on `localhost:3000`. Ensure static file serving is optimized.
- [ ] Set up SSL with Let's Encrypt — P0
  - Dependencies: Domain, Nginx
  - AC: Point the domain DNS to the VPS IP. Use `certbot` to generate an SSL certificate. Nginx serves traffic over HTTPS (port 443). HTTP traffic automatically redirects to HTTPS. Certificate auto-renewal cron is active.
- [ ] Configure PM2 for process management — P0
  - Dependencies: Production build
  - AC: Install PM2 globally. Start the Next.js production server via PM2. Ensure the app restarts automatically if it crashes, and starts automatically when the VPS reboots (`pm2 startup`).
- [ ] Set up environment variables on server — P0
  - Dependencies: Server access
  - AC: Create a `.env.production` file on the VPS. Populate all required secrets (Auth secret, DB URL). Verify no `.env` files containing secrets are tracked in Git.
- [ ] Set up automated database backups — P1
  - Dependencies: Production DB
  - AC: Create a bash script that runs `mysqldump` to back up the database. Set up a cron job to execute this script daily. Ensure backups are stored securely and older backups (e.g., >30 days) are rotated/deleted.
- [ ] Create deployment script — P1
  - Dependencies: All above
  - AC: Write a `deploy.sh` script on the server that automates the deployment process: `git pull`, `npm install`, `npm run build`, `npx prisma migrate deploy`, `pm2 reload all`.
- [ ] Seed default data on production — P0
  - Dependencies: Production DB
  - AC: Run the Prisma seed script on production to ensure default expense/income categories exist before the first user registers. Verify the initial user registration works perfectly.
- [ ] Final production smoke test — P0
  - Dependencies: Full deployment
  - AC: As a real user on the live HTTPS domain: Register, login, create a new Bank account, add an expense transaction, add an income transaction, do a transfer, view the dashboard to confirm math is correct, and test UI responsiveness on a mobile phone.

---

## Summary
| Phase | Tasks | MVP Critical (P0) | Status |
|-------|-------|--------------------|--------|
| 0 | Documentation | 7 | ✅ Complete |
| 1 | Project Setup | 9 | ✅ Complete |
| 2 | Database | 4 | ✅ Complete |
| 3 | Authentication | 5 | ✅ Complete |
| 4 | Accounts | 5 | ✅ Complete |
| 5 | Transactions | 6 | ✅ Core Complete |
| 6 | Categories | 4 | ✅ Complete |
| 7 | Dashboard | 5 | ✅ Core Complete |
| 8 | Budgets | 3 | ✅ Core Complete |
| 9 | Recurring (V1.1) | 0 | 📋 Placeholder |
| 10 | Savings Goals (V1.1) | 0 | 📋 Placeholder |
| 11 | Reports | 2 | ✅ Core Complete |
| 12 | Import/Export | 1 | 🔶 CSV Export Done |
| 13 | Attachments (V1.1) | 0 | ⬜ Not Started |
| 14 | Mobile/PWA | 3 | 🔶 Bottom Nav Done |
| 15 | Testing | 0 | ⬜ Not Started |
| 16 | Security Audit | 2 | ⬜ Not Started |
| 17 | Deployment | 8 | 🔶 Build Passes |
