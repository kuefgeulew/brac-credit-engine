import { osmlFinancials } from './osmlFinancials'
import type { MockData } from '../types/mockData'

export const osmlData: MockData = {
  borrower: "Outpace Spinning Mills Ltd.",
  group: "Outright Group",
  auditFirm: "Dewan Nazrul Islam & Co.",
  sector: "Textile",
  industryCode: "102",
  ownership: "Private Ltd Company",
  cibStatus: "Standard",
  auditStatus: "Unaudited",
  analyst: "Md. Matiur Rahman, SRM",
  verifier: "Farhana Afrin, SM",
  dateOfFinancials: "30 June 2024",
  dateOfAnalysis: "26 December 2024",
  facilityType: "Short Term Loan + Long Term Loan",
  facilityLimit: "BDT 3,135.2 Million",
  facilityOutstanding: "BDT 3,135.2 Million",
  collateral: "Registered Hypothecation (1st Charge)",
  relationshipYears: "8 years",
  lastReviewDate: "December 2023",
  nextReviewDue: "December 2025",
  financials: {
    years: osmlFinancials.years,
    incomeStatement: osmlFinancials.incomeStatement,
    balanceSheet: osmlFinancials.balanceSheet,
    cashFlow: osmlFinancials.cashFlow,
  },
  ratios: osmlFinancials.ratios,
}
