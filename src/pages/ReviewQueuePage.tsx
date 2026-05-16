import {
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ClipboardList,
  Filter,
  Loader2,
  Search,
  UserPlus,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

type QueueStatus = 'Pending Review' | 'In Progress' | 'Overdue' | 'Completed'

type QueueRow = {
  priority: number
  priorityDot: 'danger' | 'warning' | 'primary'
  borrower: string
  sector: string
  facilityM: string
  analyst: string
  dueDate: string
  status: QueueStatus
  canReview: boolean
}

const QUEUE_ROWS: QueueRow[] = [
  {
    priority: 1,
    priorityDot: 'danger',
    borrower: 'Crystal Ceramics Ltd.',
    sector: 'Manufacturing',
    facilityM: '1,240',
    analyst: 'Farhana Afrin',
    dueDate: '10 May 2026',
    status: 'Overdue',
    canReview: true,
  },
  {
    priority: 1,
    priorityDot: 'danger',
    borrower: 'Bay Fabrics International',
    sector: 'Textile',
    facilityM: '890',
    analyst: 'Unassigned',
    dueDate: '14 May 2026',
    status: 'Pending Review',
    canReview: true,
  },
  {
    priority: 2,
    priorityDot: 'warning',
    borrower: 'Green Delta Logistics Ltd.',
    sector: 'Transport',
    facilityM: '2,150',
    analyst: 'Md. Matiur Rahman',
    dueDate: '18 May 2026',
    status: 'In Progress',
    canReview: true,
  },
  {
    priority: 2,
    priorityDot: 'warning',
    borrower: 'Coastal Fisheries Export Ltd.',
    sector: 'Fisheries',
    facilityM: '675',
    analyst: 'Sadia Rahman',
    dueDate: '20 May 2026',
    status: 'In Progress',
    canReview: true,
  },
  {
    priority: 3,
    priorityDot: 'primary',
    borrower: 'Padma Steel Industries Ltd.',
    sector: 'Steel & Metal',
    facilityM: '4,820',
    analyst: 'Tanvir Hossain',
    dueDate: '22 May 2026',
    status: 'Pending Review',
    canReview: true,
  },
  {
    priority: 3,
    priorityDot: 'primary',
    borrower: 'Northern Agro Processing Co.',
    sector: 'Agriculture',
    facilityM: '1,560',
    analyst: 'Unassigned',
    dueDate: '24 May 2026',
    status: 'Pending Review',
    canReview: true,
  },
  {
    priority: 4,
    priorityDot: 'primary',
    borrower: 'Apex Pharmaceuticals Ltd.',
    sector: 'Pharmaceuticals',
    facilityM: '3,400',
    analyst: 'Nazia Haque',
    dueDate: '8 May 2026',
    status: 'Completed',
    canReview: false,
  },
  {
    priority: 5,
    priorityDot: 'primary',
    borrower: 'Meridian Infrastructure Ltd.',
    sector: 'Construction',
    facilityM: '5,100',
    analyst: 'Imran Chowdhury',
    dueDate: '5 May 2026',
    status: 'Completed',
    canReview: false,
  },
]

const STAT_COUNTS = {
  pending: QUEUE_ROWS.filter((r) => r.status === 'Pending Review').length,
  inProgress: QUEUE_ROWS.filter((r) => r.status === 'In Progress').length,
  overdue: QUEUE_ROWS.filter((r) => r.status === 'Overdue').length,
  completed: QUEUE_ROWS.filter((r) => r.status === 'Completed').length,
}

const STAT_CARDS = [
  {
    title: 'Pending Review',
    value: STAT_COUNTS.pending,
    icon: ClipboardList,
    color: 'text-warning',
    bg: 'bg-warning/10',
  },
  {
    title: 'In Progress',
    value: STAT_COUNTS.inProgress,
    icon: Loader2,
    color: 'text-[#0052A5]',
    bg: 'bg-primary/10',
  },
  {
    title: 'Overdue',
    value: STAT_COUNTS.overdue,
    icon: AlertTriangle,
    color: 'text-danger',
    bg: 'bg-danger/10',
  },
  {
    title: 'Completed This Month',
    value: STAT_COUNTS.completed,
    icon: CheckCircle,
    color: 'text-success',
    bg: 'bg-success/10',
  },
] as const

function priorityDotClass(tone: QueueRow['priorityDot']) {
  if (tone === 'danger') return 'bg-danger'
  if (tone === 'warning') return 'bg-warning'
  return 'bg-primary'
}

function statusBadgeClass(status: QueueStatus) {
  if (status === 'Completed') return 'bg-success/15 text-success'
  if (status === 'Overdue') return 'bg-danger/15 text-danger'
  if (status === 'In Progress') return 'bg-primary/15 text-primary'
  return 'bg-warning/15 text-warning'
}

export default function ReviewQueuePage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return QUEUE_ROWS
    return QUEUE_ROWS.filter(
      (r) =>
        r.borrower.toLowerCase().includes(q) ||
        r.sector.toLowerCase().includes(q) ||
        r.analyst.toLowerCase().includes(q),
    )
  }, [search])

  return (
    <div className="p-6">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STAT_CARDS.map(({ title, value, icon: Icon, color, bg }) => (
          <div
            key={title}
            className="rounded-xl border border-[#D0DCF0] bg-card-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium text-text-secondary">{title}</p>
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${bg}`}
              >
                <Icon className={`h-4 w-4 ${color}`} strokeWidth={2} aria-hidden />
              </div>
            </div>
            <p className="mt-3 text-[28px] font-bold leading-tight text-text-primary">
              {value}
            </p>
          </div>
        ))}
      </section>

      <section className="mt-6 rounded-xl border border-[#D0DCF0] bg-card-white shadow-sm">
        <div className="border-b border-[#D0DCF0] px-5 py-4">
          <div className="relative mb-4">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary"
              strokeWidth={2}
              aria-hidden
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search borrower or sector..."
              className="h-10 w-full rounded-lg border border-[#D0DCF0] bg-surface pl-10 pr-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-secondary focus:border-primary focus:ring-1 focus:ring-primary/30"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-bold text-text-primary">
              Credit Review Queue
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#D0DCF0] bg-card-white px-3 text-sm text-text-primary"
              >
                <Filter className="h-4 w-4 text-text-secondary" strokeWidth={2} />
                All Statuses
                <ChevronDown className="h-4 w-4 text-text-secondary" strokeWidth={2} />
              </button>
              <button
                type="button"
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-primary bg-card-white px-3 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
              >
                <UserPlus className="h-4 w-4" strokeWidth={2} />
                Assign Reviews
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[#D0DCF0] bg-surface text-xs font-medium text-text-secondary">
                <th className="px-5 py-3">Priority</th>
                <th className="px-5 py-3">Borrower</th>
                <th className="px-5 py-3">Sector</th>
                <th className="px-5 py-3">Facility (BDT M)</th>
                <th className="px-5 py-3">Analyst Assigned</th>
                <th className="px-5 py-3">Due Date</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-10 text-center text-sm text-text-secondary"
                  >
                    No reviews match your search.
                  </td>
                </tr>
              ) : (
                filteredRows.map((row) => (
                  <tr
                    key={row.borrower}
                    className="border-b border-[#D0DCF0] last:border-b-0 transition-colors hover:bg-surface/60"
                  >
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-2">
                        <span
                          className={`h-2.5 w-2.5 shrink-0 rounded-full ${priorityDotClass(row.priorityDot)}`}
                          aria-hidden
                        />
                        <span className="font-medium text-text-primary">{row.priority}</span>
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-text-primary">
                      {row.borrower}
                    </td>
                    <td className="px-5 py-3.5 text-text-secondary">{row.sector}</td>
                    <td className="px-5 py-3.5 tabular-nums text-text-primary">
                      {row.facilityM}
                    </td>
                    <td className="px-5 py-3.5 text-text-primary">{row.analyst}</td>
                    <td className="px-5 py-3.5 text-text-secondary">{row.dueDate}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusBadgeClass(row.status)}`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        type="button"
                        onClick={() => row.canReview && navigate('/new-review')}
                        disabled={!row.canReview}
                        className={`inline-flex h-7 items-center justify-center rounded-md px-3 text-xs font-semibold transition-colors ${
                          row.canReview
                            ? 'bg-primary text-card-white hover:bg-primary-dark'
                            : 'cursor-default bg-surface text-text-secondary'
                        }`}
                      >
                        {row.canReview ? 'Review' : 'Closed'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <p className="border-t border-[#D0DCF0] px-5 py-3 text-xs text-[#4A5568]">
          Showing {filteredRows.length} of {QUEUE_ROWS.length} reviews · Last refreshed:{' '}
          {new Date().toLocaleString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          })}
          {' · '}
          <button
            type="button"
            onClick={() => navigate('/new-review')}
            className="font-semibold text-primary hover:underline"
          >
            New Review
          </button>{' '}
          to run a live upload demo.
        </p>
      </section>
    </div>
  )
}
