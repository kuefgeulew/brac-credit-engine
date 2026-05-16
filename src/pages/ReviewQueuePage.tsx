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
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const STAT_CARDS = [
  {
    title: 'Pending Review',
    value: 0,
    icon: ClipboardList,
    color: 'text-warning',
    bg: 'bg-warning/10',
  },
  {
    title: 'In Progress',
    value: 1,
    icon: Loader2,
    color: 'text-[#0052A5]',
    bg: 'bg-primary/10',
  },
  {
    title: 'Overdue',
    value: 0,
    icon: AlertTriangle,
    color: 'text-danger',
    bg: 'bg-danger/10',
  },
  {
    title: 'Completed This Month',
    value: 0,
    icon: CheckCircle,
    color: 'text-success',
    bg: 'bg-success/10',
  },
] as const

export default function ReviewQueuePage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

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
              <tr className="border-b border-[#D0DCF0] last:border-b-0 transition-colors hover:bg-surface/60">
                <td className="px-5 py-3.5">
                  <span className="inline-flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full bg-danger"
                      aria-hidden
                    />
                    <span className="font-medium text-text-primary">1</span>
                  </span>
                </td>
                <td className="px-5 py-3.5 font-medium text-text-primary">
                  Outpace Spinning Mills Ltd.
                </td>
                <td className="px-5 py-3.5 text-text-secondary">Textile</td>
                <td className="px-5 py-3.5 tabular-nums text-text-primary">
                  3,135
                </td>
                <td className="px-5 py-3.5 text-text-primary">Md. Matiur Rahman</td>
                <td className="px-5 py-3.5 text-text-secondary">30 Dec 2024</td>
                <td className="px-5 py-3.5">
                  <span className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold bg-primary/15 text-primary">
                    In Progress
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <button
                    type="button"
                    onClick={() => navigate('/results', { state: { firmKey: 'osml' } })}
                    className="inline-flex h-7 items-center justify-center rounded-md bg-primary px-3 text-xs font-semibold text-card-white transition-colors hover:bg-primary-dark"
                  >
                    Review
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="border-t border-[#D0DCF0] px-5 py-3 text-xs text-[#4A5568]">
          Showing 1 of 1 reviews · Last refreshed: 26 Dec 2024, 12:00 PM
        </p>
      </section>
    </div>
  )
}
