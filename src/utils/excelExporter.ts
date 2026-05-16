import * as XLSX from 'xlsx-js-style'
import type { CellStyle, WorkSheet } from 'xlsx-js-style'
import type { MockData } from '../types/mockData'

const BDT_FMT = '"BDT" #,##0'
const PCT_FMT = '0.0%'
const RATIO_FMT = '0.00'

const borderThin = {
  style: 'thin' as const,
  color: { rgb: 'FFD0DCF0' },
}

const borderAll: NonNullable<CellStyle['border']> = {
  top: borderThin,
  bottom: borderThin,
  left: borderThin,
  right: borderThin,
}

const styleTitle: CellStyle = {
  font: { bold: true, sz: 14, color: { rgb: 'FFFFFFFF' } },
  fill: { fgColor: { rgb: 'FF003D7A' } },
  alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
  border: borderAll,
}

const styleMeta: CellStyle = {
  font: { sz: 11, color: { rgb: 'FF0D1B3E' } },
  fill: { fgColor: { rgb: 'FFF4F7FB' } },
  alignment: { horizontal: 'left', vertical: 'center', wrapText: true },
  border: borderAll,
}

const styleColHeader: CellStyle = {
  font: { bold: true, sz: 11, color: { rgb: 'FFFFFFFF' } },
  fill: { fgColor: { rgb: 'FF0052A5' } },
  alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
  border: borderAll,
}

const styleSection: CellStyle = {
  font: { bold: true, sz: 11, color: { rgb: 'FF0D1B3E' } },
  fill: { fgColor: { rgb: 'FFE8EDF5' } },
  alignment: { horizontal: 'left', vertical: 'center' },
  border: borderAll,
}

const styleBodyLabel: CellStyle = {
  font: { sz: 11, color: { rgb: 'FF0D1B3E' } },
  alignment: { horizontal: 'left', vertical: 'center' },
  border: borderAll,
}

const styleBodyNum: CellStyle = {
  font: { sz: 11, color: { rgb: 'FF0D1B3E' } },
  alignment: { horizontal: 'right', vertical: 'center' },
  border: borderAll,
}

const styleBodyText: CellStyle = {
  font: { sz: 11, color: { rgb: 'FF4A5568' } },
  alignment: { horizontal: 'left', vertical: 'center', wrapText: true },
  border: borderAll,
}

const styleNote: CellStyle = {
  font: { italic: true, sz: 10, color: { rgb: 'FF4A5568' } },
  alignment: { horizontal: 'left', vertical: 'center', wrapText: true },
  border: borderAll,
}

function enc(r: number, c: number) {
  return XLSX.utils.encode_cell({ r, c })
}

function extendRef(ws: WorkSheet, r: number, c: number) {
  const cur = ws['!ref'] ? XLSX.utils.decode_range(ws['!ref']!) : { s: { r: 0, c: 0 }, e: { r: 0, c: 0 } }
  cur.e.r = Math.max(cur.e.r, r)
  cur.e.c = Math.max(cur.e.c, c)
  ws['!ref'] = XLSX.utils.encode_range(cur)
}

function setCell(
  ws: WorkSheet,
  r: number,
  c: number,
  value: string | number | null,
  t: 's' | 'n' | undefined,
  style?: CellStyle,
  z?: string,
) {
  const addr = enc(r, c)
  const cell: XLSX.CellObject = { v: value ?? '', t: t ?? 's' }
  if (z) cell.z = z
  if (style) cell.s = style
  ws[addr] = cell
  extendRef(ws, r, c)
}

function mergeRow(ws: WorkSheet, r: number, c0: number, c1: number, text: string, style: CellStyle) {
  setCell(ws, r, c0, text, 's', style)
  if (!ws['!merges']) ws['!merges'] = []
  ws['!merges'].push({ s: { r, c: c0 }, e: { r, c: c1 } })
  for (let c = c0 + 1; c <= c1; c++) {
    setCell(ws, r, c, '', 's', style)
  }
}

