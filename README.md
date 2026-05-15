---

# BRAC Bank Credit Analysis Portal

The BRAC Bank Credit Analysis Portal is a modern, web-based application designed for the Credit Technology Division to streamline the evaluation of corporate and SME borrowers. It enables credit analysts to upload audited financial statements, automatically extract and spread financial data using firm-specific templates, calculate regulatory scores (ICRR, FSS, CRG), and generate comprehensive AI-driven credit memos. By automating manual data entry and standardizing compliance checks against Bangladesh Bank guidelines, the portal significantly reduces review turnaround times and enhances the accuracy of credit committee submissions.

---

## Table of Contents
- Tech Stack
- Project Structure
- Pages & Features
- Mock Data
- Output Modules
- Docker Setup
- Vercel Deployment
- Local Development
- Demo Credentials
- Known Limitations

---

## Tech Stack
| Package | Version | Purpose |
|---------|---------|---------|
| @tailwindcss/vite | ^4.3.0 | Vite plugin for Tailwind CSS integration. |
| jspdf | ^4.2.1 | Generates PDF reports of credit reviews. |
| jspdf-autotable | ^5.0.7 | Creates tables within the generated PDF reports. |
| lucide-react | ^1.16.0 | Provides SVG icons used throughout the UI. |
| react | ^19.2.6 | Core library for building the user interface. |
| react-dom | ^19.2.6 | Renders React components into the DOM. |
| react-router-dom | ^7.15.1 | Handles client-side routing and navigation. |
| recharts | ^3.8.1 | Renders charts for the ratio dashboard and trend analysis. |
| tailwindcss | ^4.3.0 | Utility-first CSS framework for styling components. |
| xlsx-js-style | ^1.2.0 | Generates and styles Excel workbooks for financial data export. |

---

## Project Structure
```text
src/
├── App.tsx - Main application component and route definitions
├── index.css - Global styles and Tailwind CSS configuration
├── main.tsx - Application entry point
├── vite-env.d.ts - TypeScript declarations for Vite
├── components/
│   ├── BorrowerHeaderStrip.tsx - Displays borrower summary details in results
│   ├── ExcelExportTab.tsx - Renders Excel export preview and download button
│   ├── KPICard.tsx - Reusable KPI card component for dashboards
│   ├── MinWidthGuard.tsx - Enforces minimum screen width for the application
│   ├── NarrativeTab.tsx - Displays AI narrative and reliability scores
│   ├── Navbar.tsx - Top navigation bar with breadcrumbs and notifications
│   ├── ProcessingStrip.tsx - Animated progress strip for review processing
│   ├── RatioDashboard.tsx - Renders financial charts and ratio summaries
│   ├── Sidebar.tsx - Left sidebar navigation and review cycle progress
│   └── Toast.tsx - Toast notification component
├── mockData/
│   ├── aqasem.ts - Mock data for A. Qasem & Co.
│   ├── howladar.ts - Mock data for Howladar Yunus & Co.
│   ├── islam.ts - Mock data for Islam Afzal Parsons & Co.
│   ├── rrh.ts - Mock data for Rahman Rahman Huq & Co.
│   └── syful.ts - Mock data for Syful Shamsul Alam & Co.
├── pages/
│   ├── DashboardPage.tsx - Main dashboard with KPIs and recent reviews
│   ├── LoginPage.tsx - Authentication page
│   ├── NewReviewPage.tsx - Form to upload statements and start a review
│   ├── ResultsPage.tsx - Displays analysis results, charts, and exports
│   ├── ReviewQueuePage.tsx - Shows pending and overdue credit reviews
│   └── SettingsPage.tsx - Application settings and configurations
├── types/
│   └── mockData.ts - TypeScript definitions for mock data structures
└── utils/
    ├── excelExporter.ts - Logic for generating multi-sheet Excel workbooks
    ├── icrrBandStyles.ts - Utility functions for ICRR band styling
    └── pdfExporter.ts - Logic for generating PDF credit review reports
```

---

## Pages & Features

### Login Page (/)
Features a diagonal gradient background with decorative circles (5% white). The center card has a top border accent, brand mark, and floating label animations for the email and password inputs. It includes a password visibility toggle, a shake animation on validation failure (empty fields), footer text, and navigates to the dashboard upon successful submission.

