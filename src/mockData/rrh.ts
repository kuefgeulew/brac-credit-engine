import type { MockData } from '../types/mockData'

export const mockData: MockData = {
  borrower: 'Bengal Agro Processing Ltd.',
  auditFirm: 'Rahman Rahman Huq & Co. (KPMG Bangladesh)',
  reviewDate: '2025-04-02',
  financials: {
    years: ['2022', '2023', '2024'],
    revenue: [176500000, 198000000, 217250000],
    costOfSales: [142800000, 159200000, 174600000],
    grossProfit: [33700000, 38800000, 42650000],
    operatingExpenses: [24100000, 26500000, 28150000],
    ebitda: [9600000, 12300000, 14500000],
    netProfit: [4100000, 6100000, 7800000],
    totalAssets: [152000000, 164500000, 178800000],
    totalLiabilities: [101500000, 107200000, 112400000],
    equity: [50500000, 57300000, 66400000],
    currentAssets: [88500000, 94200000, 100800000],
    currentLiabilities: [68500000, 71800000, 75200000],
    operatingCF: [11200000, 12850000, 13900000],
    debtService: [9850000, 10200000, 10650000],
  },
  ratios: {
    dscr: [1.14, 1.26, 1.38],
    currentRatio: [1.29, 1.31, 1.34],
    debtToEquity: [2.01, 1.87, 1.69],
    interestCoverage: [2.6, 3.1, 3.4],
    leverageRatio: [0.67, 0.65, 0.63],
  },
  regulatory: {
    icrrScore: 65,
    icrrBand: 'Acceptable',
    fssScore: 74,
    crgScore: 3,
    covenantBreaches: [],
    earlyWarnings: [
      'Seasonal inventory build ahead of aman harvest increased short-term funded exposure in Q3 FY24.',
    ],
  },
  narrative:
    'Bengal Agro Processing Ltd. operates a rice milling and spice grading facility in Jessore, sourcing paddy through local aggregators and selling branded SKUs to domestic distributors. Margins are thinner than manufacturing peers, but throughput rose as the firm added a second parboiling line and secured a working capital limit tied to warehouse receipts. Leverage remains elevated relative to equity, although DSCR stayed above 1.10x through conservative term-loan structuring. The profile maps to an Acceptable ICRR outcome with manageable early-warning flags around commodity price volatility.',
  borrowerDetails: {
    sector: 'Food & Agro Processing',
    subSector: 'Rice milling, parboiling & branded spice packing (Bengal Gold, Jessore Fresh)',
    established: '2011',
    employees: '286 (seasonal peak +420 contract loaders Nov–Jan)',
    facilityType: 'Term Loan (plant) + CC (Hypo) + Warehouse Receipt Financing',
    facilityLimit: 'BDT 92.5 Million',
    facilityOutstanding: 'BDT 71.8 Million (term BDT 38.0M + CC BDT 33.8M)',
    lastReviewDate: '2025-04-02',
    nextReviewDue: '2025-10-02',
    relationshipYears: '7 years',
    collateral:
      'First-ranking mortgage on plant, silos & land at Benapole Road, Jessore — indicative BDT 98M; pledge of warehouse receipts under supervised lock with insurer-approved fire & burglary cover BDT 45M sum insured.',
  },
  reliabilityScores: {
    completeness: 14,
    consistency: 14,
    auditorQuality: 15,
    cashFlowMatch: 13,
    taxAlignment: 12,
    total: 68,
    assessment: 'Moderate Reliability',
  },
  narrativeSections: {
    executiveSummary:
      'Bengal Agro Processing Ltd. is a Jessore-based agro-industrial borrower with FY24 revenue of BDT 217.3M and an Acceptable ICRR (65). The business model is commodity-cyclical: margins compress when domestic paddy prices spike ahead of Boro procurement, then recover through Q1 parboiled rice sales to Dhaka & Khulna distributors. Audited statements (KPMG Bangladesh) are complete; a Moderate reliability score reflects inherent volatility in inventory valuation and seasonal WC spikes rather than material qualification issues.',
    financialPerformance:
      'Top-line growth of 23% over FY22–FY24 reflects both volume (+11% milled tonnes) and selective price pass-through on branded SKUs. Gross profit improved from BDT 33.7M to BDT 42.7M, though gross margin % dipped slightly in FY23 when diesel and drying costs surged. EBITDA reached BDT 14.5M in FY24; net profit BDT 7.8M represents a thin 3.6% net margin, typical for commodity milling but requiring tight working capital discipline. Debt service coverage improved to 1.38×, only modest headroom above the 1.15× covenant floor.',
    liquidityWorkingCapital:
      'Current ratio of 1.34× is adequate but not ample for a seasonal borrower. Q3 FY24 saw CC utilisation peak at 94% of sub-limit during pre-harvest inventory build; the bank approved a temporary BDT 6.0M seasonal overlay (since repaid). Operating cash flow of BDT 13.9M vs debt service BDT 10.7M in FY24 is positive; however, Q-o-Q volatility is high—management now provides 13-week cash forecasts monthly during harvest windows.',
    leverageDebt:
      'Debt-to-equity of 1.69× (FY24) is elevated versus general manufacturing norms but acceptable for asset-heavy milling where term debt funded the second parboiling line (commissioned FY23). Interest coverage at 3.4× is stable. Term loan residual tenor is 4.2 years with bullet-free amortisation. No related-party on-lending; shareholder advances of BDT 4.2M were fully cleared in FY24.',
    covenantCompliance:
      'No breaches recorded. Covenants include minimum DSCR 1.10×, maximum leverage ratio 0.72×, and minimum stock cover 1.25× on CC. Early-warning flag logged for Q3 funded build—remediated before quarter close. Insurance renewals (fire, machinery breakdown, crop transit) are current through June 2025.',
    riskFlags:
      'Commodity price and weather risk on paddy intake; political disruption on Benapole corridor could delay spice imports. Early-warning: seasonal inventory concentration in Q3. Mitigation includes warehouse receipt financing with third-party surveyor and partial forward sales to institutional buyers. No single distributor exceeds 19% of FY24 domestic sales.',
    recommendation:
      'Recommend continuation of facilities at existing limit with six-monthly review cycle until DSCR consistently exceeds 1.35× for four consecutive quarters. Maintain seasonal overlay mechanism. Do not increase term exposure until equity injection of at least BDT 8.0M is evidenced or D/E falls below 1.45× on audited basis.',
  },
}
