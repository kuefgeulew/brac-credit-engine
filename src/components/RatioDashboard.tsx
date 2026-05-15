import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Printer,
  ShieldCheck,
  XCircle,
} from 'lucide-react'
import { useEffect } from 'react'
import {
  Bar,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useDemo } from '../context/useDemo'
import type { MockData } from '../types/mockData'

type ScoreTone = 'success' | 'warning' | 'danger'

function icrrLikeTone(score: number): ScoreTone {
  if (score >= 70) return 'success'
  if (score >= 60) return 'warning'
  return 'danger'
}

function scoreToneClasses(tone: ScoreTone) {
  if (tone === 'success') return { text: 'text-success', bar: 'bg-success' }
  if (tone === 'warning') return { text: 'text-warning', bar: 'bg-warning' }
  return { text: 'text-danger', bar: 'bg-danger' }
}

/** CRG mock uses 1–5 (lower is better). Bar shows “headroom” toward 100. */
function crgBarPercent(crg: number) {
  const n = Math.min(5, Math.max(1, crg))
  return ((6 - n) / 5) * 100
}

function crgTone(crg: number): ScoreTone {
  if (crg <= 2) return 'success'
  if (crg <= 3) return 'warning'
  return 'danger'
}

const GAUGE_COLORS = {
  danger: '#B91C1C',
  warning: '#B45309',
  success: '#1A7C4A',
} as const

function dscrGaugeFill(dscr: number) {
  if (dscr < 1) return GAUGE_COLORS.danger
  if (dscr < 1.25) return GAUGE_COLORS.warning
  return GAUGE_COLORS.success
}

