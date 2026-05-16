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

type BadgeTone = 'danger' | 'warning' | 'success' | 'primary'

type MockReview = {
  borrower: string
  auditFirm: string
  sector: string
  reviewDate: string
  icrrBand: string
  icrrScore: string
  crgBand: string
  crgScore: string
  icrrTone: BadgeTone
  crgTone: BadgeTone
  status: string
  statusTone: BadgeTone
  actionLabel: string
  actionPath?: '/new-review' | '/review-queue'
}

const MOCK_REVIEWS: MockReview[] = [
  {
    borrower: 'Padma Steel Industries Ltd.',
    auditFirm: 'Rahman Rahman Huq & Co.',
    sector: 'Steel & Metal',
    reviewDate: '14 May 2026',
    icrrBand: 'Acceptable',
    icrrScore: '68.2',
    crgBand: 'Good',
    crgScore: '52/60',
    icrrTone: 'primary',
    crgTone: 'success',
    status: 'Completed',
    statusTone: 'success',
    actionLabel: 'View Report',
  },
  {
    borrower: 'Apex Pharmaceuticals Ltd.',
    auditFirm: 'A. Qasem & Co. Chartered Accountants',
    sector: 'Pharmaceuticals',
    reviewDate: '12 May 2026',
    icrrBand: 'Good',
    icrrScore: '74.5',
    crgBand: 'Acceptable',
    crgScore: '48/60',
    icrrTone: 'primary',
    crgTone: 'primary',
    status: 'Completed',
    statusTone: 'success',
    actionLabel: 'View Report',
  },
  {
    borrower: 'Green Delta Logistics Ltd.',
    auditFirm: 'M/S Howladar Yunus & Co.',
    sector: 'Transport',
    reviewDate: '10 May 2026',
    icrrBand: 'Marginal',
    icrrScore: '58.3',
    crgBand: 'Marginal',
    crgScore: '38/60',
    icrrTone: 'warning',
    crgTone: 'warning',
    status: 'Under Review',
    statusTone: 'warning',
    actionLabel: 'Continue',
    actionPath: '/new-review',
  },
  {
    borrower: 'Bay Fabrics International',
    auditFirm: 'Syful Shamsul Alam & Co.',
    sector: 'Textile',
    reviewDate: '8 May 2026',
    icrrBand: 'Unacceptable',
    icrrScore: '47.1',
    crgBand: 'Special Mention',
    crgScore: '32/60',
    icrrTone: 'danger',
    crgTone: 'warning',
    status: 'Pending',
    statusTone: 'primary',
    actionLabel: 'Assign',
    actionPath: '/review-queue',
  },
  {
    borrower: 'Northern Agro Processing Co.',
    auditFirm: 'Islam Afzal Parsons & Co.',
    sector: 'Agriculture',
    reviewDate: '5 May 2026',
    icrrBand: 'Good',
    icrrScore: '71.8',
    crgBand: 'Good',
    crgScore: '50/60',
    icrrTone: 'primary',
    crgTone: 'success',
    status: 'Completed',
    statusTone: 'success',
    actionLabel: 'View Report',
  },
  {
    borrower: 'Crystal Ceramics Ltd.',
    auditFirm: 'Rahman Rahman Huq & Co.',
    sector: 'Manufacturing',
    reviewDate: '2 May 2026',
    icrrBand: 'Unacceptable',
    icrrScore: '44.6',
    crgBand: 'Substandard',
    crgScore: '28/60',
    icrrTone: 'danger',
    crgTone: 'danger',
    status: 'Overdue',
    statusTone: 'danger',
    actionLabel: 'Review',
    actionPath: '/review-queue',
  },
  {
    borrower: 'Meridian Infrastructure Ltd.',
    auditFirm: 'A. Qasem & Co. Chartered Accountants',
    sector: 'Construction',
    reviewDate: '28 Apr 2026',
    icrrBand: 'Acceptable',
    icrrScore: '65.4',
    crgBand: 'Acceptable',
    crgScore: '46/60',
    icrrTone: 'primary',
    crgTone: 'primary',
    status: 'Completed',
    statusTone: 'success',
    actionLabel: 'View Report',
  },
  {
    borrower: 'Coastal Fisheries Export Ltd.',
    auditFirm: 'M/S Howladar Yunus & Co.',
    sector: 'Fisheries',
    reviewDate: '25 Apr 2026',
    icrrBand: 'Marginal',
    icrrScore: '61.2',
    crgBand: 'Marginal',
    crgScore: '36/60',
    icrrTone: 'warning',
    crgTone: 'warning',
    status: 'Under Review',
    statusTone: 'warning',
    actionLabel: 'Continue',
    actionPath: '/new-review',
  },
]

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

