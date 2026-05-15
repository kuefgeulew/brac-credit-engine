import type { MockData } from '../types/mockData'

export const mockData: MockData = {
  borrower: 'Chittagong Shipping Services Ltd.',
  auditFirm: 'Islam Afzal Parsons & Co.',
  reviewDate: '2025-03-29',
  financials: {
    years: ['2023', '2024', '2025'],
    revenue: [182000000, 201500000, 223800000],
    costOfSales: [124500000, 137200000, 152600000],
    grossProfit: [57500000, 64300000, 71200000],
    operatingExpenses: [36800000, 39800000, 42800000],
    ebitda: [20700000, 24500000, 28400000],
    netProfit: [11200000, 14100000, 16800000],
    totalAssets: [141000000, 153800000, 167500000],
    totalLiabilities: [92500000, 98800000, 104200000],
    equity: [48500000, 55000000, 63300000],
    currentAssets: [76500000, 82800000, 90100000],
    currentLiabilities: [54800000, 59200000, 63100000],
    operatingCF: [15600000, 18100000, 20400000],
    debtService: [13200000, 12900000, 12750000],
  },
  ratios: {
    dscr: [1.28, 1.36, 1.44],
    currentRatio: [1.4, 1.4, 1.43],
    debtToEquity: [1.91, 1.8, 1.65],
    interestCoverage: [3.5, 4.0, 4.5],
    leverageRatio: [0.66, 0.64, 0.62],
  },
  regulatory: {
    icrrScore: 61,
    icrrBand: 'Acceptable',
    fssScore: 70,
    crgScore: 4,
    covenantBreaches: [],
    earlyWarnings: [
      'Charter-hire cost volatility linked to bunker fuel prices and regional container slot premiums.',
    ],
  },
  narrative:
    'Chittagong Shipping Services Ltd. provides coastal lighterage, port towage support, and third-party vessel agency services tied to Chittagong and Mongla port traffic. Revenue growth tracked higher port throughput and expanded contracts with feed importers and bulk cement operators, while fuel surcharges were largely passed through with a short lag. Balance-sheet leverage is moderate for a service asset model, and cash flows have consistently met scheduled obligations, supporting an Acceptable ICRR band. Key risks remain voyage economics, crew cost inflation, and exposure to regulatory changes in coastal shipping cabotage rules.',
  borrowerDetails: {
    sector: 'Logistics & Coastal Shipping',
    subSector: 'Lighterage, port towage, vessel agency & husbandry (Chittagong / Mongla)',
    established: '1998',
    employees: '520 (including 240 certified seafarers on rotation)',
    facilityType: 'Term Loan (tug acquisition) + Revolving CC (bunker & spares)',
    facilityLimit: 'BDT 88.0 Million',
    facilityOutstanding: 'BDT 64.3 Million',
    lastReviewDate: '2024-03-29',
    nextReviewDue: '2025-03-29',
    relationshipYears: '8 years',
    collateral:
      'Mortgage on office & workshop Patenga — BDT 52M; first priority ship mortgage on MV Padma Lighter-7 (fair market BDT 38M per marine surveyor Jan 2025); assignment of P&I club refunds and key charter contracts.',
  },
  reliabilityScores: {
    completeness: 15,
    consistency: 15,
    auditorQuality: 15,
    cashFlowMatch: 14,
    taxAlignment: 12,
    total: 71,
    assessment: 'Moderate Reliability',
  },
  narrativeSections: {
    executiveSummary:
      'Chittagong Shipping Services Ltd. is a Patenga-headquartered coastal logistics operator with FY25 revenue of BDT 223.8M and an Acceptable ICRR (61). Earnings are tied to port throughput, charter-hire pass-through mechanics, and tug utilisation on bulk cement and feed import jobs. Audited financials are clean; Moderate reliability reflects inherent voyage P&L volatility and timing differences between bunker accruals and charter settlements rather than control weaknesses.',
    financialPerformance:
      'Revenue grew 23% FY23–FY25 with stable gross margin near 32% as fuel surcharges were contractually indexed on roughly 78% of lighterage days. EBITDA reached BDT 28.4M; net margin held near 7.5%. A one-off dry-docking expense of BDT 3.1M was booked in Q2 FY25, partially offset by higher summer cement volumes. No material related-party sales; agency commission income from foreign principals grew 9% year-on-year.',
    liquidityWorkingCapital:
      'Current ratio 1.43×; liquid resources include BDT 14.2M in operational current accounts after minimum balance covenants. Operating cash flow BDT 20.4M exceeded debt service BDT 12.8M. CC utilisation averaged 58% with seasonal spikes during Ramadan import peaks. Management maintains a BDT 5.0M undrawn contingency line for emergency tug repairs.',
    leverageDebt:
      'Debt-to-equity improved to 1.65× from 1.91× as retained earnings accumulated and one tug loan tranche matured. Leverage ratio 0.62× is within policy for marine asset portfolios. Interest coverage 4.5× provides cushion against bunker shocks. Remaining term debt amortises through FY30 with no bullet concentration in any single fiscal year.',
    covenantCompliance:
      'All covenants met: minimum DSCR 1.15× (actual 1.44×), minimum fleet utilisation 68% (actual 74% annualised), and maintenance of marine insurance with approved underwriters. Early-warning note on bunker volatility is informational—no breach. Environmental discharge permits for Patenga workshop renewed through 2027.',
    riskFlags:
      'Bunker price volatility and regional container slot premiums can compress voyage margins when pass-through clauses lag by 10–15 days. Crew wage inflation (~11% FY25) is partly offset by productivity gains from newer tug. Regulatory risk: any tightening of cabotage crew nationality rules could increase manning cost; management monitors Bangladesh Shipping Corporation policy circulars.',
    recommendation:
      'Recommend renewal of facilities at BDT 88.0M combined limit with standard annual review. Approve incremental BDT 6.0M capex sub-limit for engine overhaul on MV Padma Lighter-7 subject to marine surveyor sign-off and lien perfection update. Require quarterly bunker sensitivity report if Brent forward strip exceeds USD 92/bbl for two consecutive months.',
  },
}
