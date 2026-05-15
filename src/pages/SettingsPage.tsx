import {
  Bell,
  Building2,
  Info,
  Sliders,
  User,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useCallback, useState } from 'react'
import Toast from '../components/Toast'

type SettingsSection =
  | 'profile'
  | 'notifications'
  | 'audit'
  | 'thresholds'
  | 'system'

const NAV_ITEMS: {
  id: SettingsSection
  label: string
  icon: LucideIcon
}[] = [
  { id: 'profile', label: 'User Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'audit', label: 'Audit Firm Templates', icon: Building2 },
  { id: 'thresholds', label: 'Regulatory Thresholds', icon: Sliders },
  { id: 'system', label: 'System Information', icon: Info },
]

const AUDIT_FIRMS = [
  {
    name: 'A. Qasem & Co.',
    capabilities: ['P&L extraction', 'Note mapping', 'Cash flow parsing'],
  },
  {
    name: 'Rahman Rahman Huq (KPMG)',
    capabilities: ['Consolidated statements', 'Segment reporting', 'Ratio validation'],
  },
  {
    name: 'Howladar Yunus',
    capabilities: ['Balance sheet parsing', 'Related party notes', 'Covenant tables'],
  },
  {
    name: 'Syful Shamsul Alam',
    capabilities: ['Multi-year comparison', 'P&L extraction', 'Audit opinion parsing'],
  },
  {
    name: 'Islam Afzal Parsons',
    capabilities: ['Note mapping', 'Cash flow parsing', 'ICRR data fields'],
  },
] as const

const THRESHOLD_ROWS = [
  {
    metric: 'DSCR',
    healthy: '≥1.25',
    watch: '1.00–1.24',
    critical: '<1.00',
    guideline: 'Minimum 1.10 recommended',
  },
  {
    metric: 'Current Ratio',
    healthy: '≥1.50',
    watch: '1.00–1.49',
    critical: '<1.00',
    guideline: 'Minimum 1.00 required',
  },
  {
    metric: 'Debt/Equity',
    healthy: '≤1.50',
    watch: '1.51–2.50',
    critical: '>2.50',
    guideline: 'Maximum 2.00 preferred',
  },
  {
    metric: 'Interest Coverage',
    healthy: '≥2.00',
    watch: '1.50–1.99',
    critical: '<1.50',
    guideline: 'Minimum 1.50 required',
  },
  {
    metric: 'Leverage Ratio',
    healthy: '≤0.60',
    watch: '0.61–0.75',
    critical: '>0.75',
    guideline: 'Maximum 0.70 preferred',
  },
  {
    metric: 'ICRR Score',
    healthy: '≥70',
    watch: '60–69',
    critical: '<60',
    guideline: 'Annual review mandatory <65',
  },
] as const

const NOTIFICATION_TOGGLES = [
  {
    id: 'overdue',
    label: 'Email alerts for overdue reviews',
    description: 'Receive an email when a assigned review passes its due date.',
    on: true,
  },
  {
    id: 'digest',
    label: 'Email digest — daily review summary',
    description: 'Morning summary of queue status and priority items.',
    on: true,
  },
  {
    id: 'sms',
    label: 'SMS alerts for covenant breaches',
    description: 'Instant SMS when automated covenant checks flag a breach.',
    on: false,
  },
  {
    id: 'inapp',
    label: 'In-app notifications',
    description: 'Show alerts in the portal notification panel.',
    on: true,
  },
  {
    id: 'bb',
    label: 'Bangladesh Bank circular updates',
    description: 'Notify when new BRPD circulars are published.',
    on: true,
  },
  {
    id: 'weekly',
    label: 'Weekly performance report',
    description: 'Analyst productivity and portfolio health summary.',
    on: false,
  },
] as const

function ToggleSwitch({ on }: { on: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      className={[
        'relative h-6 w-11 shrink-0 rounded-full transition-colors',
        on ? 'bg-primary' : 'bg-[#D0DCF0]',
      ].join(' ')}
    >
      <span
        className={[
          'absolute top-0.5 h-5 w-5 rounded-full bg-card-white shadow transition-transform',
          on ? 'translate-x-5' : 'translate-x-0.5',
        ].join(' ')}
      />
    </button>
  )
}

function FormField({
  label,
  value,
  type = 'text',
}: {
  label: string
  value: string
  type?: string
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-text-primary">
        {label}
      </span>
      <input
        type={type}
        defaultValue={value}
        readOnly
        className="h-10 w-full rounded-lg border border-[#D0DCF0] bg-surface px-3 text-sm text-text-primary outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
      />
    </label>
  )
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#D0DCF0] bg-surface px-4 py-3">
      <p className="text-xs font-medium text-text-secondary">{label}</p>
      <p className="mt-1 text-sm font-semibold text-text-primary">{value}</p>
    </div>
  )
}

