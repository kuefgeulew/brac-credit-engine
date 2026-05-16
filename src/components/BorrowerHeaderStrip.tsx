import {
  Building2,
  Clock,
  CreditCard,
  DollarSign,
  Shield,
  TrendingDown,
} from 'lucide-react'
import { useMemo } from 'react'
import type { MockData } from '../types/mockData'

/** First "BDT … Million" figure in a string (mock data uses this pattern). */
function parseFirstBdtMillion(s: string): number | null {
  const m = s.match(/BDT\s*([\d,.]+)\s*Million/i)
  if (!m) return null
  const n = Number.parseFloat(m[1].replace(/,/g, ''))
  return Number.isFinite(n) ? n : null
}

function facilityUtilisationTone(
  limitStr: string,
  outstandingStr: string,
): 'amber' | 'green' | 'neutral' {
  const limit = parseFirstBdtMillion(limitStr)
  const out = parseFirstBdtMillion(outstandingStr)
  if (limit === null || out === null || limit <= 0) return 'neutral'
  const pct = (out / limit) * 100
  if (pct > 80) return 'amber'
  if (pct < 60) return 'green'
  return 'neutral'
}

const LABEL_CLASS =
  'truncate text-[10px] font-semibold uppercase leading-tight tracking-wide text-[#4A5568] xl:text-[11px]'
const VALUE_BASE =
  'truncate text-[11px] font-bold leading-tight text-[#0D1B3E] xl:text-[12px] 2xl:text-[13px]'

type StripColumnProps = {
  icon: typeof Building2
  label: string
  value: string
  valueClassName?: string
}

function StripColumn({ icon: Icon, label, value, valueClassName }: StripColumnProps) {
  return (
    <div className="flex min-h-0 min-w-0 flex-col gap-1 border-r border-[#D0DCF0] px-1.5 last:border-r-0 sm:px-2 xl:gap-1.5 xl:px-2.5 2xl:px-3">
      <div className="flex min-w-0 flex-nowrap items-center gap-1">
        <Icon className="h-3 w-3 shrink-0 text-[#4A5568] xl:h-3.5 xl:w-3.5" strokeWidth={2} aria-hidden />
        <span className={`min-w-0 ${LABEL_CLASS}`}>{label}</span>
      </div>
      <p
        className={`min-w-0 ${VALUE_BASE} ${valueClassName ?? ''}`}
        title={value}
      >
        {value}
      </p>
    </div>
  )
}

export default function BorrowerHeaderStrip({
  details,
}: {
  details: MockData
}) {
  const outstandingTone = useMemo(
    () => facilityUtilisationTone(details.facilityLimit, details.facilityOutstanding),
    [details.facilityLimit, details.facilityOutstanding],
  )

  const outstandingClass =
    outstandingTone === 'amber'
      ? 'text-[#B45309]'
      : outstandingTone === 'green'
        ? 'text-[#1A7C4A]'
        : ''

  return (
    <section
      className="mt-6 rounded-[12px] border border-[#D0DCF0] bg-white px-4 py-3 shadow-sm xl:px-5 xl:py-3.5"
      aria-label="Borrower facility summary"
    >
      <div className="w-full min-w-0 overflow-x-auto xl:overflow-x-visible">
        <div className="grid min-w-[640px] grid-cols-6 xl:min-w-0 xl:w-full">
          <StripColumn icon={Building2} label="Sector" value={details.sector} />
          <StripColumn icon={CreditCard} label="Facility Type" value={details.facilityType} />
          <StripColumn icon={DollarSign} label="Facility Limit" value={details.facilityLimit} />
          <StripColumn
            icon={TrendingDown}
            label="Outstanding"
            value={details.facilityOutstanding}
            valueClassName={outstandingClass}
          />
          <StripColumn icon={Shield} label="Collateral" value={details.collateral} />
          <StripColumn icon={Clock} label="Relationship" value={details.relationshipYears} />
        </div>
      </div>
    </section>
  )
}
