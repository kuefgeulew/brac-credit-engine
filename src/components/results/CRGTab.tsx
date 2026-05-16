import {
  AlertTriangle,
  CheckCircle,
  CheckCircle2,
  FileDown,
  Loader2,
  MessageSquare,
  XCircle,
} from 'lucide-react'
import React, { useState } from 'react'

type TableRow = {
  indicator: string
  actual: string
  score: number
  max: number
  pct: number
  benchmark?: string
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
    score: 4,
    max: 10,
    pct: 40,
    rows: [
      {
        indicator: 'Total Liabilities to Tangible Net Worth',
        actual: '2.99×',
        score: 3,
        max: 7,
        pct: 42.9,
        benchmark: '<1.0× ideal',
      },
      {
        indicator: 'Total Long Term Loan to Total Equity',
        actual: '0.99×',
        score: 1,
        max: 3,
        pct: 33.3,
        benchmark: '<0.25× ideal',
      },
    ],
  },
  {
    title: 'B. Liquidity',
    score: 2,
    max: 10,
    pct: 20,
    rows: [
      {
        indicator: 'Current Ratio (CR)',
        actual: '0.51×',
        score: 2,
        max: 7,
        pct: 28.6,
        benchmark: '>2.0× ideal',
      },
      {
        indicator: 'Cash Ratio',
        actual: '0.05',
        score: 0,
        max: 3,
        pct: 0,
        benchmark: '>0.20× ideal',
      },
    ],
  },
  {
    title: 'C. Profitability',
    score: 8,
    max: 10,
    pct: 80,
    rows: [
      {
        indicator: 'Net Profit Margin (NPM)',
        actual: '8.01%',
        score: 4,
        max: 5,
        pct: 80,
        benchmark: '>11% ideal',
      },
      {
        indicator: 'Return on Assets (ROA)',
        actual: '1.94%',
        score: 2,
        max: 3,
        pct: 66.7,
        benchmark: '>4.5% ideal',
      },
      {
        indicator: 'Operating Profit to Assets (OPA)',
        actual: '4.65%',
        score: 2,
        max: 2,
        pct: 100,
        benchmark: '>8% ideal',
      },
    ],
  },
  {
    title: 'D. Coverage',
    score: 9,
    max: 15,
    pct: 60,
    rows: [
      {
        indicator: 'Interest Coverage (IC)',
        actual: '2.16×',
        score: 2,
        max: 3,
        pct: 66.7,
        benchmark: '>4× ideal',
      },
      {
        indicator: 'DSCR',
        actual: '1.42×',
        score: 5,
        max: 5,
        pct: 100,
        benchmark: '>1.0× ideal',
      },
      {
        indicator: 'Financial Debt to Operating Cash Flow',
        actual: '29.8×',
        score: 0,
        max: 4,
        pct: 0,
        benchmark: '<3× ideal',
      },
      {
        indicator: 'Cashflow Coverage Ratio (CCR)',
        actual: '0.77×',
        score: 2,
        max: 3,
        pct: 66.7,
        benchmark: '>1.5× ideal',
      },
    ],
  },
  {
    title: 'E. Operational Efficiency',
    score: 3,
    max: 5,
    pct: 60,
    rows: [
      {
        indicator: 'Stock Turnover Days',
        actual: '823.7 days',
        score: 0,
        max: 3,
        pct: 0,
        benchmark: '<90 days ideal',
      },
      {
        indicator: 'Trade Debtor Days',
        actual: '89.2 days',
        score: 3,
        max: 2,
        pct: 100,
        benchmark: '—',
      },
    ],
  },
]

const QUAL_GROUPS: TableGroup[] = [
  {
    title: 'E. Business / Industry Risk',
    score: 5,
    max: 10,
    pct: 50,
    rows: [
      {
        indicator: 'Industry Growth Prospects',
        actual: 'Moderate growth',
        score: 3,
        max: 5,
        pct: 60,
      },
      {
        indicator: 'Competitive Position',
        actual: 'Below industry average',
        score: 2,
        max: 5,
        pct: 40,
      },
    ],
  },
  {
    title: 'F. Management Quality',
    score: 6,
    max: 10,
    pct: 60,
    rows: [
      {
        indicator: 'Management Competence',
        actual: 'Experienced (>10 years)',
        score: 3,
        max: 4,
        pct: 75,
      },
      {
        indicator: 'Succession Planning',
        actual: 'Yes, adequate',
        score: 2,
        max: 4,
        pct: 50,
      },
      {
        indicator: 'Transparency & Disclosure',
        actual: 'Adequate',
        score: 1,
        max: 2,
        pct: 50,
      },
    ],
  },
]