function latestDscrFillPercent(dscr: number) {
  return Math.min(100, Math.max(0, (dscr / 2.5) * 100))
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

function statusBadgeClass(s: RatioStatus) {
  if (s === 'Healthy') {
    return 'bg-success/15 text-success ring-1 ring-success/30'
  }
  if (s === 'Watch') {
    return 'bg-warning/15 text-warning ring-1 ring-warning/30'
  }
  return 'bg-danger/15 text-danger ring-1 ring-danger/30'
}

function formatRatioValue(key: keyof MockData['ratios'], v: number) {
  if (key === 'interestCoverage') return v.toFixed(1)
  return v.toFixed(2)
}

const CHART_REVENUE = 'rgba(0, 82, 165, 0.7)'
const CHART_EBITDA = 'rgba(13, 148, 136, 0.7)'
const CHART_NET_PROFIT = '#1A7C4A'

/** Y-axis ticks: millions, "320M" style (no BDT prefix). */
function formatAxisMillions(value: number) {
  const m = value / 1_000_000
  if (!Number.isFinite(m)) return ''
  const abs = Math.abs(m)
  if (abs >= 100) return `${Math.round(m)}M`
  if (abs >= 10) return `${m.toFixed(0)}M`
  return `${m.toFixed(1)}M`
}

/** Tooltip: exact values as "BDT 238.4M". */
function formatBdtTooltip(value: number) {
  const m = value / 1_000_000
  if (!Number.isFinite(m)) return 'BDT —'
  const abs = Math.abs(m)
  const formatted = abs >= 100 ? m.toFixed(0) : m.toFixed(1)
  return `BDT ${formatted}M`
}

function isRatioValueMissing(v: number | undefined | null): boolean {
  return (
    v === undefined ||
    v === null ||
    !Number.isFinite(v) ||
    v === 0
  )
}

function RatioDataUnavailable() {
  return (
    <div className="flex min-h-[100px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-surface/60 py-6">
      <span className="text-2xl font-semibold leading-none text-text-secondary">—</span>
      <p className="text-xs text-[#4A5568]">Data not available</p>
    </div>
  )
}

function stripDateToken(raw: string) {
  return raw.trim().split(/\s+/)[0]?.split('(')[0]?.trim() ?? raw.trim()
}

function formatReviewStripDate(raw: string) {
  const iso = stripDateToken(raw)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return raw
  const d = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(d.getTime())) return raw
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/** Red when due within the next 90 days, or overdue. */
function isNextDueUrgent(nextReviewDue: string) {
  const iso = stripDateToken(nextReviewDue)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false
  const due = new Date(`${iso}T00:00:00`)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  due.setHours(0, 0, 0, 0)
  const diffDays = Math.ceil((due.getTime() - today.getTime()) / 86400000)
  if (diffDays < 0) return true
  return diffDays <= 90
}

function RatioPrintTable({ data }: { data: MockData }) {
  const { borrower, financials, ratios } = data
  const [y0, y1, y2] = financials.years
  const lastY = financials.years[2] ?? 'latest'

  const rows: Array<{
    label: string
    key: keyof MockData['ratios']
    fmt: (v: number) => string
    status: (v: number) => RatioStatus
  }> = [
    {
      label: 'DSCR',
      key: 'dscr',
      fmt: (v) => v.toFixed(2),
      status: dscrStatus,
    },
    {
      label: 'Current Ratio',
      key: 'currentRatio',
      fmt: (v) => v.toFixed(2),
      status: currentRatioStatus,
    },
    {
      label: 'Debt to Equity',
      key: 'debtToEquity',
      fmt: (v) => v.toFixed(2),
      status: debtToEquityStatus,
    },
    {
      label: 'Interest Coverage',
      key: 'interestCoverage',
      fmt: (v) => v.toFixed(1),
      status: interestCoverageStatus,
    },
    {
      label: 'Leverage Ratio',
      key: 'leverageRatio',
      fmt: (v) => v.toFixed(2),
      status: leverageRatioStatus,
    },
  ]

  return (
    <div className="ratio-dashboard-print-only w-full">
      <h3 className="mb-2 text-sm font-bold text-text-primary">Ratio summary (print)</h3>
      <p className="mb-3 text-xs text-text-secondary">{borrower}</p>
      <table className="w-full border-collapse border border-[#D0DCF0] text-left text-xs text-text-primary">
        <thead>
          <tr className="bg-[#E8EDF5]">
            <th className="border border-[#D0DCF0] px-2 py-1.5 font-semibold">Ratio</th>
            <th className="border border-[#D0DCF0] px-2 py-1.5 font-semibold">FY{y0}</th>
            <th className="border border-[#D0DCF0] px-2 py-1.5 font-semibold">FY{y1}</th>
            <th className="border border-[#D0DCF0] px-2 py-1.5 font-semibold">FY{y2}</th>
            <th className="border border-[#D0DCF0] px-2 py-1.5 font-semibold">Status (FY{lastY})</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ label, key, fmt, status }) => {
            const s = ratios[key]
            const bad = s.some(isRatioValueMissing)
            const v2 = s[2]
            return (
              <tr key={key}>
                <td className="border border-[#D0DCF0] px-2 py-1.5 font-medium">{label}</td>
                {bad ? (
                  <td colSpan={4} className="border border-[#D0DCF0] px-2 py-1.5 text-text-secondary">
                    Data not available
                  </td>
                ) : (
                  <>
                    <td className="border border-[#D0DCF0] px-2 py-1.5 tabular-nums">{fmt(s[0])}</td>
                    <td className="border border-[#D0DCF0] px-2 py-1.5 tabular-nums">{fmt(s[1])}</td>
                    <td className="border border-[#D0DCF0] px-2 py-1.5 tabular-nums">{fmt(s[2])}</td>
                    <td className="border border-[#D0DCF0] px-2 py-1.5 font-semibold">{status(v2)}</td>
                  </>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function ReviewSummaryRow({ details }: { details: MockData['borrowerDetails'] }) {
  const nextUrgent = isNextDueUrgent(details.nextReviewDue)
  return (
    <section className="rounded-xl border border-border bg-surface/50 p-4 shadow-sm">
      <h2 className="text-[13px] font-bold text-text-primary">Review Summary</h2>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-card-white px-4 py-3 text-center shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-text-secondary">
            Last Review
          </p>
          <p className="mt-2 text-sm font-bold text-text-primary">
            {formatReviewStripDate(details.lastReviewDate)}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card-white px-4 py-3 text-center shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-text-secondary">
            Next Due
          </p>
          <p
            className={`mt-2 text-sm font-bold ${nextUrgent ? 'text-danger' : 'text-text-primary'}`}
          >
            {details.nextReviewDue}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card-white px-4 py-3 text-center shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-text-secondary">
            With BRAC Bank
          </p>
          <p className="mt-2 text-sm font-bold text-text-primary">{details.relationshipYears}</p>
        </div>
      </div>
    </section>
  )
}

export default function RatioDashboard({
  mockData,
}: {
  mockData: MockData
}) {
  const { highlightCovenantBreach, highlightIcrrScore } = useDemo()
  const { borrowerDetails, regulatory, ratios, financials } = mockData
  const lastYear = financials.years[2] ?? '2024'

  useEffect(() => {
    const clearPrintMode = () => document.body.classList.remove('print-ratios-on')
    window.addEventListener('afterprint', clearPrintMode)
    return () => {
      window.removeEventListener('afterprint', clearPrintMode)
      document.body.classList.remove('print-ratios-on')
    }
  }, [])

  const handlePrintRatios = () => {
    document.body.classList.add('print-ratios-on')
    requestAnimationFrame(() => {
      window.print()
    })
  }

  const trendData = financials.years.map((year, i) => ({
    year,
    revenue: financials.revenue[i],
    ebitda: financials.ebitda[i],
    netProfit: financials.netProfit[i],
  }))

  const icrrTone = icrrLikeTone(regulatory.icrrScore)
  const fssTone = icrrLikeTone(regulatory.fssScore)
  const crgToneVal = crgTone(regulatory.crgScore)

  const icrrStyles = scoreToneClasses(icrrTone)
  const fssStyles = scoreToneClasses(fssTone)
  const crgStyles = scoreToneClasses(crgToneVal)

  const latestDscr = ratios.dscr[2]
  const dscrSeriesInvalid = ratios.dscr.some(isRatioValueMissing)
  const dscrUnavailable = isRatioValueMissing(latestDscr) || dscrSeriesInvalid
  const radialData = dscrUnavailable
    ? []
    : [
        {
          name: 'dscr',
          value: latestDscrFillPercent(latestDscr),
          fill: dscrGaugeFill(latestDscr),
        },
      ]

  const ratioCards: Array<{
    key: keyof Pick<
      MockData['ratios'],
      'currentRatio' | 'debtToEquity' | 'interestCoverage' | 'leverageRatio'
    >
    title: string
    status: RatioStatus
    series: [number, number, number]
  }> = [
    {
      key: 'currentRatio',
      title: 'Current Ratio',
      status: currentRatioStatus(ratios.currentRatio[2]),
      series: ratios.currentRatio,
    },
    {
      key: 'debtToEquity',
      title: 'Debt to Equity',
      status: debtToEquityStatus(ratios.debtToEquity[2]),
      series: ratios.debtToEquity,
    },
    {
      key: 'interestCoverage',
      title: 'Interest Coverage',
      status: interestCoverageStatus(ratios.interestCoverage[2]),
      series: ratios.interestCoverage,
    },
    {
      key: 'leverageRatio',
      title: 'Leverage Ratio',
      status: leverageRatioStatus(ratios.leverageRatio[2]),
      series: ratios.leverageRatio,
    },
  ]

  return (
    <div className="ratio-dashboard-print-root relative rounded-xl border border-border bg-card-white p-6 shadow-sm">
      <div className="mb-6 flex items-start justify-between gap-4 print:mb-4">
        <h2 className="text-lg font-bold text-text-primary">Ratio Dashboard</h2>
        <button
          type="button"
          onClick={handlePrintRatios}
          className="print:hidden inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border-2 border-primary px-4 text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
        >
          <Printer className="h-4 w-4" strokeWidth={2} aria-hidden />
          Print this tab
        </button>
      </div>

      <div className="space-y-10">
      <section>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div
            className={`rounded-xl border border-border bg-card-white p-6 text-center shadow-sm ${
              highlightIcrrScore ? 'demo-highlight-icrr' : ''
            }`}
          >
            <p className="text-[11px] font-semibold uppercase tracking-wide text-text-secondary">
              Internal Credit Risk Rating
            </p>
            <p className={`mt-3 text-[48px] font-bold leading-none ${icrrStyles.text}`}>
              {regulatory.icrrScore}
            </p>
            <p className={`mt-2 text-base font-semibold ${icrrStyles.text}`}>
              {regulatory.icrrBand}
            </p>
            <div className="mt-4 h-[6px] w-full overflow-hidden rounded-[3px] bg-border">
              <div
                className={`h-full rounded-[3px] ${icrrStyles.bar}`}
                style={{ width: `${regulatory.icrrScore}%` }}
              />
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card-white p-6 text-center shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-text-secondary">
              Financial Spreading Score
            </p>
            <p className={`mt-3 text-[48px] font-bold leading-none ${fssStyles.text}`}>
              {regulatory.fssScore}
            </p>
            <p className="mt-2 text-base font-semibold text-text-secondary">
              Out of 100
            </p>
            <div className="mt-4 h-[6px] w-full overflow-hidden rounded-[3px] bg-border">
              <div
                className={`h-full rounded-[3px] ${fssStyles.bar}`}
                style={{ width: `${regulatory.fssScore}%` }}
              />
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card-white p-6 text-center shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-text-secondary">
              Credit Risk Grading
            </p>
            <p className={`mt-3 text-[48px] font-bold leading-none ${crgStyles.text}`}>
              {regulatory.crgScore}
            </p>
            <p className="mt-2 text-base font-semibold text-text-secondary">
              Grade scale 1–5
            </p>
            <div className="mt-4 h-[6px] w-full overflow-hidden rounded-[3px] bg-border">
              <div
                className={`h-full rounded-[3px] ${crgStyles.bar}`}
                style={{ width: `${crgBarPercent(regulatory.crgScore)}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col items-center print:hidden">
        {dscrUnavailable ? (
          <div className="w-full max-w-[320px]">
            <RatioDataUnavailable />
            <p className="mt-2 text-center text-xs text-text-secondary">
              Debt Service Coverage Ratio — FY{lastYear}
            </p>
          </div>
        ) : (
          <>
            <div className="relative mx-auto h-[220px] w-full max-w-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%"
                  cy="78%"
                  innerRadius="58%"
                  outerRadius="92%"
                  data={radialData}
                  startAngle={180}
                  endAngle={0}
                  barSize={14}
                >
                  <PolarAngleAxis type="number" domain={[0, 100]} tick={false} axisLine={false} />
                  <RadialBar
                    dataKey="value"
                    cornerRadius={6}
                    background={{ fill: 'var(--color-border, #D0DCF0)' }}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <div
                className="pointer-events-none absolute inset-0 flex flex-col items-center justify-end pb-[52px] text-center"
                aria-hidden
              >
                <span className="text-[32px] font-bold leading-none tabular-nums tracking-tight text-text-primary">
                  {latestDscr.toFixed(2)}
                </span>
                <span className="mt-1 text-xs text-text-secondary">DSCR</span>
              </div>
            </div>
            <p className="mt-2 text-center text-xs text-text-secondary">
              Debt Service Coverage Ratio — FY{lastYear}
            </p>
          </>
        )}
      </section>

      <section className="print:hidden">
        <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {ratioCards.map(({ key, title, status, series }) => {
            const latest = series[2]
            const seriesInvalid = series.some(isRatioValueMissing)
            const sparkData = series.map((value, index) => ({
              index,
              value,
            }))
            return (
              <div
                key={key}
                className="flex h-full min-h-[188px] flex-col rounded-xl border border-border bg-card-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-text-secondary">{title}</p>
                  {!seriesInvalid ? (
                    <span
                      className={`shrink-0 rounded-md px-2 py-0.5 text-xs font-semibold ${statusBadgeClass(status)}`}
                    >
                      {status}
                    </span>
                  ) : null}
                </div>
                {seriesInvalid ? (
                  <>
                    <p className="mt-2 text-[28px] font-bold leading-tight text-text-secondary">
                      —
                    </p>
                    <div className="mt-2 flex min-h-[52px] flex-1 flex-col justify-end">
                      <RatioDataUnavailable />
                    </div>
                  </>
                ) : (
                  <>
                    <p className="mt-2 text-[28px] font-bold leading-tight text-text-primary">
                      {formatRatioValue(key, latest)}
                    </p>
                    <div className="mt-auto flex min-h-12 flex-1 flex-col justify-end pt-2">
                      <div className="h-12 w-full min-h-12">
                        <ResponsiveContainer width="100%" height="100%" minHeight={48}>
                          <LineChart
                            data={sparkData}
                            margin={{ top: 2, right: 2, left: 2, bottom: 2 }}
                          >
                            <XAxis dataKey="index" type="number" hide />
                            <YAxis hide width={0} domain={['dataMin', 'dataMax']} />
                            <Line
                              type="monotone"
                              dataKey="value"
                              stroke="var(--color-primary, #0052A5)"
                              strokeWidth={2}
                              dot={false}
                              isAnimationActive={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card-white p-6 shadow-sm print:hidden">
        <h2 className="text-[15px] font-bold text-text-primary">
          Financial Performance Trend
        </h2>
        <div className="mt-4 h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={trendData}
              margin={{ top: 8, right: 12, left: 4, bottom: 36 }}
            >
              <XAxis
                dataKey="year"
                tick={{ fill: '#4A5568', fontSize: 12 }}
                axisLine={{ stroke: '#D0DCF0' }}
                tickLine={{ stroke: '#D0DCF0' }}
              />
              <YAxis
                tickFormatter={formatAxisMillions}
                tick={{ fill: '#4A5568', fontSize: 12 }}
                axisLine={{ stroke: '#D0DCF0' }}
                tickLine={{ stroke: '#D0DCF0' }}
                width={52}
              />
              <Tooltip
                formatter={(value, name) => [
                  formatBdtTooltip(Number(value ?? 0)),
                  String(name ?? ''),
                ]}
                labelFormatter={(label) => `Year ${label}`}
                contentStyle={{
                  borderRadius: 8,
                  border: '1px solid #D0DCF0',
                  fontSize: 12,
                }}
              />
              <Legend
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ paddingTop: 8, fontSize: 12 }}
              />
              <Bar
                dataKey="revenue"
                name="Revenue"
                fill={CHART_REVENUE}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="ebitda"
                name="EBITDA"
                fill={CHART_EBITDA}
                radius={[4, 4, 0, 0]}
              />
              <Line
                type="monotone"
                dataKey="netProfit"
                name="Net Profit"
                stroke={CHART_NET_PROFIT}
                strokeWidth={2}
                dot={{ r: 4, fill: CHART_NET_PROFIT, strokeWidth: 0 }}
                isAnimationActive={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </section>

      <RatioPrintTable data={mockData} />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-stretch">
        <div
          className={`flex h-full min-h-0 flex-col rounded-xl border border-border bg-card-white p-6 shadow-sm ${
            highlightCovenantBreach ? 'demo-highlight-covenant' : ''
          }`}
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" strokeWidth={2} aria-hidden />
            <h2 className="text-[15px] font-bold text-text-primary">Covenant Compliance</h2>
          </div>
          <div
            className={`mt-4 flex flex-1 flex-col ${regulatory.covenantBreaches.length === 0 ? 'justify-center' : ''}`}
          >
            {regulatory.covenantBreaches.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/15 text-success">
                  <CheckCircle2 className="h-9 w-9" strokeWidth={2} aria-hidden />
                </div>
                <p className="mt-4 text-sm font-medium text-success">
                  No covenant breaches detected
                </p>
              </div>
            ) : (
              <ul className="space-y-3">
                {regulatory.covenantBreaches.map((text, index) => (
                  <li
                    key={`cov-${index}`}
                    className="flex gap-3 rounded-lg border border-danger/30 bg-danger/5 px-3 py-2.5 text-sm text-danger"
                  >
                    <XCircle
                      className="mt-0.5 h-4 w-4 shrink-0 text-danger"
                      strokeWidth={2}
                      aria-hidden
                    />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="flex h-full min-h-0 flex-col rounded-xl border border-border bg-card-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" strokeWidth={2} aria-hidden />
            <h2 className="text-[15px] font-bold text-text-primary">Early Warning Signals</h2>
          </div>
          <div
            className={`mt-4 flex flex-1 flex-col ${regulatory.earlyWarnings.length === 0 ? 'justify-center' : ''}`}
          >
            {regulatory.earlyWarnings.length === 0 ? (
              <p className="py-6 text-center text-sm font-medium text-success">
                No warnings flagged
              </p>
            ) : (
              <ul className="space-y-3">
                {regulatory.earlyWarnings.map((text, index) => (
                  <li
                    key={`ew-${index}`}
                    className="flex flex-wrap items-start gap-2 rounded-lg border border-warning/30 bg-warning/5 px-3 py-2.5 text-sm text-warning"
                  >
                    <AlertCircle
                      className="mt-0.5 h-4 w-4 shrink-0 text-warning"
                      strokeWidth={2}
                      aria-hidden
                    />
                    <span className="min-w-0 flex-1 text-warning">{text}</span>
                    <span className="rounded-md bg-warning/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-warning ring-1 ring-warning/40">
                      Monitor
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      <ReviewSummaryRow details={borrowerDetails} />
      </div>
    </div>
  )
}
