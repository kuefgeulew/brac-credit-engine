import { Fragment } from 'react'
import OsmlDownloadButton from './OsmlDownloadButton'

type Rating = 'Excellent' | 'Good' | 'Marginal' | 'Unacceptable'

type QuantSubRow = {
  subIndicator: string
  actual: string
  score: number
  max: number
  pct: string
  rating: Rating
}

type QuantCategory = {
  label: string
  totalLabel: string
  rows: QuantSubRow[]
}

type QualSubRow = {
  indicator: string
  actual: string
  score: number | string
  max: number
  pct: string
}

type QualCategory = {
  label: string
  rows: QualSubRow[]
}

const QUANTITATIVE: QuantCategory[] = [
  {
    label: 'A. Leverage',
    totalLabel: 'Total: 1/10 = 10%',
    rows: [
      {
        subIndicator: 'A.1 — Financial Debt to Tangible Net Worth (DTN)',
        actual: '3.93x',
        score: 0,
        max: 7,
        pct: '0%',
        rating: 'Unacceptable',
      },
      {
        subIndicator: 'A.2 — Financial Debt to Total Assets (DTA)',
        actual: '0.785',
        score: 1,
        max: 3,
        pct: '33.3%',
        rating: 'Unacceptable',
      },
    ],
  },
  {
    label: 'B. Liquidity',
    totalLabel: 'Total: 5/10 = 50%',
    rows: [
      {
        subIndicator: 'B.1 — Current Ratio (CR)',
        actual: '1.04x',
        score: 5,
        max: 7,
        pct: '71.4%',
        rating: 'Good',
      },
      {
        subIndicator: 'B.2 — Cash Ratio',
        actual: '0.006',
        score: 0,
        max: 3,
        pct: '0%',
        rating: 'Unacceptable',
      },
    ],
  },
  {
    label: 'C. Profitability',
    totalLabel: 'Total: 5/10 = 50%',
    rows: [
      {
        subIndicator: 'C.1 — Net Profit Margin (NPM)',
        actual: '5.49%',
        score: 3,
        max: 5,
        pct: '60%',
        rating: 'Marginal',
      },
      {
        subIndicator: 'C.2 — Return on Assets (ROA)',
        actual: '1.94%',
        score: 1,
        max: 3,
        pct: '33.3%',
        rating: 'Unacceptable',
      },
      {
        subIndicator: 'C.3 — Operating Profit to Operating Assets (OPOA)',
        actual: '4.65%',
        score: 1,
        max: 2,
        pct: '50%',
        rating: 'Unacceptable',
      },
    ],
  },
  {
    label: 'D. Coverage',
    totalLabel: 'Total: 6/15 = 40%',
    rows: [
      {
        subIndicator: 'D.1 — Interest Coverage (IC)',
        actual: '2.16x',
        score: 1,
        max: 3,
        pct: '33.3%',
        rating: 'Unacceptable',
      },
      {
        subIndicator: 'D.2 — Debt Service Coverage Ratio (DSCR)',
        actual: '1.42x',
        score: 2,
        max: 5,
        pct: '40%',
        rating: 'Unacceptable',
      },
      {
        subIndicator: 'D.3 — Operating Cashflow to Debt Ratio (CDR)',
        actual: '0.034',
        score: 1,
        max: 4,
        pct: '25%',
        rating: 'Unacceptable',
      },
      {
        subIndicator: 'D.4 — Cashflow Coverage Ratio (CCR)',
        actual: '0.765',
        score: 2,
        max: 3,
        pct: '66.7%',
        rating: 'Marginal',
      },
    ],
  },
  {
    label: 'E. Operational Efficiency',
    totalLabel: 'Total: 3/10 = 30%',
    rows: [
      {
        subIndicator: 'E.1 — Stock Turnover Days (STD)',
        actual: '823.7 days',
        score: 0,
        max: 4,
        pct: '0%',
        rating: 'Unacceptable',
      },
      {
        subIndicator: 'E.2 — Trade Debtor Collection Days (TDCD)',
        actual: '89.2 days',
        score: 2,
        max: 3,
        pct: '66.7%',
        rating: 'Marginal',
      },
      {
        subIndicator: 'E.3 — Asset Turnover (AT)',
        actual: '0.354',
        score: 1,
        max: 3,
        pct: '33.3%',
        rating: 'Unacceptable',
      },
    ],
  },
  {
    label: 'F. Earning Quality',
    totalLabel: 'Total: 2/5 = 40%',
    rows: [
      {
        subIndicator: 'F.1 — Operating Cash Flow to Sales (CFS)',
        actual: '7.44%',
        score: 2,
        max: 3,
        pct: '66.7%',
        rating: 'Marginal',
      },
      {
        subIndicator: 'F.2 — Cashflow Based Accrual Ratio (CAR)',
        actual: '0.008',
        score: 0,
        max: 2,
        pct: '0%',
        rating: 'Unacceptable',
      },
    ],
  },
]

