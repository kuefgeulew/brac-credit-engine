import {
  BarChart3,
  Building2,
  Calendar,
  Download,
  FileSpreadsheet,
  FileText,
  Loader2,
  SearchX,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import BorrowerHeaderStrip from '../components/BorrowerHeaderStrip'
import ExcelExportTab from '../components/ExcelExportTab'
import NarrativeTab from '../components/NarrativeTab'
import RatioDashboard from '../components/RatioDashboard'
import { mockData as aqasem } from '../mockData/aqasem'
import { mockData as howladar } from '../mockData/howladar'
import { mockData as islam } from '../mockData/islam'
import { mockData as rrh } from '../mockData/rrh'
import { mockData as syful } from '../mockData/syful'
import type { MockData } from '../types/mockData'
import { generatePDFReport } from '../utils/pdfExporter'

const MOCK_BY_KEY: Record<string, MockData> = {
  aqasem,
  rrh,
  howladar,
  syful,
  islam,
}

const FIRM_KEYS = new Set(Object.keys(MOCK_BY_KEY))

const DEFAULT_DOC_TITLE = 'BRAC Bank Credit Analysis Portal'

type ResultsLocationState = {
  firmKey?: string
}

type TabId = 'ratios' | 'excel' | 'narrative'

type ResultsSelection =
  | { kind: 'empty' }
  | { kind: 'ok'; selectedData: MockData }

function formatReviewDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function icrrBandBadgeClass(band: string): string {
  const b = band.trim().toLowerCase()
  if (b === 'strong') {
    return 'border-success/40 bg-success/15 text-success'
  }
  if (b === 'good') {
    return 'border-primary bg-primary/10 text-primary'
  }
  if (b === 'acceptable') {
    return 'border-warning/40 bg-warning/15 text-warning'
  }
  if (b === 'marginal') {
    return 'border-danger/40 bg-danger/15 text-danger'
  }
  return 'border-border bg-surface text-text-secondary'
}

function hasValidResultsSelection(state: unknown): state is ResultsLocationState {
  if (state == null || typeof state !== 'object') return false
  const fk = (state as ResultsLocationState).firmKey
  if (typeof fk !== 'string') return false
  const key = fk.trim()
  return key.length > 0 && FIRM_KEYS.has(key)
}

export default function ResultsPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabId>('ratios')
  const [pdfGenerating, setPdfGenerating] = useState(false)
  const pdfTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const selection = useMemo((): ResultsSelection => {
    const state: unknown = location.state
    if (!hasValidResultsSelection(state)) {
      return { kind: 'empty' }
    }
    const firmKey = (state as ResultsLocationState).firmKey!.trim()
    const selectedData: MockData = MOCK_BY_KEY[firmKey]
    return { kind: 'ok', selectedData }
  }, [location.state])

  useEffect(() => {
    if (selection.kind !== 'ok') {
      document.title = DEFAULT_DOC_TITLE
      return
    }
    document.title = `${selection.selectedData.borrower} — Credit Review | BRAC Bank`
    return () => {
      document.title = DEFAULT_DOC_TITLE
    }
  }, [selection])

  const handleDownloadReport = useCallback(() => {
    if (selection.kind !== 'ok' || pdfGenerating) return
    const data = selection.selectedData
    setPdfGenerating(true)
    if (pdfTimerRef.current) window.clearTimeout(pdfTimerRef.current)
    pdfTimerRef.current = window.setTimeout(() => {
      pdfTimerRef.current = null
      try {
        generatePDFReport(data)
      } finally {
        setPdfGenerating(false)
      }
    }, 800)
  }, [pdfGenerating, selection])

  useEffect(() => {
    return () => {
      if (pdfTimerRef.current) window.clearTimeout(pdfTimerRef.current)
    }
  }, [])

  if (selection.kind === 'empty') {
    return (
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center p-6">
        <div className="w-full max-w-md rounded-xl border border-border bg-card-white px-8 py-12 text-center shadow-sm">
          <SearchX
            className="mx-auto h-16 w-16 text-[#4A5568]"
            strokeWidth={1.5}
            aria-hidden
          />
          <h1 className="mt-6 text-xl font-bold text-text-primary">No Review Selected</h1>
          <p className="mt-2 text-sm text-text-secondary">
            Please start a new review from the dashboard
          </p>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="mt-8 inline-flex h-11 min-w-[200px] items-center justify-center rounded-lg bg-primary px-6 text-sm font-bold text-card-white transition-colors hover:bg-primary-dark"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const { selectedData } = selection
  const icrrLabel = `ICRR: ${selectedData.regulatory.icrrScore} — ${selectedData.regulatory.icrrBand}`

  return (
    <div className="results-print-root p-6">
      <h1 className="results-print-doc-title mb-6 hidden text-xl font-bold leading-tight text-text-primary print:block">
        BRAC Bank Credit Review Report — {selectedData.borrower}
      </h1>

      <header className="flex flex-col gap-6 rounded-xl border border-border bg-card-white px-8 py-6 shadow-sm lg:flex-row lg:items-start lg:justify-between print:border print:shadow-none">
        <div className="min-w-0 space-y-3">
          <h2 className="text-[22px] font-bold leading-tight text-text-primary print:text-xl">
            {selectedData.borrower}
          </h2>
          <div className="flex items-start gap-2 text-sm text-text-secondary">
            <Building2
              className="mt-0.5 h-4 w-4 shrink-0 text-text-secondary"
              strokeWidth={2}
              aria-hidden
            />
            <span>{selectedData.auditFirm}</span>
          </div>
          <div className="flex items-start gap-2 text-sm text-text-secondary">
            <Calendar
              className="mt-0.5 h-4 w-4 shrink-0 text-text-secondary"
              strokeWidth={2}
              aria-hidden
            />
            <span>{formatReviewDate(selectedData.reviewDate)}</span>
          </div>
        </div>

        <div className="results-print-actions flex shrink-0 flex-col items-stretch gap-4 sm:flex-row sm:items-center lg:flex-col lg:items-end print:hidden">
          <div
            className={`inline-flex min-h-[2.75rem] w-full min-w-0 max-w-[min(100%,340px)] items-center justify-center rounded-full border-2 px-6 py-2.5 text-center text-[17px] font-bold leading-snug sm:w-auto sm:min-w-[272px] ${icrrBandBadgeClass(selectedData.regulatory.icrrBand)}`}
          >
            {icrrLabel}
          </div>
          <button
            type="button"
            disabled={pdfGenerating}
            aria-busy={pdfGenerating}
            onClick={handleDownloadReport}
            className="inline-flex h-10 min-w-[168px] items-center justify-center gap-2 rounded-lg border-2 border-primary px-4 text-sm font-semibold text-primary transition-colors hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {pdfGenerating ? (
              <>
                <Loader2 className="h-4 w-4 shrink-0 animate-spin" strokeWidth={2} aria-hidden />
                Generating...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
                Download Report
              </>
            )}
          </button>
        </div>
      </header>

      <BorrowerHeaderStrip details={selectedData.borrowerDetails} />

      <div
        className="results-print-tablist mt-6 flex flex-nowrap items-stretch gap-0 overflow-x-hidden border-b border-border print:hidden"
        role="tablist"
        aria-label="Results sections"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'ratios'}
          className={`flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 px-3 py-3 text-sm transition-colors sm:px-4 ${
            activeTab === 'ratios'
              ? 'border-primary font-bold text-primary'
              : 'border-transparent font-semibold text-text-secondary hover:text-text-primary'
          }`}
          onClick={() => setActiveTab('ratios')}
        >
          <BarChart3 className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
          Ratio Dashboard
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'excel'}
          className={`flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 px-3 py-3 text-sm transition-colors sm:px-4 ${
            activeTab === 'excel'
              ? 'border-primary font-bold text-primary'
              : 'border-transparent font-semibold text-text-secondary hover:text-text-primary'
          }`}
          onClick={() => setActiveTab('excel')}
        >
          <FileSpreadsheet className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
          Excel Export
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'narrative'}
          className={`flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 px-3 py-3 text-sm transition-colors sm:px-4 ${
            activeTab === 'narrative'
              ? 'border-primary font-bold text-primary'
              : 'border-transparent font-semibold text-text-secondary hover:text-text-primary'
          }`}
          onClick={() => setActiveTab('narrative')}
        >
          <FileText className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
          AI Narrative
        </button>
      </div>

      <div className="results-print-stack mt-6 space-y-8">
        <section
          className={`results-print-section results-print-section-ratios ${activeTab === 'ratios' ? 'block' : 'hidden'} print:block`}
          aria-hidden={activeTab !== 'ratios'}
        >
          <h3 className="mb-3 hidden border-b border-border pb-2 text-base font-bold text-text-primary print:block">
            Tab 1 — Ratio Dashboard
          </h3>
          <RatioDashboard mockData={selectedData} />
        </section>

        <section
          className={`results-print-section results-print-section-excel ${activeTab === 'excel' ? 'block' : 'hidden'} print:block`}
          aria-hidden={activeTab !== 'excel'}
        >
          <h3 className="mb-3 hidden border-b border-border pb-2 text-base font-bold text-text-primary print:block">
            Tab 2 — Excel Export
          </h3>
          <ExcelExportTab mockData={selectedData} />
        </section>

        <section
          className={`results-print-section results-print-section-narrative ${activeTab === 'narrative' ? 'block' : 'hidden'} print:block`}
          aria-hidden={activeTab !== 'narrative'}
        >
          <h3 className="mb-3 hidden border-b border-border pb-2 text-base font-bold text-text-primary print:block">
            Tab 3 — AI Narrative
          </h3>
          <NarrativeTab mockData={selectedData} />
        </section>
      </div>
    </div>
  )
}
