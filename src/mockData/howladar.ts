import type { MockData } from '../types/mockData'

export const mockData: MockData = {
  borrower: 'Padma Steel & Engineering Ltd.',
  auditFirm: 'Howladar Yunus & Co.',
  reviewDate: '2025-02-27',
  financials: {
    years: ['2022', '2023', '2024'],
    revenue: [158800000, 171200000, 164500000],
    costOfSales: [129500000, 140800000, 138200000],
    grossProfit: [29300000, 30400000, 26300000],
    operatingExpenses: [19800000, 20500000, 21200000],
    ebitda: [9500000, 9900000, 5100000],
    netProfit: [3200000, 2800000, -1800000],
    totalAssets: [198000000, 205500000, 208800000],
    totalLiabilities: [148500000, 154200000, 159800000],
    equity: [49500000, 51300000, 49000000],
    currentAssets: [102000000, 105500000, 101200000],
    currentLiabilities: [88500000, 91800000, 95200000],
    operatingCF: [8800000, 7200000, 20460000],
    debtService: [11200000, 11800000, 12400000],
  },
  ratios: {
    dscr: [1.48, 1.56, 1.65],
    currentRatio: [1.15, 1.15, 1.06],
    debtToEquity: [3.0, 3.01, 3.26],
    interestCoverage: [2.1, 2.0, 1.0],
    leverageRatio: [0.75, 0.75, 0.77],
  },
  regulatory: {
    icrrScore: 58,
    icrrBand: 'Marginal',
    fssScore: 66,
    crgScore: 5,
    covenantBreaches: [
      'FY24 audited financials: maximum leverage ratio covenant of 0.70× exceeded (actual 0.77×).',
      'FY24 tested minimum interest coverage covenant of 1.25× not met (actual 1.0×).',
    ],
    earlyWarnings: [
      'FY24 net loss after scrap-metal price correction and delayed project billings.',
      'Tightening liquidity: operating cash flow fell short of scheduled principal in FY24.',
    ],
  },
  narrative:
    'Padma Steel & Engineering Ltd. fabricates structural steel and transmission-line towers for domestic EPC contractors, with a workshop in Gazipur and heavy reliance on imported hot-rolled coil. FY24 performance weakened when a large infrastructure milestone slipped to the next fiscal year, compressing revenue and leaving EBITDA thin versus interest expense. The borrower remains operational with an active order book, but breached leverage and interest-coverage covenants trigger heightened monitoring under a Marginal ICRR classification despite an adequate headline DSCR of 1.65× supported by working-capital inflows. Recovery prospects hinge on timely project invoicing, inventory discipline, and a lender-supported covenant reset.',
  borrowerDetails: {
    sector: 'Engineering & Metal Fabrication',
    subSector: 'Structural steel, transmission towers & heavy fabrication for EPC contractors',
    established: '2009',
    employees: '412 (including 68 subcontract welders on rolling basis)',
    facilityType: 'Term Loan (machinery) + Cash Credit (HRC & WIP)',
    facilityLimit: 'BDT 135.0 Million',
    facilityOutstanding: 'BDT 128.4 Million (utilisation 95.1% — stress signal)',
    lastReviewDate: '2025-02-27',
    nextReviewDue: '2025-05-27 (accelerated watchlist review)',
    relationshipYears: '5 years',
    collateral:
      'Registered mortgage on workshop & land at Tongi-Gazipur corridor — forced-sale BDT 112M (dated valuation FY22; revaluation pending); charge on machinery BDT 38M net book; personal guarantee of managing director (net worth statement BDT 22M filed Feb 2025).',
  },
  reliabilityScores: {
    completeness: 12,
    consistency: 11,
    auditorQuality: 10,
    cashFlowMatch: 9,
    taxAlignment: 8,
    total: 50,
    assessment: 'Low Reliability',
  },
  narrativeSections: {
    executiveSummary:
      'Padma Steel & Engineering Ltd. is under Marginal ICRR classification (58) following audited covenant breaches on maximum leverage ratio (0.77× vs 0.70× cap) and minimum interest coverage (1.0× vs 1.25× floor). FY24 shows a net loss of BDT 1.8M, declining EBITDA, and shrinking equity as losses absorb retained earnings. Operating cash flow strengthened to BDT 20.5M on milestone collections, producing DSCR 1.65×, but earnings-based serviceability remains weak. The obligor remains a going concern with an order book of BDT 184M (management letter) but execution risk is acute: delayed milestone billing from a flagship PGCB transmission package compressed FY24 revenue recognition. Audited accounts are unqualified but include emphasis-of-matter paragraph on material uncertainty related to liquidity—warranting Low reliability on spreading alignment.',
    financialPerformance:
      'Revenue declined from BDT 171.2M (FY23) to BDT 164.5M (FY24) despite a strong prior-year pipeline, primarily due to BDT 28M of recognised revenue pushed to FY25 under percentage-of-completion restatement. Gross profit fell to BDT 26.3M; scrap-metal inventory write-down of BDT 4.1M further eroded margin. EBITDA collapsed to BDT 5.1M from BDT 9.9M, insufficient to cover interest and scheduled principal. Net margin turned negative; without parent-level support or covenant waivers, FY25 Q1–Q2 cash gaps are projected at BDT 6–9M unless advance mobilisation payments are released.',
    liquidityWorkingCapital:
      'Current ratio slipped to 1.06×; quick ratio excluding slow-moving fabricated WIP is estimated below 0.85×. Operating cash flow of BDT 20.5M exceeds scheduled debt service of BDT 12.4M (DSCR 1.65×) on a cash basis, but thin EBIT coverage of interest leaves limited cushion if billings slip again. The CC limit is effectively fully drawn; the bank has imposed a hard stop on new disbursements except payroll-critical vendor payments under monitored escrow. Debtor days stretched to 148 on PGCB-related receivables; management disputes partial retention holdbacks.',
    leverageDebt:
      'Debt-to-equity at 3.26× and leverage ratio 0.77× are both in stress territory. Interest coverage fell to 1.0× in FY24. Term loan amortisation of BDT 2.8M per quarter continues mechanically, worsening cash strain. FX exposure on HRC imports is partially naturalised via back-to-back sales clauses but residual open exposure was BDT 3.4M MTM loss recognised in OCI. No hidden off-balance-sheet SPVs identified in auditor notes.',
    covenantCompliance:
      'Active breach: maximum leverage ratio 0.70× exceeded (0.77× actual) and minimum interest coverage 1.25× not met (1.0× actual) for FY24 audited test date. Cross-reference to facility letter Clause 9.2 triggers enhanced monitoring and blocks dividend. DSCR tested at 1.65× and remains above the 1.15× floor. Other covenants (minimum tangible net worth BDT 45M) are technically met only by reclassification of BDT 6M related-party receivable—credit team has flagged for conservative treatment. Lender syndicate (lead + one participant) is aligned on 90-day corrective plan.',
    riskFlags:
      'WARNING — elevated default risk: leverage and interest-coverage covenant breaches with no cure period remaining until waiver or reset. Additional warnings: concentration on two EPC contractors (combined 67% of FY24 sales); aged receivables over 120 days at BDT 19.4M (PGCB-related); pending collateral revaluation may force provisioning if steel prices soften. Earnings-based serviceability remains fragile until milestone billings convert to sustainable margin.',
    recommendation:
      'Do not increase exposure. Recommend immediate senior credit committee session for either (a) short-term waiver + BDT 8–12M funded interest reserve facility secured by additional collateral or sponsor cash injection, or (b) orderly restructuring with amortisation holiday through FY25 H1 tied to verified PGCB payment schedule. Require monthly cash waterfall, weekly stock count, and independent confirmation of milestone completion from employer engineers before any further LC-backed imports.',
  },
}