const QUALITATIVE: QualCategory[] = [
  {
    label: 'G. Performance Behavior (10/10 = 100% — Excellent)',
    rows: [
      {
        indicator: 'G.1.1 — Adverse classification last 3 years',
        actual: '0 times',
        score: 5,
        max: 5,
        pct: '100%',
      },
      {
        indicator: 'G.1.2 — Loan rescheduled/restructured last 3 years',
        actual: '0 times',
        score: 4,
        max: 4,
        pct: '100%',
      },
      {
        indicator: 'G.2 — Pays suppliers regularly',
        actual: 'Yes',
        score: 1,
        max: 1,
        pct: '100%',
      },
    ],
  },
  {
    label: 'H. Business & Industry Risk (6/7 = 85.7% — Excellent)',
    rows: [
      {
        indicator: 'H.1 — Sales Growth',
        actual: '>10%',
        score: 2,
        max: 2,
        pct: '100%',
      },
      {
        indicator: 'H.2 — Age of Business',
        actual: '>10 years',
        score: 2,
        max: 2,
        pct: '100%',
      },
      {
        indicator: 'H.3 — Industry Prospects',
        actual: 'Growing but High Volatility',
        score: 0.5,
        max: 1,
        pct: '50%',
      },
      {
        indicator: 'H.4 — Long-Term External Credit Rating',
        actual: 'Grade 2&3',
        score: 1.5,
        max: 2,
        pct: '75%',
      },
    ],
  },
  {
    label: 'I. Management Risk (5/7 = 71.4% — Good)',
    rows: [
      {
        indicator: 'I.1 — Experience of Management',
        actual: '>10 years',
        score: 2,
        max: 2,
        pct: '100%',
      },
      {
        indicator: 'I.2 — Succession Plan',
        actual: 'Yes, good successor',
        score: 2,
        max: 2,
        pct: '100%',
      },
      {
        indicator: 'I.3 — Auditing Firms',
        actual: 'Other Auditors',
        score: 1,
        max: 2,
        pct: '50%',
      },
      {
        indicator: 'I.4 — Change in Auditors last 4 years',
        actual: 'No',
        score: 0,
        max: 1,
        pct: '0%',
      },
    ],
  },
  {
    label: 'J. Security Risk (2.5/11 = 22.7% — Unacceptable)',
    rows: [
      {
        indicator: 'J.1 — Primary Security',
        actual: 'Registered Hypothecation (1st Charge)',
        score: 1.5,
        max: 2,
        pct: '75%',
      },
      {
        indicator: 'J.2 — Collateral',
        actual: 'No Collateral',
        score: 0,
        max: 2,
        pct: '0%',
      },
      {
        indicator: 'J.3 — Collateral Coverage',
        actual: '<50%',
        score: 0,
        max: 5,
        pct: '0%',
      },
      {
        indicator: 'J.4 — Guarantee',
        actual: 'Personal/Corporate (weak)',
        score: 1,
        max: 2,
        pct: '50%',
      },
    ],
  },
  {
    label: 'K. Relationship Risk (3/3 = 100% — Excellent)',
    rows: [
      {
        indicator: 'K.1 — Account Conduct',
        actual: '>3 years faultless',
        score: 3,
        max: 3,
        pct: '100%',
      },
    ],
  },
  {
    label: 'L. Compliance Risk (2/2 = 100% — Excellent)',
    rows: [
      {
        indicator: 'L.1 — Environmental compliance',
        actual: 'Yes',
        score: 1,
        max: 1,
        pct: '100%',
      },
      {
        indicator: 'L.2 — Corporate Governance & CSR',
        actual: 'Good',
        score: 1,
        max: 1,
        pct: '100%',
      },
    ],
  },
]

