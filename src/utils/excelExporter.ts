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

function sanitizeFilePart(s: string) {
  return s
    .replace(/[<>:"/\\|?*]/g, '')
    .replace(/\s+/g, '_')
    .slice(0, 48)
}

/** `YYYYMMDD` from ISO review date `YYYY-MM-DD`, or today if unparsable. */
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

function leverageRatioStatus(v: number) {
  if (v <= 0.6) return 'Healthy'
  if (v <= 0.75) return 'Watch'
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

/** Sheet 1: Spread Financials — columns A–E (Line item, 3 years, YoY y1→y2 %) */
function buildSpreadFinancials(data: MockData): WorkSheet {
  const { financials, borrower, auditFirm, reviewDate } = data
  const [y0, y1, y2] = financials.years
  const ws: WorkSheet = {}
  const lastCol = 4

  appendStandardHeader(ws, lastCol, { borrower, auditFirm, reviewDate })

  const headerRow = 3
  const headers = ['Line Item', `FY${y0}`, `FY${y1}`, `FY${y2}`, `YoY Change % (${y1}→${y2})`]
  headers.forEach((h, c) => {
    setCell(ws, headerRow, c, h, 's', styleColHeader)
  })

  type FinRow = { label: string; key: keyof MockData['financials'] }
  const income: FinRow[] = [
    { label: 'Revenue', key: 'revenue' },
    { label: 'Cost of Sales', key: 'costOfSales' },
    { label: 'Gross Profit', key: 'grossProfit' },
    { label: 'Operating Expenses', key: 'operatingExpenses' },
    { label: 'EBITDA', key: 'ebitda' },
    { label: 'Net Profit', key: 'netProfit' },
  ]
  const balance: FinRow[] = [
    { label: 'Total Assets', key: 'totalAssets' },
    { label: 'Total Liabilities', key: 'totalLiabilities' },
    { label: 'Equity', key: 'equity' },
    { label: 'Current Assets', key: 'currentAssets' },
    { label: 'Current Liabilities', key: 'currentLiabilities' },
  ]
  const cashflow: FinRow[] = [
    { label: 'Operating Cash Flow', key: 'operatingCF' },
    { label: 'Debt Service', key: 'debtService' },
  ]

  let r = headerRow + 1

  const writeSection = (title: string, rows: FinRow[]) => {
    mergeRow(ws, r, 0, lastCol, title, styleSection)
    r += 1
    for (const { label, key } of rows) {
      const arr = financials[key] as [number, number, number]
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

  writeSection('INCOME STATEMENT', income)
  writeSection('BALANCE SHEET', balance)
  writeSection('CASH FLOW', cashflow)

  ws['!cols'] = [{ wch: 28 }, { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 22 }]
  return ws
}

/** Sheet 2: Ratio Analysis */
function buildRatioAnalysis(data: MockData): WorkSheet {
  const { financials, ratios, regulatory, borrower, auditFirm, reviewDate } = data
  const [y0, y1, y2] = financials.years
  const ws: WorkSheet = {}
  const lastCol = 5

  appendStandardHeader(ws, lastCol, { borrower, auditFirm, reviewDate })

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

  const rows: Array<{
    name: string
    series: [number, number, number]
    threshold: string
    status: (v: number) => string
  }> = [
    {
      name: 'DSCR',
      series: ratios.dscr,
      threshold: '≥1.25 Healthy; 1.0–1.24 Watch; <1.0 Critical',
      status: dscrStatus,
    },
    {
      name: 'Current Ratio',
      series: ratios.currentRatio,
      threshold: '≥1.5 Healthy; 1.0–1.49 Watch; <1.0 Critical',
      status: currentRatioStatus,
    },
    {
      name: 'Debt to Equity',
      series: ratios.debtToEquity,
      threshold: '≤1.5 Healthy; 1.51–2.5 Watch; >2.5 Critical',
      status: debtToEquityStatus,
    },
    {
      name: 'Interest Coverage',
      series: ratios.interestCoverage,
      threshold: '≥2.0 Healthy; 1.5–1.99 Watch; <1.5 Critical',
      status: interestCoverageStatus,
    },
    {
      name: 'Leverage Ratio',
      series: ratios.leverageRatio,
      threshold: '≤0.6 Healthy; 0.61–0.75 Watch; >0.75 Critical',
      status: leverageRatioStatus,
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
    `ICRR reference: ${regulatory.icrrScore} (${regulatory.icrrBand}) · FSS ${regulatory.fssScore} · CRG ${regulatory.crgScore}`,
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

/** Sheet 3: ICRR Working Paper — input parameters */
function buildIcrrWorkingPaper(data: MockData): WorkSheet {
  const {
    borrower,
    auditFirm,
    reviewDate,
    regulatory,
    borrowerDetails,
    reliabilityScores,
    financials,
    ratios,
    narrative,
  } = data
  const ws: WorkSheet = {}
  const lastCol = 1

  appendStandardHeader(ws, lastCol, { borrower, auditFirm, reviewDate })

  let r = 3
  mergeRow(ws, r, 0, lastCol, `ICRR Score: ${regulatory.icrrScore}  |  Band: ${regulatory.icrrBand}`, styleSection)
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
  add('Review date', reviewDate)
  add('ICRR score', regulatory.icrrScore)
  add('ICRR band', regulatory.icrrBand)
  add('FSS score (reference)', regulatory.fssScore)
  add('CRG score (reference)', regulatory.crgScore)
  add('Covenant breaches (count)', regulatory.covenantBreaches.length)
  add('Early warnings (count)', regulatory.earlyWarnings.length)
  r += 1

  mergeRow(ws, r, 0, lastCol, 'Borrower facility & profile', styleSection)
  r += 1
  add('Sector', borrowerDetails.sector)
  add('Sub-sector', borrowerDetails.subSector)
  add('Established', borrowerDetails.established)
  add('Employees', borrowerDetails.employees)
  add('Facility type', borrowerDetails.facilityType)
  add('Facility limit', borrowerDetails.facilityLimit)
  add('Facility outstanding', borrowerDetails.facilityOutstanding)
  add('Last review date', borrowerDetails.lastReviewDate)
  add('Next review due', borrowerDetails.nextReviewDue)
  add('Relationship (years text)', borrowerDetails.relationshipYears)
  add('Collateral summary', borrowerDetails.collateral)
  r += 1

  mergeRow(ws, r, 0, lastCol, 'Reliability scores (mock inputs)', styleSection)
  r += 1
  add('Completeness ( /20)', reliabilityScores.completeness)
  add('Consistency ( /20)', reliabilityScores.consistency)
  add('Auditor quality ( /20)', reliabilityScores.auditorQuality)
  add('Cash flow match ( /20)', reliabilityScores.cashFlowMatch)
  add('Tax alignment ( /20)', reliabilityScores.taxAlignment)
  add('Total ( /100)', reliabilityScores.total)
  add('Assessment', reliabilityScores.assessment)
  r += 1

  mergeRow(ws, r, 0, lastCol, 'Latest ratio inputs (FY' + financials.years[2] + ')', styleSection)
  r += 1
  const fy = financials.years[2]
  add(`DSCR (${fy})`, ratios.dscr[2])
  add(`Current ratio (${fy})`, ratios.currentRatio[2])
  add(`Debt / equity (${fy})`, ratios.debtToEquity[2])
  add(`Interest coverage (${fy})`, ratios.interestCoverage[2])
  add(`Leverage ratio (${fy})`, ratios.leverageRatio[2])
  r += 1

  mergeRow(ws, r, 0, lastCol, 'Covenant breaches (detail)', styleSection)
  r += 1
  add('Detail', regulatory.covenantBreaches.join(' | ') || 'None')
  r += 1
  mergeRow(ws, r, 0, lastCol, 'Early warnings (detail)', styleSection)
  r += 1
  add('Detail', regulatory.earlyWarnings.join(' | ') || 'None')
  r += 1
  mergeRow(ws, r, 0, lastCol, 'Narrative excerpt (filing summary)', styleSection)
  r += 1
  add('Text', narrative.slice(0, 800))

  ws['!cols'] = [{ wch: 36 }, { wch: 72 }]
  return ws
}

/** Sheet 4: FSS-CRG Calculation — scores + illustrative component inputs */
function buildFssCrg(data: MockData): WorkSheet {
  const { regulatory, financials, ratios, borrower, auditFirm, reviewDate } = data
  const ws: WorkSheet = {}
  const lastCol = 2

  appendStandardHeader(ws, lastCol, { borrower, auditFirm, reviewDate })

  let r = 3
  mergeRow(ws, r, 0, lastCol, 'Supervisory scores (mock decomposition for working paper)', styleSection)
  r += 1

  setCell(ws, r, 0, 'FSS Score (composite)', 's', styleBodyLabel)
  setCell(ws, r, 1, regulatory.fssScore, 'n', styleBodyNum, '0')
  setCell(ws, r, 2, 'Financial spreading & disclosure quality (0–100 scale)', 's', styleBodyText)
  r += 1
  setCell(ws, r, 0, 'CRG Score (1–5, lower is better)', 's', styleBodyLabel)
  setCell(ws, r, 1, regulatory.crgScore, 'n', styleBodyNum, '0')
  setCell(ws, r, 2, 'Credit risk grade per bank policy', 's', styleBodyText)
  r += 2

  mergeRow(ws, r, 0, lastCol, 'FSS — component inputs (illustrative)', styleSection)
  r += 1

  const ebitdaMargin =
    financials.revenue[2] !== 0 ? financials.ebitda[2] / financials.revenue[2] : 0
  const components: [string, number, string][] = [
    ['Spread completeness & tie-out', Math.min(100, regulatory.fssScore + 4), 'Audited TB vs spread'],
    ['EBITDA margin (FY latest)', ebitdaMargin, 'EBITDA ÷ Revenue'],
    ['Liquidity score proxy', ratios.currentRatio[2], 'Current ratio level'],
    ['Coverage score proxy', ratios.interestCoverage[2], 'Interest coverage ×'],
    ['Leverage stress proxy', ratios.leverageRatio[2], 'Total liabilities ÷ assets'],
    [
      'Covenant / early-warning adjustment',
      -regulatory.covenantBreaches.length * 4 - regulatory.earlyWarnings.length * 2,
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
    ['Leverage ratio', ratios.leverageRatio[2], 'Higher leverage worsens grade'],
    ['Covenant breach flag', regulatory.covenantBreaches.length > 0 ? 1 : 0, '1 if any breach'],
    ['Early-warning count', regulatory.earlyWarnings.length, 'Supervisory flags'],
    ['Loss / negative equity flag', financials.netProfit[2] < 0 ? 1 : 0, '1 if latest NP < 0'],
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
    `Mapped ICRR: ${regulatory.icrrScore} (${regulatory.icrrBand}) — used alongside FSS/CRG in committee pack.`,
    styleNote,
  )

  ws['!cols'] = [{ wch: 34 }, { wch: 14 }, { wch: 44 }]
  return ws
}

/** Sheet 5: Trend Analysis — headline metrics + changes + footer note */
function buildTrendAnalysis(data: MockData): WorkSheet {
  const { financials, borrower, auditFirm, reviewDate } = data
  const [y0, y1, y2] = financials.years
  const ws: WorkSheet = {}
  const lastCol = 7

  appendStandardHeader(ws, lastCol, { borrower, auditFirm, reviewDate })

  const headerRow = 3
  const hdr = [
    'Metric',
    `FY${y0}`,
    `FY${y1}`,
    `FY${y2}`,
    `Abs Δ ${y0}→${y1}`,
    `Abs Δ ${y1}→${y2}`,
    `% Δ ${y0}→${y1}`,
    `% Δ ${y1}→${y2}`,
  ]
  hdr.forEach((h, c) => setCell(ws, headerRow, c, h, 's', styleColHeader))

  const metrics: Array<{ label: string; key: 'revenue' | 'ebitda' | 'netProfit' }> = [
    { label: 'Revenue', key: 'revenue' },
    { label: 'EBITDA', key: 'ebitda' },
    { label: 'Net Profit', key: 'netProfit' },
  ]

  let r = headerRow + 1
  for (const { label, key } of metrics) {
    const arr = financials[key] as [number, number, number]
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
  const stamp = fileStampYyyymmdd(data.reviewDate)
  const filename = `CreditReview_${safeBorrower}_${stamp}.xlsx`

  XLSX.writeFile(wb, filename)
}