function appendStandardHeader(
  ws: WorkSheet,
  lastCol: number,
  meta: { borrower: string; auditFirm: string; reviewDate: string },
) {
  mergeRow(
    ws,
    0,
    0,
    lastCol,
    'BRAC Bank — Credit Analysis Workbook',
    styleTitle,
  )
  mergeRow(
    ws,
    1,
    0,
    lastCol,
    `Borrower: ${meta.borrower} | Audit Firm: ${meta.auditFirm} | Review Date: ${meta.reviewDate}`,
    styleMeta,
  )
  mergeRow(ws, 2, 0, lastCol, '', { ...styleMeta, font: { sz: 1 } })
}

function yoyPctDecimal(prev: number, curr: number): number | null {
  if (prev === 0) return null
  return (curr - prev) / prev
}

function fyShortPair(fromYear: string, toYear: string): string {
  const a = fromYear.trim().slice(-2)
  const b = toYear.trim().slice(-2)
  return `FY${a}→${b}`
}

function sanitizeFilePart(s: string) {
  return s
    .replace(/[<>:"/\\|?*]/g, '')
    .replace(/\s+/g, '_')
    .slice(0, 48)
}

function fileStampYyyymmdd(iso: string): string {
  const head = iso.trim().split('T')[0] ?? ''
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(head)
  if (m) return `${m[1]}${m[2]}${m[3]}`
  const d = new Date()
  const y = d.getFullYear()
  const mo = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}${mo}${day}`
}

function currentRatioStatus(v: number) {
  if (v >= 1.5) return 'Healthy'
  if (v >= 1.0) return 'Watch'
  return 'Critical'
}

function debtToEquityStatus(v: number) {
  if (v <= 1.5) return 'Healthy'
  if (v <= 2.5) return 'Watch'
  return 'Critical'
}

function interestCoverageStatus(v: number) {
  if (v >= 2.0) return 'Healthy'
  if (v >= 1.5) return 'Watch'
  return 'Critical'
}

function returnOnAssetsStatus(v: number) {
  if (v >= 3.0) return 'Healthy'
  if (v >= 1.5) return 'Watch'
  return 'Critical'
}

function dscrStatus(v: number) {
  if (v >= 1.25) return 'Healthy'
  if (v >= 1.0) return 'Watch'
  return 'Critical'
}

function yoyAbs(a: number, b: number) {
  return b - a
}

function yoyPct(a: number, b: number) {
  if (a === 0) return b === 0 ? 0 : null
  return ((b - a) / a) * 100
}

function buildSpreadFinancials(data: MockData): WorkSheet {
  const { financials, borrower, auditFirm, dateOfAnalysis } = data
  const [y0, y1, y2] = financials.years
  const ws: WorkSheet = {}
  const lastCol = 4

  appendStandardHeader(ws, lastCol, { borrower, auditFirm, reviewDate: dateOfAnalysis })

  const headerRow = 3
  const headers = ['Line Item', `FY${y0}`, `FY${y1}`, `FY${y2}`, `YoY Change % (${y1}→${y2})`]
  headers.forEach((h, c) => {
    setCell(ws, headerRow, c, h, 's', styleColHeader)
  })

  const income = [
    { label: 'Revenue', key: 'revenue' },
    { label: 'Cost of Goods Sold', key: 'costOfGoodsSold' },
    { label: 'Gross Profit', key: 'grossProfit' },
    { label: 'Operating Expenses', key: 'operatingExpenses' },
    { label: 'EBIT', key: 'ebit' },
    { label: 'Net Profit', key: 'netProfit' },
  ]
  const balance = [
    { label: 'Total Assets', key: 'totalAssets' },
    { label: 'Total Liabilities', key: 'totalLiabilities' },
    { label: 'Total Equity', key: 'totalEquity' },
    { label: 'Current Assets', key: 'totalCurrentAssets' },
    { label: 'Current Liabilities', key: 'totalCurrentLiab' },
  ]
  const cashflow = [
    { label: 'Operating Cash Flow', key: 'operatingCF' },
    { label: 'Investing Cash Flow', key: 'investingCF' },
    { label: 'Financing Cash Flow', key: 'financingCF' },
  ]

  let r = headerRow + 1

  const writeSection = (title: string, rows: {label: string, key: string}[], source: Record<string, number[]>) => {
    mergeRow(ws, r, 0, lastCol, title, styleSection)
    r += 1
    for (const { label, key } of rows) {
      const arr = source[key] || [0, 0, 0]
      const [v0, v1, v2] = arr
      const yoy = yoyPctDecimal(v1, v2)
      setCell(ws, r, 0, label, 's', styleBodyLabel)
      setCell(ws, r, 1, v0, 'n', styleBodyNum, BDT_FMT)
      setCell(ws, r, 2, v1, 'n', styleBodyNum, BDT_FMT)
      setCell(ws, r, 3, v2, 'n', styleBodyNum, BDT_FMT)
      if (yoy === null) {
        setCell(ws, r, 4, 'n/m', 's', styleBodyText)
      } else {
        setCell(ws, r, 4, yoy, 'n', styleBodyNum, PCT_FMT)
      }
      r += 1
    }
    r += 1
  }

  writeSection('INCOME STATEMENT', income, financials.incomeStatement)
  writeSection('BALANCE SHEET', balance, financials.balanceSheet)
  writeSection('CASH FLOW', cashflow, financials.cashFlow)

  ws['!cols'] = [{ wch: 28 }, { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 22 }]
  return ws
}

function buildRatioAnalysis(data: MockData): WorkSheet {
  const { financials, ratios, borrower, auditFirm, dateOfAnalysis } = data
  const [y0, y1, y2] = financials.years
  const ws: WorkSheet = {}
  const lastCol = 5

  appendStandardHeader(ws, lastCol, { borrower, auditFirm, reviewDate: dateOfAnalysis })

  const headerRow = 3
  const hdr = [
    'Ratio Name',
    `FY${y0}`,
    `FY${y1}`,
    `FY${y2}`,
    'Threshold',
    `FY${y2} Status`,
  ]
  hdr.forEach((h, c) => setCell(ws, headerRow, c, h, 's', styleColHeader))

  const rows = [
    {
      name: 'DSCR',
      series: ratios.dscr || [0, 0, 0],
      threshold: '≥1.25 Healthy; 1.0–1.24 Watch; <1.0 Critical',
      status: dscrStatus,
    },
    {
      name: 'Current Ratio',
      series: ratios.currentRatio || [0, 0, 0],
      threshold: '≥1.5 Healthy; 1.0–1.49 Watch; <1.0 Critical',
      status: currentRatioStatus,
    },
    {
      name: 'Debt to Equity',
      series: ratios.debtToEquity || [0, 0, 0],
      threshold: '≤1.5 Healthy; 1.51–2.5 Watch; >2.5 Critical',
      status: debtToEquityStatus,
    },
    {
      name: 'Interest Coverage',
      series: ratios.interestCoverage || [0, 0, 0],
      threshold: '≥2.0 Healthy; 1.5–1.99 Watch; <1.5 Critical',
      status: interestCoverageStatus,
    },
    {
      name: 'Return on Assets',
      series: ratios.returnOnAssets || [0, 0, 0],
      threshold: '≥3.0 Healthy; 1.5–2.9 Watch; <1.5 Critical',
      status: returnOnAssetsStatus,
    },
  ]

  let r = headerRow + 1
  for (const row of rows) {
    const [a, b, c] = row.series
    const latest = c
    setCell(ws, r, 0, row.name, 's', styleBodyLabel)
    setCell(ws, r, 1, a, 'n', styleBodyNum, RATIO_FMT)
    setCell(ws, r, 2, b, 'n', styleBodyNum, RATIO_FMT)
    setCell(ws, r, 3, c, 'n', styleBodyNum, RATIO_FMT)
    setCell(ws, r, 4, row.threshold, 's', styleBodyText)
    setCell(ws, r, 5, row.status(latest), 's', styleBodyLabel)
    r += 1
  }

  mergeRow(
    ws,
    r,
    0,
    lastCol,
    `ICRR reference: 50.5 (Unacceptable) · FSS 42 · CRG 29`,
    styleNote,
  )

  ws['!cols'] = [
    { wch: 20 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
    { wch: 42 },
    { wch: 14 },
  ]
  return ws
}

function buildIcrrWorkingPaper(data: MockData): WorkSheet {
  const {
    borrower,
    auditFirm,
    dateOfAnalysis,
    financials,
    ratios,
  } = data
  const ws: WorkSheet = {}
  const lastCol = 1

  appendStandardHeader(ws, lastCol, { borrower, auditFirm, reviewDate: dateOfAnalysis })

  let r = 3
  mergeRow(ws, r, 0, lastCol, `ICRR Score: 50.5  |  Band: Unacceptable`, styleSection)
  r += 1
  r += 1

  const hdrRow = r
  setCell(ws, hdrRow, 0, 'Parameter', 's', styleColHeader)
  setCell(ws, hdrRow, 1, 'Value', 's', styleColHeader)
  r += 1

  const add = (k: string, v: string | number) => {
    setCell(ws, r, 0, k, 's', styleBodyLabel)
    if (typeof v === 'number') {
      setCell(ws, r, 1, v, 'n', styleBodyNum, Number.isInteger(v) ? '0' : RATIO_FMT)
    } else {
      setCell(ws, r, 1, v, 's', styleBodyText)
    }
    r += 1
  }

  add('Borrower', borrower)
  add('Audit firm', auditFirm)
  add('Review date', dateOfAnalysis)
  add('ICRR score', 50.5)
  add('ICRR band', 'Unacceptable')
  add('FSS score (reference)', 42)
  add('CRG score (reference)', 29)
  add('Covenant breaches (count)', 1)
  add('Early warnings (count)', 1)
  r += 1

  mergeRow(ws, r, 0, lastCol, 'Borrower facility & profile', styleSection)
  r += 1
  add('Sector', data.sector)
  add('Facility type', data.facilityType)
  add('Facility limit', data.facilityLimit)
  add('Facility outstanding', data.facilityOutstanding)
  add('Last review date', data.lastReviewDate)
  add('Next review due', data.nextReviewDue)
  add('Relationship (years text)', data.relationshipYears)
  add('Collateral summary', data.collateral)
  r += 1

  mergeRow(ws, r, 0, lastCol, 'Reliability scores (mock inputs)', styleSection)
  r += 1
  add('Total ( /100)', 70)
  add('Assessment', 'Moderate Reliability')
  r += 1

  mergeRow(ws, r, 0, lastCol, 'Latest ratio inputs (FY' + financials.years[2] + ')', styleSection)
  r += 1
  const fy = financials.years[2]
  add(`DSCR (${fy})`, ratios.dscr[2])
  add(`Current ratio (${fy})`, ratios.currentRatio[2])
  add(`Debt / equity (${fy})`, ratios.debtToEquity[2])
  add(`Interest coverage (${fy})`, ratios.interestCoverage[2])
  add(`Return on Assets (${fy})`, ratios.returnOnAssets[2])
  r += 1

  mergeRow(ws, r, 0, lastCol, 'Covenant breaches (detail)', styleSection)
  r += 1
  add('Detail', 'DSCR fell below 1.5x minimum requirement (Actual: 1.42x)')
  r += 1
  mergeRow(ws, r, 0, lastCol, 'Early warnings (detail)', styleSection)
  r += 1
  add('Detail', 'Inventory turnover days increased significantly from 378 to 824 days')
  r += 1

  ws['!cols'] = [{ wch: 36 }, { wch: 72 }]
  return ws
}

function buildFssCrg(data: MockData): WorkSheet {
  const { financials, ratios, borrower, auditFirm, dateOfAnalysis } = data
  const ws: WorkSheet = {}
  const lastCol = 2

  appendStandardHeader(ws, lastCol, { borrower, auditFirm, reviewDate: dateOfAnalysis })

  let r = 3
  mergeRow(ws, r, 0, lastCol, 'Supervisory scores (mock decomposition for working paper)', styleSection)
  r += 1

  setCell(ws, r, 0, 'FSS Score (composite)', 's', styleBodyLabel)
  setCell(ws, r, 1, 42, 'n', styleBodyNum, '0')
  setCell(ws, r, 2, 'Financial spreading & disclosure quality (0–100 scale)', 's', styleBodyText)
  r += 1
  setCell(ws, r, 0, 'CRG Score (1–5, lower is better)', 's', styleBodyLabel)
  setCell(ws, r, 1, 29, 'n', styleBodyNum, '0')
  setCell(ws, r, 2, 'Credit risk grade per bank policy', 's', styleBodyText)
  r += 2

  mergeRow(ws, r, 0, lastCol, 'FSS — component inputs (illustrative)', styleSection)
  r += 1

  const ebitdaMargin =
    financials.incomeStatement.revenue[2] !== 0 ? financials.incomeStatement.ebit[2] / financials.incomeStatement.revenue[2] : 0
  const components: [string, number, string][] = [
    ['Spread completeness & tie-out', 46, 'Audited TB vs spread'],
    ['EBITDA margin (FY latest)', ebitdaMargin, 'EBITDA ÷ Revenue'],
    ['Liquidity score proxy', ratios.currentRatio[2], 'Current ratio level'],
    ['Coverage score proxy', ratios.interestCoverage[2], 'Interest coverage ×'],
    ['Leverage stress proxy', ratios.debtToEquity[2], 'Total liabilities ÷ equity'],
    [
      'Covenant / early-warning adjustment',
      -6,
      'Penalty points (mock)',
    ],
  ]

  setCell(ws, r, 0, 'Component', 's', styleColHeader)
  setCell(ws, r, 1, 'Input value', 's', styleColHeader)
  setCell(ws, r, 2, 'Notes', 's', styleColHeader)
  r += 1
  for (const [name, val, note] of components) {
    setCell(ws, r, 0, name, 's', styleBodyLabel)
    setCell(ws, r, 1, val, 'n', styleBodyNum, RATIO_FMT)
    setCell(ws, r, 2, note, 's', styleBodyText)
    r += 1
  }

  r += 1
  mergeRow(ws, r, 0, lastCol, 'CRG — component inputs (illustrative)', styleSection)
  r += 1

  const crgRows: [string, number, string][] = [
    ['DSCR stress (inverse scale)', ratios.dscr[2], 'Lower DSCR worsens grade'],
    ['Leverage ratio', ratios.debtToEquity[2], 'Higher leverage worsens grade'],
    ['Covenant breach flag', 1, '1 if any breach'],
    ['Early-warning count', 1, 'Supervisory flags'],
    ['Loss / negative equity flag', financials.incomeStatement.netProfit[2] < 0 ? 1 : 0, '1 if latest NP < 0'],
  ]
  setCell(ws, r, 0, 'Component', 's', styleColHeader)
  setCell(ws, r, 1, 'Input value', 's', styleColHeader)
  setCell(ws, r, 2, 'Notes', 's', styleColHeader)
  r += 1
  for (const [name, val, note] of crgRows) {
    setCell(ws, r, 0, name, 's', styleBodyLabel)
    setCell(ws, r, 1, val, 'n', styleBodyNum, RATIO_FMT)
    setCell(ws, r, 2, note, 's', styleBodyText)
    r += 1
  }

  mergeRow(
    ws,
    r,
    0,
    lastCol,
    `Mapped ICRR: 50.5 (Unacceptable) — used alongside FSS/CRG in committee pack.`,
    styleNote,
  )

  ws['!cols'] = [{ wch: 34 }, { wch: 14 }, { wch: 44 }]
  return ws
}

function buildTrendAnalysis(data: MockData): WorkSheet {
  const { financials, borrower, auditFirm, dateOfAnalysis } = data
  const [y0, y1, y2] = financials.years
  const ws: WorkSheet = {}
  const lastCol = 7

  appendStandardHeader(ws, lastCol, { borrower, auditFirm, reviewDate: dateOfAnalysis })

  const headerRow = 3
  const hdr = [
    'Metric',
    `FY${y0}`,
    `FY${y1}`,
    `FY${y2}`,
    `Change ${fyShortPair(y0, y1)} (abs)`,
    `Change ${fyShortPair(y1, y2)} (abs)`,
    `Change ${fyShortPair(y0, y1)} (%)`,
    `Change ${fyShortPair(y1, y2)} (%)`,
  ]
  hdr.forEach((h, c) => setCell(ws, headerRow, c, h, 's', styleColHeader))

  const metrics = [
    { label: 'Revenue', key: 'revenue' },
    { label: 'EBIT', key: 'ebit' },
    { label: 'Net Profit', key: 'netProfit' },
  ]

  let r = headerRow + 1
  for (const { label, key } of metrics) {
    const arr = financials.incomeStatement[key] || [0, 0, 0]
    const [v0, v1, v2] = arr
    const abs01 = yoyAbs(v0, v1)
    const abs12 = yoyAbs(v1, v2)
    const p01 = yoyPct(v0, v1)
    const p12 = yoyPct(v1, v2)

    setCell(ws, r, 0, label, 's', styleBodyLabel)
    setCell(ws, r, 1, v0, 'n', styleBodyNum, BDT_FMT)
    setCell(ws, r, 2, v1, 'n', styleBodyNum, BDT_FMT)
    setCell(ws, r, 3, v2, 'n', styleBodyNum, BDT_FMT)
    setCell(ws, r, 4, abs01, 'n', styleBodyNum, BDT_FMT)
    setCell(ws, r, 5, abs12, 'n', styleBodyNum, BDT_FMT)
    if (p01 === null) {
      setCell(ws, r, 6, 'n/m', 's', styleBodyText)
    } else {
      setCell(ws, r, 6, p01 / 100, 'n', styleBodyNum, PCT_FMT)
    }
    if (p12 === null) {
      setCell(ws, r, 7, 'n/m', 's', styleBodyText)
    } else {
      setCell(ws, r, 7, p12 / 100, 'n', styleBodyNum, PCT_FMT)
    }
    r += 1
  }

  r += 1
  mergeRow(
    ws,
    r,
    0,
    lastCol,
    'Prepared by AI Credit Spreading Engine — BRAC Bank Credit Division',
    styleNote,
  )

  ws['!cols'] = [
    { wch: 16 },
    { wch: 16 },
    { wch: 16 },
    { wch: 16 },
    { wch: 18 },
    { wch: 18 },
    { wch: 14 },
    { wch: 14 },
  ]
  return ws
}

export function generateExcel(data: MockData) {
  const wb = XLSX.utils.book_new()

  const ws1 = buildSpreadFinancials(data)
  XLSX.utils.book_append_sheet(wb, ws1, 'Spread Financials')

  const ws2 = buildRatioAnalysis(data)
  XLSX.utils.book_append_sheet(wb, ws2, 'Ratio Analysis')

  const ws3 = buildIcrrWorkingPaper(data)
  XLSX.utils.book_append_sheet(wb, ws3, 'ICRR Working Paper')

  const ws4 = buildFssCrg(data)
  XLSX.utils.book_append_sheet(wb, ws4, 'FSS-CRG Calculation')

  const ws5 = buildTrendAnalysis(data)
  XLSX.utils.book_append_sheet(wb, ws5, 'Trend Analysis')

  const safeBorrower = sanitizeFilePart(data.borrower)
  const stamp = fileStampYyyymmdd(data.dateOfAnalysis)
  const filename = `CreditReview_${safeBorrower}_${stamp}.xlsx`

  XLSX.writeFile(wb, filename)
}