function ratingPillClass(rating: Rating): string {
  switch (rating) {
    case 'Excellent':
      return 'bg-[#DCFCE7] text-[#166534]'
    case 'Good':
      return 'bg-[#DBEAFE] text-[#1E40AF]'
    case 'Marginal':
      return 'bg-[#FEF3C7] text-[#B45309]'
    case 'Unacceptable':
      return 'bg-[#FEE2E2] text-[#B91C1C]'
  }
}

function scoreCardStyles(band: string): { card: string; bar: string; badge: string } {
  if (band === 'Good') {
    return {
      card: 'border-[#BFDBFE] bg-[#EFF6FF]',
      bar: 'bg-[#0052A5]',
      badge: 'bg-[#DBEAFE] text-[#1E40AF]',
    }
  }
  return {
    card: 'border-[#FECACA] bg-[#FEF2F2]',
    bar: 'bg-[#DC2626]',
    badge: 'bg-[#FEE2E2] text-[#B91C1C]',
  }
}

function RatingPill({ rating }: { rating: Rating }) {
  return (
    <span
      className={[
        'inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap',
        ratingPillClass(rating),
      ].join(' ')}
    >
      {rating}
    </span>
  )
}

function ScoreCard({
  title,
  valueLabel,
  percentageLabel,
  band,
  progressPct,
}: {
  title: string
  valueLabel: string
  percentageLabel: string
  band: string
  progressPct: number
}) {
  const styles = scoreCardStyles(band)
  return (
    <div className={['flex min-w-0 flex-1 flex-col rounded-xl border p-5', styles.card].join(' ')}>
      <p className="text-[13px] font-semibold text-[#4A5568]">{title}</p>
      <p className="mt-2 text-[28px] font-bold leading-none text-[#0D1B3E]">{valueLabel}</p>
      <p className="mt-1 text-[14px] font-medium text-[#4A5568]">{percentageLabel}</p>
      <span
        className={[
          'mt-3 inline-flex w-fit rounded-full px-2.5 py-0.5 text-[12px] font-semibold',
          styles.badge,
        ].join(' ')}
      >
        {band}
      </span>
      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/80">
        <div
          className={['h-full rounded-full transition-[width] duration-500', styles.bar].join(' ')}
          style={{ width: `${progressPct}%` }}
          role="progressbar"
          aria-valuenow={progressPct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  )
}

function formatScore(score: number | string): string {
  return typeof score === 'number' && !Number.isInteger(score) ? score.toFixed(1) : String(score)
}

export default function ICRRTab() {
  let quantRowIndex = 0
  let qualRowIndex = 0

  return (
    <div className="space-y-8">
      <section aria-label="ICRR aggregate scores">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <ScoreCard
            title="Quantitative Score"
            valueLabel="22 / 60"
            percentageLabel="36.7%"
            band="Unacceptable"
            progressPct={36.7}
          />
          <ScoreCard
            title="Qualitative Score"
            valueLabel="28.5 / 40"
            percentageLabel="71.25%"
            band="Good"
            progressPct={71.25}
          />
          <ScoreCard
            title="Aggregate (ICRR)"
            valueLabel="50.5 / 100"
            percentageLabel="50.5%"
            band="Unacceptable"
            progressPct={50.5}
          />
        </div>

        <div
          className="mt-4 rounded-lg border border-[#FCD34D] bg-[#FFFBEB] px-4 py-3 text-[13px] leading-relaxed text-[#78350F]"
          role="note"
        >
          <strong className="font-semibold text-[#92400E]">Note:</strong> Since the quantitative
          score is below 50%, the overall ICRR is classified as Unacceptable regardless of
          qualitative performance. Bangladesh Bank guidelines require quantitative score ≥ 50% for
          sanction eligibility.
        </div>
      </section>

      <section
        className="overflow-hidden rounded-xl border border-[#D0DCF0] bg-card-white"
        aria-label="Quantitative analysis breakdown"
      >
        <div className="border-b border-[#E2E8F0] px-6 py-4">
          <h2 className="text-[15px] font-bold text-[#0D1B3E]">
            Quantitative Analysis Breakdown
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#F4F7FB] text-[11px] font-semibold uppercase tracking-wide text-[#4A5568]">
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Sub-Indicator</th>
                <th className="px-4 py-3">Actual Value</th>
                <th className="px-4 py-3 text-right">Score Obtained</th>
                <th className="px-4 py-3 text-right">Max Score</th>
                <th className="px-4 py-3 text-right">% Achieved</th>
                <th className="px-4 py-3">Rating</th>
              </tr>
            </thead>
            <tbody>
              {QUANTITATIVE.map((category) => (
                <Fragment key={category.label}>
                  <tr className="bg-[#E8EDF5] font-bold text-[#0D1B3E]">
                    <td className="px-4 py-2.5" colSpan={7}>
                      {category.label} ({category.totalLabel})
                    </td>
                  </tr>
                  {category.rows.map((row) => {
                    const stripe = quantRowIndex % 2 === 0 ? 'bg-card-white' : 'bg-[#F4F7FB]'
                    quantRowIndex += 1
                    return (
                      <tr key={row.subIndicator} className={['border-b border-[#E2E8F0]/60', stripe].join(' ')}>
                        <td className="px-4 py-2.5 text-[#4A5568]" />
                        <td className="px-4 py-2.5 text-[#0D1B3E]">{row.subIndicator}</td>
                        <td className="px-4 py-2.5 tabular-nums text-[#0D1B3E]">{row.actual}</td>
                        <td className="px-4 py-2.5 text-right tabular-nums">{row.score}</td>
                        <td className="px-4 py-2.5 text-right tabular-nums">{row.max}</td>
                        <td className="px-4 py-2.5 text-right tabular-nums">{row.pct}</td>
                        <td className="px-4 py-2.5">
                          <RatingPill rating={row.rating} />
                        </td>
                      </tr>
                    )
                  })}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section
        className="overflow-hidden rounded-xl border border-[#D0DCF0] bg-card-white"
        aria-label="Qualitative analysis breakdown"
      >
        <div className="border-b border-[#E2E8F0] px-6 py-4">
          <h2 className="text-[15px] font-bold text-[#0D1B3E]">
            Qualitative Analysis Breakdown
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#F4F7FB] text-[11px] font-semibold uppercase tracking-wide text-[#4A5568]">
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Indicator</th>
                <th className="px-4 py-3">Actual</th>
                <th className="px-4 py-3 text-right">Score</th>
                <th className="px-4 py-3 text-right">Max</th>
                <th className="px-4 py-3 text-right">%</th>
              </tr>
            </thead>
            <tbody>
              {QUALITATIVE.map((category) => (
                <Fragment key={category.label}>
                  <tr className="bg-[#E8EDF5] font-bold text-[#0D1B3E]">
                    <td className="px-4 py-2.5" colSpan={6}>
                      {category.label}
                    </td>
                  </tr>
                  {category.rows.map((row) => {
                    const stripe = qualRowIndex % 2 === 0 ? 'bg-card-white' : 'bg-[#F4F7FB]'
                    qualRowIndex += 1
                    return (
                    <tr
                      key={row.indicator}
                      className={['border-b border-[#E2E8F0]/60', stripe].join(' ')}
                    >
                      <td className="px-4 py-2.5" />
                      <td className="px-4 py-2.5 text-[#0D1B3E]">{row.indicator}</td>
                      <td className="px-4 py-2.5 text-[#0D1B3E]">{row.actual}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums">{formatScore(row.score)}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums">{row.max}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums">{row.pct}</td>
                    </tr>
                    )
                  })}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div>
        <OsmlDownloadButton
          filename="OSML-ICRRS-30062024.xlsx"
          displayName="OSML-ICRRS-30062024.xlsx"
          label="Download ICRR Workbook"
        />
      </div>
    </div>
  )
}
