import { CheckCircle2, X } from 'lucide-react'
import { useEffect } from 'react'

export type ToastProps = {
  open: boolean
  message: string
  onClose: () => void
  durationMs?: number
}

export default function Toast({
  open,
  message,
  onClose,
  durationMs = 4000,
}: ToastProps) {
  useEffect(() => {
    if (!open) return
    const t = window.setTimeout(onClose, durationMs)
    return () => window.clearTimeout(t)
  }, [open, onClose, durationMs])

  if (!open) return null

  return (
    <div
      className="fixed bottom-6 right-6 z-[1200] flex max-w-sm items-start gap-3 rounded-xl border border-border bg-card-white px-4 py-3 shadow-xl print:hidden"
      role="status"
      aria-live="polite"
    >
      <CheckCircle2
        className="mt-0.5 h-5 w-5 shrink-0 text-success"
        strokeWidth={2}
        aria-hidden
      />
      <p className="text-sm font-medium text-text-primary">{message}</p>
      <button
        type="button"
        onClick={onClose}
        className="-m-1 shrink-0 rounded-lg p-1 text-text-secondary transition-colors hover:bg-surface hover:text-text-primary"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" strokeWidth={2} />
      </button>
    </div>
  )
}