function badgeClasses(tone: BadgeTone) {
  if (tone === 'success') return 'border-success/30 bg-success/10 text-success'
  if (tone === 'primary') return 'border-primary/30 bg-primary/10 text-primary'
  if (tone === 'warning') return 'border-warning/30 bg-warning/10 text-warning'
  return 'border-danger/30 bg-danger/10 text-danger'
}

function statusClasses(tone: BadgeTone) {
  if (tone === 'success') return 'bg-success/15 text-success ring-success/30'
  if (tone === 'primary') return 'bg-primary/15 text-primary ring-primary/30'
  if (tone === 'warning') return 'bg-warning/15 text-warning ring-warning/30'
  return 'bg-danger/15 text-danger ring-danger/30'
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
          You have 5 pending renewals and 3 flagged facilities requiring attention.
        </p>
      </div>
      <section className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard
          title="Reviews This Month"
          value={12}
          subtitle="Compared with prior month"
          icon={FileText}
          trend="+8%"
          trendUp
          accent="primary"
        />
        <KPICard
          title="Pending Renewals"
          value={5}
          subtitle="Awaiting credit committee"
          icon={Clock}
          trend="+2"
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
          value={3}
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
              {MOCK_REVIEWS.map((row) => (
                <tr
                  key={row.borrower}
                  className="border-b border-border last:border-b-0 hover:bg-surface/40"
                >
                  <td className="px-6 py-3 font-medium text-text-primary">{row.borrower}</td>
                  <td className="px-6 py-3 text-text-secondary">{row.auditFirm}</td>
                  <td className="px-6 py-3 text-text-secondary">{row.sector}</td>
                  <td className="px-6 py-3 text-text-secondary">{row.reviewDate}</td>
                  <td className="px-6 py-3">
                    <div className="flex flex-col gap-1">
                      <span
                        className={`inline-flex max-w-max items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${badgeClasses(row.icrrTone)}`}
                      >
                        <span>{row.icrrBand}</span>
                        <span className="tabular-nums opacity-90">{row.icrrScore}</span>
                      </span>
                      <span
                        className={`inline-flex max-w-max items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${badgeClasses(row.crgTone)}`}
                      >
                        <span>{row.crgBand}</span>
                        <span className="tabular-nums opacity-90">{row.crgScore}</span>
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`inline-flex rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ${statusClasses(row.statusTone)}`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <button
                      type="button"
                      onClick={() => row.actionPath && navigate(row.actionPath)}
                      disabled={!row.actionPath}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                        row.actionPath
                          ? 'bg-primary/10 text-primary hover:bg-primary/20'
                          : 'cursor-default bg-surface text-text-secondary'
                      }`}
                    >
                      {row.actionLabel}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="border-t border-border px-6 py-3 text-xs text-text-secondary">
          Showing {MOCK_REVIEWS.length} of {MOCK_REVIEWS.length} reviews · Upload a new file via{' '}
          <button
            type="button"
            onClick={() => navigate('/new-review')}
            className="font-semibold text-primary hover:underline"
          >
            New Review
          </button>{' '}
          to run a live AI analysis demo.
        </p>
      </section>
    </div>
  )
}
