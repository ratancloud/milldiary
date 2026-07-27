# 🌾 MillDiary — AI-Powered Mill ERP & Financial Ledger

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Google Gemini AI](https://img.shields.io/badge/Google_Gemini-Flash-8E75B2?style=for-the-badge&logo=google)](https://ai.google.dev/)

---

## 🎯 Executive Summary & Project Overview

**MillDiary** is a state-of-the-art, AI-enhanced Enterprise Resource Planning (ERP) and daily accounting application designed specifically for agricultural grain mills, flour mills (Chakki), and oil processing plants (Sarso / Mustard oil mills). 

In traditional mill operations, tracking daily commodity inputs (wheat, mustard seeds), processed outputs (flour, oil, khari/oilseed cake), customer credit ledgers, staff wages, and household expenses is done via cumbersome handwritten registers. **MillDiary** digitizes and automates this workflow through:
- **AI-Powered OCR Register Scanning:** Instantly digitizes handwritten Indian register sheets using Google Gemini Flash models with image enhancement and anti-hallucination village master matching.
- **Granular Financial & Weight Accounting:** Tracks daily credit (revenue/production) and debit (raw material costs, operational expenses, home withdrawals) down to the kilogram and rupee.
- **Automated Daily Operations:** Features IST-timezone aware serverless cron jobs to ensure zero-gap daily accounting records.
- **Interactive Visual Analytics:** Real-time dashboards visualizing monthly income trends, net savings, and commodity breakdown charts.
- **One-Click Accounting Exports:** Generates clean, professional Excel (`.xlsx`) spreadsheets formatted with custom financial headers and summary totals.

---

## 🛠️ Technology Stack & Architecture

The application is built on a modern **Full-Stack Next.js App Router** architecture, prioritizing type safety, server-side performance, and seamless AI integration.

| Layer | Technology | Version | Description & Purpose |
| :--- | :--- | :--- | :--- |
| **Core Framework** | [Next.js](https://nextjs.org/) | `16.2.11` | React framework utilizing App Router, API Routes, and Server Actions. |
| **UI Library** | [React](https://react.dev/) | `19.2.3` | Latest React library utilizing modern hooks and server components. |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | `^5.0` | End-to-end static typing across database schemas, APIs, and UI. |
| **Database & ORM** | [Prisma](https://www.prisma.io/) / PostgreSQL | `^7.2.0` | ORM configured with `@prisma/adapter-neon` for serverless PostgreSQL on Neon. |
| **Authentication** | [Better-Auth](https://www.better-auth.com/) | `^1.6.22` | Modern, secure session-based authentication with Role-Based Access Control (`ADMIN`, `STAFF`). |
| **Artificial Intelligence** | [Google GenAI SDK](https://ai.google.dev/) | `^2.13.0` | Integrates `gemini-3.6-flash` and `gemini-2.5-flash` with structured JSON schema outputs for high-precision OCR. |
| **Image Processing** | [Sharp](https://sharp.pixelplumbing.com/) | `^0.35.3` | Pre-processes uploaded register images (auto-rotation, contrast normalization, sharpening) before feeding to LLM. |
| **Styling & UI Design** | Tailwind CSS / Radix UI | `v4.0` | Modern utility-first styling with accessible Radix primitives, Lucide icons, and `next-themes` dark mode. |
| **Form Management** | React Hook Form + Zod | `^7.69` / `^4.2` | Strict client-side and server-side validation for complex accounting entries. |
| **Visualization & Export** | Recharts / ExcelJS | `^2.15` / `^4.4` | Interactive financial charting and client-side `.xlsx` spreadsheet generation via `file-saver`. |

---

## 🗄️ Database Architecture & Domain Model

The database is structured around user ownership, secure session management, and comprehensive daily mill metrics.

```
+----------------+       1:N       +-------------------+
|      User      | <-------------- |     MillData      |
+----------------+                 +-------------------+
| id             |                 | id, date, userId  |
| email, role    |                 | [Credits & Debits]|
+----------------+                 +-------------------+
  ^            ^
  | 1:N        | 1:N
+---------+  +---------+
| Session |  | Account |
+---------+  +---------+
```

### 1. `User` & Authentication Tables (`Session`, `Account`, `Verification`)
- Manages user identity, OAuth/password credentials, active sessions, and access roles (`ADMIN` vs. `STAFF`).
- All financial records in `MillData` cascade on user deletion.

### 2. Core Domain: `MillData` (`mill_data`)
A unique daily ledger entry per user (`@@unique([userId, date])`).

| Category | Fields | Description |
| :--- | :--- | :--- |
| **Identity & Time** | `id`, `userId`, `date` | CUID primary key, relational owner, and strict calendar date (`@db.Date`). |
| **Mill Credits (Inflows)** | `millCredit`<br>`flourWeight`, `flourRs`<br>`oilWeight`, `oilRs`<br>`khariWeight`, `khariRs`<br>`totalCredit` | Tracks general mill credit and specific weight (Kg) and revenue (Rs) for Flour (Atta), Mustard Oil, and Oilseed Cake (Khari). `totalCredit` is dynamically computed and stored. |
| **Mill Debits (Outflows)** | `sarsoWeight`, `sarsoRs`<br>`gehumWeight`, `gehumRs`<br>`staff1Rs`, `staff2Rs`, `staffDescription`<br>`millDebit`, `millDescription`<br>`homeDebit`, `homeDescription`<br>`totalDebit` | Tracks raw material procurement (Mustard seeds & Wheat), staff wages, operational mill maintenance expenses, and personal home withdrawals. `totalDebit` is dynamically computed and stored. |

---

## 📡 API Endpoints Specification

All API routes follow a unified response structure (`ApiResponse<T>`) returning JSON with HTTP status codes:
```json
// Success Response (2xx)
{ "success": true, "data": { ... } }

// Error Response (4xx / 5xx)
{ "success": false, "message": "Error explanation", "errors": [ ... ] }
```

### 1. Daily Ledger Management (`/api/mill-data`)
- **`GET /api/mill-data?year={YYYY}&month={MM}`**
  - **Auth:** Required (Session Cookie).
  - **Description:** Retrieves chronological daily entries for the specified month and computes aggregate totals.
  - **Response:** `200 OK`
    ```json
    {
      "success": true,
      "data": {
        "items": [ { "id": "...", "date": "2026-07-01T00:00:00.000Z", "millCredit": 1500, "totalCredit": 8500, "totalDebit": 4200, ... } ],
        "totals": { "millCredit": 45000, "flourWeight": 1250.5, "flourRs": 37500, "totalCredit": 250000, "totalDebit": 180000, ... }
      }
    }
    ```

- **`POST /api/mill-data`**
  - **Auth:** Required.
  - **Request Body:** JSON matching `createMillDataValidator` (date, credits, weights, debits, descriptions).
  - **Description:** Validates input, checks for duplicate dates (`409 Conflict`), calculates `totalCredit` and `totalDebit`, and creates the record.
  - **Response:** `201 Created` returning the created object.

### 2. Single Record Operations (`/api/mill-data/[id]`)
- **`GET /api/mill-data/[id]`**
  - **Auth:** Required (Owner verification).
  - **Description:** Fetches a specific daily ledger entry by its ID.
- **`PATCH /api/mill-data/[id]`**
  - **Auth:** Required (Owner verification).
  - **Request Body:** Partial JSON matching `updateMillDataValidator`.
  - **Description:** Updates provided fields, re-calculates `totalCredit` and `totalDebit` combining new and existing values, and persists changes.

### 3. AI Handwritten Register Extraction (`/api/form-data`)
- **`POST /api/form-data`**
  - **Auth:** Public / Session.
  - **Request Body:** `multipart/form-data` containing an `image` File (handwritten sheet).
  - **Description:** 
    1. Converts image to buffer and enhances it using `sharp` (auto-rotation, normalization, sharpening).
    2. Sends enhanced base64 image to Google Gemini (`gemini-3.6-flash`) with a strict JSON schema prompt.
    3. Maps village abbreviations to a predefined `MASTER_VILLAGES` list (e.g., Agiaon Bazar, Piro, Garhani) to eliminate OCR hallucination.
  - **Response:** `200 OK`
    ```json
    {
      "success": true,
      "records": [
        {
          "sn": 1,
          "name_english": "Ramesh Yadav",
          "name_hindi": "रमेश यादव",
          "village_english": "Agiaon Bazar",
          "village_hindi": "अगियांव बाजार",
          "weight": 25.5,
          "confidence": "HIGH",
          "box_2d": [120, 50, 180, 950]
        }
      ],
      "enhancedImage": "data:image/jpeg;base64,..."
    }
    ```

### 4. Financial Analytics Dashboard (`/api/dashboard`)
- **`GET /api/dashboard?year={YYYY}`**
  - **Auth:** Required.
  - **Description:** Aggregates an entire year's worth of data into 12 monthly buckets and yearly KPIs.
  - **Response:** `200 OK`
    - `summary`: Yearly totals, `netIncome` (`totalCredit - mill expenses`), and `netSaving` (`totalCredit - totalDebit`).
    - `monthlyCredit`: 12-month breakdown of Flour, Oil, Khari, and Mill credits.
    - `monthlyMillDebit`: 12-month breakdown of Wheat, Mustard seed, Staff, and Mill maintenance debits.
    - `monthlyHomeDebit`: 12-month breakdown of personal home withdrawals.

### 5. Automated Daily Cron Job (`/api/cron/create-daily-mill-data`)
- **`GET /api/cron/create-daily-mill-data`**
  - **Security:** Protected by `Authorization: Bearer <CRON_SECRET>`.
  - **Description:** Designed to be called by Vercel Cron or external schedulers at midnight. Calculates the exact date in Indian Standard Time (`Asia/Kolkata`), checks if an entry exists for the target user, and performs an atomic `upsert` with default `0` values.

---

## 💡 Key Product Features

1. **AI Register Digitization (Smart OCR):** Built specifically for rural/semi-urban Indian grain mills where ledgers are handwritten in Hindi and English. Detects customer names, exact weights, and village names with confidence ratings and 2D bounding boxes.
2. **Dynamic Spreadsheet Generation:** Export any month's ledger to Excel with one click. Generated spreadsheets feature styled black/white headers, auto-formatted dates, and bolded totals rows ready for auditing or accounting.
3. **Dual-Expense Tracking (Mill vs. Home):** Distinctly separates operational mill debits (raw materials, staff wages, machine repairs) from personal household withdrawals (`homeDebit`), allowing mill owners to see true business profitability vs. net personal savings.
4. **Responsive Theme & Premium UI:** Crafted with dark/light glassmorphic UI, responsive tables, interactive date pickers, and smooth toast notifications.

---

## 🚀 Project Manager's Evaluation & Strategic Roadmap

As a Project Manager, this codebase exhibits a clean structure, strong typing, and innovative use of AI. However, to scale from an MVP to an enterprise-grade SaaS platform for agricultural processing units, the following improvements are recommended:

### 🔴 High Priority (Security, Technical Debt & Stability)
1. **Remove Hardcoded AI API Keys:** 
   - *Current State:* `app/api/form-data/route.ts` contains a fallback hardcoded API key (`'AQ.Ab8RN6L0...'`).
   - *Recommendation:* Remove fallback strings immediately and enforce `process.env.GEMINI_API_KEY` validation at startup using Zod environment schemas.
2. **Consolidate OCR Service Modules:**
   - *Current State:* OCR logic exists in both `app/api/form-data/route.ts` (using `gemini-3.6-flash`) and `lib/ocr.ts` (using `gemini-2.5-flash` with redundant implementation).
   - *Recommendation:* Refactor the API route to import and consume a single, unified `extractRegisterData()` service from `lib/ocr.ts` to maintain DRY principles and consistent AI model versioning.
3. **Dynamic User Cron Scheduling:**
   - *Current State:* `app/api/cron/create-daily-mill-data/route.ts` hardcodes a single user email (`mill@gmail.com`).
   - *Recommendation:* Upgrade the cron job to query all active users who have enabled "Automated Daily Log Creation" in their settings, or implement a background task queue (e.g., BullMQ or Inngest).
4. **Rate Limiting & File Size Restrictions:**
   - *Recommendation:* Add rate-limiting middlewares (e.g., Upstash Rate Limit) and strict file size restrictions (max 5MB) on the OCR image upload endpoint to prevent DDoS attacks and excessive LLM token billing.

### 🟡 Medium Priority (Performance & User Experience)
1. **Database Indexing Optimization:**
   - *Recommendation:* Add database indices on `[userId, date(sort: Desc)]` and composite indices for dashboard analytical queries in `schema.prisma` to maintain sub-100ms response times as historical data grows over years.
2. **Client-Side Caching & Optimistic UI:**
   - *Recommendation:* Integrate TanStack Query (React Query) or SWR on frontend client components (`MillDataClient.tsx`, `DashboardClient.tsx`) to eliminate redundant network requests when switching months and provide optimistic UI updates during edits.
3. **Error Logging & Monitoring:**
   - *Recommendation:* Integrate Sentry or Datadog to capture real-time server action failures, Prisma connection timeouts, and Gemini OCR parsing exceptions.

### 🟢 Long-Term Product Roadmap (Next 2 Quarters)
1. **Q3: Customer Ledger & Udhaar Khata Module:**
   - Connect OCR-scanned names and villages directly to a persistent customer database. Allow mill owners to track individual customer credit balances (Udhaar), send WhatsApp payment reminders, and record installments.
2. **Q3: Inventory & Stock Management:**
   - Auto-calculate real-time stock levels of Wheat (`Gehum`), Mustard (`Sarso`), Flour (`Atta`), and Oil. Alert operators when raw seed stock falls below threshold levels.
3. **Q4: Multi-Language / Vernacular Localization (L10n):**
   - Provide a toggle for full Hindi (हिन्दी) and regional language UI interfaces, making the application accessible to rural mill operators and floor staff.
4. **Q4: Offline-First PWA Capabilities:**
   - Turn the web app into a Progressive Web App (PWA) with local IndexedDB storage so mill workers can log weights without internet connectivity and sync automatically when online.

---

## 💻 Getting Started & Setup Instructions

### Prerequisites
- Node.js (`v20+` recommended)
- npm, yarn, pnpm, or bun
- PostgreSQL database instance (e.g., [Neon](https://neon.tech), Supabase, or local PostgreSQL)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/ratan-kumar-git/milldiary.git
cd milldiary
npm install
```

### 2. Environment Variables Setup
Create a `.env` file in the project root with the following keys:
```env
# Database Connection (Neon / PostgreSQL)
DATABASE_URL="postgresql://user:password@ep-xxxx.region.aws.neon.tech/neondb?sslmode=require"

# Better Auth Configuration
BETTER_AUTH_SECRET="your-super-secret-auth-key-min-32-chars"
BETTER_AUTH_URL="http://localhost:3000"

# Google Gemini API Key (For AI OCR Sheet Scanning)
GEMINI_API_KEY="your-google-gemini-api-key"

# Cron Job Security Token
CRON_SECRET="your-secure-cron-secret-token"
```

### 3. Database Migration & Client Generation
Run Prisma commands to generate the type-safe client and deploy schemas to your database:
```bash
# Generate Prisma Client (outputs to ./generated/prisma)
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Repository Structure Overview

```
milldiary/
├── app/                      # Next.js App Router
│   ├── (auth)/               # Authentication layouts & pages
│   ├── (main)/               # Main application pages (Dashboard, Mill Data, Profile)
│   └── api/                  # Backend REST API routes
│       ├── auth/             # Better-Auth endpoints
│       ├── cron/             # IST-aware daily initialization cron
│       ├── dashboard/        # Yearly & monthly analytics endpoint
│       ├── form-data/        # AI OCR image processing endpoint
│       └── mill-data/        # Daily ledger CRUD endpoints
├── components/               # Reusable React components (UI primitives, Forms, Charts)
├── lib/                      # Core backend utilities
│   ├── api-response.ts       # Standardized API response wrappers
│   ├── auth.ts               # Better-Auth server configuration
│   ├── handleExportToExcel.ts # ExcelJS spreadsheet generation engine
│   ├── helper.ts             # Number formatting & server-side totals calculator
│   ├── ocr.ts                # Google Gemini AI & Sharp OCR service
│   ├── prisma.ts             # Singleton Prisma DB client
│   └── validators/           # Zod schemas for API & form validation
├── prisma/                   # Database schema and configuration
│   └── schema.prisma         # Domain models (User, MillData, Session, Account)
├── types/                    # TypeScript interfaces for dashboards & mill data
└── public/                   # Static assets & icons
```

---

## 📄 License & Ownership

Developed and maintained by **Ratan Kumar** for Next.js agricultural and mill enterprise management.
