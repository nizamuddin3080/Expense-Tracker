# Product Requirements Document (PRD) - Personal Expense Tracker

## 1. Product Overview
### What
A modern, fast, responsive personal finance web application tailored for an individual user based in Bangladesh. Built with Next.js, TypeScript, Tailwind CSS, shadcn/ui, MySQL, and Prisma.

### Why
To gain complete visibility and control over personal finances. The app solves the core problems of manual tracking which is error-prone, spreadsheets which lack immediate insights, and the lack of a centralized view of finances across various scattered accounts (banks, mobile money like bKash, cash).

### Who
A single personal user based in Bangladesh, dealing primarily with BDT (৳).

### Core Problems Addressed
- Manual expense tracking is tedious, time-consuming, and prone to human error.
- Spreadsheets are inflexible, difficult to maintain, and lack automated insights.
- Users have no centralized view of their financial status across different bank accounts, cash, and digital wallets.

### Philosophy
- **Simple > Complex:** Interactions should be intuitive and straightforward.
- **Fast > Feature-rich:** Core actions like adding transactions should be frictionless.
- **Accurate > Approximate:** Financial data must be precisely tracked and reconciled.
- **Personal Command Center:** Focus on individual financial health, not enterprise accounting.

---

## 2. Goals (Measurable)
- **Speed of Entry:** Add a new transaction in under 10 seconds.
- **Load Time:** Dashboard loads completely in under 2 seconds.
- **Immediate Clarity:** Understand monthly spending at a glance within 5 seconds of opening the app.
- **Accuracy:** Maintain 100% accurate account balances (zero floating-point errors).
- **Insight Accessibility:** Identify the top 3 spending categories instantly from the dashboard.
- **Data Ownership:** Zero data loss guarantee, with 100% of financial data exportable at any time.

---

## 3. Non-Goals
- Full accounting/ERP system features (e.g., general ledger, double-entry specifics exposed to user).
- Business, corporate, or multi-company accounting.
- Tax filing, tax calculations, or government compliance reporting.
- Direct banking platform integrations or real-time payment processing (plaid, open banking APIs not required for V1).
- Investment portfolio tracking and stock market sync (V1).
- Multi-currency conversion and forex tracking (V1).
- Shared or family expense splitting.
- Invoice generation or accounts receivable/payable management.
- Payroll management.

---

## 4. User
- **Target Audience:** Single personal user seeking strict financial control.
- **Architecture Note:** While V1 focuses strictly on a single user, the database schema and authentication architecture should theoretically support multi-tenancy in the future without requiring a complete rewrite.

---

## 5. Core Features

### 5.1 Dashboard
The dashboard serves as the central command center for the user's financial life.
- **Total Balance:** Aggregate balance across all active accounts.
- **Monthly Income Total:** Sum of all income transactions for the current month.
- **Monthly Expense Total:** Sum of all expense transactions for the current month.
- **Net Cash Flow:** Calculated as (Monthly Income - Monthly Expenses).
- **Savings Rate Percentage:** Calculated as (Net Cash Flow / Monthly Income) * 100, clamped at 0% minimum.
- **Today's Spending:** Total expenses incurred today.
- **Budget Usage:** High-level progress bars for overall budget and top 3 categories nearing limits.
- **Upcoming Recurring Expenses:** List of expected recurring transactions for the next 7 days.
- **Recent Transactions:** A quick-glance list of the last 10 transactions.
- **Spending by Category:** A pie or donut chart visualizing current month expenses by parent category.
- **Monthly Trend:** A bar chart comparing income vs. expenses over the last 6 months.
- **Quick-add Button:** Prominent, floating, or fixed button to instantly open the transaction creation modal.

### 5.2 Transactions
The core data entity of the application.
- **Unified Model:** Single database table for all transaction flows, differentiated by `type`.
- **Types:** `EXPENSE`, `INCOME`, `TRANSFER`.
- **Fields:**
  - `id` (UUID or CUID)
  - `type` (Enum)
  - `amount` (Decimal 15,2)
  - `accountId` (Foreign Key - Source)
  - `toAccountId` (Foreign Key - Destination, for transfers only)
  - `categoryId` (Foreign Key)
  - `subcategoryId` (Foreign Key, optional)
  - `date` (DateTime)
  - `merchant/payee` (String, optional)
  - `paymentMethod` (String, optional)
  - `note` (Text, optional)
  - `attachments` (JSON or separate table reference)
  - `tags` (Array of Strings or relational table)
  - `isRecurring` (Boolean)
  - `recurringTransactionId` (Foreign Key, optional)
  - `createdAt`, `updatedAt` (Timestamps)
