import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Clock,
  FileText,
  RefreshCw,
  Search,
  SearchX,
  Timer,
} from 'lucide-react'
import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import KPICard from '../components/KPICard'
import { icrrBandClass } from '../utils/icrrBandStyles'
import { mockData as aqasem } from '../mockData/aqasem'
import { mockData as howladar } from '../mockData/howladar'
import { mockData as islam } from '../mockData/islam'
import { mockData as rrh } from '../mockData/rrh'
import { mockData as syful } from '../mockData/syful'

type ReviewStatus = 'Approved' | 'Pending' | 'Flagged'

type FirmKey = 'aqasem' | 'rrh' | 'howladar' | 'syful' | 'islam'

type ReviewRow = {
  firmKey: FirmKey
  borrower: string
  auditFirm: string
  sector: string
  reviewDate: string
  icrrScore: number
  icrrBand: string
  status: ReviewStatus
}

const recentReviews: ReviewRow[] = [
  {
    firmKey: 'aqasem',
    borrower: aqasem.borrower,
    auditFirm: aqasem.auditFirm,
    sector: 'Garments',
    reviewDate: aqasem.reviewDate,
    icrrScore: aqasem.regulatory.icrrScore,
    icrrBand: aqasem.regulatory.icrrBand,
    status: 'Approved',
  },
  {
    firmKey: 'rrh',
    borrower: rrh.borrower,
    auditFirm: rrh.auditFirm,
    sector: 'Agribusiness',
    reviewDate: rrh.reviewDate,
    icrrScore: rrh.regulatory.icrrScore,
    icrrBand: rrh.regulatory.icrrBand,
    status: 'Pending',
  },
  {
    firmKey: 'howladar',
    borrower: howladar.borrower,
    auditFirm: howladar.auditFirm,
    sector: 'Steel',
    reviewDate: howladar.reviewDate,
    icrrScore: howladar.regulatory.icrrScore,
    icrrBand: howladar.regulatory.icrrBand,
    status: 'Flagged',
  },
  {
    firmKey: 'syful',
    borrower: syful.borrower,
    auditFirm: syful.auditFirm,
    sector: 'Pharma',
    reviewDate: syful.reviewDate,
    icrrScore: syful.regulatory.icrrScore,
    icrrBand: syful.regulatory.icrrBand,
    status: 'Approved',
  },
  {
    firmKey: 'islam',
    borrower: islam.borrower,
    auditFirm: islam.auditFirm,
    sector: 'Logistics',
    reviewDate: islam.reviewDate,
    icrrScore: islam.regulatory.icrrScore,
    icrrBand: islam.regulatory.icrrBand,
    status: 'Pending',
  },
]

type SortKey =
  | 'borrower'
  | 'auditFirm'
  | 'sector'
  | 'reviewDate'
  | 'icrrScore'
  | 'status'

