import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { MockData } from '../types/mockData'

const PRIMARY = '#0052A5'
const TEXT_DARK = '#0D1B3E'
const BORDER = '#D0DCF0'
const ROW_ALT = '#F4F7FB'
const GROUP_BG = '#E8EEF7'

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

function setFillHex(doc: jsPDF, hex: string) {
  const [r, g, b] = hexToRgb(hex)
  doc.setFillColor(r, g, b)
}

function setTextHex(doc: jsPDF, hex: string) {
  const [r, g, b] = hexToRgb(hex)
  doc.setTextColor(r, g, b)
}

function formatBdtM(n: number): string {
  const m = n / 1_000_000
  if (!Number.isFinite(m)) return '—'
  const abs = Math.abs(m)
  const s = abs >= 100 ? m.toFixed(0) : m.toFixed(1)
  return `BDT ${s}M`
}

function formatRatio2(n: number): string {
  return Number.isFinite(n) ? n.toFixed(2) : '—'
}

type RatioStatus = 'Healthy' | 'Watch' | 'Critical'

function currentRatioStatus(v: number): RatioStatus {
  if (v >= 1.5) return 'Healthy'
  if (v >= 1.0) return 'Watch'
  return 'Critical'
}

function debtToEquityStatus(v: number): RatioStatus {
  if (v <= 1.5) return 'Healthy'
  if (v <= 2.5) return 'Watch'
  return 'Critical'
}

function interestCoverageStatus(v: number): RatioStatus {
  if (v >= 2.0) return 'Healthy'
  if (v >= 1.5) return 'Watch'
  return 'Critical'
}

function leverageRatioStatus(v: number): RatioStatus {
  if (v <= 0.6) return 'Healthy'
  if (v <= 0.75) return 'Watch'
  return 'Critical'
}

function dscrStatus(v: number): RatioStatus {
  if (v >= 1.25) return 'Healthy'
  if (v >= 1.0) return 'Watch'
  return 'Critical'
}

function regulatoryRgb(score: number): [number, number, number] {
  if (score >= 70) return [34, 197, 94]
  if (score >= 60) return [245, 158, 11]
  return [239, 68, 68]
}

/** CRG scale 1–5 (lower grade number = better). */
function crgGradeFill(crg: number): [number, number, number] {
  if (crg <= 2) return [34, 197, 94]
  if (crg === 3) return [245, 158, 11]
  return [239, 68, 68]
}

function safeFileNamePart(name: string): string {
  return (
    name
      .replace(/[^a-zA-Z0-9]+/g, '_')
      .replace(/^_|_$/g, '')
      .slice(0, 80) || 'Borrower'
  )
}