- **Operations:** Full CRUD (Create, Read, Update, Delete) capabilities.
- **List View:** Main ledger view utilizing infinite scroll or pagination (default 50 items/page).
- **Search & Filter:** Multi-faceted filtering by date range, account, category, type, amount range, merchant, tags, and free-text search.
- **Bulk Actions:** Ability to select multiple transactions to delete or recategorize simultaneously.
- **Duplicate:** "Clone" action for rapid entry of similar past transactions.
- **Sorting:** By date (default descending), amount, or category.

### 5.3 Accounts
Logical buckets where money resides.
- **Types:** Cash, Bank Account, Mobile Banking (bKash, Nagad, Rocket), Credit Card, Digital Wallet, Other.
- **Fields:**
  - `id` (UUID or CUID)
  - `name` (String, e.g., "City Bank Salary", "bKash Personal")
  - `type` (Enum)
  - `icon` (String, identifier for UI icon)
  - `openingBalance` (Decimal 15,2, set at creation)
  - `currency` (String, default "BDT")
  - `isActive` (Boolean)
  - `createdAt`, `updatedAt` (Timestamps)
- **Balance Calculation:** `currentBalance` is STRICTLY CALCULATED on the fly or via triggers. Formula: `openingBalance + sum(income) - sum(expense) + sum(transfersIn) - sum(transfersOut)`.
- **Detail Page:** Clicking an account shows its specific transaction history and metrics.
- **Lifecycle:** Soft-delete (deactivate) accounts. Hard deletion is blocked if associated transactions exist.

### 5.4 Transfers
Moving money between owned accounts.
- **Mechanism:** Transfer from Account A (source) to Account B (destination).
- **Inputs:** Amount, date, note, and optional transfer fee (e.g., bKash cash-out charge).
- **Accounting Rules:**
  - Transfers MUST NOT count as overall income or expense.
  - Transfers MUST NOT inflate income/expense reports.
  - Source account balance decreases; Destination account balance increases.
- **Fee Handling:** Any transfer fee specified is recorded as a separate `EXPENSE` transaction linked to the source account, categorized automatically under "Financial / Bank Fees".

### 5.5 Categories
Hierarchical classification of transactions.
- **Structure:** Two-level hierarchy (Parent Category → Subcategories).
- **Fields:**
  - `id`, `name`, `type` (EXPENSE/INCOME)
  - `icon`, `color` (optional string hex)
  - `parentId` (Self-referencing Foreign Key, null for top-level)
  - `isDefault`, `isActive`, `sortOrder`
  - `createdAt`, `updatedAt`
- **Default Seed Data (Expenses):**
  - Food & Dining (Groceries, Restaurants, Snacks, Coffee)
  - Transportation (Fuel, Public Transit, Ride Share, Parking)
  - Housing (Rent, Utilities, Maintenance, Internet)
  - Shopping (Clothing, Electronics, Household, Personal Care)
  - Healthcare (Medicine, Doctor, Insurance)
  - Entertainment (Movies, Games, Subscriptions, Books)
  - Education (Courses, Books, Supplies)
  - Personal (Gifts, Donations, Self-care)
  - Financial (Bank Fees, Interest, Tax)
  - Other
- **Default Seed Data (Income):** Salary, Freelance, Investment, Gift, Refund, Other.
- **Management:** Users can add custom categories, edit names/icons, and reorder them.
- **Deletion:** Prevent deletion if transactions exist; require reassignment to another category first.

### 5.6 Budgets
Proactive spending limits.
- **Period:** Monthly.
- **Scope:** Overall monthly budget (optional) and per-category budgets.
- **Fields:** `id`, `categoryId`, `amount`, `month` (Integer 1-12), `year` (Integer), `createdAt`, `updatedAt`.
- **Display:** Visual progress bars indicating `budget amount`, `spent amount`, `remaining`, and `% used`.
- **Thresholds:** Visual warnings at 80% (Warning/Yellow) and 100% (Exceeded/Red).
- **Workflow:** One-click option to "Copy previous month's budgets" to the current/new month.
- **Comparison:** Dedicated "Budget vs Actual" view.

