import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'
import { Fragment } from 'react'
import OsmlDownloadButton from './OsmlDownloadButton'

type Band = 'Marginal' | 'Substandard'

type QuantIndicator = {
  indicator: string
  actual: string
  score: number
  max: number
  benchmark: string
}

type QuantCategory = {
  label: string
  rows: QuantIndicator[]
}

type QualIndicator = {
  indicator: string
  actual: string
  score: number
  max: number
}

type QualCategory = {
  label: string
  rows: QualIndicator[]
}

const GRADE_REFERENCE = [
  { grade: 'Superior', range: '85–100', implication: 'Exceptional credit quality, minimal risk' },
  { grade: 'Good', range: '75–84', implication: 'Strong credit profile' },
  { grade: 'Acceptable', range: '65–74', implication: 'Adequate credit quality, some risk' },
  {
    grade: 'Marginal / Watch',
    range: '55–64',
    implication: 'Requires close monitoring',
  },
  {
    grade: 'Special Mention',
    range: '45–54',
    implication: 'Elevated risk, potential deterioration',
  },
  {
    grade: 'Substandard',
    range: '35–44',
    implication: 'Credit showing weakness — THIS BORROWER',
    highlight: true,
  },
  { grade: 'Doubtful', range: '25–34', implication: 'Serious doubt on full recovery' },
  { grade: 'Bad & Loss', range: '<25', implication: 'Not recoverable' },
] as const

const QUANTITATIVE: QuantCategory[] = [
  {
    label: 'A. Leverage',
    rows: [
      {
        indicator: 'Total Liabilities to Tangible Net Worth (TLTN)',
        actual: '2.99x',
        score: 3,
        max: 7,
        benchmark: '<1.0x ideal',
      },
      {
        indicator: 'Total Long Term Loan to Total Equity (LTLE)',
        actual: '0.99x',
        score: 1,
        max: 3,
        benchmark: '<0.25x ideal',
      },
    ],
  },
  {
    label: 'B. Liquidity',
    rows: [
      {
        indicator: 'Current Ratio (CR)',
        actual: '0.51x',
        score: 2,
        max: 7,
        benchmark: '>2.0x ideal',
      },
      {
        indicator: 'Cash Ratio',
        actual: '0.05',
        score: 0,
        max: 3,
        benchmark: '>0.20x ideal',
      },
    ],
  },
  {
    label: 'C. Profitability',
    rows: [
      {
        indicator: 'Net Profit Margin (NPM)',
        actual: '8.01%',
        score: 4,
        max: 5,
        benchmark: '>11% ideal',
      },
      {
        indicator: 'Return on Assets (ROA)',
        actual: '1.94%',
        score: 2,
        max: 3,
        benchmark: '>4.5% ideal',
      },
      {
        indicator: 'Operating Profit to Assets (OPA)',
        actual: '4.65%',
        score: 2,
        max: 2,
        benchmark: '>8% ideal',
      },
    ],
  },
  {
    label: 'D. Coverage',
    rows: [
      {
        indicator: 'Interest Coverage (IC)',
        actual: '2.16x',
        score: 2,
        max: 3,
        benchmark: '>4x ideal',
      },
      {
        indicator: 'Debt Service Coverage Ratio (DSCR)',
        actual: '1.42x',
        score: 5,
        max: 5,
        benchmark: '>1.0x ideal',
      },
      {
        indicator: 'Financial Debt to Operating Cash Flow',
        actual: '29.8x',
        score: 0,
        max: 4,
        benchmark: '<3x ideal',
      },
      {
        indicator: 'Cashflow Coverage Ratio (CCR)',
        actual: '0.77x',
        score: 2,
        max: 3,
        benchmark: '>1.5x ideal',
      },
    ],
  },
]

