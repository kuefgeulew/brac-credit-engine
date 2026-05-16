import { Copy, Sparkles } from 'lucide-react'
import type { ReactNode } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import Toast from './Toast'

const SEGMENT_FIELDS = [
  { field: 'completeness' as const, label: 'Completeness' },
  { field: 'consistency' as const, label: 'Consistency' },
  { field: 'auditorQuality' as const, label: 'Auditor Quality' },
  { field: 'cashFlowMatch' as const, label: 'Cash Flow Match' },
  { field: 'taxAlignment' as const, label: 'Tax Alignment' },
] as const

const OSML_NARRATIVE = {
  narrativeSections: {
    executiveSummary: "Outpace Spinning Mills Ltd. (OSML), a Private Limited Company under the Outright Group, is engaged in textile manufacturing (Industry Code 102). The company maintains a Standard CIB status with no adverse classification in the preceding three years. The ICRR aggregate score stands at 50.5/100 (Unacceptable) driven by weak quantitative performance, while the CRG score is 29/60 (Substandard, 48.3%), placing the borrower under heightened regulatory scrutiny.",
    financialPerformance: "Revenue declined from BDT 1,736.1M in FY2024 to BDT 1,412.8M in FY2025, a contraction of 18.6%, following a period of strong growth in FY2024. Net profit improved marginally by 11.5% to BDT 77.6M in FY2025, supported by a reduction in interest expenses from BDT 118.8M to BDT 80.3M. EBITDA margin remained under pressure at 13.8% in FY2025, down from 16.2% in FY2023, reflecting structural cost absorption challenges in the textile sector.",
    liquidityWorkingCapital: "The current ratio of 1.041× in FY2025 indicates a thin liquidity buffer with current assets marginally covering current liabilities. The cash ratio of 0.006 is critically low, suggesting near-zero cash reserves relative to short-term obligations. Stock Turnover Days worsened sharply to 824 days in FY2025 from 378 days in FY2024, indicating significant inventory accumulation that may reflect sales slowdown or procurement-cycle mismanagement.",
    leverageDebt: "Total financial debt grew from BDT 2,050M in FY2023 to BDT 3,135M in FY2025, representing a 52.9% increase over three years. The Debt-to-Equity ratio has deteriorated continuously: 3.51× (FY2023) → 3.71× (FY2024) → 3.99× (FY2025), indicating increasing leverage with no sign of deleveraging. Long-term loan exposure declined from BDT 157.9M to BDT 128.7M, but short-term borrowing increased substantially to BDT 2,949M, raising rollover risk concerns.",
    covenantCompliance: "No formal covenant breaches have been recorded in the current review period. The DSCR of 1.42× in FY2025 satisfies the minimum threshold of 1.0×, though the declining trend from 1.71× in FY2023 warrants continuous monitoring. Interest coverage at 2.16× remains above the 1.5× minimum, providing a modest but adequate buffer. Operating cash flow turned positive in FY2025 at BDT 105.2M after a severe outflow of BDT (723.2M) in FY2023, representing a meaningful recovery.",
    riskFlags: "The primary risk concern is the dramatic increase in stock turnover days to 824 days, suggesting inventory financing risk of significant magnitude. The near-zero cash ratio and high short-term borrowing concentration create refinancing vulnerability. Financial Debt to Operating Cash Flow at 29.8× far exceeds the 3× comfort threshold, indicating that current cash generation is insufficient to service the debt load within a reasonable timeframe. The unaudited nature of the financial statements, prepared by a non-BSEC-listed firm, introduces additional reliability risk.",
    recommendation: "Given the Substandard CRG grade and Unacceptable ICRR score driven by quantitative weakness, the analyst recommends conditional renewal of existing facilities subject to: (i) submission of audited FY2025 financial statements from a BSEC-recognized audit firm within 90 days; (ii) a credible inventory liquidation plan with quarterly milestones; (iii) enhanced primary collateral coverage to a minimum of 50% of facility value; and (iv) mandatory monthly account monitoring with early warning triggers. Facility enhancement or new exposure is not recommended at the current risk grade."
  },
  reliabilityScores: {
    completeness: 15,
    consistency: 14,
    auditorQuality: 8,
    cashFlowMatch: 13,
    taxAlignment: 12,
    total: 62,
    assessment: "Moderate Reliability"
  }
}

function buildFullNarrativeText() {
  const ns = OSML_NARRATIVE.narrativeSections
  const sections = [
    ns.executiveSummary,
    ns.financialPerformance,
    ns.liquidityWorkingCapital,
    ns.leverageDebt,
    ns.covenantCompliance,
    ns.riskFlags,
    ns.recommendation,
  ].join('\n\n')
  return sections
}

function countWords(s: string) {
  return s
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length
}

