import type { MockData } from '../types/mockData'

export const mockData: MockData = {
  borrower: 'Dhaka Pharma Industries Ltd.',
  auditFirm: 'Syful Alam & Associates',
  reviewDate: '2025-04-14',
  financials: {
    years: ['2023', '2024', '2025'],
    revenue: [248000000, 281500000, 318000000],
    costOfSales: [142500000, 160800000, 179200000],
    grossProfit: [105500000, 120700000, 138800000],
    operatingExpenses: [58200000, 64800000, 71200000],
    ebitda: [47300000, 55900000, 67600000],
    netProfit: [31800000, 38200000, 45100000],
    totalAssets: [228000000, 251500000, 279000000],
    totalLiabilities: [112000000, 118500000, 124000000],
    equity: [116000000, 133000000, 155000000],
    currentAssets: [132000000, 148500000, 166200000],
    currentLiabilities: [62800000, 68200000, 73800000],
    operatingCF: [38500000, 44800000, 28200000],
    debtService: [16800000, 16200000, 15600000],
  },
  ratios: {
    dscr: [1.55, 1.68, 1.81],
    currentRatio: [2.1, 2.18, 2.25],
    debtToEquity: [0.96, 0.89, 0.8],
    interestCoverage: [6.8, 7.9, 9.2],
    leverageRatio: [0.49, 0.47, 0.44],
  },
  regulatory: {
    icrrScore: 79,
    icrrBand: 'Strong',
    fssScore: 88,
    crgScore: 1,
    covenantBreaches: [],
    earlyWarnings: [],
  },
  narrative:
    'Dhaka Pharma Industries Ltd. manufactures off-patent solid dosage forms for the local market and selected export destinations, with a WHO-GMP aligned plant in Tongi and long-standing hospital formulary relationships. Gross margins expanded as the company shifted mix toward higher-value cardiovascular and anti-diabetic lines while keeping distribution costs controlled. Cash generation comfortably covered debt service, supporting a Strong ICRR outcome with clean covenant compliance and no early-warning triggers in the latest review cycle. The borrower remains well placed for incremental capex funded largely from internal accruals.',
  borrowerDetails: {
    sector: 'Pharmaceuticals (Formulations)',
    subSector: 'Solid oral dosage — WHO-GMP lines, hospital channel & regulated export',
    established: '2004',
    employees: '1,640 (including 210 R&D & quality assurance)',
    facilityType: 'Term Loan (minimal — legacy capex) + Working Capital Demand Loan + LC limits',
    facilityLimit: 'BDT 165.0 Million',
    facilityOutstanding: 'BDT 58.5 Million (28.5% utilisation — conservative leverage)',
    lastReviewDate: '2024-04-14',
    nextReviewDue: '2025-04-14',
    relationshipYears: '11 years',
    collateral:
      'First mortgage on Tongi plant Block A–C — forced-sale value BDT 210M (Dec 2025); fixed deposit lien BDT 15.0M as cash margin for bid bonds; negative pledge on core brands per facility letter.',
  },
  reliabilityScores: {
    completeness: 19,
    consistency: 18,
    auditorQuality: 17,
    cashFlowMatch: 18,
    taxAlignment: 17,
    total: 89,
    assessment: 'High Reliability',
  },
  narrativeSections: {
    executiveSummary:
      'Dhaka Pharma Industries Ltd. is the strongest credit in the current review sample: ICRR 79 (Strong), CRG grade 1, FSS 88, and no covenant or early-warning flags. FY25 revenue reached BDT 318.0M with net profit BDT 45.1M and operating cash flow BDT 28.2M—comfortably above annual debt service with DSCR 1.81×. The company operates a modern Tongi facility with WHO-GMP alignment, diversified hospital formulary contracts, and a growing export toe-hold in West Africa. Reliability scoring is the highest across completeness, consistency, and tax alignment.',
    financialPerformance:
      'Three-year revenue CAGR exceeds 13%, underpinned by mix shift to cardiovascular and anti-diabetic SKUs with structurally higher gross margin (43.6% in FY25 vs 42.5% in FY23). EBITDA margin expanded to 21.2%. Net profit growth of 41.8% over FY23–FY25 reflects operating leverage and disciplined SG&A (22.4% of sales vs 23.5% in FY23). R&D capitalization remains immaterial (<1% of assets); auditor confirmed expensing policy is conservative.',
    liquidityWorkingCapital:
      'Current ratio 2.25× and substantial cash generation provide ample cushion. Operating working capital cycle improved: inventory days stable near 118 (industry norm for regulated batch releases), receivable days 62 with 91% of hospital receivables within 75 days. OCF BDT 28.2M vs debt service BDT 15.6M yields DSCR 1.81×. Unutilised LC lines of BDT 42M support raw material imports without incremental funded exposure.',
    leverageDebt:
      'Debt-to-equity of 0.80× is low for a pharma manufacturer of this scale; management has deliberately prepaid BDT 12.0M of term debt ahead of schedule in FY25. Interest coverage 9.2× and leverage ratio 0.44× indicate significant headroom for modest incremental borrowing tied to line expansion. No foreign-currency term debt; export receivables largely USD with natural hedge on API imports.',
    covenantCompliance:
      'All covenants in compliance with material cushion: minimum DSCR 1.25× (actual 1.81×), minimum interest coverage 3.0× (actual 9.2×), minimum TNW BDT 95M (actual BDT 155M equity). Quarterly certifications have been filed without exception. Environmental compliance certificates for effluent treatment are current through FY27.',
    riskFlags:
      'Sector-wide pricing pressure on high-volume generics remains a background risk but is mitigated by hospital tender wins and export diversification. No regulatory sanctions or product recalls in the review period. API concentration for two molecules is noted for supply-chain monitoring only—not elevated to early warning.',
    recommendation:
      'Strongly recommend approval of the proposed annual facility renewal at BDT 165.0M combined limit with preferential pricing tier A-1. Support management’s capex plan (BDT 35M blister line) via a structured term tranche of up to BDT 25M at a SOFR-linked cap, subject only to standard disbursement conditions and the unchanged security package. Shortening the review cycle to annual (from bi-annual) is not required—credit quality comfortably supports standard 12-month surveillance with quarterly management accounts.',
  },
}
