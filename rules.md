# Engineering Rules & Coding Standards

This document serves as the engineering constitution for the Personal Expense Tracker web application. These rules **MUST** be followed during all development, code reviews, and AI-assisted coding sessions. 

The technology stack for this project is: **Next.js 14+ (App Router), TypeScript, Tailwind CSS, shadcn/ui, MySQL, Prisma, NextAuth.js**.

---

## 1. General Rules

- **TypeScript Strict Mode**: TypeScript strict mode must be enabled (`strict: true` in `tsconfig.json`). No exceptions.
- **No `any` Type**: Do not use the `any` type unless absolutely unavoidable. If you must use `any`, you are required to document the exact reason in a comment directly above the usage. Prefer `unknown` if the type is truly unknown, and narrow it down safely.
- **DRY Principle (Don't Repeat Yourself)**: No duplicated logic. Shared utilities, type definitions, and common components must be extracted into their respective shared directories (`/lib`, `/utils`, `/components/ui`).
- **No Dead Code**: Remove all unused imports, functions, variables, and components before committing. Use your IDE's auto-fix features or a linter to ensure no dead code remains.
- **Dependency Management**: No random or unnecessary dependencies. Every npm package added must be justified. Prefer native APIs or small utility functions over pulling in heavy third-party libraries for simple tasks.
- **Secret Management**: No hardcoded secrets (API keys, database URIs, JWT secrets) anywhere in the codebase. All sensitive information must be loaded via environment variables (`process.env.VARIABLE_NAME`).
- **URL Management**: No hardcoded URLs, especially absolute paths for API endpoints. Use environment variables (e.g., `NEXT_PUBLIC_APP_URL`) or central constants for routing and external links.
- **Logging**: No `console.log` statements in production code. Use a proper logging utility (e.g., Winston, Pino) or remove debugging logs entirely before pushing code.
- **Single Responsibility Principle**: All files must have a clear, single responsibility. A file handling database queries should not contain UI components.
- **Maximum File Length**: Guideline is 300 lines per file. If a file exceeds this limit, it is a strong signal that it has taken on too many responsibilities and must be refactored into smaller, composed modules.
- **Exports**: Use named exports exclusively across the project to ensure better refactoring and intellisense. The ONLY exception is for Next.js special files (pages, layouts, error boundaries, loading states) which require default exports.
- **Variable Declarations**: Prefer `const` over `let`. Never use `var`. Only use `let` if you can definitively prove the variable needs to be reassigned.
- **String Manipulation**: Use template literals (`` `string ${variable}` ``) over string concatenation (`+`).
- **Modern JavaScript/TypeScript Features**: Utilize optional chaining (`?.`) and nullish coalescing (`??`) to safely access nested properties and handle fallbacks instead of verbose `&&` or ternary checks.
- **Exhaustive Checks**: Switch statements handling enums or union types must be exhaustive. Include a `default` case that assigns the value to the `never` type to catch unhandled cases at compile time.

---

## 2. Architecture Rules

- **Folder Structure Adherence**: Strictly follow the documented folder structure in `architecture.md`. Do not invent new root directories without updating the architecture document.
- **Business Logic Separation**: Keep business logic in `server/services/`. Do NOT embed complex business rules, calculations, or data transformations inside React components or Server Actions.
- **Server Actions Layer**: Server actions in `server/actions/` must remain a thin layer. Their only responsibilities are: 
  1. Receive request.
  2. Authenticate/Authorize.
  3. Validate input (Zod).
  4. Call the appropriate service in `server/services/`.
  5. Return the formatted result.
- **Database Queries**: Database queries must reside in `server/queries/` as reusable, typed query functions. Do not write raw Prisma calls inside services if the query can be reused.
- **UI Components Restrictions**: UI components in `components/` are strictly for presentation and client interaction. They must NEVER contain direct database access (`prisma.$...`).
- **Single Source of Truth for Types**: Shared types must be kept in `types/`. This is the absolute source of truth for TypeScript interfaces, DB schemas mapped to types, and component prop types that cross boundaries.
- **Hooks Segregation**: Custom hooks (`hooks/`) are strictly for client-side state, effects, and browser API interactions.
- **Utilities**: Utilities in `lib/` and `utils/` must be pure functions. They should take inputs, return outputs, and have zero side effects (no database calls, no network requests).
- **Component Organization**: Organize components by feature domain (e.g., `components/transactions/`, `components/accounts/`) rather than by generic types, except for highly reusable UI primitives (`components/ui/`).
- **Circular Dependencies**: No circular dependencies. Use tools like `madge` if necessary to detect and resolve them.
- **Server to Client Imports**: NEVER import from the `server/` directory inside client components (files marked with `"use client"`). This will bundle server code (and potentially secrets) into the client bundle or cause runtime crashes.

---

## 3. Naming Conventions

- **Files**: Use `kebab-case` for all files and directories (e.g., `transaction-form.tsx`, `balance.service.ts`, `use-click-outside.ts`).
- **Components**: Use `PascalCase` for React components (e.g., `TransactionForm`, `AccountCard`, `DashboardLayout`).
- **Functions & Variables**: Use `camelCase` for functions, methods, and variables (e.g., `getTransactions`, `calculateTotalBalance`, `isModalOpen`).
- **Constants**: Use `UPPER_SNAKE_CASE` for global, immutable constants (e.g., `MAX_FILE_SIZE`, `DEFAULT_CURRENCY`, `API_TIMEOUT_MS`).
- **Types & Interfaces**: Use `PascalCase` for types and interfaces. Do not prefix with 'I' or 'T' (e.g., use `Transaction` not `ITransaction`, use `CreateTransactionInput`).
- **Enums**: Use `PascalCase` for the enum name and `UPPER_SNAKE_CASE` for enum values (e.g., `enum TransactionType { EXPENSE = 'EXPENSE', INCOME = 'INCOME' }`).
- **Database Tables (Prisma)**: Use `PascalCase` for Prisma models (e.g., `model Transaction { ... }`). This will map to `snake_case` in the underlying MySQL database through Prisma's mapping configurations (`@@map("transactions")`).
- **Server Actions**: Name actions using a `verbNoun` structure (e.g., `createTransaction`, `updateAccount`, `deleteCategory`).
- **Query Functions**: Name data access functions describing their action: `getNoun` (single item), `listNouns` (multiple items), `findNounBy` (search) (e.g., `getTransaction`, `listAccounts`, `findCategoryByName`).
- **Booleans**: Prefix boolean variables with `is`, `has`, `should`, or `can` to clearly indicate their boolean nature (e.g., `isActive`, `hasAttachment`, `shouldRender`, `canEdit`).

---

## 4. Component Rules

- **React Server Components First**: Prefer React Server Components (RSC) by default. Do not use `"use client"` automatically.
- **When to use `"use client"`**: Only add `"use client"` when the component strictly requires:
  - Event handlers (`onClick`, `onChange`, `onSubmit`, etc.)
  - React state or lifecycle hooks (`useState`, `useEffect`, `useRef`, `useReducer`)
  - Browser-specific APIs (`window`, `document`, `localStorage`)
  - Custom hooks that rely on the above.
- **Component Size**: Keep client components extremely small and focused on the interactive layer.
- **RSC Composition**: Extract non-interactive parts of a UI into server components, passing the client components as children or props to maximize the benefits of RSCs.
- **Required UI States**: All components dealing with data must explicitly handle:
  - **Loading State**: Display a skeleton loader or spinner while data is fetching.
  - **Empty State**: Display a helpful message and a Call to Action (CTA) when no data exists (e.g., "No transactions found. Click here to add one.").
  - **Error State**: Gracefully handle errors with a clear message and a retry mechanism.
- **Destructive Actions**: Any destructive action (Delete, Archive, Reset) MUST require a confirmation dialog before proceeding.
- **Form Validation**: Forms must show validation errors inline, directly under or next to the offending input field.
- **Accessibility (a11y)**: All interactive elements must be keyboard accessible (tabbable, operable via Enter/Space) and possess appropriate ARIA labels where semantic HTML is insufficient.
- **UI Base**: Use `shadcn/ui` components as the foundational building blocks. Do not reinvent standard UI patterns (buttons, dialogs, dropdowns) unless the design dictates a completely custom behavior not supported by shadcn.
- **Strict Typing**: Component props must be strictly typed. Implicit `any` is forbidden.
- **HTML Element Extension**: When creating components that wrap standard HTML elements, use `React.ComponentPropsWithoutRef<'element'>` (e.g., `interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> { variant?: 'primary' | 'secondary' }`).

---

## 5. Database Rules

- **Access Layer**: NEVER directly manipulate the database outside of the Prisma ORM in the application code.
- **Migrations**: ALWAYS use Prisma migrations for any and all schema changes (`npx prisma migrate dev`).
- **Migration Immutability**: NEVER edit migration files (`.sql` files in `prisma/migrations/`) after they have been successfully applied to any database environment. If a mistake was made, create a new migration to fix it.
- **Pre-persistence Validation**: ALL data must be validated using Zod schemas before it is passed to Prisma for persistence. The database is the last line of defense, but validation must happen at the application boundary.
- **Transactions for Financial Ops**: ALL financial operations (e.g., creating a transfer that updates two account balances, deleting an income record) MUST use database transactions (`prisma.$transaction`) to ensure atomicity. Partial updates are catastrophic.
- **Soft Deletes**: Use soft deletes for transactions and accounts. Implement an `isDeleted` boolean flag or a `deletedAt` timestamp instead of physically removing rows (`DELETE`).
- **Query Exclusions**: Soft-deleted records must be explicitly excluded from ALL queries by default unless explicitly querying for a trash/recycle bin view.
- **Tenant Isolation**: Include proper `WHERE` clauses in every query. Always filter by `userId` to ensure users can only ever access their own data.
- **ID Exposure**: NEVER expose internal auto-incrementing integer IDs in URLs or API responses if they can be enumerated. Use CUIDs or UUIDs for all public-facing identifiers.
- **Indexing**: Add database indexes (`@@index`) in the Prisma schema for columns that are frequently used in `WHERE` clauses or `ORDER BY` operations (e.g., `userId`, `date`, `categoryId`).
- **Migration Testing**: Test migrations on a local development database thoroughly before applying them to production or staging environments.
- **Idempotent Seeding**: The database seed file (`prisma/seed.ts`) must be idempotent. It should be safe to run multiple times without creating duplicate reference data (like default categories).
- **Audit Timestamps**: Every model must include `@default(now())` for a `createdAt` field and `@updatedAt` for an `updatedAt` field.

---

## 6. Financial Data Rules — CRITICAL

> [!CAUTION]
> Violation of these rules compromises the core integrity of the application.

- **No JS Numbers for Money**: NEVER use the native JavaScript `number` type for financial calculations. Floating-point math will lead to precision errors (e.g., `0.1 + 0.2 === 0.30000000000000004`).
- **No Native Parsing**: NEVER use `parseFloat()` or `Number()` on monetary strings for arithmetic purposes.
- **Mandatory Decimal Library**: ALWAYS use `Decimal.js` (or Prisma's `Decimal` type which is based on `decimal.js`) for ALL money arithmetic (addition, subtraction, multiplication, division).
- **Database Storage**: Store money as `DECIMAL(15,2)` in MySQL. Do not store money as floats or integers (cents) unless explicitly redesigning the entire architecture, but the current standard is `DECIMAL(15,2)`.
- **Absolute Values**: Transaction amounts are ALWAYS stored as positive values. The `type` field (e.g., `EXPENSE`, `INCOME`) determines the direction of the cash flow.
- **Transfer Isolation**: Transfers between accounts are NEVER counted as overall user income or overall user expense. They only affect the individual balances of the source and destination accounts.
- **Balance Calculation Formula**: 
  `Account Balance = Opening Balance + Income - Expenses + Transfers In - Transfers Out`
- **No Silent Modification**: NEVER silently modify transaction amounts (e.g., arbitrary rounding, truncation to fit a UI component) during processing.
- **Auditability**: All balance calculations must be verifiable and auditable by recalculating the ledger of transactions.
- **Presentation Layer Formatting**: Currency symbol formatting (e.g., `৳ 1,500.00`) is strictly for display purposes. Never store formatted strings in the database. Add the currency symbol and commas at the very last step before rendering. All examples must use BDT (৳).
- **Rounding Rule**: When rounding is absolutely necessary (e.g., after applying a percentage split), use `ROUND_HALF_UP`, and do this ONLY at the point of storage, not during intermediate calculations.
- **Soft-Delete Exclusion**: Deleted transactions (soft-deleted) MUST be excluded from all financial calculations, reports, and balance updates.
- **Report Transparency**: Financial reports and charts must clearly state the date range and any filters applied (e.g., "Excluding Savings Account") so the user understands the context of the numbers.

---

## 7. API / Server Action Rules

- **Standard Operating Procedure**: Every server action MUST follow this exact sequence:
  1. **Authenticate**: Verify the user session exists and is valid.
  2. **Validate**: Parse and validate the input against a strict Zod schema.
  3. **Authorize**: Verify the authenticated user has permission to perform the action and owns the resources being accessed.
  4. **Execute**: Perform the core business logic (database updates, calculations).
  5. **Return**: Return a strictly typed result using the `ActionResult<T>` pattern.
- **Zero Trust**: NEVER trust client-side data. Even if a form validates on the client, you must re-validate the exact same data on the server.
- **Error Obfuscation**: NEVER expose stack traces, database schema details, or raw internal errors to the client.
- **User-Friendly Errors**: Catch internal errors and translate them into user-friendly error messages (e.g., "Unable to connect to the database" instead of `PrismaClientKnownRequestError: P1001`).
- **Standardized Response Format**: Use a consistent error/success format for all Server Actions:
```typescript
type ActionResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }
```
- **Transactional Integrity**: Operations modifying multiple records (e.g., deleting an account and soft-deleting all its transactions) must be wrapped in a database transaction.
- **Server-Side Logging**: Log errors server-side with sufficient context (timestamp, user ID, action name, sanitized input payload) for debugging purposes.
- **Rate Limiting**: Rate limit sensitive authentication endpoints (login, register, password reset) to prevent brute-force attacks.

---

## 8. Validation Rules

- **Zod Everywhere**: Use Zod for ALL input validation, parsing, and type inference.
- **Schema Location**: Define schemas in a centralized `lib/validators.ts` file, or within feature-specific validator files (e.g., `server/validators/transaction.schema.ts`).
- **Schema Sharing**: Export Zod schemas so they can be used both by `react-hook-form` (via resolvers) on the client, and by Server Actions on the server.
- **Required Validation Constraints**:
  - **Transaction Amount**: Must be a positive number, maximum of 15 total digits, up to 2 decimal places.
  - **Transaction Date**: Must be a valid date. Cannot be in the distant future (e.g., > 1 year from today) to prevent anomalies.
  - **Account Name**: String, 1-100 characters in length, trimmed of leading/trailing whitespace.
  - **Category Name**: String, 1-50 characters in length, trimmed.
  - **Budget Amount**: Must be a positive number.
  - **Email**: Must conform to a valid email format string.
  - **Password**: Minimum 8 characters. Must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number.
  - **File Upload (Receipts)**: Check allowed MIME types (e.g., `image/jpeg`, `image/png`, `application/pdf`). Enforce a maximum file size of 5MB.
  - **Tags**: Array of strings. Each tag 1-30 characters. Maximum 10 tags per transaction.
  - **Notes**: String, maximum 500 characters.
  - **Merchant**: String, maximum 100 characters.

---

## 9. UI / UX Rules

- **Design System**: Strictly follow the design system defined in `design.md`. Do not introduce new colors, font sizes, or spacing variables ad-hoc.
- **Semantic Colors**: Use semantic colors consistently across the app:
  - Green (`text-green-600`, `bg-green-100`) strictly for **Income** and positive balances.
  - Red (`text-red-600`, `bg-red-100`) strictly for **Expenses** and negative balances.
  - Blue (`text-blue-600`, `bg-blue-100`) strictly for **Transfers** and neutral informational elements.
- **Monospace Typography for Finance**: Financial amounts MUST ALWAYS be displayed in a monospace font (or using `tabular-nums` in Tailwind) so digits align vertically in lists and tables.
- **Alignment**: Amounts MUST ALWAYS be right-aligned in tables and lists to ensure decimal points line up.
- **Form UX Flow**: All forms must implement the following flow:
  - Show a clear loading state (spinner inside the button, text changes to "Saving...") on the submit button.
  - Disable the submit button and all inputs while processing to prevent double-submissions.
  - Show inline validation errors immediately upon blur or failed submission.
  - Clear, reset, or redirect appropriately upon a successful response.
- **Confirmation Guards**: All delete actions and bulk operations require an explicit user confirmation dialog.
- **Toast Notifications**: 
  - Success feedback: Show a success toast that auto-dismisses after 3 seconds.
  - Error feedback: Show an error toast that either requires manual dismissal or lasts at least 5-7 seconds to ensure readability.
- **Initial Loading Experience**: Use Skeleton UI components (shimmer effects) for initial page loads and major block rendering.
- **Secondary Loading Experience**: Use standard spinners for button loading states or small inline data fetching (e.g., loading a chart within a card).
- **Empty States**: Empty states cannot just be blank space. They must contain a helpful illustration or icon, a descriptive message, and a primary action button to get started.
- **Date Display Consistency**: Date formats must be consistent throughout the application. Respect user preferences if implemented; otherwise, standardize on a clear format (e.g., `DD MMM YYYY`).
- **Responsive Mandate**: Every single feature, table, chart, and form must be fully functional and visually acceptable on a mobile viewport (320px - 480px width).
- **Theme Support**: The application supports Dark Mode. Every new component created must be verified to look correct in both light and dark themes using Tailwind's `dark:` variant.

---

## 10. Security Rules

- **Default Deny Authentication**: ALL routes (except explicitly public ones like `/login`, `/register`, `/landing`) must be protected by Next.js middleware checking for a valid session.
- **Server Action Protection**: Middleware is not enough. ALL server actions must independently verify the session using NextAuth's `getServerSession` before executing any logic.
- **Data Isolation**: ALL database queries MUST filter by `userId`. Never write a query that could accidentally return another user's data. 
- **Input Sanitization**: While Prisma protects against SQL injection, you must sanitize user inputs (like Notes or Merchant fields) if rendering them in contexts where XSS is possible, although React handles most of this automatically.
- **Upload Validation Integrity**: Validate file uploads on the server. Check the actual MIME type by reading the file buffer signature (magic numbers), do not trust the client-provided file extension or `Content-Type` header. Enforce strict size limits.
- **Secure Storage**: Store uploaded files (receipts) OUTSIDE the public web directory. Serve them via authenticated API routes to ensure unauthorized users cannot view receipt images.
- **Session Security**: Use HTTP-only, secure (HTTPS) cookies for session tokens. NextAuth handles this by default, do not override it with less secure settings.
- **Security Headers**: Set appropriate security headers in `next.config.js` (Content Security Policy, X-Frame-Options, X-Content-Type-Options).
- **No Sensitive Logging**: Never log sensitive data (passwords, session tokens, full credit card numbers, PII) to standard output or third-party logging services.
- **Password Hashing**: Use `bcrypt` with a minimum of 12 salt rounds for password hashing. Never store plain text passwords.
- **Brute Force Protection**: Implement rate limiting specifically on the login and register routes (e.g., maximum 5 failed attempts per minute per IP address).

---

## 11. Performance Rules

- **Minimize Client JS**: Use React Server Components by default to send zero JavaScript to the client for static or purely presentational UI.
- **Lazy Loading**: Lazy load heavy components like charting libraries (Recharts, Chart.js), complex modals, and below-the-fold content using Next.js `dynamic()` imports.
- **Pagination Required**: Never fetch unbound lists of data. Paginate lists (transactions, categories) with a strict maximum of 50 items per page.
- **Cursor Pagination for Feeds**: For continuous feeds like the main transaction list, use cursor-based pagination (using the transaction `id` or `createdAt` as the cursor) rather than offset pagination for better performance on large datasets.
- **Asset Optimization**: Optimize images. Use `next/image` which handles format conversion (WebP/AVIF), resizing, and lazy loading automatically.
- **Targeted Database Fetching**: In Prisma, use the `select` object to fetch only the specific fields required by the component, rather than pulling entire rows (`SELECT *`) into memory.
- **N+1 Query Prevention**: Avoid N+1 queries. If you need a list of transactions and their associated categories, use Prisma's `include` to fetch them in a single optimized joined query, or use batching techniques.
- **Database Tuning**: Add indexes for all columns that are frequently filtered against (`date`, `type`), sorted by, or used in foreign key relationships.
- **Caching Strategy**: Cache static or infrequently changing data (e.g., standard system categories, account types) in memory or using Next.js data cache to reduce database load.

---

## 12. Error Handling Rules

- **No Silent Failures**: NEVER swallow errors silently. `try { ... } catch (e) { }` with an empty catch block is strictly prohibited.
- **Boundary Management**: Catch errors at appropriate architectural boundaries.
- **Server Action Errors**: Server actions should use `try/catch` blocks. The catch block should log the error and return a standardized `ActionResult` indicating failure, rather than throwing an exception that crashes the request.
- **Component Error Boundaries**: Use React Error Boundaries for unexpected client-side runtime errors to prevent the entire UI tree from crashing. Show a localized fallback UI.
- **Page-Level Errors**: Use Next.js `error.tsx` conventions for handling catastrophic page-level data fetching failures.
- **Form Error Routing**: Inline errors are for user-correctable field validation. Toast notifications are for server rejections or unexpected network failures.
- **Transaction Rollbacks**: For financial operations wrapped in `prisma.$transaction`, if ANY step throws an error, allow the transaction to naturally roll back. Do not attempt to manually compensate for partial failures.
- **Contextual Logging**: When logging errors server-side, include actionable context: the `userId` attempting the action, the specific action being performed, and a sanitized summary of the input data that caused the failure.
- **User Empathy**: User-facing error messages must be helpful, non-technical, and actionable. (e.g., "We couldn't save your transaction right now. Please try again." instead of "Error 500: Database lock timeout").

---

## 13. Git / Version Control Rules

- **Conventional Commits**: Commit messages must follow the conventional commits specification:
  - `feat: add transaction creation form`
  - `fix: correct balance calculation for cross-currency transfers`
  - `refactor: extract money arithmetic utilities`
  - `docs: update architecture.md with new budget schema`
  - `chore: update dependencies to latest minor versions`
  - `style: format code with prettier across components`
- **Strictly Ignored Files**: Never commit the following:
  - `.env` or `.env.local` files (always maintain a clean `.env.example`).
  - `node_modules/` directories.
  - Directories containing user uploaded files (e.g., `/public/uploads`).
  - IDE-specific configurations (`.vscode/` unless containing shared workspace settings/extensions).
- **Branching Strategy**: Use a simplified branching model:
  - `main` — Represents production-ready code. Commits here should be deployable.
  - `dev` — The primary development branch where features are integrated.
  - Feature/Fix branches: Create branches off `dev` named descriptively (e.g., `feat/transaction-crud`, `fix/balance-calculation`).
- **Migration Immutability in Git**: Migration files are source code. They must always be committed. Once a migration is pushed to `dev` or `main`, it is immutable.
- **Review Protocol**: Database migrations require careful review before applying to any shared environment.

---

## 14. Testing Rules (V1.1+)

- **Critical Path Priority**: Testing must prioritize the core functionality that prevents data corruption and ensures application utility:
  - **Balance Calculation**: Ensure balances sum correctly across all edge cases.
  - **Transaction CRUD**: Ensure records are created, updated, and soft-deleted properly.
  - **Transfer Logic**: Verify transfers deduct from source and add to destination without altering global net income/expense.
  - **Budget Calculation**: Verify budget progress accurately reflects categorized spending.
  - **Authentication Flow**: Ensure users can log in, register, and cannot access protected routes while unauthenticated.
  - **Input Validation**: Verify Zod schemas reject invalid data.
- **Tooling**: 
  - Use **Vitest** for all unit and integration tests (services, utilities, components).
  - Use **Playwright** for end-to-end (E2E) testing of critical user journeys.
- **Financial Edge Case Testing**: Tests for financial calculations must explicitly cover:
  - Zero amount transactions.
  - Very large amounts (approaching the `DECIMAL(15,2)` limit).
  - Operations with many decimal places (ensuring truncation/rounding behaves as expected).
  - Concurrent modifications (simulating race conditions on balance updates).

---

## 15. Documentation Rules

- **Living Documentation**: Keep documentation files in the repository root updated synchronously when features change. Stale documentation is worse than no documentation.
- **Task Tracking**: Update `tasks.md` immediately after completing tasks or discovering new requirements.
- **Decision Log**: Update `memory.md` when important architectural, product, or technical decisions are made, noting the rationale.
- **Schema Docs**: Update `architecture.md` immediately when the database schema changes, detailing new tables, columns, or relationships.
- **Commenting Philosophy**: Code comments should explain **WHY** a specific approach was taken or business rule exists. Do not explain **WHAT** the code is doing if it is obvious from reading the syntax.
- **JSDoc Requirement**: Complex business logic functions (in `/services` or `/utils`) must have JSDoc comments defining the parameters, expected return types, and potential side effects or thrown errors.
- **API Documentation**: Document all API routes and Server Actions regarding their expected input payloads and return structures.

---

## 16. AI Coding Agent Rules — CRITICAL

> [!IMPORTANT]
> The AI coding agent (Antigravity, Cursor, Claude, GitHub Copilot, etc.) operating in this workspace MUST adhere to these operational directives at all times.

### Before Making Changes
- **Context Gathering**: You must read `prd.md` to understand the overarching product requirements and goals.
- **Architecture Review**: You must read `architecture.md` to understand the technical architecture, database schema, and folder conventions.
- **Rule Enforcement**: You must internalize `rules.md` (this file) to understand the strict coding standards and guardrails.
- **Design Alignment**: You must read `design.md` to understand the UI/UX requirements, color palettes, and component behaviors.
- **Task Awareness**: You must read `tasks.md` to understand the current development status, pending objectives, and active sprint goals.
- **Historical Context**: You must read `memory.md` to understand the project context, prior constraints, and past decisions to avoid repeating mistakes.

### During Development
- **Strict Compliance**: Follow ALL rules defined in this document without exception.
- **No Silent Deviations**: Do NOT silently change documented requirements, schemas, or behaviors. If an optimization requires a deviation, propose it explicitly first.
- **No Feature Creep**: Do NOT invent features, screens, or data models that are not explicitly defined in `prd.md`.
- **Mandatory Defenses**: Do NOT skip input validation, authentication checks, or comprehensive error handling to save time or tokens.
- **Type Rigidity**: Do NOT use the `any` type or `@ts-ignore` without a documented, valid, and unavoidable reason.
- **Dependency Justification**: Do NOT add new dependencies (`npm install`) without explicitly justifying why it is superior to writing a custom utility.
- **Conflict Resolution**: If requirements in the PRD conflict with the Architecture or Design documents, STOP writing code and identify the conflict to the user for resolution.

### After Completing Work
- **Task Management**: Update `tasks.md` — mark completed tasks as done, and append any new sub-tasks or edge cases discovered during implementation.
- **Knowledge Retention**: Update `memory.md` — record important implementation decisions, workarounds, or context changes.
- **Architecture Sync**: Update `architecture.md` — if the database schema or folder architecture was modified during the task.
- **Responsive Verification**: Ensure the generated UI code works on both desktop and mobile viewports by using standard Tailwind responsive prefixes (`sm:`, `md:`, `lg:`).
- **Theme Verification**: Ensure dark mode compatibility is included in the markup (`dark:bg-gray-800`).

### NEVER
- NEVER implement features not documented in `prd.md` without explicit user approval.
- NEVER change the database schema without updating `architecture.md` to reflect the new state.
- NEVER remove or weaken validation rules to make tests pass or simplify form submission.
- NEVER use floating-point arithmetic (`Number`, `parseFloat`) for money calculations. Always use `Decimal.js`.
- NEVER skip authentication or authorization checks on Server Actions or API routes.
- NEVER hardcode values (magic numbers, URLs, standard categories) that should be configurable or stored in the database.
- NEVER leave `// TODO` or `// FIXME` comments in the code without creating a corresponding entry in `tasks.md` to track it.
