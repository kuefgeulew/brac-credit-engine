import { Monitor } from 'lucide-react'
import { useEffect, useState } from 'react'

const MIN_W = 1024

export default function MinWidthGuard() {
  const [narrow, setNarrow] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < MIN_W,
  )

  useEffect(() => {
    function check() {
      setNarrow(window.innerWidth < MIN_W)
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  if (!narrow) return null

  return (
    <div
      className="app-minwidth-guard fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-card-white px-8 text-center print:hidden"
      role="alertdialog"
      aria-modal="true"
      aria-label="Desktop viewing required"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-[10px] bg-[#0052A5] text-xl font-bold text-card-white">
        BB
      </div>
      <Monitor className="h-12 w-12 text-text-secondary" strokeWidth={1.5} aria-hidden />
      <div className="max-w-md space-y-3">
        <p className="text-sm leading-relaxed text-text-primary">
          This application is optimized for desktop viewing (1024px+). Please use a larger screen.
        </p>
      </div>
    </div>
  )
}