### Dashboard (/dashboard)
Displays a time-aware greeting banner ("Good morning/afternoon/evening, Nazia."). Features 4 KPI cards with exact values and icons (Reviews This Month: 34, Pending Renewals: 12, Avg. Turnaround: 1.8 days, Facilities Flagged: 3). Includes a review cycle progress bar (FY2025 Annual Review, 68% Complete). The Recent Reviews table shows columns for Borrower, Audit Firm, Sector, Review Date, ICRR, and Status, with search and sorting capabilities, a skeleton loader, row click navigation to results, and a "New Review" button.

### New Review (/new-review)
Features a 3-step stepper (Firm, File, Analysis). Includes a dropdown to select from 5 audit firms (A. Qasem & Co., Rahman Rahman Huq & Co., M/S Howladar Yunus & Co., Syful Shamsul Alam & Co., Islam Afzal Parsons & Co.) with their subtitles. The PDF dropzone supports drag-over states, displays a file card upon upload, and has a remove button. The "Run Analysis" button is enabled only when a firm and file are selected. Clicking it triggers the ProcessingStrip with 3 step labels (Detecting audit firm layout, Extracting financial line items, Calculating regulatory scores) and exact timings (2000ms, 4000ms, 6000ms, navigating at 6800ms).

### Review Queue (/review-queue)
Displays 4 stat cards (Pending Review: 12, In Progress: 5, Overdue: 3, Completed This Month: 34). The table includes columns for Priority, Borrower, Sector, Facility (BDT M), Analyst Assigned, Due Date, Days Remaining, Status, and Action. It lists all 12 borrower rows with their respective priority (1, 2, 3), status, analyst, and due date. Includes a search filter and a "Review" button that navigates to the New Review page.

### Results (/results)
Includes an empty state guard if accessed without a selected review. The header features the borrower name, audit firm, review date, an ICRR badge with color logic for all 5 bands (Strong, Good, Acceptable, Marginal, Unacceptable), and a "Download Report" button with a loading state. The borrower detail strip displays 6 columns (Last Review, Next Due, With BRAC Bank). It has 3 tabs: Ratio Dashboard, Excel Export, and AI Narrative. The Download Report button generates a PDF.

### Settings (/settings)
Contains 5 left-nav sections:
1. **User Profile**: Fields for Full Name, Email, Phone, Department, and Branch.
2. **Notifications**: 6 toggles (Email alerts for overdue reviews [on], Email digest [on], SMS alerts for covenant breaches [off], In-app notifications [on], Bangladesh Bank circular updates [on], Weekly performance report [off]).
3. **Audit Firm Templates**: Cards for all 5 supported audit firms detailing their extraction capabilities.
4. **Regulatory Thresholds**: Table detailing thresholds for DSCR, Current Ratio, Debt/Equity, Interest Coverage, Leverage Ratio, and ICRR Score across Healthy, Watch, Critical, and Guideline columns.
5. **System Information**: Fields for Application Version, Deployment Environment, Last Deploy, Uptime, OCR Engine, Bangladesh Bank Compliance, and Data Residency, plus 3 compliance certificates (Bangladesh Bank BRPD Compliance, ISO 27001 Data Security, ICAB Auditor Registry Integration).

---

## Mock Data

| Firm Key | Audit Firm | Borrower | Sector | ICRR Score | ICRR Band | Facility Limit | Covenant Breaches |
|----------|------------|----------|--------|------------|-----------|----------------|-------------------|
| aqasem | A. Qasem & Co. Chartered Accountants | Anwar Textile Mills Ltd. | Ready Made Garments (RMG) | 72 | Good | BDT 118.0 Million | 0 |
| rrh | Rahman Rahman Huq & Co. (KPMG Bangladesh) | Bengal Agro Processing Ltd. | Food & Agro Processing | 65 | Acceptable | BDT 92.5 Million | 0 |
| howladar | M/S Howladar Yunus & Co. | Padma Steel & Engineering Ltd. | Engineering & Metal Fabrication | 58 | Marginal | BDT 135.0 Million | 2 |
| syful | Syful Shamsul Alam & Co. | Dhaka Pharma Industries Ltd. | Pharmaceuticals (Formulations) | 79 | Strong | BDT 165.0 Million | 0 |
| islam | Islam Afzal Parsons & Co. | Chittagong Shipping Services Ltd. | Logistics & Coastal Shipping | 61 | Acceptable | BDT 88.0 Million | 0 |

