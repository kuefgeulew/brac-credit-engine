import { CheckCircle, Loader2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

type ProcessingStage = 1 | 2 | 3 | 4

type ProcessingStripProps = {
  firmKey: string
  firmDisplayName: string
  onStageChange?: (stage: ProcessingStage) => void
}

function StepConnector({ complete }: { complete: boolean }) {
  return (
    <div className="flex justify-center py-0" aria-hidden>
      <div
        className={`h-6 w-[2px] shrink-0 rounded-full transition-colors duration-300 ${
          complete ? 'bg-[#BBF7D0]' : 'bg-[#D0DCF0]'
        }`}
      />
    </div>
  )
}

function ProcessingStepCard({
  title,
  subtitle,
  phase,
}: {
  title: string
  subtitle: string
  phase: 'pending' | 'loading' | 'done'
}) {
  const pending =
    phase === 'pending'
      ? 'border-[#D0DCF0] bg-card-white'
      : phase === 'loading'
        ? 'border-[#0052A5] bg-[#EFF6FF]'
        : 'border-[#BBF7D0] bg-[#F0FDF4]'

  const titleClass =
    phase === 'pending'
      ? 'text-[#4A5568]'
      : phase === 'loading'
        ? 'font-bold text-[#0052A5]'
        : 'font-bold text-[#1A7C4A]'

  const subtitleClass =
    phase === 'pending'
      ? 'text-[#4A5568]/80'
      : phase === 'loading'
        ? 'text-[#0052A5]/90'
        : 'text-[#1A7C4A]/90'

  return (
    <div
      className={`flex w-full items-start gap-3 rounded-[10px] border px-5 py-4 transition-colors duration-200 ${pending}`}
    >
      {phase === 'done' ? (
        <CheckCircle
          className="mt-0.5 h-5 w-5 shrink-0 text-[#1A7C4A]"
          strokeWidth={2}
          aria-hidden
        />
      ) : phase === 'loading' ? (
        <span className="mt-0.5 inline-flex shrink-0 animate-pulse">
          <Loader2
            className="h-5 w-5 animate-spin text-[#0052A5]"
            strokeWidth={2}
            aria-hidden
          />
        </span>
      ) : (
        <div
          className="mt-0.5 h-5 w-5 shrink-0 rounded-full border-2 border-[#D0DCF0] bg-transparent"
          aria-hidden
        />
      )}
      <div className="min-w-0 flex-1">
        <p className={`text-sm ${titleClass}`}>{title}</p>
        <p className={`mt-0.5 text-xs ${subtitleClass}`}>{subtitle}</p>
      </div>
    </div>
  )
}

export default function ProcessingStrip({
  firmKey,
  firmDisplayName,
  onStageChange,
}: ProcessingStripProps) {
  const navigate = useNavigate()
  const [stage, setStage] = useState<ProcessingStage>(1)
  const cancelledRef = useRef(false)

  useEffect(() => {
    onStageChange?.(stage)
  }, [stage, onStageChange])

  useEffect(() => {
    cancelledRef.current = false
    const t2 = window.setTimeout(() => {
      if (!cancelledRef.current) setStage(2)
    }, 2000)
    const t3 = window.setTimeout(() => {
      if (!cancelledRef.current) setStage(3)
    }, 4000)
    const tComplete = window.setTimeout(() => {
      if (!cancelledRef.current) setStage(4)
    }, 6000)
    const tNavigate = window.setTimeout(() => {
      if (cancelledRef.current) return
      navigate('/results', { state: { firmKey } })
    }, 6800)

    return () => {
      cancelledRef.current = true
      window.clearTimeout(t2)
      window.clearTimeout(t3)
      window.clearTimeout(tComplete)
      window.clearTimeout(tNavigate)
    }
  }, [firmKey, navigate])

  const p1: 'pending' | 'loading' | 'done' = stage === 1 ? 'loading' : 'done'
  const p2: 'pending' | 'loading' | 'done' =
    stage === 1 ? 'pending' : stage === 2 ? 'loading' : 'done'
  const p3: 'pending' | 'loading' | 'done' =
    stage <= 2 ? 'pending' : stage === 3 ? 'loading' : 'done'

  const line1Green = stage >= 2
  const line2Green = stage >= 3

  return (
    <div className="mt-6 flex flex-col gap-0">
      <ProcessingStepCard
        phase={p1}
        title="Detecting audit firm layout"
        subtitle={`Template matched: ${firmDisplayName}`}
      />
      <StepConnector complete={line1Green} />
      <ProcessingStepCard
        phase={p2}
        title="Extracting financial line items"
        subtitle="P&L · Balance Sheet · Cash Flow · Working Capital"
      />
      <StepConnector complete={line2Green} />
      <ProcessingStepCard
        phase={p3}
        title="Calculating regulatory scores"
        subtitle="ICRR · FSS · CRG · Covenant checks · Early warnings"
      />

      {stage === 4 ? (
        <p className="mt-4 text-center text-sm font-bold text-[#1A7C4A]">
          Analysis complete — preparing your results…
        </p>
      ) : null}
    </div>
  )
}