### 5.7 Recurring Transactions (V1.1)
Automated future transaction scheduling.
- **Frequencies:** Daily, Weekly, Biweekly, Monthly, Quarterly, Yearly, Custom (every N days).
- **Fields:** `id`, `type`, `amount`, `accountId`, `categoryId`, `subcategoryId`, `merchant`, `note`, `frequency`, `interval`, `startDate`, `endDate` (optional), `nextDueDate`, `isActive`, `lastProcessedDate`.
- **Behavior:** On `nextDueDate`, the system automatically generates the transaction and updates `nextDueDate`. A user confirmation prompt variant can be configured.
- **Visibility:** Upcoming recurring items appear on the dashboard.
- **Management:** Users can pause/resume and edit future occurrences. E.g., Rent (৳15,000 Monthly), Internet (৳1,000 Monthly), Netflix.

### 5.8 Savings Goals (V1.1)
Target-based saving tracking.
- **Fields:** `id`, `name`, `targetAmount`, `currentAmount`, `targetDate`, `icon`, `color`, `isCompleted`, `createdAt`, `updatedAt`.
- **Tracking:** Visual percentage progress, remaining amount, and countdown of days remaining.
- **Workflow:** Users log specific transfer or allocation transactions towards a goal.
- **Concurrency:** Support multiple active goals simultaneously.

### 5.9 Reports & Analytics
Comprehensive visual insights.
- **Income vs Expense:** Monthly comparative bar chart.
- **Category Breakdown:** Pie/Donut chart for expenses.
- **Spending Trend:** Line chart over the last 6-12 months.
- **Account History:** Line chart showing balance trajectory over time.
- **Budget vs Actual:** Grouped bar chart comparing limits vs actual spend.
- **Savings Rate:** Line chart tracking savings percentage over time.
- **Top Merchants:** Table/List of payees where the most money is spent.
- **Time Controls:** Global date range selection (This Month, Last Month, YTD, Last 12 Months, Custom) applying to all charts.

### 5.10 Search & Filtering
Robust data discovery.
- **Global Search:** Fast text search across transaction notes, merchants, and tags.
- **Filters:** Date range, specific accounts, specific categories, transaction type, amount range (min/max), tags, and attachment presence.
- **Combinations:** All filters must be composable (AND logic).
- **Presets (V1.1):** Save frequently used filter combinations.

### 5.11 Attachments (V1.1)
Receipt and document storage.
- **Supported Formats:** JPEG, PNG, PDF, WebP.
- **Limits:** Max 5MB per file.
- **Quantity:** One attachment per transaction in V1, multiple in V1.1.
- **Storage:** Local filesystem (server disk) mapped to static routes or secure API endpoints.
- **UI:** Thumbnail preview in lists, full-size modal view on click.

### 5.12 Import/Export
Data portability features.
- **Export (CSV):** Filtered or full transaction list export with all data columns.
- **Export (JSON):** Full database state backup.
- **Import (CSV - V1.1):** Wizard with column mapping for bank statements.
- **Import Validation:** Check required fields, map to valid accounts/categories, validate amounts.
- **Duplicate Detection:** Identify and skip exact matches (Date + Amount + Account + Merchant).

### 5.13 Notifications (V1.1 & V2)
User alerts and updates.
- **V1.1 (In-App):** Alerts for Budget exceeded, Budget approaching limit (80%), Upcoming recurring expense (1 day before), Savings milestone reached.
- **V2 (Email):** Weekly summaries, critical budget alerts.

### 5.14 Settings
User preferences and configuration.
- **Profile:** Name, email, password update.
- **Preferences:** Default currency display (৳ BDT), Default account for new transactions, Date format (DD/MM/YYYY vs MM/DD/YYYY).
- **Appearance:** Light/Dark theme toggle.
- **Data Management:** Triggers for Import/Export/Backup.

---

## 6. MVP vs Future Features

### V1 — MVP (Minimum Viable Product)
- Authentication (Login, Registration, Session management).
- Dashboard with key financial metrics.
- Transaction CRUD operations (Expense, Income, Transfer).
- Accounts management (Create, Edit, Deactivate).
- Categories (Seeded defaults + Custom user additions).
- Monthly budgets per category.
- Basic Reports (Monthly overview, category breakdown, trend).
- Search and filtering.
- Simple CSV export.
- Fully responsive design (Desktop + Mobile browsers).
- Light/Dark theme support.
- Settings configuration page.

