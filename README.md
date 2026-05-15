# BRAC Bank Credit Analysis Portal
AI-powered financial spreading and regulatory assessment engine for medium business banking.

## Tech Stack
- React 18 + Vite + TypeScript
- Tailwind CSS (custom BRAC Bank theme)
- Recharts (gauge, sparklines, trend charts)
- SheetJS / xlsx (client-side Excel generation)
- jsPDF + jspdf-autotable (client-side PDF generation)
- React Router DOM v6
- Lucide React (icons)
- Docker + Nginx (containerized static serve)
- Vercel (production deployment)

## Demo Credentials
Any email address + any password (no real authentication)

## Quick Start — Local Development
npm install
npm run dev
Open http://localhost:5173

## Quick Start — Docker
docker build -t brac-credit-demo .
docker run -p 3000:80 brac-credit-demo
Open http://localhost:3000

## Quick Start — Production
Deployed on Vercel. Auto-deploys on every push to main branch.

## Demo Firms & Borrowers
| Firm | Borrower | Sector | ICRR |
|---|---|---|---|
| A. Qasem & Co. | Anwar Textile Mills Ltd. | RMG | 72 — Good |
| Rahman Rahman Huq (KPMG) | Bengal Agro Processing Ltd. | Agribusiness | 65 — Acceptable |
| M/S Howladar Yunus & Co. | Padma Steel & Engineering Ltd. | Steel | 58 — Marginal |
| Syful Shamsul Alam & Co. | Dhaka Pharma Industries Ltd. | Pharma | 79 — Strong |
| Islam Afzal Parsons & Co. | Chittagong Shipping Services Ltd. | Logistics | 61 — Acceptable |

## Known Demo Limitations
- No real PDF parsing — file upload is visual only
- No real backend — all data is hardcoded mock data
- No real authentication — any credentials work
- Bundle is ~2MB single chunk (acceptable for demo)

## Future Production Roadmap
- Azure Document Intelligence integration for real OCR
- Real Bangladesh Bank API connectivity
- User authentication with BRAC Bank SSO
- PostgreSQL database for review history
- Real-time analyst collaboration
- Mobile responsive layout
