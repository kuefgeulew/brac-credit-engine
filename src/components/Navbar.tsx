import { Bell } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

function breadcrumbForPath(pathname: string): string {
  if (pathname === '/dashboard') return 'Dashboard'
  if (pathname === '/new-review') return 'Dashboard / New Review'
  if (pathname === '/results') return 'Dashboard / New Review / Results'
  if (pathname === '/review-queue') return 'Dashboard / Review Queue'
  if (pathname === '/settings') return 'Dashboard / Settings'
  return 'Dashboard'
}

const notifications = [
  {
    id: '1',
    text: 'Padma Steel review flagged for covenant breach',
    time: '2h ago',
  },
  {
    id: '2',
    text: '3 renewals due this week',
    time: '2h ago',
  },
  {
    id: '3',
    text: 'Bangladesh Bank circular updated',
    time: '2h ago',
  },
] as const

export default function Navbar() {
  const location = useLocation()
  const breadcrumb = breadcrumbForPath(location.pathname)
  const [now, setNow] = useState(() => new Date())
  const [notifOpen, setNotifOpen] = useState(false)
  const notifWrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    if (!notifOpen) return
    function handlePointerDown(e: PointerEvent) {
      if (
        notifWrapRef.current &&
        !notifWrapRef.current.contains(e.target as Node)
      ) {
        setNotifOpen(false)
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setNotifOpen(false)
    }
    document.addEventListener('pointerdown', handlePointerDown, true)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [notifOpen])

  const timeInDhaka = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Dhaka',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(now)

  return (
    <header
      className="app-navbar fixed top-0 right-0 left-0 z-50 flex h-20 w-full items-center border-b border-border bg-card-white pl-56 pr-6 shadow-[0_1px_4px_rgba(0,0,0,0.08)] print:hidden"
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] bg-[#0052A5] text-[14px] font-bold leading-none text-card-white">
          BB
        </div>
        <div className="min-w-0 leading-tight">
          <div className="truncate text-[18px] font-bold text-[#0D1B3E]">
            BRAC Bank
          </div>
          <p className="truncate text-[11px] text-[#4A5568]">
            Credit Analysis Portal
          </p>
        </div>
      </div>

      <div className="hidden min-w-0 shrink-0 px-4 md:block">
        <p className="truncate text-center text-sm font-medium text-text-secondary">
          {breadcrumb}
        </p>
      </div>

      <div className="flex min-w-0 flex-1 items-center justify-end gap-4">
        <div ref={notifWrapRef} className="relative">
          <button
            type="button"
            onClick={() => setNotifOpen((o) => !o)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface"
            aria-expanded={notifOpen}
            aria-haspopup="true"
            aria-label="Notifications"
          >
            <span className="relative inline-flex">
              <Bell className="h-5 w-5" strokeWidth={2} />
              <span
                className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-danger ring-2 ring-card-white"
                aria-hidden
              />
            </span>
          </button>

          {notifOpen ? (
            <div
              className="absolute right-0 top-full z-50 mt-2 w-[280px] overflow-hidden rounded-[10px] border border-[#D0DCF0] bg-card-white shadow-lg"
              role="menu"
            >
              <ul className="divide-y divide-border py-1">
                {notifications.map((n) => (
                  <li key={n.id}>
                    <button
                      type="button"
                      className="flex w-full items-start gap-3 px-3 py-3 text-left transition-colors hover:bg-surface"
                      role="menuitem"
                      onClick={() => setNotifOpen(false)}
                    >
                      <span
                        className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary"
                        aria-hidden
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13px] leading-snug text-text-primary">
                          {n.text}
                        </span>
                        <span className="mt-1 block text-[11px] text-text-secondary">
                          {n.time}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="flex min-w-0 items-center gap-3">
          <span className="text-lg leading-none" aria-hidden>
            🇧🇩
          </span>
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-card-white"
            aria-hidden
          >
            NH
          </div>
          <div className="min-w-0 leading-tight">
            <span className="block text-[13px] font-medium text-text-primary">
              Nazia Haque
            </span>
            <span className="mt-0.5 block text-[11px] tabular-nums text-[#4A5568]">
              {timeInDhaka}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