### V1.1 (Fast Follow)
- Recurring transactions engine.
- Savings goals tracking.
- CSV import with validation wizard.
- Attachments (Receipt image upload).
- In-app notification center.
- Saved search/filter presets.
- Multiple attachments per transaction.
- One-click budget copy from the previous month.

### V2 (Growth)
- Advanced reports (Payment method analysis, granular custom reports).
- Email notifications.
- Progressive Web App (PWA) installation with offline read support.
- Multi-currency support (for travel or foreign accounts).
- Automated backup scheduling to cloud storage.

### Future / Experimental
- AI spending analysis (e.g., "You spend 20% more on dining this month").
- Natural language transaction entry (e.g., typed input: "৳500 food cash today").
- OCR receipt scanning to auto-fill amount and merchant.
- Machine Learning categorization of raw bank statement strings.
- Long-term financial forecasting.

---

## 7. User Stories

1. **As a user**, I want to quickly add an expense from my phone, so that I don't forget to track cash purchases.
   - *Acceptance Criteria:* FAB (Floating Action Button) is visible on mobile; form opens instantly; requires minimal fields (Amount, Category) to save.
2. **As a user**, I want to view a dashboard with my total net worth and this month's spending, so that I know my financial standing immediately upon logging in.
   - *Acceptance Criteria:* Dashboard loads < 2s; displays aggregated balances; shows income/expense summary for current month.
3. **As a user**, I want to categorize my expenses into subcategories, so that I can see exactly where my money goes (e.g., Food -> Groceries vs. Food -> Restaurants).
   - *Acceptance Criteria:* Hierarchical category selection in transaction form; reports can drill down into subcategories.
4. **As a user**, I want to record a transfer from my Bank to my bKash account, so that both account balances are accurate without inflating my monthly expenses.
   - *Acceptance Criteria:* Transfer form available; reduces Bank balance; increases bKash balance; does not appear on expense reports.
5. **As a user**, I want to set a monthly budget for 'Dining Out' of ৳5,000, so that I can control my discretionary spending.
   - *Acceptance Criteria:* Budget creation form; visual progress bar updates as dining expenses are logged.
6. **As a user**, I want to see a visual warning when I exceed 80% of my budget, so that I can slow down my spending before the month ends.
   - *Acceptance Criteria:* Budget progress bar turns yellow/orange at 80% and red at 100%.
7. **As a user**, I want to search for a specific transaction by merchant name, so that I can check how much I paid a specific vendor last month.
   - *Acceptance Criteria:* Search bar handles text input; list updates immediately; searches across notes and merchant fields.
8. **As a user**, I want to filter my transactions to see only my 'Credit Card' expenses from 'Last Year', so that I can analyze past debt usage.
   - *Acceptance Criteria:* Filter drawer allows combining Account = Credit Card, Type = Expense, Date = Last Year.
9. **As a user**, I want to export all my data to a CSV file, so that I have a local backup and can run my own spreadsheet analysis if needed.
   - *Acceptance Criteria:* Export button generates complete CSV; downloads to user's device.
10. **As a user**, I want to upload a picture of a receipt, so that I have proof of purchase for warranties or returns. (V1.1)
    - *Acceptance Criteria:* File upload input accepts images; thumbnail renders; image can be viewed full size.
11. **As a user**, I want my salary to automatically log on the 1st of every month, so that I don't have to enter it manually. (V1.1)
    - *Acceptance Criteria:* Recurring transaction setup allows monthly interval; system generates transaction on the 1st.
12. **As a user**, I want to switch the app to dark mode, so that it is comfortable to use at night.
    - *Acceptance Criteria:* Theme toggle in settings or nav; UI immediately shifts to dark palette; preference is persisted.
13. **As a user**, I want to manage my custom categories, so that the app reflects my unique spending habits.
    - *Acceptance Criteria:* Category management UI allows adding, editing, and disabling categories.
14. **As a user**, I want to see my spending trend over the last 6 months, so that I can identify if my expenses are inflating over time.
    - *Acceptance Criteria:* Trend line chart visible on reports page showing 6 data points (months).
