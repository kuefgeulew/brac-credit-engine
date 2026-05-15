# BRAC Bank Credit Analysis Portal — Master documentation

Stakeholder-facing overview of the **BRAC Bank Credit Analysis Portal** demo: a single-page React application that showcases AI-assisted credit review workflows using curated mock data (no backend, no real PDF ingestion).

---

## Project description

The portal simulates the end-to-end experience of a corporate credit analyst:

1. **Login** — lightweight UI gate (any non-empty email and password).
2. **Dashboard** — KPIs, FY2024 cycle progress, and a searchable “Recent Credit Reviews” table with firm shortcuts into results.
3. **New Credit Review** — select one of five ICAB-style audit firms, upload a PDF placeholder, optionally run a **~7s animated processing strip**, then land on results.
4. **Results** — three tabs: **Ratio Dashboard** (ICRR/FSS/CRG, DSCR radial gauge, ratio cards, Recharts trends), **Excel Export** (client-side `.xlsx` workbook download), and **Narrative** (structured AI-style memo with reliability scoring, copy, print/PDF hooks).

**Demo Mode** (floating control) is available on **every route**, including login, for fast navigation and optional processing-skip during live demos.

---

## Tech stack

| Layer | Technology |
|--------|------------|
| Language | TypeScript (strict, `noImplicitAny`) |
| UI | React 19, React Router 7 |
| Styling | Tailwind CSS 4, `@tailwindcss/vite` |
| Charts | Recharts 3 |
| Icons | lucide-react |
| Spreadsheets | xlsx-js-style (browser download) |
| Build | Vite 8, `tsc -b` |
| Lint | ESLint 9 + typescript-eslint |
| Container | Docker multi-stage: Node 20 Alpine → build → nginx:alpine |

---

## Five demo borrowers (firm keys)

Each row is keyed for routing (`/results` with `state.firmKey`) and Demo Mode “Switch Active Firm”.

| Key | Borrower | Audit firm (mock) | Demo highlights |
|-----|-----------|-------------------|-----------------|
| `aqasem` | Anwar Textile Mills Ltd. | A. Qasem & Co. | RMG exporter, **ICRR “Good”**, clean covenants, latest **DSCR 1.22×** |
| `rrh` | Bengal Agro Processing Ltd. | Rahman Rahman Huq & Co. (KPMG Bangladesh) | Agri / milling, **Acceptable** band, **DSCR 1.38×** |
| `howladar` | Padma Steel & Engineering Ltd. | Howladar Yunus & Co. | **Marginal** ICRR, **leverage + interest-coverage covenant breaches**, headline **DSCR 1.65×** (cash-supported) |
| `syful` | Dhaka Pharma Industries Ltd. | Syful Shamsul Alam & Co. | Strongest cohort profile, **ICRR 79 / Strong**, **DSCR 1.81×** |
| `islam` | Chittagong Shipping Services Ltd. | Islam Afzal Parsons & Co. | Marine logistics growth, **DSCR 1.44×**, improving leverage narrative |

---

## Stakeholder demo script (suggested order)

**Before the session**

- Run locally (`npm run dev`) or via Docker (`docker run -p 3000:80 brac-credit-demo`) and open the app URL.
- Optionally enable **Demo Mode → Skip ~7s processing animation** so “Run Analysis” jumps straight to results during time-boxed slides.

**1. Login (30 s)**  
Open `/`. Enter any email/password → Sign in. Mention: no real auth; UI-only gate.

**2. Dashboard (1–2 min)**  
Highlight welcome line, KPI cards, FY2024 progress bar, **Recent Credit Reviews** table. Sort/search if time permits. Click **New Review** or use Demo Mode **Dashboard**.

**3. New Credit Review (2 min)**  
Pick an audit firm from the dropdown, attach any **PDF** (drag/drop or browse). Click **Run Analysis →**.  
- With animation on: walk through the **three processing steps** (~7s total before navigation).  
- With **Skip** on: immediately navigate to results—call out time-saving for repeat demos.

**4. Results — Ratios tab (3 min)**  
Point out borrower header, ICRR badge, **DSCR semi-circular gauge** (values differ per firm—see table above), regulatory tiles, ratio sparkline cards, trend charts. Toggle **Highlight covenant breach** / **Highlight ICRR score** in Demo Mode for emphasis.

**5. Results — Excel tab (1 min)**  
Click **Download Excel Report**; wait for “Generating…” (~800ms). Open the file in Excel or Google Sheets; mention five workbook sheets (spread, ratios, ICRR working paper, FSS/CRG, trends).

**6. Results — Narrative tab (2 min)**  
Scroll the memo, reliability segments, **Export as PDF** (browser print to PDF), **Copy to clipboard**, optional **Approve & Submit** toast.

**7. Demo Mode sweep (1 min)**  
Open **Demo Mode** from any page; use **Quick Navigate** (Login, Dashboard, New Review, RMG results, Flagged results). On `/results`, use **Switch Active Firm** to rotate all five borrowers. Close panel with **X**, overlay click, or **Escape**.

**8. About & wrap**  
Sidebar → **About this system** → version **v2.4.1**, five supported firms, Bangladesh Bank alignment note → **Close**.

---

## Docker instructions

**Build image**

```bash
docker build -t brac-credit-demo .
```

**Run (host port 3000 → container nginx port 80)**

```bash
docker run --rm -p 3000:80 brac-credit-demo
```

Open **http://localhost:3000**. SPA routes (`/dashboard`, `/new-review`, `/results`, etc.) are served via `try_files` fallback to `index.html`.

**NPM shortcuts** (from `package.json`)

```bash
npm run docker:build
npm run docker:run
```

---

## Known limitations (demo scope)

- **No backend** — all data is static TypeScript mocks; no API, database, or session server.
- **No real PDF parsing** — uploads only validate PDF type/name; analysis outcomes are predetermined by the selected firm key.
- **No real scoring engine** — ICRR/FSS/CRG/DSCR and narratives are editorial demo content, not Bangladesh Bank production models.
- **Login** — no SSO, MFA, or RBAC; suitable for UI walkthrough only.
- **Print/PDF** — relies on the browser print pipeline; layout tuned for Chrome/Edge print preview.

---

## Future roadmap (toward production)

- Secure authentication (SSO / OIDC), role-based access, and audit logging of analyst actions.
- Real document ingestion: OCR/layout models for audited PDFs, XBRL where available, and human-in-the-loop corrections.
- Integration with core banking / LOS for facility limits, collateral, and live covenant monitoring.
- Server-side spreadsheet and PDF generation with templated BRPD/ICRR outputs and digital signatures.
- Model governance: versioned scorecards, explainability, and back-testing against historical default data.
- Performance and accessibility hardening (WCAG 2.2 AA), localization (Bengali UI), and offline-capable field packs where needed.

---

## Related files

- `README.md` — quick local setup and login note.
- `SESSION5.md` — Session 5 audit log, build/Docker sign-off, and demo readiness statement.
- `Dockerfile`, `nginx.conf` — production static hosting configuration.
