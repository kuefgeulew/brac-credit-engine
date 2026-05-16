export interface OsmlData {
  borrower: string
  group: string
  auditFirm: string
  sector: string
  industryCode: string
  ownership: string
  cibStatus: string
  auditStatus: string
  analyst: string
  verifier: string
  dateOfFinancials: string
  dateOfAnalysis: string
  facilityType: string
  facilityLimit: string
  facilityOutstanding: string
  collateral: string
  relationshipYears: string
  lastReviewDate: string
  nextReviewDue: string
  financials: {
    years: string[]
    incomeStatement: Record<string, number[]>
    balanceSheet: Record<string, number[]>
    cashFlow: Record<string, number[]>
  }
  ratios: Record<string, number[]>
  regulatory?: any
  narrative?: string
  narrativeSections?: any
  reliabilityScores?: any
}

export type MockData = OsmlData