15. **As a user**, I want to log a transfer fee of ৳10 when moving money from bKash, so that my balance perfectly matches reality.
    - *Acceptance Criteria:* Transfer form includes optional fee field; fee is logged as a separate expense automatically.
16. **As a user**, I want to set a savings goal for a new laptop (৳80,000), so that I can track my progress. (V1.1)
    - *Acceptance Criteria:* Savings goal UI allows setting target amount; progress bar updates when allocations are made.
17. **As a user**, I want to prevent deletion of an account that has transaction history, so that my historical net worth calculations aren't corrupted.
    - *Acceptance Criteria:* Delete button disabled or shows error if transactions exist; user is prompted to archive/deactivate instead.
18. **As a user**, I want to duplicate a transaction from last week, so that I can log a repeat purchase instantly without re-typing.
    - *Acceptance Criteria:* "Duplicate" action on transaction list populates a new form with the old data, current date.
19. **As a user**, I want to see form validation errors immediately, so that I don't submit incomplete data.
    - *Acceptance Criteria:* Amount field rejects non-numeric or negative values; required fields highlight red if missed on submit.
20. **As a user**, I want the app to be fully usable on my iPhone via Safari, so that I have access on the go.
    - *Acceptance Criteria:* No horizontal scrolling; tap targets are large enough; responsive design adapts to mobile width.

---

## 8. Functional Requirements

- **FR-001:** The system shall allow users to register an account using email and password.
- **FR-002:** The system shall authenticate users and maintain a secure session.
- **FR-003:** The system shall allow users to create, read, update, and soft-delete financial accounts.
- **FR-004:** The system shall dynamically calculate account balances based on underlying transactions.
- **FR-005:** The system shall allow users to create EXPENSE transactions requiring at minimum: amount, account, category, and date.
- **FR-006:** The system shall allow users to create INCOME transactions requiring at minimum: amount, account, category, and date.
- **FR-007:** The system shall allow users to create TRANSFER transactions requiring at minimum: amount, source account, destination account, and date.
- **FR-008:** The system shall provide a preset list of default parent and subcategories upon user registration.
- **FR-009:** The system shall allow users to create custom parent categories and subcategories.
- **FR-010:** The system shall prevent hard deletion of categories that have linked transactions.
- **FR-011:** The system shall allow users to set monetary budgets for specific categories for a specific month and year.
- **FR-012:** The system shall display visual indicators of budget utilization on the dashboard and budget pages.
- **FR-013:** The system shall aggregate and display total net worth, monthly income, and monthly expenses on the dashboard.
- **FR-014:** The system shall provide a paginated or infinite-scrolling list of all transactions.
- **FR-015:** The system shall allow searching transactions by text matching the note or merchant fields.
- **FR-016:** The system shall allow filtering transactions by date range, account, category, and type.
- **FR-017:** The system shall generate a monthly income vs. expense chart.
- **FR-018:** The system shall generate a pie chart breaking down expenses by category for a selected date range.
- **FR-019:** The system shall allow exporting the transaction list to a CSV file.
- **FR-020:** The system shall support switching between light and dark visual themes.
- **FR-021:** The system shall store all monetary amounts with two decimal places of precision.
- **FR-022:** The system shall validate that transfer amounts do not exceed the available balance of the source account (soft warning, allow override).
- **FR-023:** (V1.1) The system shall allow uploading up to one image or PDF attachment per transaction, max 5MB.
- **FR-024:** (V1.1) The system shall allow defining recurring transaction rules (daily, weekly, monthly).
- **FR-025:** (V1.1) The system shall automatically execute recurring transactions based on their defined schedule.
- **FR-026:** (V1.1) The system shall allow importing transactions via CSV with a column-mapping interface.
- **FR-027:** (V1.1) The system shall allow users to create and track savings goals with target amounts and dates.
- **FR-028:** The system shall allow users to update their profile information and change passwords.
- **FR-029:** The system shall gracefully handle network errors and display user-friendly error messages.
- **FR-030:** The system shall ensure database transactions are used for all multi-step financial mutations (e.g., Transfers with fees).

---

## 9. Non-Functional Requirements

### Performance
- **Dashboard Load Time:** < 2 seconds.
- **Transaction List Render:** < 1 second for standard paginated view.
- **Transaction Creation API Response:** < 500ms.
- **Chart Rendering Time:** < 1 second after data is fetched.

