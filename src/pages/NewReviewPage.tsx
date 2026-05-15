import { AlertCircle, Check, ChevronDown, FileText, Upload, X, XCircle } from 'lucide-react'
import type { ChangeEvent, DragEvent } from 'react'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProcessingStrip from '../components/ProcessingStrip'
import { useDemo } from '../context/useDemo'

const AUDIT_FIRMS = [
  {
    key: 'aqasem',
    label: 'A. Qasem & Co.',
    subtitle: 'ICAB registered — Dhaka practice',
  },
  {
    key: 'rrh',
    label: 'Rahman Rahman Huq & Co. (KPMG Bangladesh)',
    subtitle: 'Big 4 affiliated — KPMG Bangladesh',
  },
  {
    key: 'howladar',
    label: 'M/S Howladar Yunus & Co.',
    subtitle: 'ICAB registered — Dhaka practice',
  },
  {
    key: 'syful',
    label: 'Syful Shamsul Alam & Co.',
    subtitle: 'ICAB registered — Dhaka practice',
  },
  {
    key: 'islam',
    label: 'Islam Afzal Parsons & Co.',
    subtitle: 'ICAB registered — Dhaka practice',
  },
] as const

type FirmKey = (typeof AUDIT_FIRMS)[number]['key']

function formatFileSize(bytes: number) {
  if (bytes >= 1024 * 1024) {
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(1)} MB`
  }
  if (bytes >= 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }
  return `${bytes} B`
}

function isPdfFile(file: File) {
  const lower = file.name.toLowerCase()
  return file.type === 'application/pdf' || lower.endsWith('.pdf')
}

function truncateFileName(name: string, max = 40) {
  if (name.length <= max) return name
  return `${name.slice(0, max)}…`
}

type StepperStatus = 'complete' | 'active' | 'upcoming'

function StepperCircle({
  stepNum,
  status,
}: {
  stepNum: number
  status: StepperStatus
}) {
  if (status === 'complete') {
    return (
      <div
        className="box-border flex size-9 shrink-0 items-center justify-center rounded-full bg-success text-card-white ring-2 ring-success/30"
        aria-hidden
      >
        <Check className="h-4 w-4" strokeWidth={2.5} />
      </div>
    )
  }
  if (status === 'active') {
    return (
      <div
        className="box-border flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-card-white"
        aria-current="step"
      >
        {stepNum}
      </div>
    )
  }
  return (
    <div className="box-border flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-[#D0DCF0] bg-card-white text-sm font-semibold text-text-secondary">
      {stepNum}
    </div>
  )
}

function StepperLine({ complete }: { complete: boolean }) {
  return (
    <div
      className={`mx-1 h-0.5 min-w-[24px] flex-1 rounded-full transition-colors duration-300 ${
        complete ? 'bg-success' : 'bg-[#D0DCF0]'
      }`}
      aria-hidden
    />
  )
}

export default function NewReviewPage() {
  const navigate = useNavigate()
  const { showProcessingAnimation } = useDemo()
  const listboxId = useId()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [selectedKey, setSelectedKey] = useState<FirmKey | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [procStage, setProcStage] = useState<0 | 1 | 2 | 3 | 4>(0)
  const [runAnalysisGuardError, setRunAnalysisGuardError] = useState(false)
  const [dropzoneRejectPdf, setDropzoneRejectPdf] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const dragDepthRef = useRef(0)
  const dropzoneRejectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const selectedFirm = selectedKey
    ? AUDIT_FIRMS.find((f) => f.key === selectedKey)
    : null

  const canRun = Boolean(selectedKey && file && !isProcessing)

  const showRunAnalysisGuardError = runAnalysisGuardError && !canRun

  useEffect(() => {
    return () => {
      if (dropzoneRejectTimerRef.current) window.clearTimeout(dropzoneRejectTimerRef.current)
    }
  }, [])

  useEffect(() => {
    if (!isProcessing) return
    const main = document.querySelector('main.main-scroll') as HTMLElement | null
    const prevMainOverflow = main?.style.overflow ?? ''
    const prevHtmlOverflow = document.documentElement.style.overflow
    const prevBodyOverflow = document.body.style.overflow
    if (main) main.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    return () => {
      if (main) main.style.overflow = prevMainOverflow
      document.documentElement.style.overflow = prevHtmlOverflow
      document.body.style.overflow = prevBodyOverflow
    }
  }, [isProcessing])

  const handleProcStage = useCallback((s: 1 | 2 | 3 | 4) => {
    setProcStage(s)
  }, [])

  useEffect(() => {
    if (!dropdownOpen) return
    function closeIfOutside(e: Event) {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setDropdownOpen(false)
    }
    document.addEventListener('pointerdown', closeIfOutside, true)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', closeIfOutside, true)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [dropdownOpen])

  const assignPdf = (next: File | null) => {
    if (!next) {
      setFile(null)
      return
    }
    if (!isPdfFile(next)) {
      setDropzoneRejectPdf(true)
      if (dropzoneRejectTimerRef.current) window.clearTimeout(dropzoneRejectTimerRef.current)
      dropzoneRejectTimerRef.current = window.setTimeout(() => {
        setDropzoneRejectPdf(false)
        dropzoneRejectTimerRef.current = null
      }, 3000)
      return
    }
    setDropzoneRejectPdf(false)
    setFile(next)
  }

  function handleFileInputChange(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f) assignPdf(f)
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    dragDepthRef.current = 0
    setDragOver(false)
    const f = e.dataTransfer.files?.[0]
    if (f) assignPdf(f)
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }

  function handleDragEnter(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    dragDepthRef.current += 1
    setDragOver(true)
  }

  function handleDragLeave(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    dragDepthRef.current -= 1
    if (dragDepthRef.current <= 0) {
      dragDepthRef.current = 0
      setDragOver(false)
    }
  }

  function clearFile(e?: React.MouseEvent) {
    e?.stopPropagation()
    setFile(null)
    setProcStage(0)
    setIsProcessing(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function handleRunAnalysis() {
    if (!canRun || !selectedKey || !selectedFirm) {
      setRunAnalysisGuardError(true)
      return
    }
    setRunAnalysisGuardError(false)
    if (!showProcessingAnimation) {
      navigate('/results', { state: { firmKey: selectedKey } })
      return
    }
    setProcStage(1)
    setIsProcessing(true)
  }

  const step1Complete = Boolean(selectedKey)
  const step2Complete = Boolean(file)
  const step3Complete = procStage === 4

  function step1Status(): StepperStatus {
    if (step1Complete) return 'complete'
    return 'active'
  }

  function step2Status(): StepperStatus {
    if (step2Complete) return 'complete'
    if (step1Complete) return 'active'
    return 'upcoming'
  }

  function step3Status(): StepperStatus {
    if (step3Complete) return 'complete'
    if (isProcessing) return 'active'
    return 'upcoming'
  }

  return (
    <div className="p-6">
      <div className="mx-auto max-w-[720px] rounded-2xl border border-border bg-card-white p-10 shadow-sm">
        <h1 className="text-[22px] font-bold leading-tight text-text-primary">
          New Credit Review
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          Upload audited financial statements and select the preparing audit firm
        </p>

        {/* Stepper */}
        <div className="mt-8" aria-label="Review progress">
          <div className="flex items-center justify-between gap-1">
            <div className="flex flex-col items-center gap-2">
              <StepperCircle stepNum={1} status={step1Status()} />
              <span className="text-center text-[11px] font-medium text-text-secondary">
                Firm
              </span>
            </div>
            <StepperLine complete={step1Complete} />
            <div className="flex flex-col items-center gap-2">
              <StepperCircle stepNum={2} status={step2Status()} />
              <span className="text-center text-[11px] font-medium text-text-secondary">
                File
              </span>
            </div>
            <StepperLine complete={step2Complete} />
            <div className="flex flex-col items-center gap-2">
              <StepperCircle stepNum={3} status={step3Status()} />
              <span className="text-center text-[11px] font-medium text-text-secondary">
                Analysis
              </span>
            </div>
          </div>
        </div>

        <section className="mt-10">
          <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
            Audit firm
          </p>

          <div className="relative mt-3" ref={dropdownRef}>
            <button
              type="button"
              id={listboxId}
              aria-haspopup="listbox"
              aria-expanded={dropdownOpen}
              onClick={() => setDropdownOpen((o) => !o)}
              className="flex w-full items-center justify-between gap-3 rounded-lg border border-border bg-card-white px-4 py-3 text-left text-sm font-medium text-text-primary shadow-sm transition-colors hover:border-primary/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <span className={selectedFirm ? 'text-text-primary' : 'text-text-secondary'}>
                {selectedFirm?.label ?? 'Select an audit firm…'}
              </span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-text-secondary transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                aria-hidden
              />
            </button>

            {dropdownOpen && (
              <ul
                role="listbox"
                aria-labelledby={listboxId}
                className="absolute z-20 mt-1 max-h-[min(240px,45vh)] w-full overflow-y-auto overflow-x-hidden rounded-lg border border-border bg-card-white py-1 shadow-lg"
              >
                {AUDIT_FIRMS.map((firm) => {
                  const selected = selectedKey === firm.key
                  return (
                    <li key={firm.key} role="presentation">
                      <button
                        type="button"
                        role="option"
                        aria-selected={selected}
                        className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-surface ${
                          selected ? 'bg-primary/5' : ''
                        }`}
                        onClick={() => {
                          setSelectedKey(firm.key)
                          setDropdownOpen(false)
                        }}
                      >
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-bold text-text-primary">
                            {firm.label}
                          </span>
                          <span className="mt-0.5 block text-xs text-text-secondary">
                            {firm.subtitle}
                          </span>
                        </span>
                        <Check
                          className={`mt-0.5 h-5 w-5 shrink-0 text-primary ${selected ? '' : 'invisible'}`}
                          strokeWidth={2.5}
                          aria-hidden
                        />
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </section>

        <section className="mt-10">
          <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
            Financial statements (PDF)
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,.pdf"
            className="sr-only"
            onChange={handleFileInputChange}
          />

          <div
            role="presentation"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onClick={() => {
              if (!file) fileInputRef.current?.click()
            }}
            className={`mt-3 flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 px-4 py-4 text-center transition-[border-color,background-color,border-style] duration-200 ease-out ${
              dropzoneRejectPdf
                ? 'border-danger bg-danger/10'
                : file
                  ? 'border-dashed border-primary/40 bg-surface hover:border-primary/60'
                  : dragOver
                    ? 'border-solid border-[#0052A5] bg-[#EFF6FF]'
                    : 'border-dashed border-primary/40 bg-surface hover:border-primary/60'
            }`}
          >
            {!file ? (
              dropzoneRejectPdf ? (
                <>
                  <XCircle className="h-8 w-8 text-danger" strokeWidth={2} aria-hidden />
                  <p className="mt-2 text-sm font-semibold text-danger">
                    Only PDF files are accepted
                  </p>
                </>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-primary" strokeWidth={1.75} aria-hidden />
                  <p className="mt-2 text-sm font-medium text-text-primary">
                    Drag and drop PDF here
                  </p>
                  <button
                    type="button"
                    className="mt-1 text-sm font-semibold text-primary hover:text-primary-dark hover:underline"
                    onClick={(e) => {
                      e.stopPropagation()
                      fileInputRef.current?.click()
                    }}
                  >
                    or Browse Files
                  </button>
                </>
              )
            ) : (
              <div
                role="group"
                aria-label="Selected file"
                className="flex w-full max-w-full items-center gap-3 rounded-lg border border-border bg-card-white px-4 py-3 text-left shadow-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <FileText
                  className="h-9 w-9 shrink-0 text-primary"
                  strokeWidth={1.75}
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-text-primary">
                    {truncateFileName(file.name)}
                  </p>
                  <p className="mt-0.5 text-xs text-text-secondary">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    clearFile()
                  }}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-danger transition-colors hover:bg-danger/10"
                  aria-label="Remove file"
                >
                  <X className="h-5 w-5" strokeWidth={2} />
                </button>
              </div>
            )}
          </div>

          {file ? (
            <button
              type="button"
              className="mt-2 text-sm font-semibold text-primary hover:text-primary-dark hover:underline"
              onClick={() => fileInputRef.current?.click()}
            >
              Replace file
            </button>
          ) : null}
        </section>

        <section className="mt-10">
          <button
            type="button"
            disabled={!canRun}
            onClick={handleRunAnalysis}
            className="flex h-[52px] w-full items-center justify-center rounded-[10px] bg-primary text-sm font-bold text-card-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-text-secondary/30 disabled:text-card-white/80"
          >
            Run Analysis →
          </button>
          {showRunAnalysisGuardError ? (
            <p className="mt-3 flex items-start justify-center gap-2 text-center text-sm font-medium text-danger">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
              <span>
                Please select an audit firm and upload a financial statement before running analysis
              </span>
            </p>
          ) : null}

          {isProcessing && selectedKey && selectedFirm && (
            <ProcessingStrip
              firmKey={selectedKey}
              firmDisplayName={selectedFirm.label}
              onStageChange={handleProcStage}
            />
          )}
        </section>
      </div>
    </div>
  )
}
