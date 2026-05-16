import {
  BarChart3,
  Building2,
  ClipboardList,
  Download,
  FileDown,
  FileText,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import BorrowerHeaderStrip from '../components/BorrowerHeaderStrip'
import { osmlData } from '../mockData/aqasem'
import ICRRTab from '../components/results/ICRRTab'
import FSSTab from '../components/results/FSSTab'
import CRGTab from '../components/results/CRGTab'
import NarrativeTab from '../components/NarrativeTab'

type TabId = 'icrr' | 'fss' | 'crg' | 'narrative'

export default function ResultsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('icrr')

  useEffect(() => {
    document.title = `${osmlData.borrower} — Credit Review | BRAC Bank`
    return () => {
      document.title = 'BRAC Bank Credit Analysis Portal'
    }
  }, [])

  return (
    <div className="space-y-6 p-6">
      {/* PAGE HEADER */}
      <header className="flex flex-col gap-6 rounded-[12px] border border-[#D0DCF0] bg-white px-8 py-6 shadow-sm lg:flex-row lg:items-start lg:justify-between">
        {/* Left side */}
        <div className="min-w-0 space-y-3">
          <h2 className="text-[22px] font-bold leading-tight text-[#0D1B3E]">
            {osmlData.borrower}
          </h2>
          <div className="flex items-center gap-2 text-[14px] text-[#4A5568]">
            <Building2 className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
            <span>{osmlData.group}</span>
          </div>
          <div className="text-[14px] text-[#4A5568]">
            {osmlData.sector} · Industry Code {osmlData.industryCode}
          </div>
          <div className="flex items-center gap-2 pt-1">
            <span className="inline-flex items-center rounded-md bg-success/15 px-2 py-0.5 text-xs font-semibold text-success ring-1 ring-success/30">
              CIB: {osmlData.cibStatus}
            </span>
            <span className="inline-flex items-center rounded-md bg-warning/15 px-2 py-0.5 text-xs font-semibold text-warning ring-1 ring-warning/30">
              {osmlData.auditStatus}
            </span>
          </div>
        </div>

        {/* Right side */}
        <div className="flex shrink-0 flex-col items-stretch gap-4 sm:flex-row sm:items-center lg:flex-col lg:items-end">
          <div className="flex flex-col gap-2 sm:flex-row lg:flex-col lg:items-end">
            <div className="inline-flex items-center justify-center rounded-full border border-[#B91C1C] bg-[#B91C1C]/10 px-4 py-1.5 text-sm font-bold text-[#B91C1C]">
              Unacceptable — 50.5%
            </div>
            <div className="inline-flex items-center justify-center rounded-full border border-[#B91C1C] bg-[#B91C1C]/10 px-4 py-1.5 text-sm font-bold text-[#B91C1C]">
              Substandard — 29/60
            </div>
          </div>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <a
              href="/OSML-CRM-Memo.xlsx"
              download
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-success px-4 text-sm font-semibold text-white transition-colors hover:bg-success/90"
            >
              <FileDown className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
              Download CRM Memo
            </a>
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border-2 border-primary px-4 text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
            >
              <Download className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
              Download Full Report
            </button>
          </div>
        </div>
      </header>

      {/* BORROWER DETAIL STRIP */}
      <BorrowerHeaderStrip details={osmlData} />

      {/* AI BANNER STRIP */}
      <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] px-5 py-3 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3 sm:items-center">
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-warning sm:mt-0" strokeWidth={2} aria-hidden />
          <p className="text-sm text-[#0D1B3E]">
            <span className="font-bold">AI-Generated Analysis</span> — {osmlData.borrower} financial statements were processed by the BRAC Bank Credit Engine. Processing time: 4.2 seconds.
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center rounded-md bg-success/15 px-2.5 py-1 text-xs font-bold text-success ring-1 ring-success/30">
          Confidence: High
        </span>
      </div>

      {/* TAB BAR */}
      <div
        className="flex flex-nowrap items-stretch gap-0 overflow-x-auto border-b border-border"
        role="tablist"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'icrr'}
          className={`flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm transition-colors ${
            activeTab === 'icrr'
              ? 'border-[#0052A5] font-bold text-[#0052A5]'
              : 'border-transparent font-semibold text-text-secondary hover:text-text-primary'
          }`}
          onClick={() => setActiveTab('icrr')}
        >
          <ShieldCheck className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
          ICRR
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'fss'}
          className={`flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm transition-colors ${
            activeTab === 'fss'
              ? 'border-[#0052A5] font-bold text-[#0052A5]'
              : 'border-transparent font-semibold text-text-secondary hover:text-text-primary'
          }`}
          onClick={() => setActiveTab('fss')}
        >
          <BarChart3 className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
          FSS — Financial Spread
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'crg'}
          className={`flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm transition-colors ${
            activeTab === 'crg'
              ? 'border-[#0052A5] font-bold text-[#0052A5]'
              : 'border-transparent font-semibold text-text-secondary hover:text-text-primary'
          }`}
          onClick={() => setActiveTab('crg')}
        >
          <ClipboardList className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
          CRG
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'narrative'}
          className={`flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm transition-colors ${
            activeTab === 'narrative'
              ? 'border-[#0052A5] font-bold text-[#0052A5]'
              : 'border-transparent font-semibold text-text-secondary hover:text-text-primary'
          }`}
          onClick={() => setActiveTab('narrative')}
        >
          <FileText className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
          AI Narrative
        </button>
      </div>

      {/* TAB CONTENT */}
      <div className="mt-6" key={activeTab}>
        {activeTab === 'icrr' && <ICRRTab />}
        {activeTab === 'fss' && <FSSTab />}
        {activeTab === 'crg' && <CRGTab />}
        {activeTab === 'narrative' && <NarrativeTab />}
      </div>
    </div>
  )
}