### Scalability
- The architecture must comfortably handle a single user accumulating 50,000+ transactions over years without UI degradation or report timeout.

### Reliability
- **Zero Data Loss:** Database integrity must be maintained. Soft deletes are preferred over hard deletes for critical data.
- **Transaction Integrity:** Network failures during a transfer save must not result in money leaving one account and vanishing.

### Usability
- **Time on Task:** A trained user should be able to add a standard expense in under 10 seconds.
- **Intuitive Navigation:** Maximum 3 clicks to reach any core feature from the dashboard.

### Security
- **Authentication:** Required for all routes except login/register.
- **Data Protection:** Passwords must be heavily hashed.
- **Input Validation:** Strict server-side validation to prevent injection or bad data.

### Compatibility
- **Desktop Browsers:** Chrome, Firefox, Safari, Edge (latest 2 major versions).
- **Mobile Browsers:** iOS Safari, Android Chrome.

### Accessibility
- **Standard:** Target WCAG 2.1 AA compliance.

---

## 10. Acceptance Criteria (Major Features)

### Feature: Add Transaction
- **Given** I am logged in and on the dashboard,
- **When** I click "Add Transaction",
- **Then** a modal/page opens immediately.
- **When** I fill in amount (৳500), select category (Food), account (Cash), and click Save,
- **Then** the modal closes, a success toast appears, the dashboard balances update instantly, and the transaction appears at the top of the recent list.

### Feature: Transfer Money
- **Given** Account A has ৳1000 and Account B has ৳0,
- **When** I execute a transfer of ৳500 from A to B with a ৳10 fee,
- **Then** Account A's balance becomes ৳490, Account B's balance becomes ৳500.
- **And** the ৳10 fee is logged as a separate expense.
- **And** my total net worth decreases by exactly ৳10.

### Feature: Budgeting
- **Given** I have a budget of ৳10,000 for 'Housing' this month,
- **And** I have spent ৳8,500 on 'Housing',
- **When** I view the budgets page,
- **Then** the 'Housing' progress bar shows 85% utilization and is styled with a warning color (yellow/orange).

### Feature: Dashboard Metrics
- **Given** I have 3 accounts (৳5000, ৳2000, ৳-1000 [credit]),
- **When** I view the dashboard,
- **Then** the Total Balance displays exactly ৳6000.

---

## 11. Error Handling Requirements
- **API Responses:** All REST/GraphQL/Server Action errors must return a consistent JSON schema (e.g., `{ success: false, error: { code, message, details } }`).
- **User-Facing Messages:** Errors must be non-technical (e.g., "We couldn't save your transaction right now. Please try again." instead of "SQL Deadlock at row 54").
- **Form Validation:** Client-side validation must show errors inline under the respective inputs before form submission.
- **Network Failures:** If the client loses connection, mutations should fail gracefully with a retry prompt, and queries should show a skeleton/cached state with an offline indicator.
- **Transactional Rollbacks:** Any operation affecting multiple records (like a Transfer) must be wrapped in a Prisma `$transaction`. If step 2 fails, step 1 must rollback automatically.
- **File Uploads:** Exceeding 5MB or invalid file types must immediately reject client-side with a clear instructional message.

---

## 12. Security Requirements
- **Password Hashing:** Use `bcrypt` with a minimum of 12 salt rounds or `Argon2`.
- **Session Management:** Secure, HttpOnly, SameSite cookies containing JWTs or opaque session tokens.
- **CSRF Protection:** Required on all state-mutating requests (handled natively if using Next.js Server Actions properly).
- **Input Sanitization:** Prevent XSS by escaping user output (handled natively by React) and stripping malicious payload in server controllers.
- **File Security:** Uploaded files must have their MIME types verified on the server, not just relying on extensions.
- **Database Security:** Prevent SQL injection strictly by utilizing Prisma ORM's parameterized queries for all operations. No raw SQL string concatenation.
- **Rate Limiting:** Implement strict rate limiting on `/login` and `/register` to prevent brute-force attacks.
- **Headers:** Implement standard security headers (Content-Security-Policy, X-Frame-Options, Strict-Transport-Security).
- **Secrets:** All API keys, database URLs, and JWT secrets must reside in environment variables and never be committed to version control.
- **Transport:** HTTPS is strictly required in production environments.