const QUALITATIVE: QualCategory[] = [
  {
    label: 'E. Business / Industry Risk',
    rows: [
      {
        indicator: 'Industry Growth Prospects',
        actual: 'Moderate',
        score: 3,
        max: 5,
      },
      {
        indicator: 'Competitive Position',
        actual: 'Below Average',
        score: 2,
        max: 5,
      },
    ],
  },
  {
    label: 'F. Management Quality',
    rows: [
      {
        indicator: 'Management Competence',
        actual: 'Good',
        score: 3,
        max: 5,
      },
      {
        indicator: 'Succession Planning',
        actual: 'Yes',
        score: 2,
        max: 5,
      },
      {
        indicator: 'Transparency & Disclosure',
        actual: 'Adequate',
        score: 1,
        max: 5,
      },
    ],
  },
]

const RISK_FLAGS = [
  'Quantitative score below 50% threshold — loan sanction restricted',
  'Stock Turnover Days critically high at 824 days',
  'Financial Debt to Operating Cash Flow at 29.8x — severely overleveraged against cash generation',
  'Cash Ratio at 0.006 — near-zero liquidity cushion',
  'Total Debt/Equity ratio increasing 3 consecutive years (3.51 → 3.71 → 3.99)',
] as const

const MITIGATING_FACTORS = [
  'CIB Status: Standard — no adverse classification in 3 years',
  'DSCR above 1.0x — debt service is being met',
  'Strong management experience (>10 years in sector)',
  'Faultless account conduct with BRAC Bank (>3 years)',
  'Trade debtor collection days improved to 89 days from 196 days',
] as const

function bandBadgeClass(band: Band): string {
  if (band === 'Marginal') return 'bg-[#FEF3C7] text-[#B45309]'
  return 'bg-[#FEE2E2] text-[#B91C1C]'
}