function ymd(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}${m}${day}`
}

function fileStampFromReviewIso(iso: string): string {
  const head = iso.trim().split('T')[0] ?? ''
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(head)
  if (m) return `${m[1]}${m[2]}${m[3]}`
  return ymd(new Date())
}

function formatReviewDateIso(iso: string): string {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function drawFooter(doc: jsPDF, pageIndex: number, totalPages: number, generatedAt: string) {
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const margin = 14
  doc.setFontSize(8)
  doc.setTextColor(100, 100, 100)
  doc.setFont('helvetica', 'normal')
  doc.text(`Page ${pageIndex} of ${totalPages}`, pageW - margin, pageH - 8, { align: 'right' })
  doc.text('BRAC Bank Limited — Credit Analysis Portal — CONFIDENTIAL', margin, pageH - 8)
  doc.text(generatedAt, pageW / 2, pageH - 8, { align: 'center' })
}

function drawSectionHeaderBar(doc: jsPDF, y: number, title: string): number {
  const pageW = doc.internal.pageSize.getWidth()
  const margin = 14
  const barH = 8
  setFillHex(doc, PRIMARY)
  doc.rect(margin, y, pageW - 2 * margin, barH, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(255, 255, 255)
  doc.text(title, margin + 2, y + 5.5)
  doc.setTextColor(0, 0, 0)
  return y + barH + 4
}

function drawScoreBox(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  label: string,
  body: string,
  rgb: [number, number, number],
) {
  doc.setFillColor(rgb[0], rgb[1], rgb[2])
  doc.roundedRect(x, y, w, h, 1, 1, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(255, 255, 255)
  doc.text(label, x + w / 2, y + 6, { align: 'center' })
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  const lines = doc.splitTextToSize(body, w - 4)
  doc.text(lines, x + w / 2, y + 11, { align: 'center' })
  doc.setTextColor(0, 0, 0)
}

/**
 * Builds a multi-page credit review PDF and triggers download in the browser.
 */
export function generatePDFReport(data: MockData): void {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  const margin = 14
  const generatedAt = new Date().toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })
  const { financials, ratios, regulatory, borrowerDetails, narrativeSections, reliabilityScores } =
    data
  const [y0, y1, y2] = financials.years

  /* ----- PAGE 1 COVER ----- */
  const topBarH = 11
  setFillHex(doc, PRIMARY)
  doc.rect(0, 0, pageW, topBarH, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.setTextColor(255, 255, 255)
  doc.text('BRAC Bank Limited', margin, 7)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text('Credit Analysis Portal', pageW - margin, 7, { align: 'right' })

  let y = topBarH + 16
  doc.setFont('helvetica', 'bold')
  setTextHex(doc, TEXT_DARK)
  doc.setFontSize(22)
  doc.text('CREDIT REVIEW REPORT', pageW / 2, y, { align: 'center' })
  y += 14
  doc.setFontSize(18)
  setTextHex(doc, PRIMARY)
  doc.text(data.borrower, pageW / 2, y, { align: 'center' })
  y += 10
  setTextHex(doc, TEXT_DARK)
  doc.setDrawColor(...hexToRgb(BORDER))
  doc.setLineWidth(0.3)
  doc.line(margin, y, pageW - margin, y)
  y += 8

  doc.setFontSize(10)
  const leftX = margin
  const valX = margin + 55
  const lineH = 6.5

  const leftBlock: [string, string][] = [
    ['Audit Firm', data.auditFirm],
    ['Sector', borrowerDetails.sector],
    ['Facility Type', borrowerDetails.facilityType],
    ['Facility Limit', borrowerDetails.facilityLimit],
    ['Outstanding', borrowerDetails.facilityOutstanding],
  ]
  for (const [lab, val] of leftBlock) {
    doc.setFont('helvetica', 'bold')
    setTextHex(doc, TEXT_DARK)
    doc.text(lab + ':', leftX, y)
    doc.setFont('helvetica', 'normal')
    const vlines = doc.splitTextToSize(val, pageW - valX - margin)
    doc.text(vlines, valX, y)
    y += Math.max(lineH, vlines.length * 4.2)
  }
  y += 3
  const rightBlock: [string, string][] = [
    ['Review Date', formatReviewDateIso(data.reviewDate)],
    ['ICRR Score', String(regulatory.icrrScore)],
    ['ICRR Band', regulatory.icrrBand],
    ['FSS Score', String(regulatory.fssScore)],
    ['CRG Score', String(regulatory.crgScore)],
  ]
  for (const [lab, val] of rightBlock) {
    doc.setFont('helvetica', 'bold')
    setTextHex(doc, TEXT_DARK)
    doc.text(lab + ':', leftX, y)
    doc.setFont('helvetica', 'normal')
    doc.text(val, valX, y)
    y += lineH
  }

  const bottomBarH = 8
  const bottomY = doc.internal.pageSize.getHeight() - bottomBarH
  setFillHex(doc, PRIMARY)
  doc.rect(0, bottomY, pageW, bottomBarH, 'F')
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(255, 255, 255)
  doc.text(
    'CONFIDENTIAL — For Internal Use Only · BRAC Bank Credit Division',
    pageW / 2,
    bottomY + 5,
    { align: 'center' },
  )

  /* ----- PAGE 2 FINANCIAL SPREAD ----- */
  doc.addPage()
  y = margin
  y = drawSectionHeaderBar(doc, y, 'FINANCIAL STATEMENTS — 3 YEAR SPREAD')

  const head = [['Line Item', `FY${y0}`, `FY${y1}`, `FY${y2}`]]
  type Row = string[] | { content: string; colSpan: number; styles: Record<string, unknown> }
  const body: Row[] = []

  const pushGroup = (title: string) => {
    body.push({
      content: title,
      colSpan: 4,
      styles: {
        fillColor: hexToRgb(GROUP_BG),
        textColor: hexToRgb(TEXT_DARK),
        fontStyle: 'bold',
        halign: 'left',
      },
    })
  }

  const pushRow = (label: string, a: number, b: number, c: number) => {
    body.push([label, formatBdtM(a), formatBdtM(b), formatBdtM(c)])
  }

  pushGroup('INCOME STATEMENT')
  pushRow('Revenue', ...financials.revenue)
  pushRow('Cost of Sales', ...financials.costOfSales)
  pushRow('Gross Profit', ...financials.grossProfit)
  pushRow('Operating Expenses', ...financials.operatingExpenses)
  pushRow('EBITDA', ...financials.ebitda)
  pushRow('Net Profit', ...financials.netProfit)

  pushGroup('BALANCE SHEET')
  pushRow('Total Assets', ...financials.totalAssets)
  pushRow('Total Liabilities', ...financials.totalLiabilities)
  pushRow('Equity', ...financials.equity)
  pushRow('Current Assets', ...financials.currentAssets)
  pushRow('Current Liabilities', ...financials.currentLiabilities)

  pushGroup('CASH FLOW')
  pushRow('Operating Cash Flow', ...financials.operatingCF)
  pushRow('Debt Service', ...financials.debtService)

  autoTable(doc, {
    startY: y,
    head,
    body: body as (string | { content: string; colSpan: number; styles: Record<string, unknown> })[][],
    margin: { left: margin, right: margin },
    headStyles: {
      fillColor: hexToRgb(PRIMARY),
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center',
    },
    alternateRowStyles: { fillColor: hexToRgb(ROW_ALT) },
    styles: { fontSize: 9, cellPadding: 2.5, valign: 'middle' },
    columnStyles: {
      0: { halign: 'left', cellWidth: 62 },
      1: { halign: 'right' },
      2: { halign: 'right' },
      3: { halign: 'right' },
    },
  })

  /* ----- PAGE 3 RATIOS + REGULATORY ----- */
  doc.addPage()
  y = margin
  y = drawSectionHeaderBar(doc, y, 'RATIO ANALYSIS & REGULATORY ASSESSMENT')

  const ratioRows: string[][] = [
    [
      'DSCR',
      formatRatio2(ratios.dscr[0]),
      formatRatio2(ratios.dscr[1]),
      formatRatio2(ratios.dscr[2]),
      dscrStatus(ratios.dscr[2]),
    ],
    [
      'Current Ratio',
      formatRatio2(ratios.currentRatio[0]),
      formatRatio2(ratios.currentRatio[1]),
      formatRatio2(ratios.currentRatio[2]),
      currentRatioStatus(ratios.currentRatio[2]),
    ],
    [
      'Debt/Equity',
      formatRatio2(ratios.debtToEquity[0]),
      formatRatio2(ratios.debtToEquity[1]),
      formatRatio2(ratios.debtToEquity[2]),
      debtToEquityStatus(ratios.debtToEquity[2]),
    ],
    [
      'Interest Coverage',
      formatRatio2(ratios.interestCoverage[0]),
      formatRatio2(ratios.interestCoverage[1]),
      formatRatio2(ratios.interestCoverage[2]),
      interestCoverageStatus(ratios.interestCoverage[2]),
    ],
    [
      'Leverage',
      formatRatio2(ratios.leverageRatio[0]),
      formatRatio2(ratios.leverageRatio[1]),
      formatRatio2(ratios.leverageRatio[2]),
      leverageRatioStatus(ratios.leverageRatio[2]),
    ],
  ]

  const ratioHead = [['Ratio', `FY${y0}`, `FY${y1}`, `FY${y2}`, 'Status']]
  autoTable(doc, {
    startY: y,
    head: ratioHead,
    body: ratioRows,
    tableWidth: 100,
    margin: { left: margin, right: 0 },
    headStyles: {
      fillColor: hexToRgb(PRIMARY),
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    styles: { fontSize: 8.5, cellPadding: 2 },
    columnStyles: {
      0: { cellWidth: 32 },
      1: { halign: 'right', cellWidth: 18 },
      2: { halign: 'right', cellWidth: 18 },
      3: { halign: 'right', cellWidth: 18 },
      4: { halign: 'center', cellWidth: 22 },
    },
    alternateRowStyles: { fillColor: hexToRgb(ROW_ALT) },
  })

  const boxW = 58
  const boxH = 22
  const boxX = margin + 105
  let boxY = y + 2
  const icrrRgb = regulatoryRgb(regulatory.icrrScore)
  const fssRgb = regulatoryRgb(regulatory.fssScore)
  const crgFill = crgGradeFill(regulatory.crgScore)

  drawScoreBox(
    doc,
    boxX,
    boxY,
    boxW,
    boxH,
    'ICRR',
    `${regulatory.icrrScore} — ${regulatory.icrrBand}`,
    icrrRgb,
  )
  boxY += boxH + 4
  drawScoreBox(doc, boxX, boxY, boxW, boxH, 'FSS', `${regulatory.fssScore} / 100`, fssRgb)
  boxY += boxH + 4
  drawScoreBox(doc, boxX, boxY, boxW, boxH, 'CRG', `Grade ${regulatory.crgScore} (1–5)`, crgFill)

  /* ----- PAGE 4+ NARRATIVE ----- */
  doc.addPage()
  y = margin
  y = drawSectionHeaderBar(doc, y, 'CREDIT REVIEW NARRATIVE')
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  setTextHex(doc, TEXT_DARK)
  y += 2
  doc.setFont('helvetica', 'bold')
  doc.text(
    `Financial Statement Reliability Score: ${reliabilityScores.total}/100 — ${reliabilityScores.assessment}`,
    margin,
    y,
  )
  y += 8
  doc.setFont('helvetica', 'normal')

  const sections: { title: string; text: string }[] = [
    { title: 'Executive Summary', text: narrativeSections.executiveSummary },
    { title: 'Financial Performance', text: narrativeSections.financialPerformance },
    { title: 'Liquidity & Working Capital', text: narrativeSections.liquidityWorkingCapital },
    { title: 'Leverage & Debt Structure', text: narrativeSections.leverageDebt },
    { title: 'Covenant Compliance', text: narrativeSections.covenantCompliance },
    { title: 'Risk Flags & Early Warnings', text: narrativeSections.riskFlags },
    { title: 'Analyst Recommendation', text: narrativeSections.recommendation },
  ]

  const pageH = doc.internal.pageSize.getHeight()
  const maxW = pageW - 2 * margin
  const bottomLimit = pageH - margin - 12

  for (const { title, text } of sections) {
    doc.setFont('helvetica', 'bold')
    setTextHex(doc, PRIMARY)
    doc.setFontSize(10)
    const titleLines = doc.splitTextToSize(title, maxW)
    const titleH = titleLines.length * 4.5
    if (y + titleH > bottomLimit) {
      doc.addPage()
      y = margin
    }
    doc.text(titleLines, margin, y)
    y += titleH + 1
    doc.setFont('helvetica', 'normal')
    setTextHex(doc, TEXT_DARK)
    doc.setFontSize(9)
    const paras = doc.splitTextToSize(text, maxW)
    const paraH = paras.length * 4
    if (y + paraH > bottomLimit) {
      doc.addPage()
      y = margin
    }
    doc.text(paras, margin, y)
    y += paraH + 2
    doc.setDrawColor(...hexToRgb(BORDER))
    doc.setLineWidth(0.2)
    doc.line(margin, y, pageW - margin, y)
    y += 4
  }

  const totalPages = doc.getNumberOfPages()
  for (let i = 2; i <= totalPages; i++) {
    doc.setPage(i)
    drawFooter(doc, i, totalPages, generatedAt)
  }

  const stamp = fileStampFromReviewIso(data.reviewDate)
  const fname = `CreditReview_${safeFileNamePart(data.borrower)}_${stamp}.pdf`
  doc.save(fname)
}
