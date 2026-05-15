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

type QueueStatus = 'Pending' | 'In Progress' | 'Overdue'
type Priority = 1 | 2 | 3

type QueueRow = {
  id: number
  priority: Priority
  borrower: string
  sector: string
  facility: number
  analyst: string
  dueDate: string
  daysRemaining: number
  status: QueueStatus
}

const QUEUE_ROWS: QueueRow[] = [
  {
    id: 3,
    priority: 1,
    borrower: 'Summit Power Ltd.',
    sector: 'Energy',
    facility: 210.0,
    analyst: 'Nazia Haque',
    dueDate: '16 May 2025',
    daysRemaining: 1,
    status: 'Overdue',
  },
  {
    id: 6,
    priority: 1,
    borrower: 'Beximco Textiles',
    sector: 'RMG',
    facility: 145.0,
    analyst: 'Nazia Haque',
    dueDate: '15 May 2025',
    daysRemaining: 0,
    status: 'Overdue',
  },
  {
    id: 8,
    priority: 1,
    borrower: 'Bangladesh Steel Re-Rolling',
    sector: 'Steel',
    facility: 130.0,
    analyst: 'Sadia Ahmed',
    dueDate: '17 May 2025',
    daysRemaining: 2,
    status: 'Overdue',
  },
  {
    id: 1,
    priority: 2,
    borrower: 'Meghna Garments Ltd.',
    sector: 'RMG',
    facility: 120.0,
    analyst: 'Sadia Ahmed',
    dueDate: '20 May 2025',
    daysRemaining: 5,
    status: 'In Progress',
  },
  {
    id: 5,
    priority: 2,
    borrower: 'Square Pharmaceuticals',
    sector: 'Pharma',
    facility: 175.0,
    analyst: 'Rahim Chowdhury',
    dueDate: '22 May 2025',
    daysRemaining: 7,
    status: 'In Progress',
  },
  {
    id: 11,
    priority: 2,
    borrower: 'Jamuna Group',
    sector: 'Manufacturing',
    facility: 110.0,
    analyst: 'Nazia Haque',
    dueDate: '21 May 2025',
    daysRemaining: 6,
    status: 'In Progress',
  },
  {
    id: 2,
    priority: 3,
    borrower: 'Bashundhara Paper Mills',
    sector: 'Manufacturing',
    facility: 85.5,
    analyst: 'Karim Hossain',
    dueDate: '18 May 2025',
    daysRemaining: 3,
    status: 'Pending',
  },
  {
    id: 4,
    priority: 3,
    borrower: 'Pran Foods Ltd.',
    sector: 'Agribusiness',
    facility: 95.0,
    analyst: 'Sadia Ahmed',
    dueDate: '25 May 2025',
    daysRemaining: 10,
    status: 'Pending',
  },
  {
    id: 7,
    priority: 3,
    borrower: 'ACI Limited',
    sector: 'FMCG',
    facility: 88.0,
    analyst: 'Karim Hossain',
    dueDate: '28 May 2025',
    daysRemaining: 13,
    status: 'Pending',
  },
  {
    id: 9,
    priority: 3,
    borrower: 'Navana Real Estate',
    sector: 'Real Estate',
    facility: 160.0,
    analyst: 'Rahim Chowdhury',
    dueDate: '30 May 2025',
    daysRemaining: 15,
    status: 'Pending',
  },
  {
    id: 10,
    priority: 3,
    borrower: 'Partex Star Group',
    sector: 'Conglomerate',
    facility: 195.0,
    analyst: 'Karim Hossain',
    dueDate: '24 May 2025',
    daysRemaining: 9,
    status: 'In Progress',
  },
  {
    id: 12,
    priority: 3,
    borrower: 'Energypac Power',
    sector: 'Energy',
    facility: 140.0,
    analyst: 'Sadia Ahmed',
    dueDate: '19 May 2025',
    daysRemaining: 4,
    status: 'Pending',
  },
]

const STAT_CARDS = [
  {
    title: 'Pending Review',
    value: 12,
    icon: ClipboardList,
    color: 'text-warning',
    bg: 'bg-warning/10',
  },
  {
    title: 'In Progress',
    value: 5,
    icon: Loader2,
    color: 'text-[#0052A5]',
    bg: 'bg-primary/10',
  },
  {
    title: 'Overdue',
    value: 3,
    icon: AlertTriangle,
    color: 'text-danger',
    bg: 'bg-danger/10',
  },
  {
    title: 'Completed This Month',
    value: 34,
    icon: CheckCircle,
    color: 'text-success',
    bg: 'bg-success/10',
  },
] as const

function priorityDotClass(priority: Priority) {
  if (priority === 1) return 'bg-danger'
  if (priority === 2) return 'bg-warning'
  return 'bg-[#9CA3AF]'
}

function statusBadgeClass(status: QueueStatus) {
  if (status === 'In Progress') return 'bg-primary/15 text-primary'
  if (status === 'Pending') return 'bg-warning/15 text-warning'
  return 'bg-danger/15 text-danger'
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
        r.sector.toLowerCase().includes(q),
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
                <th className="px-5 py-3">Days Remaining</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-[#D0DCF0] last:border-b-0 transition-colors hover:bg-surface/60"
                >
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center gap-2">
                      <span
                        className={`h-2.5 w-2.5 shrink-0 rounded-full ${priorityDotClass(row.priority)}`}
                        aria-hidden
                      />
                      <span className="font-medium text-text-primary">
                        {row.priority}
                      </span>
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-medium text-text-primary">
                    {row.borrower}
                  </td>
                  <td className="px-5 py-3.5 text-text-secondary">{row.sector}</td>
                  <td className="px-5 py-3.5 tabular-nums text-text-primary">
                    {row.facility.toFixed(1)}
                  </td>
                  <td className="px-5 py-3.5 text-text-primary">{row.analyst}</td>
                  <td className="px-5 py-3.5 text-text-secondary">{row.dueDate}</td>
                  <td className="px-5 py-3.5">
                    {row.daysRemaining <= 0 ? (
                      <span className="font-bold text-danger">Overdue</span>
                    ) : (
                      <span className="tabular-nums text-text-primary">
                        {row.daysRemaining} days
                      </span>
                    )}
                  </td>
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
                      onClick={() => navigate('/new-review')}
                      className="inline-flex h-7 items-center justify-center rounded-md bg-primary px-3 text-xs font-semibold text-card-white transition-colors hover:bg-primary-dark"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="border-t border-[#D0DCF0] px-5 py-3 text-xs text-[#4A5568]">
          Showing {filteredRows.length} of {QUEUE_ROWS.length} reviews · Last
          refreshed: 15 May 2025, 12:00 PM
        </p>
      </section>
    </div>
  )
}