function BreakdownCell({
  label,
  score,
  max,
  pct,
  band,
}: {
  label: string
  score: number
  max: number
  pct: string
  band: Band
}) {
  return (
    <div className="text-center">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[#4A5568]">
        {label}
      </p>
      <p className="mt-2 text-[20px] font-bold tabular-nums text-[#0D1B3E]">
        {score} / {max}
      </p>
      <p className="mt-0.5 text-[14px] font-medium text-[#4A5568]">{pct}</p>
      <span
        className={[
          'mt-2 inline-flex rounded-full px-2.5 py-0.5 text-[12px] font-semibold',
          bandBadgeClass(band),
        ].join(' ')}
      >
        {band}
      </span>
    </div>
  )
}

export default function CRGTab() {
  let quantRowIndex = 0
  let qualRowIndex = 0

  return (
    <div className="space-y-8">
      <section aria-label="CRG summary scorecard">
        <div className="rounded-[12px] border border-[#D0DCF0] bg-card-white px-8 py-7">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-semibold uppercase tracking-wide text-[#4A5568]">
                CRG Score
              </p>
              <p className="mt-1 text-[48px] font-bold leading-none text-[#0D1B3E]">29 / 60</p>
              <p className="mt-2 text-[20px] font-medium text-[#4A5568]">48.3%</p>
              <span className="mt-4 inline-flex rounded-full bg-[#FEF2F2] px-4 py-1.5 text-[16px] font-bold text-[#B91C1C]">
                Substandard
              </span>
              <div className="mt-5 h-2 w-full max-w-md overflow-hidden rounded bg-[#FEE2E2]">
                <div
                  className="h-2 rounded bg-[#DC2626]"
                  style={{ width: '48.3%' }}
                  role="progressbar"
                  aria-valuenow={48.3}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            </div>

            <div className="grid flex-1 grid-cols-1 gap-6 border-t border-[#E2E8F0] pt-6 sm:grid-cols-3 lg:max-w-[520px] lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
              <BreakdownCell
                label="Quantitative"
                score={18}
                max={40}
                pct="45.0%"
                band="Marginal"
              />
              <BreakdownCell
                label="Qualitative"
                score={11}
                max={20}
                pct="55.0%"
                band="Marginal"
              />
              <BreakdownCell
                label="Overall"
                score={29}
                max={60}
                pct="48.3%"
                band="Substandard"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-lg border border-[#D0DCF0] bg-card-white">
          <div className="border-b border-[#E2E8F0] px-4 py-3">
            <h3 className="text-[13px] font-bold text-[#0D1B3E]">
              Bangladesh Bank CRG Grade Reference
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-left text-[12px]">
              <thead>
                <tr className="bg-[#F4F7FB] text-[11px] font-semibold uppercase tracking-wide text-[#4A5568]">
                  <th className="px-4 py-2">Grade</th>
                  <th className="px-4 py-2">Score Range</th>
                  <th className="px-4 py-2">Implication</th>
                </tr>
              </thead>
              <tbody>
                {GRADE_REFERENCE.map((row) => (
                  <tr
                    key={row.grade}
                    className={[
                      'border-b border-[#E2E8F0]/60',
                      'highlight' in row && row.highlight
                        ? 'border-l-4 border-l-[#F59E0B] bg-[#FFFBEB] font-medium text-[#0D1B3E]'
                        : 'text-[#4A5568]',
                    ].join(' ')}
                  >
                    <td className="px-4 py-2">{row.grade}</td>
                    <td className="px-4 py-2 tabular-nums">{row.range}</td>
                    <td className="px-4 py-2">{row.implication}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section
        className="overflow-hidden rounded-xl border border-[#D0DCF0] bg-card-white"
        aria-label="CRG quantitative indicators"
      >
        <div className="border-b border-[#E2E8F0] px-6 py-4">
          <h2 className="text-[15px] font-bold text-[#0D1B3E]">CRG Quantitative Indicators</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#F4F7FB] text-[11px] font-semibold uppercase tracking-wide text-[#4A5568]">
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Indicator</th>
                <th className="px-4 py-3">Actual Value</th>
                <th className="px-4 py-3 text-right">Score</th>
                <th className="px-4 py-3 text-right">Max Score</th>
                <th className="px-4 py-3">Benchmark</th>
              </tr>
            </thead>
            <tbody>
              {QUANTITATIVE.map((category) => (
                <Fragment key={category.label}>
                  <tr className="bg-[#E8EDF5] font-bold text-[#0D1B3E]">
                    <td className="px-4 py-2.5" colSpan={6}>
                      {category.label}
                    </td>
                  </tr>
                  {category.rows.map((row) => {
                    const stripe = quantRowIndex % 2 === 0 ? 'bg-card-white' : 'bg-[#F4F7FB]'
                    quantRowIndex += 1
                    return (
                      <tr
                        key={row.indicator}
                        className={['border-b border-[#E2E8F0]/60', stripe].join(' ')}
                      >
                        <td className="px-4 py-2.5" />
                        <td className="px-4 py-2.5 text-[#0D1B3E]">{row.indicator}</td>
                        <td className="px-4 py-2.5 tabular-nums text-[#0D1B3E]">{row.actual}</td>
                        <td className="px-4 py-2.5 text-right tabular-nums">{row.score}</td>
                        <td className="px-4 py-2.5 text-right tabular-nums">{row.max}</td>
                        <td className="px-4 py-2.5 text-[#4A5568]">{row.benchmark}</td>
                      </tr>
                    )
                  })}
                </Fragment>
              ))}
              <tr className="bg-[#EFF6FF] font-bold text-[#0D1B3E]">
                <td className="px-4 py-2.5" colSpan={2}>
                  Quantitative Total
                </td>
                <td className="px-4 py-2.5">—</td>
                <td className="px-4 py-2.5 text-right tabular-nums">18</td>
                <td className="px-4 py-2.5 text-right tabular-nums">40</td>
                <td className="px-4 py-2.5">45.0%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section
        className="overflow-hidden rounded-xl border border-[#D0DCF0] bg-card-white"
        aria-label="CRG qualitative indicators"
      >
        <div className="border-b border-[#E2E8F0] px-6 py-4">
          <h2 className="text-[15px] font-bold text-[#0D1B3E]">CRG Qualitative Indicators</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#F4F7FB] text-[11px] font-semibold uppercase tracking-wide text-[#4A5568]">
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Indicator</th>
                <th className="px-4 py-3">Actual</th>
                <th className="px-4 py-3 text-right">Score</th>
                <th className="px-4 py-3 text-right">Max</th>
                <th className="px-4 py-3">Benchmark</th>
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
                        <td className="px-4 py-2.5 text-right tabular-nums">{row.score}</td>
                        <td className="px-4 py-2.5 text-right tabular-nums">{row.max}</td>
                        <td className="px-4 py-2.5 text-[#4A5568]">—</td>
                      </tr>
                    )
                  })}
                </Fragment>
              ))}
              <tr className="bg-[#EFF6FF] font-bold text-[#0D1B3E]">
                <td className="px-4 py-2.5" colSpan={2}>
                  Qualitative Total
                </td>
                <td className="px-4 py-2.5">—</td>
                <td className="px-4 py-2.5 text-right tabular-nums">11</td>
                <td className="px-4 py-2.5 text-right tabular-nums">20</td>
                <td className="px-4 py-2.5">55.0%</td>
              </tr>
              <tr className="border-y-2 border-y-[#0052A5] bg-[#EFF6FF] font-bold text-[#0D1B3E]">
                <td className="px-4 py-2.5" colSpan={2}>
                  TOTAL CRG SCORE
                </td>
                <td className="px-4 py-2.5">—</td>
                <td className="px-4 py-2.5 text-right tabular-nums">29</td>
                <td className="px-4 py-2.5 text-right tabular-nums">60</td>
                <td className="px-4 py-2.5">
                  48.3% —{' '}
                  <span className="text-[#B91C1C]">Substandard</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section
        className="grid grid-cols-1 gap-4 lg:grid-cols-2"
        aria-label="CRG risk assessment"
      >
        <div className="rounded-xl border border-[#D0DCF0] border-l-4 border-l-[#DC2626] bg-card-white p-5">
          <h3 className="flex items-center gap-2 text-[14px] font-bold text-[#B91C1C]">
            <AlertTriangle className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
            Risk Flags Identified
          </h3>
          <ul className="mt-4 space-y-3">
            {RISK_FLAGS.map((flag) => (
              <li
                key={flag}
                className="flex gap-2.5 rounded-lg bg-[#FEF2F2] px-3 py-2.5 text-[13px] leading-snug text-[#991B1B]"
              >
                <XCircle
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#DC2626]"
                  strokeWidth={2}
                  aria-hidden
                />
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-[#D0DCF0] border-l-4 border-l-[#1A7C4A] bg-card-white p-5">
          <h3 className="flex items-center gap-2 text-[14px] font-bold text-[#166534]">
            <CheckCircle2 className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
            Mitigating Factors
          </h3>
          <ul className="mt-4 space-y-3">
            {MITIGATING_FACTORS.map((factor) => (
              <li
                key={factor}
                className="flex gap-2.5 rounded-lg bg-[#F0FDF4] px-3 py-2.5 text-[13px] leading-snug text-[#166534]"
              >
                <CheckCircle2
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#1A7C4A]"
                  strokeWidth={2}
                  aria-hidden
                />
                <span>{factor}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <blockquote
        className="rounded-r-lg border-l-4 border-[#0052A5] bg-[#F0F7FF] px-6 py-5"
        aria-label="Analyst observation"
      >
        <p className="text-[14px] font-bold text-[#0052A5]">Analyst Observation</p>
        <p className="mt-3 text-[13px] leading-relaxed text-[#0D1B3E]">
          Outpace Spinning Mills Ltd. presents a mixed credit profile. While qualitative indicators
          show strong management and clean banking conduct, the quantitative metrics — particularly
          leverage ratios, stock turnover days, and cash generation — are under significant stress.
          The deteriorating debt-to-equity trajectory and near-zero cash ratio warrant close
          monitoring. The overall CRG grade of Substandard (48.3%) signals elevated risk. Bangladesh
          Bank guidelines restrict new sanctions at this grading level without enhanced security or
          management undertaking.
        </p>
        <p className="mt-4 text-[12px] italic text-[#4A5568]">
          — Md. Matiur Rahman, SRM | Large Corporate Unit 04
        </p>
      </blockquote>

      <div>
        <OsmlDownloadButton
          filename="OSML-CRG-30062025.xls"
          displayName="OSML-CRG-30062025.xls"
          label="Download CRG Workbook"
        />
      </div>
    </div>
  )
}