function formatReviewDate(iso: string) {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function statusBadgeClass(status: ReviewStatus) {
  if (status === 'Approved')
    return 'bg-success/15 text-success ring-1 ring-success/30'
  if (status === 'Pending')
    return 'bg-warning/15 text-warning ring-1 ring-warning/30'
  return 'bg-danger/15 text-danger ring-1 ring-danger/30'
}

function compareRows(a: ReviewRow, b: ReviewRow, key: SortKey, dir: 'asc' | 'desc') {
  const mul = dir === 'asc' ? 1 : -1
  let cmp = 0
  switch (key) {
    case 'borrower':
    case 'auditFirm':
    case 'sector':
    case 'status':
      cmp = a[key].localeCompare(b[key], undefined, { sensitivity: 'base' })
      break
    case 'reviewDate':
      cmp =
        new Date(a.reviewDate).getTime() - new Date(b.reviewDate).getTime()
      break
    case 'icrrScore':
      cmp = a.icrrScore - b.icrrScore
      break
    default:
      break
  }
  return cmp * mul
}

function DashboardSkeleton() {
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
        <div className="rounded-xl border border-border bg-card-white p-6 shadow-sm sm:col-span-2 xl:col-span-4">
          <div className="skeleton-shimmer h-5 w-full max-w-md rounded" />
          <div className="skeleton-shimmer mt-4 h-2.5 w-full rounded-full" />
          <div className="skeleton-shimmer mt-3 h-4 w-full max-w-lg rounded" />
          <div className="skeleton-shimmer mt-2 h-3 w-48 rounded" />
        </div>
      </section>

      <section className="mt-8 rounded-xl border border-border bg-card-white p-6 shadow-sm">
        <div className="mb-6 flex flex-wrap justify-between gap-3">
          <div className="skeleton-shimmer h-5 w-48 rounded" />
          <div className="skeleton-shimmer h-8 w-24 rounded-lg" />
        </div>
        <div className="skeleton-shimmer mb-4 h-10 w-full rounded-lg" />
        <div className="space-y-3">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="flex gap-4">
              <div className="skeleton-shimmer h-4 min-w-0 flex-[1.4] rounded" />
              <div className="skeleton-shimmer h-4 min-w-0 flex-1 rounded" />
              <div className="skeleton-shimmer h-4 w-20 shrink-0 rounded" />
              <div className="skeleton-shimmer h-4 w-24 shrink-0 rounded" />
              <div className="skeleton-shimmer h-4 w-28 shrink-0 rounded" />
              <div className="skeleton-shimmer h-4 w-20 shrink-0 rounded" />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function SortHeader({
  label,
  columnKey,
  activeKey,
  dir,
  onSort,
}: {
  label: string
  columnKey: SortKey
  activeKey: SortKey
  dir: 'asc' | 'desc'
  onSort: (k: SortKey) => void
}) {
  const active = activeKey === columnKey
  return (
    <th className="bg-surface px-6 py-3 font-medium">
      <button
        type="button"
        onClick={() => onSort(columnKey)}
        className="inline-flex items-center gap-1.5 text-text-secondary transition-colors hover:text-text-primary"
      >
        {label}
        {active ? (
          dir === 'asc' ? (
            <ArrowUp className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
          ) : (
            <ArrowDown className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
          )
        ) : null}
      </button>
    </th>
  )
}

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
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('reviewDate')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
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

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const filteredSorted = useMemo(() => {
    const q = search.trim().toLowerCase()
    let rows = recentReviews
    if (q) {
      rows = rows.filter(
        (r) =>
          r.borrower.toLowerCase().includes(q) ||
          r.sector.toLowerCase().includes(q),
      )
    }
    return [...rows].sort((a, b) => compareRows(a, b, sortKey, sortDir))
  }, [search, sortKey, sortDir])

  function goToReview(row: ReviewRow) {
    navigate('/results', { state: { firmKey: row.firmKey } })
  }

  function handleRefreshTimestamp() {
    if (refreshSpinning) return
    setRefreshSpinning(true)
    window.setTimeout(() => {
      setLastUpdatedLabel(`Last updated: ${formatDashboardTimestamp(new Date())}`)
      setRefreshSpinning(false)
    }, 1000)
  }

  if (!ready) {
    return <DashboardSkeleton />
  }

  return (
    <div className="p-6">
      <div className="mb-6 w-full">
        <p className="text-lg font-semibold text-text-primary">
          {timeOfDayGreeting(hourOfDay)}, Nazia.
        </p>
        <p className="mt-1 text-[14px] text-[#4A5568]">
          You have 12 pending renewals and 3 flagged facilities requiring attention.
        </p>
      </div>
      <section className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard
          title="Reviews This Month"
          value={34}
          subtitle="Compared with prior month"
          icon={FileText}
          trend="+18%"
          trendUp
          accent="primary"
        />
        <KPICard
          title="Pending Renewals"
          value={12}
          subtitle="Awaiting credit committee"
          icon={Clock}
          trend="+3"
          trendUp={false}
          accent="warning"
        />
        <KPICard
          title="Avg. Turnaround"
          value="1.8 days"
          subtitle="From file-in to decision"
          icon={Timer}
          trend="-62%"
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

        <div className="rounded-xl border border-border bg-card-white p-6 shadow-sm sm:col-span-2 xl:col-span-4">
          <h2 className="text-base font-bold text-text-primary">
            Review Cycle Progress — FY2025 Annual Review
          </h2>
          <div
            className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-border"
            role="progressbar"
            aria-valuenow={68}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="FY2025 review cycle completion"
          >
            <div className="h-full w-[68%] rounded-full bg-primary transition-[width] duration-300" />
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
            <span className="font-medium text-text-primary">
              272 of 400 facilities reviewed
            </span>
            <span className="text-text-secondary">128 remaining</span>
          </div>
          <p className="mt-2 text-xs text-text-secondary">
            Cycle closes: 31 December 2025
          </p>
        </div>
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

        <div className="border-b border-border px-6 py-3">
          <label className="relative block">
            <span className="sr-only">Search borrower or sector</span>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary"
              strokeWidth={2}
              aria-hidden
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search borrower or sector…"
              className="h-10 w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm text-text-primary outline-none transition-shadow placeholder:text-text-secondary focus:border-transparent focus:ring-2 focus:ring-primary"
            />
          </label>
        </div>

        <div className="max-h-[min(480px,calc(100dvh-18rem))] overflow-auto overscroll-y-contain">
          {filteredSorted.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-text-secondary">
              <SearchX className="h-10 w-10 shrink-0 opacity-60" strokeWidth={1.5} aria-hidden />
              <p className="text-sm font-medium text-text-primary">
                No matching reviews found
              </p>
            </div>
          ) : (
            <table className="w-full min-w-[800px] border-collapse text-left text-sm">
              <thead className="sticky top-0 z-10 bg-surface">
                <tr className="border-b border-border text-text-secondary">
                  <SortHeader
                    label="Borrower"
                    columnKey="borrower"
                    activeKey={sortKey}
                    dir={sortDir}
                    onSort={handleSort}
                  />
                  <SortHeader
                    label="Audit Firm"
                    columnKey="auditFirm"
                    activeKey={sortKey}
                    dir={sortDir}
                    onSort={handleSort}
                  />
                  <SortHeader
                    label="Sector"
                    columnKey="sector"
                    activeKey={sortKey}
                    dir={sortDir}
                    onSort={handleSort}
                  />
                  <SortHeader
                    label="Review Date"
                    columnKey="reviewDate"
                    activeKey={sortKey}
                    dir={sortDir}
                    onSort={handleSort}
                  />
                  <SortHeader
                    label="ICRR"
                    columnKey="icrrScore"
                    activeKey={sortKey}
                    dir={sortDir}
                    onSort={handleSort}
                  />
                  <SortHeader
                    label="Status"
                    columnKey="status"
                    activeKey={sortKey}
                    dir={sortDir}
                    onSort={handleSort}
                  />
                </tr>
              </thead>
              <tbody>
                {filteredSorted.map((row) => (
                  <tr
                    key={row.firmKey}
                    onClick={() => goToReview(row)}
                    className="cursor-pointer border-b border-border last:border-b-0 hover:bg-surface/40"
                  >
                    <td className="px-6 py-3 font-medium text-text-primary">
                      {row.borrower}
                    </td>
                    <td className="px-6 py-3 text-text-secondary">
                      {row.auditFirm}
                    </td>
                    <td className="px-6 py-3 text-text-secondary">{row.sector}</td>
                    <td className="px-6 py-3 text-text-secondary">
                      {formatReviewDate(row.reviewDate)}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${icrrBandClass(row.icrrBand)}`}
                      >
                        <span className="truncate">{row.icrrBand}</span>
                        <span className="tabular-nums opacity-90">
                          {row.icrrScore}
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex rounded-md px-2 py-0.5 text-xs font-semibold ${statusBadgeClass(row.status)}`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  )
}
