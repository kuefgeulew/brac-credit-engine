/**
 * Canonical mock payload types for `src/mockData/*.ts`.
 *
 * **`MockData`** — full credit-review mock (Session 4+): spreads, regulatory block,
 * `narrative`, and enriched `borrowerDetails`, `reliabilityScores`, `narrativeSections`.
 * `reliabilityScores.total` must equal the sum of the five segment scores;
 * `narrativeSections` must include all seven keys.
 */
export interface BorrowerDetails {
  sector: string
  subSector: string
  established: string
  employees: string
  facilityType: string
  facilityLimit: string
  facilityOutstanding: string
  lastReviewDate: string
  nextReviewDue: string
  relationshipYears: string
  collateral: string
}

export interface ReliabilityScores {
  completeness: number
  consistency: number
  auditorQuality: number
  cashFlowMatch: number
  taxAlignment: number
  total: number
  assessment: 'High Reliability' | 'Moderate Reliability' | 'Low Reliability'
}

export interface NarrativeSections {
  executiveSummary: string
  financialPerformance: string
  liquidityWorkingCapital: string
  leverageDebt: string
  covenantCompliance: string
  riskFlags: string
  recommendation: string
}

export interface MockData {
  borrower: string
  auditFirm: string
  reviewDate: string
  financials: {
    years: [string, string, string]
    revenue: [number, number, number]
    costOfSales: [number, number, number]
    grossProfit: [number, number, number]
    operatingExpenses: [number, number, number]
    ebitda: [number, number, number]
    netProfit: [number, number, number]
    totalAssets: [number, number, number]
    totalLiabilities: [number, number, number]
    equity: [number, number, number]
    currentAssets: [number, number, number]
    currentLiabilities: [number, number, number]
    operatingCF: [number, number, number]
    debtService: [number, number, number]
  }
  ratios: {
    dscr: [number, number, number]
    currentRatio: [number, number, number]
    debtToEquity: [number, number, number]
    interestCoverage: [number, number, number]
    leverageRatio: [number, number, number]
  }
  regulatory: {
    icrrScore: number
    icrrBand: string
    fssScore: number
    crgScore: number
    covenantBreaches: string[]
    earlyWarnings: string[]
  }
  /** Short filing summary used for Excel excerpt and supplementary “source” block. */
  narrative: string
  borrowerDetails: BorrowerDetails
  reliabilityScores: ReliabilityScores
  narrativeSections: NarrativeSections
}

/** @deprecated Prefer `MockData`; kept for older imports. */
export type CreditReviewMockData = MockData

/** Segment fields that must sum to `reliabilityScores.total`. */
export const RELIABILITY_SEGMENT_KEYS = [
  'completeness',
  'consistency',
  'auditorQuality',
  'cashFlowMatch',
  'taxAlignment',
] as const

export function sumReliabilitySegments(
  s: Pick<
    ReliabilityScores,
    'completeness' | 'consistency' | 'auditorQuality' | 'cashFlowMatch' | 'taxAlignment'
  >,
): number {
  return (
    s.completeness +
    s.consistency +
    s.auditorQuality +
    s.cashFlowMatch +
    s.taxAlignment
  )
}
