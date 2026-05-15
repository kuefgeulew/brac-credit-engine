import { Copy, Sparkles } from 'lucide-react'
import type { ReactNode } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { MockData } from '../types/mockData'
import Toast from './Toast'

const SEGMENT_FIELDS = [
  { field: 'completeness' as const, label: 'Completeness' },
  { field: 'consistency' as const, label: 'Consistency' },
  { field: 'auditorQuality' as const, label: 'Auditor Quality' },
  { field: 'cashFlowMatch' as const, label: 'Cash Flow Match' },
  { field: 'taxAlignment' as const, label: 'Tax Alignment' },
] as const

function assessmentTone(assessment: MockData['reliabilityScores']['assessment']) {
  if (assessment === 'High Reliability') return { tone: 'green' as const }
  if (assessment === 'Moderate Reliability') return { tone: 'amber' as const }
  return { tone: 'red' as const }
}

function buildFullNarrativeText(data: MockData) {
  const ns = data.narrativeSections
  const sections = [
    ns.executiveSummary,
    ns.financialPerformance,
    ns.liquidityWorkingCapital,
    ns.leverageDebt,
    ns.covenantCompliance,
    ns.riskFlags,
    ns.recommendation,
  ].join('\n\n')
  return `${sections}\n\n---\n\n${data.narrative}`
}

function countWords(s: string) {
  return s
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length
}

/** Minutes from word count ÷ 200, rounded up to nearest 0.5. */
function estimateReadMinutesFromWords(words: number) {
  if (words <= 0) return 0
  return Math.ceil((words / 200) * 2) / 2
}

function formatReadMinutes(m: number) {
  if (m === 0) return '0 min'
  if (Number.isInteger(m)) return `${m} min`
  return `${m.toFixed(1)} min`
}

export default function NarrativeTab({
  mockData,
}: {
  mockData: MockData
}) {
  const [toastOpen, setToastOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const closeToast = useCallback(() => setToastOpen(false), [])
  const { narrative, narrativeSections, reliabilityScores } = mockData

  const band = useMemo(() => assessmentTone(reliabilityScores.assessment), [reliabilityScores.assessment])

  const fullNarrativeText = useMemo(() => buildFullNarrativeText(mockData), [mockData])
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

  const bannerClass =
    band.tone === 'green'
      ? 'border-[#BBF7D0] bg-[#F0FDF4]'
      : band.tone === 'amber'
        ? 'border-[#FDE68A] bg-[#FFFBEB]'
        : 'border-[#FECACA] bg-[#FEF2F2]'

  return (
    <div className="space-y-6 pb-6">
      <section
        className={`flex flex-col gap-6 rounded-xl border-2 px-7 py-5 print:hidden lg:flex-row lg:items-center lg:justify-between ${bannerClass}`}
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
            Financial Statement Reliability Score
          </p>
          <p className="mt-1 text-[32px] font-bold leading-none text-text-primary">
            {reliabilityScores.total} / 100
          </p>
          <p className="mt-2 text-sm font-semibold text-text-primary">{reliabilityScores.assessment}</p>
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
                Review, edit, and approve before submission
              </p>
            </div>
            <MemoBody narrativeSections={narrativeSections} narrative={narrative} />
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
              onClick={() => setToastOpen(true)}
              className="inline-flex h-11 items-center justify-center rounded-lg bg-success px-5 text-sm font-bold text-card-white transition-colors hover:bg-success/90"
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
          {mockData.borrower} · Reliability {reliabilityScores.total}/100 ({reliabilityScores.assessment})
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
          <div className="border-t border-border pt-3">
            <p className="font-bold text-text-primary">Source narrative</p>
            <p className="mt-1 whitespace-pre-line text-text-secondary">{narrative}</p>
          </div>
        </div>
      </div>

      <Toast
        open={toastOpen}
        message="Review approved and submitted to credit committee"
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
    <div className="border-t border-border pt-6 first:border-t-0 first:pt-0">
      <h3 className="text-sm font-bold text-primary">
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
  narrative,
}: {
  narrativeSections: MockData['narrativeSections']
  narrative: string
}) {
  return (
    <div className="space-y-2">
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

      <div className="border-t border-border pt-6">
        <h3 className="text-xs font-bold uppercase tracking-wide text-text-secondary">
          Source narrative (filing summary)
        </h3>
        <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-text-secondary">
          {narrative}
        </p>
      </div>
    </div>
  )
}