function IndicatorTable({
  groups,
  title,
  totalScore,
  totalMax,
  totalPct,
  totalRating,
  isFinal,
  showBenchmark,
}: {
  groups: TableGroup[]
  title: string
  totalScore: number
  totalMax: number
  totalPct: number
  totalRating: string
  isFinal?: boolean
  showBenchmark?: boolean
}) {
  return (
    <div className="rounded-xl border border-border bg-card-white shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h3 className="text-[15px] font-bold text-text-primary">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse text-left text-sm">
          <thead>
            <tr className="bg-primary text-card-white">
              <th className="px-6 py-3 font-bold">Category / Indicator</th>
              <th className="px-6 py-3 font-bold">Actual Value</th>
              <th className="px-6 py-3 font-bold text-right">Score</th>
              <th className="px-6 py-3 font-bold text-right">Max</th>
              <th className="px-6 py-3 font-bold text-right">Achievement</th>
              {showBenchmark && <th className="px-6 py-3 font-bold">Benchmark</th>}
            </tr>
          </thead>
          <tbody>
            {groups.map((g) => (
              <React.Fragment key={g.title}>
                <tr className="bg-[#F1F5F9] border-b border-border">
                  <td
                    className="px-6 py-2 font-bold text-text-primary border-l-[3px] border-primary"
                    colSpan={2}
                  >
                    {g.title}
                  </td>
                  <td className="px-6 py-2 font-bold text-text-primary text-right">{g.score}</td>
                  <td className="px-6 py-2 font-bold text-text-primary text-right">{g.max}</td>
                  <td className="px-6 py-2 font-bold text-text-primary text-right">{g.pct}%</td>
                  {showBenchmark && <td className="px-6 py-2"></td>}
                </tr>
                {g.rows.map((r, i) => (
                  <tr key={i} className="border-b border-border last:border-b-0">
                    <td className="px-6 py-2.5 text-text-primary pl-8">{r.indicator}</td>
                    <td className="px-6 py-2.5 text-text-secondary">{r.actual}</td>
                    <td className="px-6 py-2.5 tabular-nums text-text-primary text-right">{r.score}</td>
                    <td className="px-6 py-2.5 tabular-nums text-text-secondary text-right">{r.max}</td>
                    <td className="px-6 py-2.5 tabular-nums text-text-secondary text-right">{r.pct}%</td>
                  {showBenchmark && (
                    <td className="px-6 py-2.5 text-text-secondary">{r.benchmark}</td>
                  )}
                </tr>
              ))}
              </React.Fragment>
            ))}
            <tr
              className={`${isFinal ? 'bg-danger' : 'bg-primary'} text-card-white border-t-2 border-border`}
            >
              <td className="px-6 py-3 font-bold uppercase" colSpan={2}>
                {isFinal ? 'CRG AGGREGATE' : title.split(' ')[1] + ' TOTAL'}
              </td>
              <td className="px-6 py-3 font-bold tabular-nums text-right">{totalScore}</td>
              <td className="px-6 py-3 font-bold tabular-nums text-right">{totalMax}</td>
              <td className="px-6 py-3 font-bold tabular-nums text-right">{totalPct.toFixed(1)}%</td>
              {showBenchmark && (
                <td className="px-6 py-3 font-bold">{totalRating}</td>
              )}
              {!showBenchmark && (
                <td className="px-6 py-3 font-bold text-right" colSpan={1}>
                  {totalRating}
                </td>
              )}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function CRGTab() {
  const [downloading, setDownloading] = useState(false)

  const handleDownload = () => {
    if (downloading) return
    setDownloading(true)
    setTimeout(() => {
      const link = document.createElement('a')
      link.href = '/OSML-CRG-30062025.xls'
      link.download = 'OSML-CRG-30062025.xls'
      link.click()
      setDownloading(false)
    }, 800)
  }

  return (
    <div className="space-y-8 pb-8">
      {/* SECTION 1 — CRG SCORE SUMMARY */}
      <section className="rounded-xl border border-border bg-card-white p-7 shadow-sm lg:p-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-stretch lg:justify-between">
          {/* Left block */}
          <div className="flex flex-col items-start justify-center lg:w-1/3">
            <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              CRG Score
            </p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-[56px] font-bold leading-none text-text-primary">29</span>
              <span className="text-2xl font-bold text-text-secondary">/ 60</span>
            </div>
            <p className="mt-1 text-lg font-semibold text-text-secondary">48.3%</p>
            <div className="mt-4 inline-flex items-center justify-center rounded-full border border-[#FECACA] bg-[#FEF2F2] px-4 py-1.5 text-base font-bold text-[#B91C1C]">
              Substandard
            </div>
            <div className="mt-6 h-2.5 w-full max-w-[240px] overflow-hidden rounded-full bg-border">
              <div className="h-full rounded-full bg-danger" style={{ width: '48.3%' }} />
            </div>
            <p className="mt-3 text-xs text-text-secondary">
              Bangladesh Bank CRG Grade: Substandard (35–44 range)
            </p>
          </div>

          {/* Center block */}
          <div className="flex flex-col justify-center gap-4 lg:w-1/3 lg:border-l lg:border-r lg:border-border lg:px-8">
            <div className="rounded-lg border border-border bg-surface p-4">
              <p className="text-xs font-semibold text-text-secondary">Quantitative</p>
              <div className="mt-1 flex items-center justify-between">
                <p className="font-bold text-text-primary">18 / 40 = 45.0%</p>
                <span className="rounded-md bg-warning/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-warning ring-1 ring-warning/30">
                  Marginal
                </span>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-surface p-4">
              <p className="text-xs font-semibold text-text-secondary">Qualitative</p>
              <div className="mt-1 flex items-center justify-between">
                <p className="font-bold text-text-primary">11 / 20 = 55.0%</p>
                <span className="rounded-md bg-warning/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-warning ring-1 ring-warning/30">
                  Marginal
                </span>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-surface p-4">
              <p className="text-xs font-semibold text-text-secondary">Overall</p>
              <div className="mt-1 flex items-center justify-between">
                <p className="font-bold text-text-primary">29 / 60 = 48.3%</p>
                <span className="rounded-md bg-danger/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-danger ring-1 ring-danger/30">
                  Substandard
                </span>
              </div>
            </div>
          </div>

          {/* Right block */}
          <div className="flex flex-col justify-center lg:w-1/3 lg:pl-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Bangladesh Bank Grade Reference
            </p>
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-border text-text-secondary">
                  <th className="py-1.5 font-medium">Grade</th>
                  <th className="py-1.5 font-medium">Score</th>
                  <th className="py-1.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="py-1.5 text-text-primary">Superior</td>
                  <td className="py-1.5 text-text-secondary">85–100</td>
                  <td className="py-1.5 text-text-secondary">—</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-1.5 text-text-primary">Good</td>
                  <td className="py-1.5 text-text-secondary">75–84</td>
                  <td className="py-1.5 text-text-secondary">—</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-1.5 text-text-primary">Acceptable</td>
                  <td className="py-1.5 text-text-secondary">65–74</td>
                  <td className="py-1.5 text-text-secondary">—</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-1.5 text-text-primary">Marginal/Watch</td>
                  <td className="py-1.5 text-text-secondary">55–64</td>
                  <td className="py-1.5 text-text-secondary">—</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-1.5 text-text-primary">Special Mention</td>
                  <td className="py-1.5 text-text-secondary">45–54</td>
                  <td className="py-1.5 text-text-secondary">—</td>
                </tr>
                <tr className="bg-warning/10 font-semibold text-warning">
                  <td className="py-1.5 pl-2">Substandard</td>
                  <td className="py-1.5">35–44</td>
                  <td className="py-1.5 pr-2">← This borrower</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-1.5 text-text-primary">Doubtful</td>
                  <td className="py-1.5 text-text-secondary">25–34</td>
                  <td className="py-1.5 text-text-secondary">—</td>
                </tr>
                <tr>
                  <td className="py-1.5 text-text-primary">Bad & Loss</td>
                  <td className="py-1.5 text-text-secondary">&lt;25</td>
                  <td className="py-1.5 text-text-secondary">—</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SECTION 2 — CRG QUANTITATIVE TABLE */}
      <IndicatorTable
        title="CRG Quantitative Indicators (40 marks)"
        groups={QUANT_GROUPS}
        totalScore={18}
        totalMax={40}
        totalPct={45.0}
        totalRating="Marginal"
        showBenchmark
      />

      {/* SECTION 3 — CRG QUALITATIVE TABLE */}
      <IndicatorTable
        title="CRG Qualitative Indicators (20 marks)"
        groups={QUAL_GROUPS}
        totalScore={11}
        totalMax={20}
        totalPct={55.0}
        totalRating="Marginal"
      />

      <IndicatorTable
        title="CRG Aggregate"
        groups={[]}
        totalScore={29}
        totalMax={60}
        totalPct={48.3}
        totalRating="Substandard"
        isFinal
      />

      {/* SECTION 4 — RISK FLAG AND MITIGATING FACTOR PANEL */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border border-l-4 border-l-danger bg-card-white p-6 shadow-sm">
          <div className="flex items-center gap-2 border-b border-border pb-4">
            <AlertTriangle className="h-5 w-5 text-danger" strokeWidth={2} aria-hidden />
            <h3 className="text-base font-bold text-text-primary">Risk Flags</h3>
          </div>
          <ul className="mt-4 space-y-4">
            {[
              'Quantitative score 45% — below 50% comfort threshold',
              'Stock Turnover Days at 824 days — critically high inventory lock-up',
              'Financial Debt to Operating Cash Flow at 29.8× — severe cash generation weakness',
              'Total Debt/Equity rising 3 years: 3.51 → 3.71 → 3.99',
              'Cash Ratio near zero at 0.006 — minimal liquidity buffer',
            ].map((text, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-text-primary">
                <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-danger" strokeWidth={2} />
                <span className="leading-relaxed">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-border border-l-4 border-l-success bg-card-white p-6 shadow-sm">
          <div className="flex items-center gap-2 border-b border-border pb-4">
            <CheckCircle2 className="h-5 w-5 text-success" strokeWidth={2} aria-hidden />
            <h3 className="text-base font-bold text-text-primary">Mitigating Factors</h3>
          </div>
          <ul className="mt-4 space-y-4">
            {[
              'CIB Status: Standard — no adverse classification in 3 years',
              'DSCR above 1.0× — debt obligations being serviced',
              'Management experience >10 years in textile sector',
              'Faultless account conduct with BRAC Bank (>3 years)',
              'Trade debtor collection improved significantly: 196 days → 89 days',
            ].map((text, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-text-primary">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-success" strokeWidth={2} />
                <span className="leading-relaxed">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* SECTION 5 — ANALYST RECOMMENDATION */}
      <section className="rounded-r-[10px] border border-border border-l-4 border-l-primary bg-[#F0F7FF] px-7 py-5 shadow-sm">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary" strokeWidth={2.5} aria-hidden />
          <h3 className="text-sm font-bold text-primary">Analyst Observation</h3>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-text-primary">
          "Outpace Spinning Mills Ltd. presents a mixed credit profile with Substandard CRG grading (29/60 — 48.3%). While qualitative factors are strong — particularly management experience, clean CIB status, and faultless account conduct — the quantitative metrics reveal significant structural stress. Leverage ratios continue to deteriorate, stock inventory lock-up has worsened sharply to 824 days, and the near-zero cash ratio indicates very limited liquidity headroom. The decline in DSCR from 1.71× to 1.23× before recovering marginally to 1.42× warrants close monitoring. Bangladesh Bank guidelines require enhanced scrutiny at Substandard grade. Any renewal or enhancement should be supported by a strong management undertaking, enhanced collateral, and a clear debt reduction roadmap."
        </p>
        <p className="mt-4 text-xs italic text-text-secondary">
          — Md. Matiur Rahman, SRM | Large Corporate Unit 04 | BRAC Bank PLC
        </p>
      </section>

      {/* SECTION 6 — DOWNLOAD BUTTON */}
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
              Download CRG Workbook
            </>
          )}
        </button>
      </div>
    </div>
  )
}
