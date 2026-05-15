import { Check, FileDown, FileSpreadsheet, Loader2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { MockData } from '../types/mockData'
import { generateExcel } from '../utils/excelExporter'

function formatBdtM(n: number) {
  const m = n / 1_000_000
  if (!Number.isFinite(m)) return '—'
  const abs = Math.abs(m)
  const s = abs >= 100 ? m.toFixed(0) : m.toFixed(1)
  return `BDT ${s}M`
}

function formatRatio2(n: number) {
  return Number.isFinite(n) ? n.toFixed(2) : '—'
}

function yoyPercentChange(prev: number, curr: number): number | null {
  if (!Number.isFinite(prev) || !Number.isFinite(curr) || prev === 0) return null
  return ((curr - prev) / prev) * 100
}

function yoyCellClass(pct: number | null) {
  if (pct === null) return 'text-text-secondary'
  if (pct > 0) return 'text-success font-semibold'
  if (pct < 0) return 'text-danger font-semibold'
  return 'text-text-secondary'
}

function formatYoyDisplay(pct: number | null) {
  if (pct === null) return '—'
  const sign = pct > 0 ? '+' : ''
  return `${sign}${pct.toFixed(1)}%`
}

type FinKey = keyof Pick<
  MockData['financials'],
  | 'revenue'
  | 'costOfSales'
  | 'grossProfit'
  | 'operatingExpenses'
  | 'ebitda'
  | 'netProfit'
  | 'totalAssets'
  | 'totalLiabilities'
  | 'equity'
  | 'currentAssets'
  | 'currentLiabilities'
  | 'operatingCF'
  | 'debtService'
>

type RatioKey = keyof MockData['ratios']

export default function ExcelExportTab({
  mockData,
}: {
  mockData: MockData
}) {
  const { financials, ratios } = mockData
  const [isGenerating, setIsGenerating] = useState(false)
  const [downloaded, setDownloaded] = useState(false)
  const revertTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const generateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (revertTimerRef.current) window.clearTimeout(revertTimerRef.current)
      if (generateTimerRef.current) window.clearTimeout(generateTimerRef.current)
    }
  }, [])

  const [y0, y1, y2] = financials.years

  const incomeRows: Array<{ label: string; key: FinKey }> = [
    { label: 'Revenue', key: 'revenue' },
    { label: 'Cost of Sales', key: 'costOfSales' },
    { label: 'Gross Profit', key: 'grossProfit' },
    { label: 'Operating Expenses', key: 'operatingExpenses' },
    { label: 'EBITDA', key: 'ebitda' },
    { label: 'Net Profit', key: 'netProfit' },
  ]

  const balanceRows: Array<{ label: string; key: FinKey }> = [
    { label: 'Total Assets', key: 'totalAssets' },
    { label: 'Total Liabilities', key: 'totalLiabilities' },
    { label: 'Equity', key: 'equity' },
    { label: 'Current Assets', key: 'currentAssets' },
    { label: 'Current Liabilities', key: 'currentLiabilities' },
  ]

  const ratioRows: Array<{ label: string; key: RatioKey }> = [
    { label: 'DSCR', key: 'dscr' },
    { label: 'Current Ratio', key: 'currentRatio' },
    { label: 'Debt/Equity', key: 'debtToEquity' },
    { label: 'Interest Coverage', key: 'interestCoverage' },
    { label: 'Leverage Ratio', key: 'leverageRatio' },
  ]

  const cashRows: Array<{ label: string; key: FinKey }> = [
    { label: 'Operating Cash Flow', key: 'operatingCF' },
    { label: 'Debt Service', key: 'debtService' },
  ]

  const incomeLen = incomeRows.length
  const balanceLen = balanceRows.length
  const cashLen = cashRows.length

  const yoyHeader = `YoY ${y1}→${y2} %`

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-border bg-card-white p-8 text-center shadow-sm print:hidden">
        <FileSpreadsheet
          className="mx-auto h-16 w-16 text-primary"
          strokeWidth={1.25}
          aria-hidden
        />
        <h2 className="mt-4 text-lg font-bold text-text-primary">
          Download Full Credit Analysis Workbook
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-text-secondary">
          5-sheet Excel workbook including spread financials, ratio analysis, ICRR/FSS/CRG working papers, and trend analysis
        </p>
        <button
          type="button"
          disabled={isGenerating || downloaded}
          aria-busy={isGenerating}
          onClick={() => {
            if (isGenerating || downloaded) return
            setIsGenerating(true)
            if (generateTimerRef.current) window.clearTimeout(generateTimerRef.current)
            generateTimerRef.current = window.setTimeout(() => {
              generateTimerRef.current = null
              generateExcel(mockData)
              setIsGenerating(false)
              setDownloaded(true)
              if (revertTimerRef.current) window.clearTimeout(revertTimerRef.current)
              revertTimerRef.current = window.setTimeout(() => {
                setDownloaded(false)
                revertTimerRef.current = null
              }, 3000)
            }, 800)
          }}
          className={`mx-auto mt-6 flex h-[52px] w-[280px] items-center justify-center gap-2 rounded-[10px] text-sm font-bold transition-colors disabled:cursor-not-allowed ${
            downloaded
              ? 'bg-success/15 text-success ring-2 ring-success/40'
              : isGenerating
                ? 'bg-primary/10 text-primary ring-2 ring-primary/30'
                : 'bg-success text-card-white hover:bg-success/90'
          }`}
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-5 w-5 shrink-0 animate-spin" strokeWidth={2} aria-hidden />
              Generating...
            </>
          ) : downloaded ? (
            <>
              <Check className="h-5 w-5 shrink-0" strokeWidth={2.5} aria-hidden />
              Downloaded ✓
            </>
          ) : (
            <>
              <FileDown className="h-5 w-5 shrink-0" strokeWidth={2} aria-hidden />
              Download Excel Report
            </>
          )}
        </button>
        <p className="mt-4 text-xs text-text-secondary">
          Format: .xlsx · 5 sheets · Compatible with Microsoft Excel and Google Sheets
        </p>
      </section>

      <section className="excel-export-preview-screen print:hidden">
        <h3 className="text-[15px] font-bold text-text-primary">
          Financial Statements Preview — 3 Year Spread
        </h3>
        <div className="mt-3 overflow-x-auto rounded-xl border border-border bg-card-white shadow-sm">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-primary text-card-white">
                <th className="px-4 py-3 font-bold">Line Item</th>
                <th className="px-4 py-3 font-bold">FY{y0}</th>
                <th className="px-4 py-3 font-bold">FY{y1}</th>
                <th className="px-4 py-3 font-bold">FY{y2}</th>
                <th className="px-4 py-3 font-bold">{yoyHeader}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-surface text-xs font-semibold uppercase tracking-wide text-text-primary">
                <td colSpan={5} className="px-4 py-2">
                  Income Statement
                </td>
              </tr>
              {incomeRows.map(({ label, key }, idx) => {
                const arr = financials[key] as [number, number, number]
                const yoy = yoyPercentChange(arr[1], arr[2])
                return (
                  <tr
                    key={key}
                    className={`border-t border-border transition-colors hover:bg-primary/5 ${idx % 2 === 0 ? 'bg-card-white' : 'bg-surface'}`}
                  >
                    <td className="px-4 py-2.5 font-medium text-text-primary">{label}</td>
                    <td className="px-4 py-2.5 tabular-nums text-text-secondary">
                      {formatBdtM(arr[0])}
                    </td>
                    <td className="px-4 py-2.5 tabular-nums text-text-secondary">
                      {formatBdtM(arr[1])}
                    </td>
                    <td className="px-4 py-2.5 tabular-nums text-text-secondary">
                      {formatBdtM(arr[2])}
                    </td>
                    <td className={`px-4 py-2.5 tabular-nums ${yoyCellClass(yoy)}`}>
                      {formatYoyDisplay(yoy)}
                    </td>
                  </tr>
                )
              })}

              <tr className="bg-surface text-xs font-semibold uppercase tracking-wide text-text-primary">
                <td colSpan={5} className="px-4 py-2">
                  Balance Sheet
                </td>
              </tr>
              {balanceRows.map(({ label, key }, idx) => {
                const arr = financials[key] as [number, number, number]
                const stripe = (incomeLen + idx) % 2 === 0
                const yoy = yoyPercentChange(arr[1], arr[2])
                return (
                  <tr
                    key={key}
                    className={`border-t border-border transition-colors hover:bg-primary/5 ${stripe ? 'bg-card-white' : 'bg-surface'}`}
                  >
                    <td className="px-4 py-2.5 font-medium text-text-primary">{label}</td>
                    <td className="px-4 py-2.5 tabular-nums text-text-secondary">
                      {formatBdtM(arr[0])}
                    </td>
                    <td className="px-4 py-2.5 tabular-nums text-text-secondary">
                      {formatBdtM(arr[1])}
                    </td>
                    <td className="px-4 py-2.5 tabular-nums text-text-secondary">
                      {formatBdtM(arr[2])}
                    </td>
                    <td className={`px-4 py-2.5 tabular-nums ${yoyCellClass(yoy)}`}>
                      {formatYoyDisplay(yoy)}
                    </td>
                  </tr>
                )
              })}

              <tr className="bg-surface text-xs font-semibold uppercase tracking-wide text-text-primary">
                <td colSpan={5} className="px-4 py-2">
                  Cash Flow
                </td>
              </tr>
              {cashRows.map(({ label, key }, idx) => {
                const arr = financials[key] as [number, number, number]
                const stripe = (incomeLen + balanceLen + idx) % 2 === 0
                const yoy = yoyPercentChange(arr[1], arr[2])
                return (
                  <tr
                    key={key}
                    className={`border-t border-border transition-colors hover:bg-primary/5 ${stripe ? 'bg-card-white' : 'bg-surface'}`}
                  >
                    <td className="px-4 py-2.5 font-medium text-text-primary">{label}</td>
                    <td className="px-4 py-2.5 tabular-nums text-text-secondary">
                      {formatBdtM(arr[0])}
                    </td>
                    <td className="px-4 py-2.5 tabular-nums text-text-secondary">
                      {formatBdtM(arr[1])}
                    </td>
                    <td className="px-4 py-2.5 tabular-nums text-text-secondary">
                      {formatBdtM(arr[2])}
                    </td>
                    <td className={`px-4 py-2.5 tabular-nums ${yoyCellClass(yoy)}`}>
                      {formatYoyDisplay(yoy)}
                    </td>
                  </tr>
                )
              })}

              <tr className="bg-surface text-xs font-semibold uppercase tracking-wide text-text-primary">
                <td colSpan={5} className="px-4 py-2">
                  Key Ratios
                </td>
              </tr>
              {ratioRows.map(({ label, key }, idx) => {
                const arr = ratios[key]
                const stripe = (incomeLen + balanceLen + cashLen + idx) % 2 === 0
                const yoy = yoyPercentChange(arr[1], arr[2])
                return (
                  <tr
                    key={key}
                    className={`border-t border-border transition-colors hover:bg-primary/5 ${stripe ? 'bg-card-white' : 'bg-surface'}`}
                  >
                    <td className="px-4 py-2.5 font-medium text-text-primary">{label}</td>
                    <td className="px-4 py-2.5 tabular-nums text-text-secondary">
                      {formatRatio2(arr[0])}
                    </td>
                    <td className="px-4 py-2.5 tabular-nums text-text-secondary">
                      {formatRatio2(arr[1])}
                    </td>
                    <td className="px-4 py-2.5 tabular-nums text-text-secondary">
                      {formatRatio2(arr[2])}
                    </td>
                    <td className={`px-4 py-2.5 tabular-nums ${yoyCellClass(yoy)}`}>
                      {formatYoyDisplay(yoy)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      <div className="excel-tab-print-only hidden print:block">
        <h3 className="text-sm font-bold text-text-primary">Excel workbook summary (print)</h3>
        <p className="mt-1 text-xs text-text-secondary">
          5-sheet workbook: Spread Financials, Ratio Analysis, ICRR Working Paper, FSS-CRG Calculation,
          Trend Analysis
        </p>
        <p className="mt-2 text-xs font-semibold text-text-primary">
          {mockData.borrower} · {mockData.reviewDate}
        </p>
        <table className="mt-3 w-full border-collapse border border-border text-left text-xs text-text-primary">
          <thead>
            <tr className="bg-surface">
              <th className="border border-border px-2 py-1.5 font-semibold">Line item</th>
              <th className="border border-border px-2 py-1.5 font-semibold">FY{y2}</th>
            </tr>
          </thead>
          <tbody>
            {incomeRows.slice(0, 4).map(({ label, key }) => {
              const arr = financials[key] as [number, number, number]
              return (
                <tr key={key}>
                  <td className="border border-border px-2 py-1.5">{label}</td>
                  <td className="border border-border px-2 py-1.5 tabular-nums">{formatBdtM(arr[2])}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <table className="mt-4 w-full border-collapse border border-border text-left text-xs text-text-primary">
          <thead>
            <tr className="bg-surface">
              <th className="border border-border px-2 py-1.5 font-semibold">Ratio</th>
              <th className="border border-border px-2 py-1.5 font-semibold">FY{y2}</th>
            </tr>
          </thead>
          <tbody>
            {ratioRows.map(({ label, key }) => {
              const arr = ratios[key]
              return (
                <tr key={key}>
                  <td className="border border-border px-2 py-1.5">{label}</td>
                  <td className="border border-border px-2 py-1.5 tabular-nums">{formatRatio2(arr[2])}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
