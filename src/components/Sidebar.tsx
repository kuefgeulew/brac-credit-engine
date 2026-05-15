import {
  BarChart3,
  ClipboardList,
  FilePlus,
  LayoutDashboard,
  Settings,
  X,
} from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/new-review', label: 'New Review', icon: FilePlus },
  { to: '/review-queue', label: 'Review Queue', icon: ClipboardList },
  { to: '/results', label: 'Reports', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
] as const

const AUDIT_FIRMS_ABOUT = [
  'A. Qasem & Co. Chartered Accountants',
  'Rahman Rahman Huq & Co. (KPMG Bangladesh)',
  'M/S Howladar Yunus & Co.',
  'Syful Shamsul Alam & Co.',
  'Islam Afzal Parsons & Co.',
] as const

export default function Sidebar() {
  const [aboutOpen, setAboutOpen] = useState(false)

  const closeAbout = useCallback(() => setAboutOpen(false), [])

  useEffect(() => {
    if (!aboutOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setAboutOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [aboutOpen])

  return (
    <>
      <aside className="app-sidebar fixed top-0 left-0 z-40 flex h-screen w-56 flex-col border-r border-border bg-card-white pt-20 print:hidden">
        <nav className="sidebar-scroll flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                [
                  'relative flex flex-nowrap items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors duration-150',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-secondary hover:bg-surface',
                ].join(' ')
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    aria-hidden
                    className={[
                      'absolute left-0 top-1/2 h-5 -translate-y-1/2 rounded-r bg-primary transition-[width] duration-150 ease-out',
                      isActive ? 'w-[3px]' : 'w-0',
                    ].join(' ')}
                  />
                  <Icon
                    className="relative z-10 h-5 w-5 shrink-0"
                    strokeWidth={2}
                    aria-hidden
                  />
                  <span className="relative z-10 min-w-0 flex-1">{label}</span>
                  {to === '/review-queue' ? (
                    <span className="relative z-10 flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-semibold leading-none text-card-white">
                      3
                    </span>
                  ) : null}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="shrink-0 px-3 pb-2">
          <button
            type="button"
            onClick={() => setAboutOpen(true)}
            className="w-full rounded-md px-2 py-2 text-left text-[11px] leading-snug text-[#4A5568] underline-offset-2 transition-colors hover:text-primary hover:underline"
          >
            About this system
          </button>
        </div>

        <div className="shrink-0 border-t border-border bg-card-white p-3">
          <div className="rounded-lg border border-border bg-surface px-3 py-3">
            <p className="text-[11px] font-medium leading-snug text-text-primary">
              FY2025 Annual Review Cycle
            </p>
            <div
              className="mt-2 h-1 w-full overflow-hidden rounded-full bg-border"
              role="progressbar"
              aria-valuenow={68}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="FY2025 review cycle progress"
            >
              <div className="h-full w-[68%] rounded-full bg-primary transition-[width] duration-300" />
            </div>
            <p className="mt-2 text-[11px] font-medium text-primary">68% Complete</p>
          </div>
        </div>
      </aside>

      {aboutOpen ? (
        <div
          className="fixed inset-0 z-[1100] flex items-center justify-center bg-[#0D1B3E]/60 p-4 print:hidden"
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="about-system-title"
            className="relative w-full max-w-[480px] rounded-2xl border border-border bg-card-white px-6 py-6 shadow-xl"
          >
            <button
              type="button"
              onClick={closeAbout}
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface hover:text-text-primary"
              aria-label="Close"
            >
              <X className="h-5 w-5" strokeWidth={2} />
            </button>
            <h2
              id="about-system-title"
              className="pr-10 text-lg font-bold leading-tight text-text-primary"
            >
              BRAC Bank Credit Analysis Portal
            </h2>
            <p className="mt-1 text-sm text-text-secondary">Version v2.4.1</p>
            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Supported audit firms
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-text-primary">
                {AUDIT_FIRMS_ABOUT.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-text-secondary">
              Aligned with Bangladesh Bank BRPD Circulars and ICRR guidelines.
            </p>
            <button
              type="button"
              onClick={closeAbout}
              className="mt-6 flex h-10 w-full items-center justify-center rounded-lg bg-primary text-sm font-bold text-card-white transition-colors hover:bg-primary-dark"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </>
  )
}