export default function SettingsPage() {
  const [section, setSection] = useState<SettingsSection>('profile')
  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('Settings saved')

  const showToast = useCallback((message: string) => {
    setToastMessage(message)
    setToastOpen(true)
  }, [])

  const closeToast = useCallback(() => setToastOpen(false), [])

  return (
    <div className="p-6">
      <div className="flex gap-6">
        <nav className="w-60 shrink-0">
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
              const active = section === id
              return (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => setSection(id)}
                    className={[
                      'relative flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium transition-colors duration-150',
                      active
                        ? 'bg-primary/10 text-primary'
                        : 'text-text-secondary hover:bg-surface',
                    ].join(' ')}
                  >
                    <span
                      aria-hidden
                      className={[
                        'absolute left-0 top-1/2 h-5 -translate-y-1/2 rounded-r bg-primary transition-[width] duration-150 ease-out',
                        active ? 'w-[3px]' : 'w-0',
                      ].join(' ')}
                    />
                    <Icon
                      className="relative z-10 h-5 w-5 shrink-0"
                      strokeWidth={2}
                      aria-hidden
                    />
                    <span className="relative z-10">{label}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="min-w-0 flex-1 rounded-xl border border-[#D0DCF0] bg-card-white p-6 shadow-sm">
          {section === 'profile' ? (
            <div>
              <h2 className="text-lg font-bold text-text-primary">User Profile</h2>
              <div className="mt-6 flex flex-wrap items-start gap-6 border-b border-[#D0DCF0] pb-6">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#0052A5] text-xl font-bold text-card-white">
                  NH
                </div>
                <div>
                  <p className="text-lg font-bold text-text-primary">Nazia Haque</p>
                  <p className="mt-0.5 text-sm text-text-secondary">
                    Senior Credit Analyst
                  </p>
                  <p className="mt-1 text-sm text-text-secondary">
                    Dhaka Corporate Branch
                  </p>
                  <p className="mt-2 text-xs text-[#4A5568]">
                    Employee ID: BRAC-CA-2847
                  </p>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Full Name" value="Nazia Haque" />
                <FormField
                  label="Email"
                  value="nazia.haque@bracbank.com"
                  type="email"
                />
                <FormField label="Phone" value="+880 1712 345678" />
                <FormField label="Department" value="Corporate Credit" />
                <FormField
                  label="Branch"
                  value="Dhaka Corporate Branch"
                />
              </div>
              <button
                type="button"
                onClick={() => showToast('Profile updated successfully')}
                className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-primary px-5 text-sm font-bold text-card-white transition-colors hover:bg-primary-dark"
              >
                Save Changes
              </button>
            </div>
          ) : null}

          {section === 'notifications' ? (
            <div>
              <h2 className="text-lg font-bold text-text-primary">
                Notification Preferences
              </h2>
              <ul className="mt-6 divide-y divide-[#D0DCF0]">
                {NOTIFICATION_TOGGLES.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-start justify-between gap-4 py-4 first:pt-0"
                  >
                    <div className="min-w-0 flex-1 pr-4">
                      <p className="text-sm font-medium text-text-primary">
                        {item.label}
                      </p>
                      <p className="mt-1 text-xs text-[#4A5568]">
                        {item.description}
                      </p>
                    </div>
                    <ToggleSwitch on={item.on} />
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => showToast('Settings saved')}
                className="mt-4 inline-flex h-10 items-center justify-center rounded-lg bg-primary px-5 text-sm font-bold text-card-white transition-colors hover:bg-primary-dark"
              >
                Save Changes
              </button>
            </div>
          ) : null}

          {section === 'audit' ? (
            <div>
              <h2 className="text-lg font-bold text-text-primary">
                Supported Audit Firm Extraction Templates
              </h2>
              <p className="mt-2 text-sm text-text-secondary">
                The system uses firm-specific templates to accurately extract
                financial data from each audit firm&apos;s statement format.
              </p>
              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                {AUDIT_FIRMS.map((firm, i) => (
                  <div
                    key={firm.name}
                    className={[
                      'rounded-xl border border-[#D0DCF0] bg-surface p-4',
                      i === AUDIT_FIRMS.length - 1 ? 'md:col-span-2' : '',
                    ].join(' ')}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-bold text-text-primary">{firm.name}</p>
                      <span className="shrink-0 rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-semibold text-success">
                        Active
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-[#4A5568]">
                      Template version: v2.1
                    </p>
                    <p className="text-xs text-[#4A5568]">
                      Last updated: March 2025
                    </p>
                    <ul className="mt-3 list-inside list-disc space-y-0.5 text-sm text-text-secondary">
                      {firm.capabilities.map((cap) => (
                        <li key={cap}>{cap}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => showToast('Settings saved')}
                className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-primary px-5 text-sm font-bold text-card-white transition-colors hover:bg-primary-dark"
              >
                Save Changes
              </button>
            </div>
          ) : null}

          {section === 'thresholds' ? (
            <div>
              <h2 className="text-lg font-bold text-text-primary">
                Credit Ratio Thresholds &amp; Scoring Parameters
              </h2>
              <p className="mt-2 text-sm text-text-secondary">
                These thresholds are aligned with Bangladesh Bank BRPD guidelines.
              </p>
              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#D0DCF0] bg-surface text-xs font-medium text-text-secondary">
                      <th className="px-4 py-3">Metric</th>
                      <th className="px-4 py-3 text-success">Healthy (green)</th>
                      <th className="px-4 py-3 text-warning">Watch (amber)</th>
                      <th className="px-4 py-3 text-danger">Critical (red)</th>
                      <th className="px-4 py-3">
                        Bangladesh Bank Guideline
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {THRESHOLD_ROWS.map((row) => (
                      <tr
                        key={row.metric}
                        className="border-b border-[#D0DCF0] last:border-b-0"
                      >
                        <td className="px-4 py-3 font-medium text-text-primary">
                          {row.metric}
                        </td>
                        <td className="px-4 py-3 text-success">{row.healthy}</td>
                        <td className="px-4 py-3 text-warning">{row.watch}</td>
                        <td className="px-4 py-3 text-danger">{row.critical}</td>
                        <td className="px-4 py-3 text-text-secondary">
                          {row.guideline}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-xs text-[#4A5568]">
                Thresholds last reviewed: January 2025 · Next review: January
                2026 · Approved by: Chief Credit Officer
              </p>
              <button
                type="button"
                disabled
                className="mt-4 inline-flex h-10 cursor-not-allowed items-center justify-center rounded-lg border border-[#D0DCF0] bg-surface px-5 text-sm font-medium text-text-secondary opacity-60"
              >
                Request Threshold Revision
              </button>
              <button
                type="button"
                onClick={() => showToast('Settings saved')}
                className="ml-3 mt-4 inline-flex h-10 items-center justify-center rounded-lg bg-primary px-5 text-sm font-bold text-card-white transition-colors hover:bg-primary-dark"
              >
                Save Changes
              </button>
            </div>
          ) : null}

          {section === 'system' ? (
            <div>
              <h2 className="text-lg font-bold text-text-primary">
                System Information
              </h2>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-3">
                  <InfoBlock label="Application Version" value="v2.4.1" />
                  <InfoBlock
                    label="Deployment Environment"
                    value="Production"
                  />
                  <InfoBlock label="Last Deploy" value="15 May 2025" />
                  <InfoBlock label="Uptime" value="99.97%" />
                </div>
                <div className="space-y-3">
                  <InfoBlock
                    label="OCR Engine"
                    value="Azure Document Intelligence"
                  />
                  <InfoBlock
                    label="Bangladesh Bank Compliance"
                    value="BRPD Circular 2023"
                  />
                  <InfoBlock
                    label="Data Residency"
                    value="Bangladesh (AWS ap-south-1)"
                  />
                </div>
              </div>

              <h3 className="mt-8 text-base font-bold text-text-primary">
                Compliance Certificates
              </h3>
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-[10px] border border-[#D0DCF0] bg-card-white p-4">
                  <p className="text-sm font-semibold text-text-primary">
                    Bangladesh Bank BRPD Compliance
                  </p>
                  <span className="mt-2 inline-flex rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-semibold text-success">
                    Certified
                  </span>
                  <p className="mt-2 text-xs text-[#4A5568]">
                    Valid until Dec 2025
                  </p>
                </div>
                <div className="rounded-[10px] border border-[#D0DCF0] bg-card-white p-4">
                  <p className="text-sm font-semibold text-text-primary">
                    ISO 27001 Data Security
                  </p>
                  <span className="mt-2 inline-flex rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-semibold text-success">
                    Certified
                  </span>
                  <p className="mt-2 text-xs text-[#4A5568]">
                    Valid until Aug 2025
                  </p>
                </div>
                <div className="rounded-[10px] border border-[#D0DCF0] bg-card-white p-4">
                  <p className="text-sm font-semibold text-text-primary">
                    ICAB Auditor Registry Integration
                  </p>
                  <span className="mt-2 inline-flex rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-primary">
                    Active
                  </span>
                  <p className="mt-2 text-xs text-[#4A5568]">
                    Connected to ICAB registry API
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <Toast open={toastOpen} message={toastMessage} onClose={closeToast} />
    </div>
  )
}
