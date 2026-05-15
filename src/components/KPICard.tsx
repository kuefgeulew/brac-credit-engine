import type { LucideIcon } from 'lucide-react'
import { TrendingDown, TrendingUp } from 'lucide-react'

type Accent = 'primary' | 'warning' | 'success' | 'danger'

const accentStyles: Record<
  Accent,
  { circle: string; icon: string; borderLeft: string }
> = {
  primary: {
    circle: 'bg-primary/10',
    icon: 'text-primary',
    borderLeft: 'border-l-primary',
  },
  warning: {
    circle: 'bg-warning/10',
    icon: 'text-warning',
    borderLeft: 'border-l-warning',
  },
  success: {
    circle: 'bg-success/10',
    icon: 'text-success',
    borderLeft: 'border-l-success',
  },
  danger: {
    circle: 'bg-danger/10',
    icon: 'text-danger',
    borderLeft: 'border-l-danger',
  },
}

export type KPICardProps = {
  title: string
  value: string | number
  subtitle: string
  icon: LucideIcon
  trend: string
  trendUp: boolean
  accent?: Accent
}

export default function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendUp,
  accent = 'primary',
}: KPICardProps) {
  const a = accentStyles[accent]
  const TrendIcon = trendUp ? TrendingUp : TrendingDown

  return (
    <div
      className={`flex h-full min-h-[168px] flex-col rounded-xl border border-border border-l-4 ${a.borderLeft} bg-card-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(0,0,0,0.12)]`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-text-secondary">{title}</p>
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${a.circle}`}
        >
          <Icon className={`h-5 w-5 ${a.icon}`} strokeWidth={2} aria-hidden />
        </div>
      </div>
      <p className="mt-3 text-[28px] font-bold leading-tight text-text-primary">
        {value}
      </p>
      <p className="mt-1 min-h-[2.5rem] text-xs leading-snug text-text-secondary">{subtitle}</p>
      <span
        className={`mt-auto inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold ${
          trendUp
            ? 'bg-success/15 text-success'
            : 'bg-danger/15 text-danger'
        }`}
      >
        <TrendIcon className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} aria-hidden />
        {trend}
      </span>
    </div>
  )
}