---

## 13. Performance Requirements
- **First Contentful Paint (FCP):** < 1.5 seconds.
- **Largest Contentful Paint (LCP):** < 2.5 seconds.
- **Time to Interactive (TTI):** < 3.0 seconds.
- **Database Query Limits:** 95th percentile of queries must execute in < 100ms. Proper indexing on `userId`, `date`, `categoryId`, and `accountId` is mandatory.
- **Pagination Strategy:** Endpoints returning lists (Transactions) must enforce pagination or cursor-based fetching, defaulting to 50 items.
- **Asset Optimization:** Next.js `next/image` must be used for all internal and uploaded images to ensure WebP conversion and responsive sizing.
- **Code Splitting:** Route-based code splitting to ensure users only download JS necessary for the current view. Lazy load heavy charting libraries (e.g., Recharts, Chart.js).

---

## 14. Accessibility Requirements
- **Semantic HTML:** Strict adherence to semantic tags (`<nav>`, `<main>`, `<article>`, `<section>`, `<dialog>`).
- **ARIA:** Proper ARIA attributes (`aria-label`, `aria-hidden`, `aria-expanded`) on interactive UI components like custom dropdowns and modals (shadcn/ui handles most of this).
- **Keyboard Navigation:** All functionalities (forms, buttons, links, modals) must be fully navigable and actionable using only a keyboard (Tab, Enter, Space, Esc).
- **Focus Management:** When modals/dialogs open, focus must be trapped inside. When closed, focus must return to the triggering element.
- **Contrast:** Minimum color contrast ratio of 4.5:1 for normal text (WCAG AA).
- **Screen Readers:** UI must be comprehensible when traversed with VoiceOver or NVDA.
- **Skip Links:** A "Skip to content" link must be available for keyboard users on initial load.
- **Forms:** Every input must have an associated explicit `<label>`. Error states must be announced to screen readers.

---

## 15. Mobile Requirements
- **Responsiveness:** Fluid layouts supporting viewports from 320px (small phones) up to 2560px (ultra-wide monitors).
- **Touch Targets:** Minimum interactive target size of 44x44 CSS pixels to prevent accidental taps.
- **Navigation:** Consider a bottom tab navigation bar for mobile viewports to enhance reachability.
- **Quick Action:** A prominent Floating Action Button (FAB) on mobile for adding transactions.
- **Gestures (V1.1):** Swipe left/right on transaction list items for quick actions like Delete or Edit.
- **Input Modalities:** Use `inputmode="decimal"` or `type="number"` for amount fields to trigger the numeric keypad on mobile devices automatically.
- **Layout Constraints:** Absolutely no horizontal scrolling permitted on the main viewport at any device width.

---

## 16. Data Integrity Requirements
- **Currency Storage:** All monetary values MUST be stored as `DECIMAL(15,2)` in MySQL to prevent floating-point arithmetic errors. Do not use `FLOAT` or `DOUBLE`.
- **Derived State:** Account balances should ideally be calculated dynamically. If cached/stored for performance, there must be a rigorous recalculation/reconciliation mechanism.
- **Soft Deletion:** Transactions should utilize a `deletedAt` timestamp rather than hard SQL `DELETE` to preserve audit trails.
- **Foreign Keys:** Strict referential integrity. e.g., A transaction cannot point to a non-existent account.
- **Unique Constraints:** Where applicable (e.g., user emails must be uniquely constrained at the database level).
- **Immutability:** Core audit fields like `createdAt` must be immutable once inserted.
- **ACID Compliance:** All related multi-table updates (e.g., deleting a transfer which affects two accounts) must happen within a single ACID-compliant database transaction.

---

## 17. Backup & Export Requirements
- **Full Data Export:** A feature in Settings allowing the user to download a complete `.json` dump of their database rows.
- **CSV Export:** Standard transaction export to CSV, respecting active filters on the view.
- **Export Completeness:** Exports must include mapped string names, not just raw database IDs (e.g., export "Food & Dining" rather than `cat_123xyz`).
- **Import Validation (V1.1):** The import tool must validate structure, data types, and referential integrity before committing rows to the database. It must present a dry-run error report to the user.
- **Restorability:** The JSON backup format must be structured in a way that a script could realistically rebuild the user's entire state on a fresh database installation.

---
*End of Document*