function estimateReadMinutesFromWords(words: number) {
  if (words <= 0) return 0
  return Math.ceil((words / 200) * 2) / 2
}

function formatReadMinutes(m: number) {
  if (m === 0) return '0 min'
  if (Number.isInteger(m)) return `${m} min`
  return `${m.toFixed(1)} min`
}

export default function NarrativeTab() {
  const [toastOpen, setToastOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [copied, setCopied] = useState(false)
  const closeToast = useCallback(() => {
    setToastOpen(false)
    setIsSubmitting(false)
  }, [])
  
  const { narrativeSections, reliabilityScores } = OSML_NARRATIVE

  const fullNarrativeText = useMemo(() => buildFullNarrativeText(), [])
  const wordCount = useMemo(() => countWords(fullNarrativeText), [fullNarrativeText])
  const characterCount = fullNarrativeText.length
  const readMinutes = useMemo(() => estimateReadMinutesFromWords(wordCount), [wordCount])

  useEffect(() => {
    if (!copied) return
    const t = window.setTimeout(() => setCopied(false), 2000)
    return () => window.clearTimeout(t)
  }, [copied])

  const handleMemoPrint = useCallback(() => {
    document.body.classList.add('print-memo-only')
    requestAnimationFrame(() => {
      window.print()
    })
  }, [])

  useEffect(() => {
    const clearMemoPrint = () => document.body.classList.remove('print-memo-only')
    window.addEventListener('afterprint', clearMemoPrint)
    return () => {
      window.removeEventListener('afterprint', clearMemoPrint)
      document.body.classList.remove('print-memo-only')
    }
  }, [])

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(fullNarrativeText)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }, [fullNarrativeText])

  return (
    <div className="space-y-6 pb-6">
      <section
        className="flex flex-col gap-6 rounded-xl border-2 px-7 py-5 print:hidden lg:flex-row lg:items-center lg:justify-between border-[#FCD34D] bg-[#FFFBEB]"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
            Financial Statement Reliability Score
          </p>
          <p className="mt-1 text-[32px] font-bold leading-none text-text-primary">
            {reliabilityScores.total} / 100
          </p>
          <p className="mt-2 text-sm font-semibold text-text-primary">{reliabilityScores.assessment}</p>
          <p className="mt-1 text-xs text-text-secondary max-w-sm">
            Unaudited statements prepared by Dewan Nazrul Islam & Co. — not BSEC listed.
          </p>
        </div>
        <div className="grid w-full max-w-xl grid-cols-1 gap-3 sm:grid-cols-5 lg:max-w-2xl">
          {SEGMENT_FIELDS.map(({ field, label }) => {
            const v = reliabilityScores[field]
            const pct = (v / 20) * 100
            const fill =
              v >= 16 ? 'bg-success' : v >= 12 ? 'bg-warning' : 'bg-danger'
            return (
              <div key={field} className="min-w-0">
                <p className="truncate text-[10px] font-medium uppercase tracking-wide text-text-secondary">
                  {label}
                </p>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-card-white/80 ring-1 ring-border">
                  <div
                    className={`h-full rounded-full ${fill}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="mt-0.5 text-xs font-semibold tabular-nums text-text-primary">
                  {v}/20
                </p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="narrative-memo-for-screen">
        <div className="overflow-hidden rounded-xl border border-border bg-card-white shadow-sm">
          <div className="memo-print-area main-scroll max-h-[min(70vh,720px)] overflow-y-auto px-6 py-8 sm:px-10 sm:py-10">
            <div className="mb-8 flex flex-col gap-1 border-b border-border pb-6">
              <div className="flex flex-wrap items-center gap-2">
                <Sparkles className="h-5 w-5 text-warning" strokeWidth={2} aria-hidden />
                <h2 className="text-lg font-bold text-text-primary">
                  AI-Generated Credit Review Memo
                </h2>
              </div>
              <p className="text-xs text-text-secondary">
                Outpace Spinning Mills Ltd. — Review Date: 26 December 2024 — Financials as at: 30 June 2024
              </p>
            </div>
            <MemoBody narrativeSections={narrativeSections} />
          </div>

          <div className="sticky bottom-0 z-20 flex flex-col gap-3 border-t border-border bg-card-white/95 px-4 py-4 backdrop-blur-sm print:hidden sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleMemoPrint}
              className="inline-flex h-11 items-center justify-center rounded-lg border-2 border-primary px-5 text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
            >
              Export as PDF
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => {
                if (isSubmitting) return
                setIsSubmitting(true)
                setToastOpen(true)
              }}
              className="inline-flex h-11 items-center justify-center rounded-lg bg-success px-5 text-sm font-bold text-card-white transition-colors hover:bg-success/90 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              Approve &amp; Submit
            </button>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card-white px-4 py-4 shadow-sm print:hidden sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-xs leading-relaxed text-text-secondary">
          <span className="font-semibold text-text-primary">Word count:</span>{' '}
          {wordCount.toLocaleString()}
          <span className="mx-2 text-border">·</span>
          <span className="font-semibold text-text-primary">Character count:</span>{' '}
          {characterCount.toLocaleString()}
          <span className="mx-2 text-border">·</span>
          <span className="font-semibold text-text-primary">Est. read time:</span>{' '}
          {formatReadMinutes(readMinutes)}
        </p>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 self-start rounded-lg border-2 border-primary px-4 text-sm font-semibold text-primary transition-colors hover:bg-primary/5 sm:self-auto"
        >
          <Copy className="h-4 w-4" strokeWidth={2} aria-hidden />
          {copied ? 'Copied!' : 'Copy to clipboard'}
        </button>
      </div>

      <div className="narrative-tab-print-only hidden border border-border bg-card-white p-5 text-sm text-text-primary print:block">
        <h3 className="text-sm font-bold text-text-primary">AI narrative (print)</h3>
        <p className="mt-1 text-xs text-text-secondary">
          Outpace Spinning Mills Ltd. · Reliability {reliabilityScores.total}/100 ({reliabilityScores.assessment})
        </p>
        <div className="mt-4 space-y-4 text-xs leading-relaxed">
          <div>
            <p className="font-bold text-text-primary">1. Executive summary</p>
            <p className="mt-1 whitespace-pre-line text-text-secondary">{narrativeSections.executiveSummary}</p>
          </div>
          <div>
            <p className="font-bold text-text-primary">2. Financial performance</p>
            <p className="mt-1 whitespace-pre-line text-text-secondary">{narrativeSections.financialPerformance}</p>
          </div>
          <div>
            <p className="font-bold text-text-primary">3. Liquidity &amp; working capital</p>
            <p className="mt-1 whitespace-pre-line text-text-secondary">{narrativeSections.liquidityWorkingCapital}</p>
          </div>
          <div>
            <p className="font-bold text-text-primary">4. Leverage &amp; debt</p>
            <p className="mt-1 whitespace-pre-line text-text-secondary">{narrativeSections.leverageDebt}</p>
          </div>
          <div>
            <p className="font-bold text-text-primary">5. Covenant compliance</p>
            <p className="mt-1 whitespace-pre-line text-text-secondary">{narrativeSections.covenantCompliance}</p>
          </div>
          <div>
            <p className="font-bold text-text-primary">6. Risk flags</p>
            <p className="mt-1 whitespace-pre-line text-text-secondary">{narrativeSections.riskFlags}</p>
          </div>
          <div>
            <p className="font-bold text-text-primary">7. Recommendation</p>
            <p className="mt-1 whitespace-pre-line text-text-secondary">{narrativeSections.recommendation}</p>
          </div>
        </div>
      </div>

      <Toast
        open={toastOpen}
        message="Review memo submitted to credit committee"
        onClose={closeToast}
      />
    </div>
  )
}

function Section({
  n,
  title,
  children,
}: {
  n: number
  title: string
  children: ReactNode
}) {
  return (
    <div className="border-t border-[#D0DCF0] pt-6 first:border-t-0 first:pt-0">
      <h3 className="text-sm font-bold text-[#0052A5]">
        {n}. {title}
      </h3>
      <div className="mt-3 space-y-2 text-sm leading-relaxed text-text-primary">{children}</div>
    </div>
  )
}

function SectionText({ text }: { text: string }) {
  return (
    <p className="whitespace-pre-line text-sm leading-relaxed text-text-primary">{text}</p>
  )
}

function MemoBody({
  narrativeSections,
}: {
  narrativeSections: typeof OSML_NARRATIVE.narrativeSections
}) {
  return (
    <div className="space-y-6">
      <Section n={1} title="Executive Summary">
        <SectionText text={narrativeSections.executiveSummary} />
      </Section>

      <Section n={2} title="Financial Performance Analysis">
        <SectionText text={narrativeSections.financialPerformance} />
      </Section>

      <Section n={3} title="Liquidity & Working Capital">
        <SectionText text={narrativeSections.liquidityWorkingCapital} />
      </Section>

      <Section n={4} title="Leverage & Debt Structure">
        <SectionText text={narrativeSections.leverageDebt} />
      </Section>

      <Section n={5} title="Covenant Compliance">
        <SectionText text={narrativeSections.covenantCompliance} />
      </Section>

      <Section n={6} title="Risk Flags & Early Warnings">
        <SectionText text={narrativeSections.riskFlags} />
      </Section>

      <Section n={7} title="Analyst Recommendation">
        <SectionText text={narrativeSections.recommendation} />
      </Section>
    </div>
  )
}
