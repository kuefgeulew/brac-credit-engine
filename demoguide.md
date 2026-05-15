# Demo guide — BRAC Bank Credit Analysis Portal

Use this document as a **step-by-step script** when walking someone through the app. All data is **mock** (no backend, no real PDF analysis).

---

## 0. Start the app

Pick one:

| Method | Command / action |
|--------|-------------------|
| **Dev (recommended for demos)** | From project root: `npm run dev` — then open the URL Vite prints (usually `http://localhost:5173`). Or double-click **`start-dev.bat`** (installs deps if needed, opens browser). |
| **Production build preview** | `npm run build` then `npm run preview` |
| **Docker** | `docker build -t brac-credit-demo .` then `docker run --rm -p 3000:80 brac-credit-demo` — open **http://localhost:3000** |

---

## 1. Login (`/`)

1. Open the app root URL (e.g. `http://localhost:5173/` or `http://localhost:3000/`).
2. Optionally type in **Email** / **Password** (cosmetic only).
3. Click **Sign In** → you go to the **Dashboard** immediately. There is **no validation**; credentials are not checked.

**Say:** *“This is a UI gate only—no real authentication.”*

---

## 2. Dashboard (`/dashboard`)

1. Read the **welcome line** (time-based greeting + name).
2. Point at the four **KPI cards** (reviews, renewals, turnaround, flagged).
3. Scroll to **FY2024 Annual Review** progress bar.
4. In **Recent Credit Reviews**, try **search** and column **sort** (headers).
5. Click a **borrower row** to open **Results** for that firm, or click **New Review** in the table header when you want the full upload flow next.

**Say:** *“Table rows deep-link into the same results view we’ll use in Demo Mode.”*

---

## 3. New Credit Review (`/new-review`)

1. **Step 1 — Audit firm:** Open the dropdown and choose one of **five** firms (each maps to a different mock borrower on results).
2. **Step 2 — PDF:** Drag any **`.pdf`** file onto the zone, or **Browse**. Non-PDFs are rejected with a short message.
3. **Step 3 — Run analysis:** Click **Run Analysis →**.

**Path A — Full animation (default)**  
- A **vertical processing strip** runs (~7s): audit template → line items → regulatory scores → then auto-navigate to **Results**.

**Path B — Skip animation (for tight schedules)**  
1. Open **Demo Mode** (bottom-right **Demo Mode** pill).
2. Turn **ON** **Skip ~7s processing animation**.
3. Return to **New Review**, pick firm + PDF, click **Run Analysis →** → you jump to **Results** immediately.

**Say:** *“PDF content is not parsed; the outcome is driven by which audit firm you selected.”*

---

## 4. Results (`/results`)

You arrive with **one borrower** loaded (from New Review state or from the dashboard row). The page has **three tabs**.

### 4a. Ratios tab (default)

1. **Header strip** — borrower name, sector hints, review date, **ICRR** badge.
2. **Regulatory row** — ICRR score + band, FSS, CRG bars.
3. **DSCR** — semi-circular gauge (FY24 value varies by firm; see cheat sheet below).
4. **Ratio cards** — sparkline-style charts and status chips.
5. **Trend charts** — revenue / EBITDA / net profit (Recharts).

**Optional — Demo Mode highlights**  
- **Highlight ICRR score** — pulses the ICRR tile.  
- **Highlight covenant breach** — pulses covenant-related UI where the story includes stress (strongest effect on **Howladar / Padma Steel**).

### 4b. Excel Export tab

1. Click **Download Excel Report** (or equivalent primary button).
2. Wait for the short **“Generating…”** state (~800 ms).
3. Open the downloaded **`.xlsx`** in Excel or Google Sheets.

**Say:** *“Workbook is built in the browser—five sheets: spread, ratios, ICRR paper, FSS/CRG, trends.”*

### 4c. Narrative tab

1. Scroll the **AI-style memo** (sections + reliability score).
2. **Copy to clipboard** — full narrative text.
3. **Export as PDF** — uses the browser print dialog (choose “Save as PDF” if needed).
4. **Approve & Submit** — shows a **toast** (bottom area; Demo FAB sits higher to reduce overlap).

---

## 5. Demo Mode (any page)

The **Demo Mode** control is available **even on the login page**.

1. Click **Demo Mode** (pill, lower-right).
2. **Quick Navigate** (five shortcuts):
   - **Login Page** → `/`
   - **Dashboard** → `/dashboard`
   - **Start New Review** → `/new-review`
   - **Show Results (RMG)** → `/results` with **A. Qasem** borrower (textiles)
   - **Show Results (Flagged)** → `/results` with **Howladar** borrower (stress / covenants)
3. **Switch Active Firm** — buttons work **only on `/results`**. When disabled (other pages), the section is greyed out with helper text. On results, click each firm to swap mock data **without** re-uploading a PDF.
4. Close the panel: **X**, click the **dimmed overlay**, or press **Escape**.

---

## 6. Sidebar extras

1. Navigate with **Dashboard**, **New Review**, **Review Queue** (placeholder), **Reports** (`/results` — empty state if no firm was selected), **Settings** (placeholder).
2. **About this system** (small link under the nav) → modal: product name, **v2.4.1**, list of supported audit firms, compliance one-liner → **Close**.

---

## 7. Five borrowers — cheat sheet

Use this when switching firms on **Results** or when explaining differences.

| Firm key | Borrower | What to highlight |
|----------|----------|-------------------|
| **aqasem** | Anwar Textile Mills Ltd. | RMG, **Good** ICRR story, **DSCR ~1.22×** |
| **rrh** | Bengal Agro Processing Ltd. | Agro / milling, **Acceptable**, **DSCR ~1.38×** |
| **howladar** | Padma Steel & Engineering Ltd. | **Marginal** ICRR, **leverage + interest-coverage breaches**, still **DSCR ~1.65×** on cash — good for “headline vs covenant stress” |
| **syful** | Dhaka Pharma Industries Ltd. | **Strong** profile, high ICRR, **DSCR ~1.81×** |
| **islam** | Chittagong Shipping Services Ltd. | Marine / logistics growth, **DSCR ~1.44×** |

---

## 8. Suggested “happy path” timeline (~12 minutes)

| Minutes | Step |
|--------:|------|
| 0:00 | Start app → **Login** → **Sign In** |
| 0:30 | **Dashboard** — KPIs, progress, table |
| 2:00 | **New Review** — firm + PDF → **Run Analysis** (skip animation if short on time) |
| 4:00 | **Results / Ratios** — header, ICRR, DSCR, cards, charts |
| 7:00 | **Excel** tab — download + mention sheets |
| 9:00 | **Narrative** tab — scroll, copy or print PDF |
| 11:00 | **Demo Mode** — quick navigate + switch all five firms |
| 12:00 | **About** modal → end |

---

## 9. If something looks wrong

| Issue | What to check |
|-------|----------------|
| **Results** shows empty / wrong borrower | Use **Demo Mode →** a “Show Results” shortcut, or **Switch Active Firm** on `/results`, or start again from **New Review** with the firm you want. |
| Processing never finishes | Rare refresh glitch — toggle **Skip** processing in Demo Mode and run again, or reload the page. |
| Excel won’t download | Pop-up blocker; allow downloads for `localhost`. |
| Print layout odd | Prefer **Chrome** or **Edge** print preview. |

---

## 10. One-line disclaimer for the room

*“This is a front-end demonstration with static sample borrowers—it does not connect to BRAC Bank systems and does not score live credits.”*

For deeper context (stack, Docker, roadmap), see **`MASTER_README.md`**.
