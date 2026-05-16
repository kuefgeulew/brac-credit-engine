import { AlertTriangle, FileDown, Loader2 } from 'lucide-react'
import React, { useState } from 'react'

type ScoreTone = 'success' | 'warning' | 'danger' | 'primary'

function getToneForLabel(label: string): ScoreTone {
  const l = label.toLowerCase()
  if (l.includes('excellent')) return 'success'
  if (l.includes('good')) return 'primary'
  if (l.includes('marginal')) return 'warning'
  return 'danger'
}

function getToneClasses(tone: ScoreTone) {
  if (tone === 'success') return 'bg-success/15 text-success ring-success/30'
  if (tone === 'primary') return 'bg-primary/15 text-primary ring-primary/30'
  if (tone === 'warning') return 'bg-warning/15 text-warning ring-warning/30'
  return 'bg-danger/15 text-danger ring-danger/30'
}

function getProgressFill(tone: ScoreTone) {
  if (tone === 'success') return 'bg-success'
  if (tone === 'primary') return 'bg-primary'
  if (tone === 'warning') return 'bg-warning'
  return 'bg-danger'
}

function ScoreCard({
  title,
  score,
  max,
  percent,
  band,
}: {
  title: string
  score: number
  max: number
  percent: number
  band: string
}) {
  const tone = getToneForLabel(band)
  const badgeClasses = getToneClasses(tone)
  const fillClass = getProgressFill(tone)

  return (
    <div className="flex flex-col justify-between rounded-xl border border-border bg-card-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-[48px] font-bold leading-none text-text-primary">
              {score}
            </span>
            <span className="text-lg font-bold text-text-secondary">/ {max}</span>
          </div>
          <p className="mt-1 text-sm font-semibold text-text-secondary">
            {percent.toFixed(1)}%
          </p>
        </div>
        <span
          className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-bold ring-1 ${badgeClasses}`}
        >
          {band}
        </span>
      </div>
      <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-border">
        <div
          className={`h-full rounded-full ${fillClass}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

type TableRow = {
  indicator: string
  actual: string
  score: number
  max: number
  pct: number
  rating: string
}

type TableGroup = {
  title: string
  score: number
  max: number
  pct: number
  rows: TableRow[]
}

const QUANT_GROUPS: TableGroup[] = [
  {
    title: 'A. Leverage',
    score: 1,
    max: 10,
    pct: 10,
    rows: [
      {
        indicator: 'Financial Debt to Tangible Net Worth (DTN)',
        actual: '3.93×',
        score: 0,
        max: 7,
        pct: 0,
        rating: 'Unacceptable',
      },
      {
        indicator: 'Financial Debt to Total Assets (DTA)',
        actual: '0.785',
        score: 1,
        max: 3,
        pct: 33.3,
        rating: 'Unacceptable',
      },
    ],
  },
  {
    title: 'B. Liquidity',
    score: 5,
    max: 10,
    pct: 50,
    rows: [
      {
        indicator: 'Current Ratio (CR)',
        actual: '1.04×',
        score: 5,
        max: 7,
        pct: 71.4,
        rating: 'Good',
      },
      {
        indicator: 'Cash Ratio',
        actual: '0.006',
        score: 0,
        max: 3,
        pct: 0,
        rating: 'Unacceptable',
      },
    ],
  },
  {
    title: 'C. Profitability',
    score: 5,
    max: 10,
    pct: 50,
    rows: [
      {
        indicator: 'Net Profit Margin (NPM)',
        actual: '5.49%',
        score: 3,
        max: 5,
        pct: 60.0,
        rating: 'Marginal',
      },
      {
        indicator: 'Return on Assets (ROA)',
        actual: '1.94%',
        score: 1,
        max: 3,
        pct: 33.3,
        rating: 'Unacceptable',
      },
      {
        indicator: 'Operating Profit to Operating Assets (OPOA)',
        actual: '4.65%',
        score: 1,
        max: 2,
        pct: 50.0,
        rating: 'Unacceptable',
      },
    ],
  },
  {
    title: 'D. Coverage',
    score: 6,
    max: 15,
    pct: 40,
    rows: [
      {
        indicator: 'Interest Coverage (IC)',
        actual: '2.16×',
        score: 1,
        max: 3,
        pct: 33.3,
        rating: 'Unacceptable',
      },
      {
        indicator: 'Debt Service Coverage Ratio (DSCR)',
        actual: '1.42×',
        score: 2,
        max: 5,
        pct: 40.0,
        rating: 'Unacceptable',
      },
      {
        indicator: 'Operating Cashflow to Debt Ratio (CDR)',
        actual: '0.034',
        score: 1,
        max: 4,
        pct: 25.0,
        rating: 'Unacceptable',
      },
      {
        indicator: 'Cashflow Coverage Ratio (CCR)',
        actual: '0.765',
        score: 2,
        max: 3,
        pct: 66.7,
        rating: 'Marginal',
      },
    ],
  },
  {
    title: 'E. Operational Efficiency',
    score: 3,
    max: 10,
    pct: 30,
    rows: [
      {
        indicator: 'Stock Turnover Days (STD)',
        actual: '823.7 days',
        score: 0,
        max: 4,
        pct: 0,
        rating: 'Unacceptable',
      },
      {
        indicator: 'Trade Debtor Collection Days (TDCD)',
        actual: '89.2 days',
        score: 2,
        max: 3,
        pct: 66.7,
        rating: 'Marginal',
      },
      {
        indicator: 'Asset Turnover (AT)',
        actual: '0.354',
        score: 1,
        max: 3,
        pct: 33.3,
        rating: 'Unacceptable',
      },
    ],
  },
  {
    title: 'F. Earning Quality',
    score: 2,
    max: 5,
    pct: 40,
    rows: [
      {
        indicator: 'Operating Cash Flow to Sales (CFS)',
        actual: '7.44%',
        score: 2,
        max: 3,
        pct: 66.7,
        rating: 'Marginal',
      },
      {
        indicator: 'Cashflow Based Accrual Ratio (CAR)',
        actual: '0.008',
        score: 0,
        max: 2,
        pct: 0,
        rating: 'Unacceptable',
      },
    ],
  },
]

const QUAL_GROUPS: TableGroup[] = [
  {
    title: 'G. Performance Behavior',
    score: 10,
    max: 10,
    pct: 100,
    rows: [
      {
        indicator: 'Adverse classification last 3 years',
        actual: '0 times',
        score: 5,
        max: 5,
        pct: 100,
        rating: 'Excellent',
      },
      {
        indicator: 'Loan rescheduled/restructured last 3 years',
        actual: '0 times',
        score: 4,
        max: 4,
        pct: 100,
        rating: 'Excellent',
      },
      {
        indicator: 'Pays suppliers regularly',
        actual: 'Yes',
        score: 1,
        max: 1,
        pct: 100,
        rating: 'Excellent',
      },
    ],
  },
  {
    title: 'H. Business & Industry Risk',
    score: 6,
    max: 7,
    pct: 85.7,
    rows: [
      {
        indicator: 'Sales Growth',
        actual: '>10%',
        score: 2,
        max: 2,
        pct: 100,
        rating: 'Excellent',
      },
      {
        indicator: 'Age of Business',
        actual: '>10 years',
        score: 2,
        max: 2,
        pct: 100,
        rating: 'Excellent',
      },
      {
        indicator: 'Industry Prospects',
        actual: 'Growing but High Volatility',
        score: 0.5,
        max: 1,
        pct: 50,
        rating: 'Unacceptable',
      },
      {
        indicator: 'Long-Term External Credit Rating',
        actual: 'Grade 2 & 3',
        score: 1.5,
        max: 2,
        pct: 75,
        rating: 'Good',
      },
    ],
  },
  {
    title: 'I. Management Risk',
    score: 5,
    max: 7,
    pct: 71.4,
    rows: [
      {
        indicator: 'Experience of Management',
        actual: '>10 years in sector',
        score: 2,
        max: 2,
        pct: 100,
        rating: 'Excellent',
      },
      {
        indicator: 'Existence of Succession Plan',
        actual: 'Yes, good successor',
        score: 2,
        max: 2,
        pct: 100,
        rating: 'Excellent',
      },
      {
        indicator: 'Auditing Firms',
        actual: 'Other Auditors (non-BSEC listed)',
        score: 1,
        max: 2,
        pct: 50,
        rating: 'Unacceptable',
      },
      {
        indicator: 'Change in Auditors last 4 years',
        actual: 'No',
        score: 0,
        max: 1,
        pct: 0,
        rating: 'Unacceptable',
      },
    ],
  },
  {
    title: 'J. Security Risk',
    score: 2.5,
    max: 11,
    pct: 22.7,
    rows: [
      {
        indicator: 'Primary Security',
        actual: 'Reg. Hypothecation (1st Charge)',
        score: 1.5,
        max: 2,
        pct: 75,
        rating: 'Good',
      },
      {
        indicator: 'Collateral',
        actual: 'No Collateral',
        score: 0,
        max: 2,
        pct: 0,
        rating: 'Unacceptable',
      },
      {
        indicator: 'Collateral Coverage',
        actual: '<50%',
        score: 0,
        max: 5,
        pct: 0,
        rating: 'Unacceptable',
      },
      {
        indicator: 'Guarantee',
        actual: 'Personal/Corporate (weak financial strength)',
        score: 1,
        max: 2,
        pct: 50,
        rating: 'Unacceptable',
      },
    ],
  },
  {
    title: 'K. Relationship Risk',
    score: 3,
    max: 3,
    pct: 100,
    rows: [
      {
        indicator: 'Account Conduct',
        actual: '>3 years faultless record',
        score: 3,
        max: 3,
        pct: 100,
        rating: 'Excellent',
      },
    ],
  },
  {
    title: 'L. Compliance Risk',
    score: 2,
    max: 2,
    pct: 100,
    rows: [
      {
        indicator: 'Environmental compliance',
        actual: 'Yes',
        score: 1,
        max: 1,
        pct: 100,
        rating: 'Excellent',
      },
      {
        indicator: 'Corporate Governance & CSR',
        actual: 'Good Corporate Governance',
        score: 1,
        max: 1,
        pct: 100,
        rating: 'Excellent',
      },
    ],
  },
]

function IndicatorTable({ groups, title, totalScore, totalMax, totalPct, totalRating, isFinal }: { groups: TableGroup[], title: string, totalScore: number, totalMax: number, totalPct: number, totalRating: string, isFinal?: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-card-white shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h3 className="text-[15px] font-bold text-text-primary">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse text-left text-sm">
          <thead>
            <tr className="bg-primary text-card-white">
              <th className="px-6 py-3 font-bold">Indicator</th>
              <th className="px-6 py-3 font-bold">Actual Value</th>
              <th className="px-6 py-3 font-bold text-right">Score Obtained</th>
              <th className="px-6 py-3 font-bold text-right">Max Score</th>
              <th className="px-6 py-3 font-bold text-right">Achievement</th>
              <th className="px-6 py-3 font-bold">Rating</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((g) => (
              <React.Fragment key={g.title}>
                <tr className="bg-[#F1F5F9] border-b border-border">
                  <td className="px-6 py-2 font-bold text-text-primary border-l-[3px] border-primary" colSpan={2}>
                    {g.title}
                  </td>
                  <td className="px-6 py-2 font-bold text-text-primary text-right">{g.score}</td>
                  <td className="px-6 py-2 font-bold text-text-primary text-right">{g.max}</td>
                  <td className="px-6 py-2 font-bold text-text-primary text-right">{g.pct}%</td>
                  <td className="px-6 py-2"></td>
                </tr>
                {g.rows.map((r, i) => {
                  const tone = getToneForLabel(r.rating)
                  let textClass = 'text-danger'
                  if (tone === 'success') textClass = 'text-success'
                  if (tone === 'primary') textClass = 'text-primary'
                  if (tone === 'warning') textClass = 'text-warning'

                  return (
                    <tr key={i} className="border-b border-border last:border-b-0">
                      <td className="px-6 py-2.5 text-text-primary">{r.indicator}</td>
                      <td className="px-6 py-2.5 text-text-secondary">{r.actual}</td>
                      <td className="px-6 py-2.5 tabular-nums text-text-primary text-right">{r.score}</td>
                      <td className="px-6 py-2.5 tabular-nums text-text-secondary text-right">{r.max}</td>
                      <td className="px-6 py-2.5 tabular-nums text-text-secondary text-right">{r.pct}%</td>
                      <td className={`px-6 py-2.5 font-semibold ${textClass}`}>{r.rating}</td>
                    </tr>
                  )
                })}
              </React.Fragment>
            ))}
            <tr className={`${isFinal ? 'bg-danger' : 'bg-primary'} text-card-white border-t-2 border-border`}>
              <td className="px-6 py-3 font-bold uppercase" colSpan={2}>
                {isFinal ? 'ICRR AGGREGATE' : title.split(' ')[0] + ' TOTAL'}
              </td>
              <td className="px-6 py-3 font-bold tabular-nums text-right">{totalScore}</td>
              <td className="px-6 py-3 font-bold tabular-nums text-right">{totalMax}</td>
              <td className="px-6 py-3 font-bold tabular-nums text-right">{totalPct}%</td>
              <td className="px-6 py-3 font-bold">{totalRating}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function ICRRTab() {
  const [downloading, setDownloading] = useState(false)

  const handleDownload = () => {
    if (downloading) return
    setDownloading(true)
    setTimeout(() => {
      const link = document.createElement('a')
      link.href = '/OSML-ICRRS-30062024.xlsx'
      link.download = 'OSML-ICRRS-30062024.xlsx'
      link.click()
      setDownloading(false)
    }, 800)
  }

  return (
    <div className="space-y-8 pb-8">
      {/* SECTION 1 — AGGREGATE SCORE CARDS */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <ScoreCard
          title="Quantitative Score"
          score={22}
          max={60}
          percent={36.7}
          band="Unacceptable"
        />
        <ScoreCard
          title="Qualitative Score"
          score={28.5}
          max={40}
          percent={71.25}
          band="Good"
        />
        <ScoreCard
          title="ICRR Aggregate Score"
          score={50.5}
          max={100}
          percent={50.5}
          band="Unacceptable"
        />
      </section>

      <div className="flex items-start gap-3 rounded-lg border border-[#FCD34D] bg-[#FFFBEB] px-4 py-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" strokeWidth={2} aria-hidden />
        <p className="text-sm leading-relaxed text-[#92400E]">
          <span className="font-bold">Bangladesh Bank Guideline:</span> Since the quantitative score (36.7%) is below 50%, the aggregate ICRR is Unacceptable regardless of qualitative performance. Loan sanction is restricted unless the facility is 100% cash covered, Government Guaranteed, or Bank Guaranteed.
        </p>
      </div>

      {/* SECTION 2 — QUANTITATIVE BREAKDOWN */}
      <IndicatorTable
        title="Quantitative Indicators (60 marks total)"
        groups={QUANT_GROUPS}
        totalScore={22}
        totalMax={60}
        totalPct={36.7}
        totalRating="Unacceptable"
      />

      {/* SECTION 3 — QUALITATIVE BREAKDOWN */}
      <IndicatorTable
        title="Qualitative Indicators (40 marks total)"
        groups={QUAL_GROUPS}
        totalScore={28.5}
        totalMax={40}
        totalPct={71.25}
        totalRating="Good"
      />

      <IndicatorTable
        title="ICRR Aggregate"
        groups={[]}
        totalScore={50.5}
        totalMax={100}
        totalPct={50.5}
        totalRating="Unacceptable"
        isFinal
      />

      {/* SECTION 4 — DOWNLOAD BUTTON */}
      <div className="flex justify-center pt-4">
        <button
          type="button"
          disabled={downloading}
          onClick={handleDownload}
          className="inline-flex h-12 w-full max-w-md items-center justify-center gap-2 rounded-xl bg-success px-6 text-sm font-bold text-white transition-colors hover:bg-success/90 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {downloading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" strokeWidth={2} />
              Generating Workbook...
            </>
          ) : (
            <>
              <FileDown className="h-5 w-5" strokeWidth={2} />
              Download ICRR Workbook
            </>
          )}
        </button>
      </div>
    </div>
  )
}
