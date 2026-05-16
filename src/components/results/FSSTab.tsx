import { ArrowDown, ArrowUp, FileDown, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { Line, LineChart, ResponsiveContainer, YAxis } from 'recharts'

function formatBdt(n: number) {
  if (!Number.isFinite(n)) return '—'
  const abs = Math.abs(Math.round(n))
  const s = abs.toLocaleString('en-US')
  return n < 0 ? `(${s})` : s
}

function BdtCell({ value, isBold }: { value: number; isBold?: boolean }) {
  const isNeg = value < 0
  return (
    <td
      className={`px-4 py-2.5 text-right tabular-nums ${isBold ? 'font-bold' : ''} ${
        isNeg ? 'text-danger' : 'text-text-primary'
      }`}
    >
      {formatBdt(value)}
    </td>
  )
}

function YoyCell({
  pct,
  goodDirection,
}: {
  pct: number
  goodDirection: 'up' | 'down'
}) {
  const isPos = pct > 0
  const isNeg = pct < 0
  const isGood =
    (goodDirection === 'up' && isPos) || (goodDirection === 'down' && isNeg)
  const colorClass = isGood ? 'text-success' : 'text-danger'
  const Icon = isPos ? ArrowUp : ArrowDown

  return (
    <td className={`px-4 py-2.5 text-right tabular-nums font-semibold ${colorClass}`}>
      <div className="flex items-center justify-end gap-1">
        {pct > 0 ? '+' : ''}
        {pct.toFixed(1)}%
        <Icon className="h-3.5 w-3.5" strokeWidth={2.5} />
      </div>
    </td>
  )
}

function RatioCard({
  title,
  data,
  trend,
  badgeText,
  badgeTone,
}: {
  title: string
  data: number[]
  trend: string
  badgeText: string
  badgeTone: 'success' | 'warning' | 'danger'
}) {
  const latest = data[2]
  const badgeClass =
    badgeTone === 'success'
      ? 'bg-success/15 text-success ring-success/30'
      : badgeTone === 'warning'
        ? 'bg-warning/15 text-warning ring-warning/30'
        : 'bg-danger/15 text-danger ring-danger/30'

  const sparkData = data.map((val, i) => ({ index: i, value: val }))
  const strokeColor =
    badgeTone === 'success'
      ? '#1A7C4A'
      : badgeTone === 'warning'
        ? '#B45309'
        : '#B91C1C'

  return (
    <div className="flex flex-col justify-between rounded-[10px] border border-[#D0DCF0] bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
          {title}
        </p>
        <span
          className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${badgeClass}`}
        >
          {badgeText}
        </span>
      </div>
      <div className="mt-3 flex items-end justify-between gap-4">
        <div>
          <p className="text-2xl font-bold leading-none text-text-primary">
            {latest.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 3 })}
          </p>
          <p className="mt-1 text-xs text-text-secondary">{trend}</p>
        </div>
        <div className="h-10 w-16">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparkData}>
              <YAxis hide domain={['dataMin - 0.1', 'dataMax + 0.1']} />
              <Line
                type="monotone"
                dataKey="value"
                stroke={strokeColor}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default function FSSTab() {
  const [downloading, setDownloading] = useState(false)

  const handleDownload = () => {
    if (downloading) return
    setDownloading(true)
    setTimeout(() => {
      const link = document.createElement('a')
      link.href = '/OSML-FSS-30062024.xls'
      link.download = 'OSML-FSS-30062024.xls'
      link.click()
      setDownloading(false)
    }, 800)
  }

  return (
    <div className="space-y-6 pb-8">
      {/* SECTION 1 — DATA CONTEXT STRIP */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-xl border border-border bg-card-white px-6 py-4 shadow-sm text-sm">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-text-secondary">Company:</span>
          <span className="font-bold text-text-primary">Outpace Spinning Mills Ltd.</span>
        </div>
        <div className="h-4 w-px bg-border hidden sm:block" />
        <div className="flex items-center gap-2">
          <span className="font-semibold text-text-secondary">Audit:</span>
          <span className="inline-flex rounded-md bg-warning/15 px-2 py-0.5 text-xs font-semibold text-warning ring-1 ring-warning/30">
            Unaudited
          </span>
        </div>
        <div className="h-4 w-px bg-border hidden sm:block" />
        <div className="flex items-center gap-2">
          <span className="font-semibold text-text-secondary">Period:</span>
          <span className="font-medium text-text-primary">FY2023–FY2025</span>
        </div>
        <div className="h-4 w-px bg-border hidden sm:block" />
        <div className="flex items-center gap-2">
          <span className="font-semibold text-text-secondary">Unit:</span>
          <span className="font-medium text-text-primary">BDT '000</span>
        </div>
      </div>

      {/* SECTION 2 — INCOME STATEMENT */}
      <section className="rounded-xl border border-border bg-card-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h3 className="text-[15px] font-bold text-text-primary">Profit & Loss Statement — 3 Year Spread</h3>
          <span className="rounded-md bg-surface px-2 py-1 text-xs font-medium text-text-secondary">
            All figures BDT '000
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-[#0052A5] text-white">
                <th className="px-4 py-3 font-bold">Line Item</th>
                <th className="px-4 py-3 font-bold text-right">FY2023</th>
                <th className="px-4 py-3 font-bold text-right">FY2024</th>
                <th className="px-4 py-3 font-bold text-right">FY2025</th>
                <th className="px-4 py-3 font-bold text-right">Change FY24→25</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="px-4 py-2.5 text-text-primary">Sales / Revenue</td>
                <BdtCell value={1396131} />
                <BdtCell value={1736066} />
                <BdtCell value={1412761} />
                <YoyCell pct={-18.6} goodDirection="up" />
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-2.5 text-text-primary">VAT & Supplementary Duty</td>
                <td className="px-4 py-2.5 text-right text-text-secondary">—</td>
                <td className="px-4 py-2.5 text-right text-text-secondary">—</td>
                <td className="px-4 py-2.5 text-right text-text-secondary">—</td>
                <td className="px-4 py-2.5 text-right text-text-secondary">—</td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-2.5 text-text-primary">Net Sales / Revenue</td>
                <BdtCell value={1396131} />
                <BdtCell value={1736066} />
                <BdtCell value={1412761} />
                <YoyCell pct={-18.6} goodDirection="up" />
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-2.5 text-text-primary">Cost of Goods Sold</td>
                <BdtCell value={1144305} />
                <BdtCell value={1473624} />
                <BdtCell value={1187045} />
                <YoyCell pct={-19.4} goodDirection="down" />
              </tr>
              <tr className="border-b border-border bg-[#EFF6FF]">
                <td className="px-4 py-2.5 font-bold text-text-primary">GROSS PROFIT</td>
                <BdtCell value={251826} isBold />
                <BdtCell value={262443} isBold />
                <BdtCell value={225715} isBold />
                <YoyCell pct={-14.0} goodDirection="up" />
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-2.5 text-text-primary">Marketing & Selling Expenses</td>
                <BdtCell value={34598} />
                <BdtCell value={4766} />
                <BdtCell value={3381} />
                <YoyCell pct={-29.1} goodDirection="down" />
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-2.5 text-text-primary">Administrative Expenses</td>
                <BdtCell value={4195} />
                <BdtCell value={41358} />
                <BdtCell value={29693} />
                <YoyCell pct={-28.2} goodDirection="down" />
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-2.5 text-text-primary">Depreciation/Amortization</td>
                <BdtCell value={13329} />
                <BdtCell value={19390} />
                <BdtCell value={20870} />
                <YoyCell pct={7.6} goodDirection="down" />
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-2.5 text-text-primary">Total Operating Expenses</td>
                <BdtCell value={52122} />
                <BdtCell value={65514} />
                <BdtCell value={53944} />
                <YoyCell pct={-17.7} goodDirection="down" />
              </tr>
              <tr className="border-b border-border bg-[#EFF6FF]">
                <td className="px-4 py-2.5 font-bold text-text-primary">OPERATING PROFIT</td>
                <BdtCell value={199704} isBold />
                <BdtCell value={196928} isBold />
                <BdtCell value={171771} isBold />
                <YoyCell pct={-12.8} goodDirection="up" />
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-2.5 text-text-primary">Other Income</td>
                <BdtCell value={738} />
                <BdtCell value={2786} />
                <BdtCell value={1975} />
                <YoyCell pct={-29.1} goodDirection="up" />
              </tr>
              <tr className="border-b border-border bg-[#EFF6FF]">
                <td className="px-4 py-2.5 font-bold text-text-primary">EBIT</td>
                <BdtCell value={200442} isBold />
                <BdtCell value={199714} isBold />
                <BdtCell value={173746} isBold />
                <YoyCell pct={-13.0} goodDirection="up" />
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-2.5 text-text-primary">Interest / Financial Expenses</td>
                <BdtCell value={68706} />
                <BdtCell value={118784} />
                <BdtCell value={80288} />
                <YoyCell pct={-32.4} goodDirection="down" />
              </tr>
              <tr className="border-b border-border bg-[#EFF6FF]">
                <td className="px-4 py-2.5 font-bold text-text-primary">EBT</td>
                <BdtCell value={131736} isBold />
                <BdtCell value={80930} isBold />
                <BdtCell value={93459} isBold />
                <YoyCell pct={15.5} goodDirection="up" />
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-2.5 text-text-primary">Total Tax</td>
                <BdtCell value={19760} />
                <BdtCell value={11394} />
                <BdtCell value={15902} />
                <YoyCell pct={39.6} goodDirection="down" />
              </tr>
              <tr className="border-b-2 border-[#0052A5] bg-[#EFF6FF]">
                <td className="px-4 py-2.5 font-bold text-text-primary">NET PROFIT AFTER TAX</td>
                <BdtCell value={111976} isBold />
                <BdtCell value={69536} isBold />
                <BdtCell value={77556} isBold />
                <YoyCell pct={11.5} goodDirection="up" />
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 3 — BALANCE SHEET */}
      <section className="rounded-xl border border-border bg-card-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h3 className="text-[15px] font-bold text-text-primary">Balance Sheet — 3 Year Spread</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-[#0052A5] text-white">
                <th className="px-4 py-3 font-bold">Line Item</th>
                <th className="px-4 py-3 font-bold text-right">FY2023</th>
                <th className="px-4 py-3 font-bold text-right">FY2024</th>
                <th className="px-4 py-3 font-bold text-right">FY2025</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-[#F1F5F9]">
                <td colSpan={4} className="px-4 py-2 font-bold text-text-primary">CURRENT ASSETS</td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-2.5 text-text-primary">Inventories</td>
                <BdtCell value={1596104} />
                <BdtCell value={1547239} />
                <BdtCell value={2716118} />
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-2.5 text-text-primary">Trade Debtors/Receivables</td>
                <BdtCell value={509309} />
                <BdtCell value={943795} />
                <BdtCell value={350127} />
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-2.5 text-text-primary">Advances, Deposits & Prep.</td>
                <BdtCell value={112100} />
                <BdtCell value={71990} />
                <BdtCell value={70923} />
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-2.5 text-text-primary">Advance Income Tax</td>
                <BdtCell value={14014} />
                <BdtCell value={9695} />
                <BdtCell value={15902} />
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-2.5 text-text-primary">Short Term Loan/Investment</td>
                <BdtCell value={20465} />
                <BdtCell value={22669} />
                <BdtCell value={17390} />
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-2.5 text-text-primary">Cash & Bank Balance</td>
                <BdtCell value={17410} />
                <BdtCell value={36951} />
                <BdtCell value={18841} />
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-2.5 font-bold text-text-primary">TOTAL CURRENT ASSETS</td>
                <BdtCell value={2269401} isBold />
                <BdtCell value={2632340} isBold />
                <BdtCell value={3189301} isBold />
              </tr>

              <tr className="bg-[#F1F5F9]">
                <td colSpan={4} className="px-4 py-2 font-bold text-text-primary">NON-CURRENT ASSETS</td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-2.5 text-text-primary">Net Property, Plant & Equip.</td>
                <BdtCell value={293638} />
                <BdtCell value={416977} />
                <BdtCell value={447186} />
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-2.5 text-text-primary">Investment in Subsidiaries</td>
                <BdtCell value={300000} />
                <BdtCell value={300000} />
                <BdtCell value={300000} />
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-2.5 text-text-primary">Other Non-Current Assets</td>
                <BdtCell value={27376} />
                <BdtCell value={50013} />
                <BdtCell value={55887} />
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-2.5 font-bold text-text-primary">TOTAL NON-CURRENT ASSETS</td>
                <BdtCell value={621014} isBold />
                <BdtCell value={766990} isBold />
                <BdtCell value={803073} isBold />
              </tr>
              <tr className="border-b-4 border-double border-border">
                <td className="px-4 py-2.5 font-bold text-text-primary">TOTAL ASSETS</td>
                <BdtCell value={2890415} isBold />
                <BdtCell value={3399330} isBold />
                <BdtCell value={3992374} isBold />
              </tr>

              <tr className="bg-[#F1F5F9]">
                <td colSpan={4} className="px-4 py-2 font-bold text-text-primary">CURRENT LIABILITIES</td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-2.5 text-text-primary">Short Term Loan</td>
                <BdtCell value={1836267} />
                <BdtCell value={2342804} />
                <BdtCell value={2949367} />
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-2.5 text-text-primary">Current Portion of LT Loan</td>
                <BdtCell value={56082} />
                <BdtCell value={59269} />
                <BdtCell value={57151} />
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-2.5 text-text-primary">Accounts Payable/Accruals</td>
                <BdtCell value={179606} />
                <BdtCell value={148147} />
                <BdtCell value={42588} />
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-2.5 text-text-primary">Provision for Tax</td>
                <BdtCell value={19760} />
                <BdtCell value={11394} />
                <BdtCell value={15902} />
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-2.5 font-bold text-text-primary">TOTAL CURRENT LIAB.</td>
                <BdtCell value={2091715} isBold />
                <BdtCell value={2561615} isBold />
                <BdtCell value={3065008} isBold />
              </tr>

              <tr className="bg-[#F1F5F9]">
                <td colSpan={4} className="px-4 py-2 font-bold text-text-primary">NON-CURRENT LIABILITIES</td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-2.5 text-text-primary">Long Term Loan</td>
                <BdtCell value={157875} />
                <BdtCell value={116555} />
                <BdtCell value={128650} />
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-2.5 font-bold text-text-primary">TOTAL NON-CURRENT LIAB.</td>
                <BdtCell value={157875} isBold />
                <BdtCell value={116555} isBold />
                <BdtCell value={128650} isBold />
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-2.5 font-bold text-text-primary">TOTAL LIABILITIES</td>
                <BdtCell value={2249590} isBold />
                <BdtCell value={2678170} isBold />
                <BdtCell value={3193658} isBold />
              </tr>
              <tr className="border-b-4 border-double border-border">
                <td className="px-4 py-2.5 font-bold text-text-primary">TOTAL EQUITY (Tangible Net Worth)</td>
                <BdtCell value={640824} isBold />
                <BdtCell value={721160} isBold />
                <BdtCell value={798716} isBold />
              </tr>
              <tr className="border-b-4 border-double border-border">
                <td className="px-4 py-2.5 font-bold text-text-primary">TOTAL LIABILITIES & EQUITY</td>
                <BdtCell value={2890415} isBold />
                <BdtCell value={3399330} isBold />
                <BdtCell value={3992374} isBold />
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 4 — CASH FLOW STATEMENT */}
      <section className="rounded-xl border border-border bg-card-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h3 className="text-[15px] font-bold text-text-primary">Cash Flow Statement</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-[#0052A5] text-white">
                <th className="px-4 py-3 font-bold">Line Item</th>
                <th className="px-4 py-3 font-bold text-right">FY2023</th>
                <th className="px-4 py-3 font-bold text-right">FY2024</th>
                <th className="px-4 py-3 font-bold text-right">FY2025</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="px-4 py-2.5 text-text-primary">Net Cash from Operating Activities</td>
                <BdtCell value={-723189} />
                <BdtCell value={398402} />
                <BdtCell value={105171} />
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-2.5 text-text-primary">Net Cash from Investing Activities</td>
                <BdtCell value={-20827} />
                <BdtCell value={-165366} />
                <BdtCell value={-56954} />
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-2.5 text-text-primary">Net Cash from Financing Activities</td>
                <BdtCell value={748508} />
                <BdtCell value={-213494} />
                <BdtCell value={-66327} />
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-2.5 font-bold text-text-primary">Net Inflow / (Outflow)</td>
                <BdtCell value={4491} isBold />
                <BdtCell value={19542} isBold />
                <BdtCell value={-18110} isBold />
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-2.5 text-text-primary">Opening Cash Balance</td>
                <BdtCell value={12918} />
                <BdtCell value={17410} />
                <BdtCell value={36951} />
              </tr>
              <tr className="border-b-2 border-[#0052A5]">
                <td className="px-4 py-2.5 font-bold text-text-primary">Closing Cash Balance</td>
                <BdtCell value={17410} isBold />
                <BdtCell value={36951} isBold />
                <BdtCell value={18841} isBold />
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 5 — KEY RATIO CARDS */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <RatioCard
          title="Current Ratio"
          data={[1.085, 1.028, 1.041]}
          trend="→ flat"
          badgeText="Watch"
          badgeTone="warning"
        />
        <RatioCard
          title="Debt to Equity"
          data={[3.51, 3.71, 3.99]}
          trend="↑ worsening"
          badgeText="Critical"
          badgeTone="danger"
        />
        <RatioCard
          title="Net Profit Margin (%)"
          data={[8.02, 4.01, 5.49]}
          trend="recovering"
          badgeText="Watch"
          badgeTone="warning"
        />
        <RatioCard
          title="Interest Coverage"
          data={[2.92, 1.68, 2.16]}
          trend="↑ improving"
          badgeText="Watch"
          badgeTone="warning"
        />
        <RatioCard
          title="DSCR"
          data={[1.71, 1.23, 1.42]}
          trend="↑ improving"
          badgeText="Watch"
          badgeTone="warning"
        />
        <RatioCard
          title="Return on Assets (%)"
          data={[3.87, 2.05, 1.94]}
          trend="↓ declining"
          badgeText="Critical"
          badgeTone="danger"
        />
        <RatioCard
          title="Asset Turnover"
          data={[0.483, 0.511, 0.354]}
          trend="↓ declining"
          badgeText="Critical"
          badgeTone="danger"
        />
        <RatioCard
          title="Stock Turnover (days)"
          data={[502, 378, 824]}
          trend="↑ worsening"
          badgeText="Critical"
          badgeTone="danger"
        />
      </section>

      {/* SECTION 6 — DOWNLOAD BUTTON */}
      <div className="flex justify-center pt-4">
        <button
          type="button"
          disabled={downloading}
          onClick={handleDownload}
          className="inline-flex h-12 w-full max-w-md items-center justify-center gap-2 rounded-xl bg-success px-6 text-sm font-bold text-white transition-colors hover:bg-success/90 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {downloading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" strokeWidth={2} />
              Generating Workbook...
            </>
          ) : (
            <>
              <FileDown className="h-5 w-5" strokeWidth={2} />
              Download FSS Workbook
            </>
          )}
        </button>
      </div>
    </div>
  )
}
