import {
  AlertTriangle,
  Clock,
  FileText,
  RefreshCw,
  Timer,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import KPICard from '../components/KPICard'

function formatDashboardTimestamp(d: Date) {
  return d.toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

function timeOfDayGreeting(hour: number): string {
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const [ready, setReady] = useState(false)
  const [lastUpdatedLabel, setLastUpdatedLabel] = useState(
    () => `Last updated: ${formatDashboardTimestamp(new Date())}`,
  )
  const [refreshSpinning, setRefreshSpinning] = useState(false)
  const [hourOfDay, setHourOfDay] = useState(() => new Date().getHours())

  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 800)
    return () => window.clearTimeout(t)
  }, [])

  useEffect(() => {
    const tick = () => setHourOfDay(new Date().getHours())
    const id = window.setInterval(tick, 60_000)
    return () => window.clearInterval(id)
  }, [])

  function handleRefreshTimestamp() {
    if (refreshSpinning) return
    setRefreshSpinning(true)
    window.setTimeout(() => {
      setLastUpdatedLabel(`Last updated: ${formatDashboardTimestamp(new Date())}`)
      setRefreshSpinning(false)
    }, 1000)
  }

  if (!ready) {
    return (
      <div className="p-6" aria-busy="true" aria-label="Loading dashboard">
        <section className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-card-white p-6 shadow-sm"
            >
              <div className="skeleton-shimmer mx-auto h-4 max-w-[160px] rounded" />
              <div className="skeleton-shimmer mt-6 h-9 w-28 rounded" />
              <div className="skeleton-shimmer mx-auto mt-3 h-3 w-full max-w-[220px] rounded" />
              <div className="skeleton-shimmer mt-4 h-6 w-24 rounded" />
            </div>
          ))}
        </section>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6 w-full">
        <p className="text-lg font-semibold text-text-primary">
          {timeOfDayGreeting(hourOfDay)}, Nazia.
        </p>
        <p className="mt-1 text-[14px] text-[#4A5568]">
          You have 1 pending renewal and 1 flagged facility requiring attention.
        </p>
      </div>
      <section className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard
          title="Reviews This Month"
          value={1}
          subtitle="Compared with prior month"
          icon={FileText}
          trend="+0%"
          trendUp
          accent="primary"
        />
        <KPICard
          title="Pending Renewals"
          value={1}
          subtitle="Awaiting credit committee"
          icon={Clock}
          trend="+1"
          trendUp={false}
          accent="warning"
        />
        <KPICard
          title="Avg. Turnaround"
          value="4.2 sec"
          subtitle="AI processing time"
          icon={Timer}
          trend="-99%"
          trendUp
          accent="success"
        />
        <KPICard
          title="Facilities Flagged"
          value={1}
          subtitle="Requires follow-up this week"
          icon={AlertTriangle}
          trend="+1"
          trendUp={false}
          accent="danger"
        />
      </section>

      <section className="mt-8 rounded-xl border border-border bg-card-white shadow-sm">
        <div className="flex flex-nowrap items-center justify-between gap-4 border-b border-border px-6 py-4">
          <h2 className="min-w-0 flex-1 pr-2 text-base font-bold leading-tight text-text-primary">
            Recent Credit Reviews
          </h2>
          <div className="flex shrink-0 items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-text-secondary">
              <button
                type="button"
                onClick={handleRefreshTimestamp}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-card-white text-text-secondary transition-colors hover:bg-surface hover:text-text-primary"
                aria-label="Refresh last updated time"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${refreshSpinning ? 'animate-spin' : ''}`}
                  strokeWidth={2}
                  aria-hidden
                />
              </button>
              <span className="max-w-[160px] truncate leading-snug sm:max-w-[220px] md:max-w-none">
                {lastUpdatedLabel}
              </span>
            </div>
            <button
              type="button"
              onClick={() => navigate('/new-review')}
              className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-card-white transition-colors hover:bg-primary-dark"
            >
              New Review
            </button>
          </div>
        </div>

        <div className="max-h-[min(480px,calc(100dvh-18rem))] overflow-auto overscroll-y-contain">
          <table className="w-full min-w-[800px] border-collapse text-left text-sm">
            <thead className="sticky top-0 z-10 bg-surface">
              <tr className="border-b border-border text-text-secondary">
                <th className="bg-surface px-6 py-3 font-medium">Borrower</th>
                <th className="bg-surface px-6 py-3 font-medium">Audit Firm</th>
                <th className="bg-surface px-6 py-3 font-medium">Sector</th>
                <th className="bg-surface px-6 py-3 font-medium">Review Date</th>
                <th className="bg-surface px-6 py-3 font-medium">ICRR & CRG</th>
                <th className="bg-surface px-6 py-3 font-medium">Status</th>
                <th className="bg-surface px-6 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border last:border-b-0 hover:bg-surface/40">
                <td className="px-6 py-3 font-medium text-text-primary">
                  Outpace Spinning Mills Ltd.
                </td>
                <td className="px-6 py-3 text-text-secondary">
                  Dewan Nazrul Islam & Co.
                </td>
                <td className="px-6 py-3 text-text-secondary">Textile</td>
                <td className="px-6 py-3 text-text-secondary">
                  26 Dec 2024
                </td>
                <td className="px-6 py-3">
                  <div className="flex flex-col gap-1">
                    <span className="inline-flex max-w-max items-center gap-1.5 rounded-full border border-danger/30 bg-danger/10 px-2.5 py-0.5 text-xs font-semibold text-danger">
                      <span>Unacceptable</span>
                      <span className="tabular-nums opacity-90">50.5</span>
                    </span>
                    <span className="inline-flex max-w-max items-center gap-1.5 rounded-full border border-danger/30 bg-danger/10 px-2.5 py-0.5 text-xs font-semibold text-danger">
                      <span>Substandard</span>
                      <span className="tabular-nums opacity-90">29/60</span>
                    </span>
                  </div>
                </td>
                <td className="px-6 py-3">
                  <span className="inline-flex rounded-md bg-warning/15 px-2 py-0.5 text-xs font-semibold text-warning ring-1 ring-warning/30">
                    Under Review
                  </span>
                </td>
                <td className="px-6 py-3">
                  <button
                    type="button"
                    onClick={() => navigate('/results', { state: { firmKey: 'osml' } })}
                    className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
                  >
                    View Analysis
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