The `MockData` TypeScript type shape includes:
- `borrower` (string)
- `auditFirm` (string)
- `reviewDate` (string)
- `financials`: Object with `years`, `revenue`, `costOfSales`, `grossProfit`, `operatingExpenses`, `ebitda`, `netProfit`, `totalAssets`, `totalLiabilities`, `equity`, `currentAssets`, `currentLiabilities`, `operatingCF`, `debtService` (all arrays of strings or numbers).
- `ratios`: Object with `dscr`, `currentRatio`, `debtToEquity`, `interestCoverage`, `leverageRatio` (all arrays of numbers).
- `regulatory`: Object with `icrrScore`, `icrrBand`, `fssScore`, `crgScore`, `covenantBreaches` (array of strings), `earlyWarnings` (array of strings).
- `narrative` (string)
- `borrowerDetails`: Object with `sector`, `subSector`, `established`, `employees`, `facilityType`, `facilityLimit`, `facilityOutstanding`, `lastReviewDate`, `nextReviewDue`, `relationshipYears`, `collateral`.
- `reliabilityScores`: Object with `completeness`, `consistency`, `auditorQuality`, `cashFlowMatch`, `taxAlignment`, `total`, `assessment`.
- `narrativeSections`: Object with `executiveSummary`, `financialPerformance`, `liquidityWorkingCapital`, `leverageDebt`, `covenantCompliance`, `riskFlags`, `recommendation`.

---

## Output Modules

### Excel Export
Contains 5 sheets:
1. **Spread Financials**: Income Statement, Balance Sheet, and Cash Flow with 3-year data and YoY % change.
2. **Ratio Analysis**: 5 key ratios over 3 years, thresholds, and latest status.
3. **ICRR Working Paper**: Input parameters, borrower profile, reliability scores, ratio inputs, covenant breaches, early warnings, and narrative excerpt.
4. **FSS-CRG Calculation**: Composite scores and illustrative component inputs for FSS and CRG.
5. **Trend Analysis**: Headline metrics (Revenue, EBITDA, Net Profit) with absolute and % changes over 3 years.
Number formatting uses `BDT #,##0` and `0.0%`. Filename format is `CreditReview_[Borrower]_[YYYYMMDD].xlsx`.

### PDF Export
Contains 4 pages:
1. **Cover Page**: Branding, report title, borrower name, audit firm, sector, facility details, review date, and regulatory scores (ICRR, FSS, CRG).
2. **Financial Statements**: 3-year spread for Income Statement, Balance Sheet, and Cash Flow.
3. **Ratio Analysis & Regulatory Assessment**: 3-year ratio trends, statuses, and color-coded score boxes for ICRR, FSS, and CRG.
4. **Credit Review Narrative**: AI-generated memo sections (Executive Summary, Financial Performance, Liquidity, Leverage, Covenants, Risk Flags, Recommendation).
Filename format is `CreditReview_[Borrower]_[YYYYMMDD].pdf`.

### AI Narrative
Contains 7 memo sections: Executive Summary, Financial Performance, Liquidity & Working Capital, Leverage & Debt Structure, Covenant Compliance, Risk Flags & Early Warnings, and Analyst Recommendation. The reliability score features 5 segments (Completeness, Consistency, Auditor Quality, Cash Flow Match, Tax Alignment) with a banner color logic (Green for >=75, Amber for >=60, Red for <60). Includes word count, character count, estimated read time, a clipboard copy button, and an "Approve & Submit" button that triggers a success toast.

---

## Docker Setup
Build the Docker image:
```bash
docker build -t brac-credit-demo .
```
Run the Docker container (runs on port 80 inside, mapped to 3000):
```bash
docker run -p 3000:80 brac-credit-demo
```
Alternatively, use Docker Compose:
```bash
docker-compose up --build
```
The app is served using Nginx with an SPA fallback config (`try_files $uri $uri/ /index.html;`).

---

## Vercel Deployment
The application is configured for auto-deployment on Vercel. Pushing to the `main` branch triggers a redeploy. The `vercel.json` file includes a rewrite rule (`{ "source": "/(.*)", "destination": "/index.html" }`) for SPA routing. The framework preset is Vite, the build command is `npm run build`, and the output directory is `dist`.

---

## Local Development
Install dependencies:
```bash
npm install
```
Start the development server (runs on port 5173):
```bash
npm run dev
```
Build for production:
```bash
npm run build
```
Preview the production build:
```bash
npm run preview
```

---

## Demo Credentials
You can log in using any email and any password. There is no real authentication enforced in the demo.

---

## Known Limitations
- No real PDF parsing or OCR integration; relies on predefined mock templates.
- No backend database; all data is static and demo-only.
- Single JS chunk size warning in Vite build due to bundled dependencies.
- Exported reports are based on static mock data rather than dynamic calculations from uploaded files.

---
