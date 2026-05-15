# BRAC Credit Engine

Demo credit-review console: dashboard, new review flow, and rich results (ratios, Excel export, AI-style narrative) backed by mock borrower data.

## Prerequisites

- **Node.js 20** (local development and the Docker build stage)
- **Docker Desktop** (for containerized demo: build, run, or Compose)

## Setup

### Local development

```bash
npm install
npm run dev
```

The dev server starts on the URL Vite prints (typically `http://localhost:5173`).

### Docker

From the project root:

```bash
npm run docker:compose
```

Then open **http://localhost:3000** (Compose maps host `3000` → container `80`).

You can also build and run the image directly:

```bash
npm run docker:build
npm run docker:run
```

## Login (demo)

Click **Sign In** to enter the app (no credential validation); email and password fields are cosmetic. There is no real authentication backend in this demo.

## Demo firms and borrowers

Each row is one mock credit file: **demo key** (used internally after review), **audit firm**, **borrower**.

| Demo key | Audit firm | Borrower |
|----------|------------|------------|
| `aqasem` | A. Qasem & Co. Chartered Accountants | Anwar Textile Mills Ltd. |
| `rrh` | Rahman Rahman Haq (KPMG Bangladesh) | Bengal Agro Processing Ltd. |
| `howladar` | Howladar Yunus & Co. | Padma Steel & Engineering Ltd. |
| `syful` | Syful Alam & Associates | Dhaka Pharma Industries Ltd. |
| `islam` | Islam Aftab & Associates | Chittagong Shipping Services Ltd. |

## Screenshots

_Add screenshots of the login page, dashboard, new review flow, and results tabs here._
