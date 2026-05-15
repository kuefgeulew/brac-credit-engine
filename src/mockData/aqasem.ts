import type { MockData } from '../types/mockData'

export const mockData: MockData = {
  borrower: 'Anwar Textile Mills Ltd.',
  auditFirm: 'A. Qasem & Co. Chartered Accountants',
  reviewDate: '2025-03-18',
  financials: {
    years: ['2022', '2023', '2024'],
    revenue: [268000000, 285000000, 302500000],
    costOfSales: [198000000, 210500000, 223000000],
    grossProfit: [70000000, 74500000, 79500000],
    operatingExpenses: [38500000, 40200000, 41800000],
    ebitda: [31500000, 34300000, 37700000],
    netProfit: [18200000, 20500000, 22800000],
    totalAssets: [210000000, 225000000, 242000000],
    totalLiabilities: [128000000, 132000000, 136000000],
    equity: [82000000, 93000000, 106000000],
    currentAssets: [118000000, 126000000, 134000000],
    currentLiabilities: [72000000, 74800000, 76500000],
    operatingCF: [26500000, 30200000, 33800000],
    debtService: [18800000, 18500000, 18200000],
  },
  ratios: {
    dscr: [1.18, 1.2, 1.22],
    currentRatio: [1.64, 1.69, 1.75],
    debtToEquity: [1.56, 1.42, 1.28],
    interestCoverage: [4.2, 4.8, 5.1],
    leverageRatio: [0.61, 0.59, 0.56],
  },
  regulatory: {
    icrrScore: 72,
    icrrBand: 'Good',
    fssScore: 81,
    crgScore: 2,
    covenantBreaches: [],
    earlyWarnings: [
      'Export receivable concentration: top five buyers accounted for 58% of RMG sales in FY24.',
    ],
  },
  narrative:
    'Anwar Textile Mills Ltd. is a Dhaka-based woven garment exporter supplying EU retailers under back-to-back LCs, with stable capacity utilisation across its Narayanganj sewing floors. Gross margin held in the mid-twenties as cotton yarn costs normalised after FY23 spikes, while working capital cycles lengthened modestly due to extended buyer payment terms. Debt service coverage strengthened on higher EBITDA and scheduled term-loan amortisation, supporting a Good ICRR band with no covenant breaches. Overall credit quality is sound, though buyer concentration and FX mismatch on Euro-denominated contracts warrant routine monitoring.',
  borrowerDetails: {
    sector: 'Ready Made Garments (RMG)',
    subSector: 'Woven garments — EU compliance & Oeko-Tex certified lines',
    established: '2006',
    employees: '1,180 (including 920 permanent production operators)',
    facilityType: 'Term Loan (capex) + Packing Credit / EDF',
    facilityLimit: 'BDT 118.0 Million',
    facilityOutstanding: 'BDT 76.2 Million (term BDT 48.5M + funded WC BDT 27.7M)',
    lastReviewDate: '2025-03-18',
    nextReviewDue: '2026-03-18',
    relationshipYears: '9 years',
    collateral:
      'Registered equitable mortgage on land & factory building at Rupshi, Narayanganj — forced-sale value BDT 142M (independent valuer Jan 2025); hypothecation of stock & book debts with 25% margin on eligible receivables.',
  },
  reliabilityScores: {
    completeness: 17,
    consistency: 17,
    auditorQuality: 16,
    cashFlowMatch: 17,
    taxAlignment: 16,
    total: 83,
    assessment: 'High Reliability',
  },
  narrativeSections: {
    executiveSummary:
      'Anwar Textile Mills Ltd. is a mid-sized woven RMG exporter with audited FY22–FY24 statements reviewed under the March 2025 annual renewal. The obligor maintains a Good internal credit risk rating (ICRR 72) with clean covenant history and a stable DSCR trajectory (1.18× → 1.22×). Exposure is predominantly trade-backed (LC / back-to-back) with modest balance-sheet leverage trending down as retained earnings build. Primary watch items are buyer concentration in the EU retail channel and partial Euro invoice exposure against USD-denominated yarn purchases.',
    financialPerformance:
      'Revenue grew from BDT 268.0M (FY22) to BDT 302.5M (FY24), a CAGR of roughly 6.3%, driven by higher average order values on compliance-heavy outerwear programs rather than pure volume growth. Gross profit expanded from BDT 70.0M to BDT 79.5M, holding gross margin near 26% as cotton yarn prices stabilised post-FY23 volatility. EBITDA reached BDT 37.7M in FY24 (+19.6% vs FY22), with net profit at BDT 22.8M, reflecting disciplined overhead control and better absorption across three cutting-sewing- finishing units. Management guidance for FY25 assumes flattish volume but margin support from negotiated fabric conversion terms with nominated mills.',
    liquidityWorkingCapital:
      'Current assets of BDT 134.0M versus current liabilities of BDT 76.5M yield a current ratio of 1.75× at FY24 year-end. Inventory days edged up to 62 (from 55) as a large winter program shipped late in Q4, but post-year-end clearance reduced carrying value by BDT 11.4M per management representation letter. Operating cash flow of BDT 33.8M comfortably exceeded debt service of BDT 18.2M. Packing credit utilisation averaged 71% of sub-limit against eligible export LCs, with no instances of overdue interest in the last 24 months.',
    leverageDebt:
      'Total liabilities to equity improved from 1.56× (FY22) to 1.28× (FY24) as scheduled term amortisation of BDT 3.2M per quarter continued uninterrupted. The leverage ratio (total liabilities / total assets) declined to 0.56, within the bank’s “comfort” band for RMG exposures. Interest coverage strengthened to 5.1× on lower average funding cost after partial repricing to BRAC SME preferential tier. No foreign-currency term debt; all term exposure is BDT-denominated with fixed amortisation through FY28.',
    covenantCompliance:
      'All financial covenants tested positive for FY24: minimum DSCR 1.15× (actual 1.22×), minimum current ratio 1.20× (actual 1.75×), and maximum funded WC utilisation 85% (actual peak 78% in September 2024). The borrower submitted quarterly stock statements and ageing of receivables on time. No cross-default triggers are active. A single technical waiver was granted in FY23 for delayed submission of insurance renewal; documentation was regularised within 14 days.',
    riskFlags:
      'Concentration: five largest buyers represented 58% of FY24 export sales; mitigation includes staggered shipment windows and parent guarantees on two anchor programs. FX mismatch is partial—roughly 32% of invoices are Euro-denominated while yarn imports are largely USD LC—hedging via forward sales is used opportunistically rather than systematically. Sector risk from EU GSP+ rule changes is moderate; the firm holds SMETA audit status renewed through Q1 2026.',
    recommendation:
      'Recommend renewal of the existing BDT 118.0M combined facility at current pricing tier with annual review. Maintain standard RMG covenants and require semi-annual buyer concentration reporting if any single buyer exceeds 22% of rolling twelve-month sales. No material change to security structure; consider incremental limit of up to BDT 12.0M only if supported by additional confirmed order book and third-party LC cover.',
  },
}
