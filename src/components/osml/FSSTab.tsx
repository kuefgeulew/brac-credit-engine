import { ArrowRight, TrendingDown, TrendingUp } from 'lucide-react'
import OsmlDownloadButton from './OsmlDownloadButton'
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

type YoyTone = 'green' | 'red' | 'neutral'

type IncomeRow = {
  label: string
  fy23: number
  fy24: number
  fy25: number
  yoy?: string
  yoyTone?: YoyTone
  bold?: boolean
}

type BalanceRow = {
  label: string
  fy23: number
  fy24: number
  fy25: number
  kind: 'group' | 'data' | 'subtotal' | 'total-double'
}

type CashFlowRow = {
  label: string
  fy23: number
  fy24: number
  fy25: number
}

type RatioTrend = 'flat' | 'improving' | 'recovering' | 'deteriorating' | 'declining' | 'worsening'

type RatioCardData = {
  title: string
  values: [number, number, number]
  display: [string, string, string]
  trend: RatioTrend
  trendLabel: string
}

const INCOME_STATEMENT: IncomeRow[] = [
  {
    label: 'Sales / Revenue',
    fy23: 1_396_131,
    fy24: 1_736_066,
    fy25: 1_412_761,
    yoy: '-18.6%',
    yoyTone: 'red',
  },
  { label: 'VAT & Supplementary Duty', fy23: 0, fy24: 0, fy25: 0, yoy: '—', yoyTone: 'neutral' },
  {
    label: 'Net Sales / Revenue',
    fy23: 1_396_131,
    fy24: 1_736_066,
    fy25: 1_412_761,
    yoy: '-18.6%',
    yoyTone: 'red',
  },
  {
    label: 'Cost of Goods Sold',
    fy23: 1_144_305,
    fy24: 1_473_624,
    fy25: 1_187_045,
    yoy: '-19.4%',
    yoyTone: 'green',
  },
  {
    label: 'GROSS PROFIT',
    fy23: 251_826,
    fy24: 262_443,
    fy25: 225_715,
    yoy: '-14.0%',
    yoyTone: 'red',
    bold: true,
  },
  {
    label: 'Marketing & Selling Expenses',
    fy23: 34_598,
    fy24: 4_766,
    fy25: 3_381,
    yoy: '-29.1%',
    yoyTone: 'green',
  },
  {
    label: 'Administrative Expenses',
    fy23: 4_195,
    fy24: 41_358,
    fy25: 29_693,
    yoy: '-28.2%',
    yoyTone: 'green',
  },
  {
    label: 'Depreciation / Amortization',
    fy23: 13_329,
    fy24: 19_390,
    fy25: 20_870,
    yoy: '+7.6%',
    yoyTone: 'red',
  },
  {
    label: 'Total Operating Expenses',
    fy23: 52_122,
    fy24: 65_514,
    fy25: 53_944,
    yoy: '-17.7%',
    yoyTone: 'green',
  },
  {
    label: 'OPERATING PROFIT',
    fy23: 199_704,
    fy24: 196_928,
    fy25: 171_771,
    yoy: '-12.8%',
    yoyTone: 'red',
    bold: true,
  },
  {
    label: 'Other Income',
    fy23: 738,
    fy24: 2_786,
    fy25: 1_975,
    yoy: '-29.1%',
    yoyTone: 'red',
  },
  {
    label: 'EBIT',
    fy23: 200_442,
    fy24: 199_714,
    fy25: 173_746,
    yoy: '-13.0%',
    yoyTone: 'red',
    bold: true,
  },
  {
    label: 'Financial / Interest Expenses',
    fy23: 68_706,
    fy24: 118_784,
    fy25: 80_288,
    yoy: '-32.4%',
    yoyTone: 'green',
  },
  {
    label: 'EBT',
    fy23: 131_736,
    fy24: 80_930,
    fy25: 93_459,
    yoy: '+15.5%',
    yoyTone: 'green',
    bold: true,
  },
  {
    label: 'Total Tax',
    fy23: 19_760,
    fy24: 11_394,
    fy25: 15_902,
    yoy: '+39.6%',
    yoyTone: 'red',
  },
  {
    label: 'NET PROFIT AFTER TAX',
    fy23: 111_976,
    fy24: 69_536,
    fy25: 77_556,
    yoy: '+11.5%',
    yoyTone: 'green',
    bold: true,
  },
  {
    label: 'Total Comprehensive Income',
    fy23: 111_976,
    fy24: 69_536,
    fy25: 77_556,
    yoy: '+11.5%',
    yoyTone: 'green',
  },
]

const BALANCE_SHEET: BalanceRow[] = [
  { label: 'CURRENT ASSETS', fy23: 0, fy24: 0, fy25: 0, kind: 'group' },
  { label: 'Inventories', fy23: 1_596_104, fy24: 1_547_239, fy25: 2_716_118, kind: 'data' },
  {
    label: 'Trade Debtors / Accounts Receivable',
    fy23: 509_309,
    fy24: 943_795,
    fy25: 350_127,
    kind: 'data',
  },
  {
    label: 'Advances, Deposits & Prepayments',
    fy23: 112_100,
    fy24: 71_990,
    fy25: 70_923,
    kind: 'data',
  },
  { label: 'Advance Income Tax', fy23: 14_014, fy24: 9_695, fy25: 15_902, kind: 'data' },
  {
    label: 'Short Term Loan / Investment',
    fy23: 20_465,
    fy24: 22_669,
    fy25: 17_390,
    kind: 'data',
  },
  { label: 'Cash & Bank Balance', fy23: 17_410, fy24: 36_951, fy25: 18_841, kind: 'data' },
  {
    label: 'TOTAL CURRENT ASSETS',
    fy23: 2_269_401,
    fy24: 2_632_340,
    fy25: 3_189_301,
    kind: 'subtotal',
  },
  { label: 'NON-CURRENT ASSETS', fy23: 0, fy24: 0, fy25: 0, kind: 'group' },
  {
    label: 'Net Property, Plant & Equipment',
    fy23: 293_638,
    fy24: 416_977,
    fy25: 447_186,
    kind: 'data',
  },
  {
    label: 'Investment in Subsidiaries',
    fy23: 300_000,
    fy24: 300_000,
    fy25: 300_000,
    kind: 'data',
  },
  { label: 'Other Non-Current Assets', fy23: 27_376, fy24: 50_013, fy25: 55_887, kind: 'data' },
  {
    label: 'TOTAL NON-CURRENT ASSETS',
    fy23: 621_014,
    fy24: 766_990,
    fy25: 803_073,
    kind: 'subtotal',
  },
  {
    label: 'TOTAL ASSETS',
    fy23: 2_890_415,
    fy24: 3_399_330,
    fy25: 3_992_374,
    kind: 'total-double',
  },
  { label: 'CURRENT LIABILITIES', fy23: 0, fy24: 0, fy25: 0, kind: 'group' },
  {
    label: 'Short Term Loan',
    fy23: 1_836_267,
    fy24: 2_342_804,
    fy25: 2_949_367,
    kind: 'data',
  },
  {
    label: 'Current Portion of Long Term Loan',
    fy23: 56_082,
    fy24: 59_269,
    fy25: 57_151,
    kind: 'data',
  },
  {
    label: 'Accounts Payable / Accruals',
    fy23: 179_606,
    fy24: 148_147,
    fy25: 42_588,
    kind: 'data',
  },
  { label: 'Provision for Tax', fy23: 19_760, fy24: 11_394, fy25: 15_902, kind: 'data' },
  {
    label: 'TOTAL CURRENT LIABILITIES',
    fy23: 2_091_715,
    fy24: 2_561_615,
    fy25: 3_065_008,
    kind: 'subtotal',
  },
  { label: 'NON-CURRENT LIABILITIES', fy23: 0, fy24: 0, fy25: 0, kind: 'group' },
  { label: 'Long Term Loan', fy23: 157_875, fy24: 116_555, fy25: 128_650, kind: 'data' },
  {
    label: 'TOTAL NON-CURRENT LIABILITIES',
    fy23: 157_875,
    fy24: 116_555,
    fy25: 128_650,
    kind: 'subtotal',
  },
  {
    label: 'TOTAL LIABILITIES',
    fy23: 2_249_590,
    fy24: 2_678_170,
    fy25: 3_193_658,
    kind: 'subtotal',
  },
  {
    label: 'TOTAL EQUITY (TANGIBLE NET WORTH)',
    fy23: 640_824,
    fy24: 721_160,
    fy25: 798_716,
    kind: 'total-double',
  },
  {
    label: 'TOTAL LIABILITIES & EQUITY',
    fy23: 2_890_415,
    fy24: 3_399_330,
    fy25: 3_992_374,
    kind: 'total-double',
  },
]

const CASH_FLOW: CashFlowRow[] = [
  { label: 'Net Cash from Operating Activities', fy23: -723_189, fy24: 398_402, fy25: 105_171 },
  { label: 'Net Cash from Investing Activities', fy23: -20_827, fy24: -165_366, fy25: -56_954 },
  { label: 'Net Cash from Financing Activities', fy23: 748_508, fy24: -213_494, fy25: -66_327 },
  { label: 'Net Inflow / (Outflow)', fy23: 4_491, fy24: 19_542, fy25: -18_110 },
  { label: 'Opening Cash Balance', fy23: 12_918, fy24: 17_410, fy25: 36_951 },
  { label: 'Closing Cash Balance', fy23: 17_410, fy24: 36_951, fy25: 18_841 },
]

const KEY_RATIOS: RatioCardData[] = [
  {
    title: 'Current Ratio',
    values: [1.085, 1.028, 1.041],
    display: ['1.085', '1.028', '1.041'],
    trend: 'flat',
    trendLabel: 'flat',
  },
  {
    title: 'Debt to Equity',
    values: [3.51, 3.71, 3.99],
    display: ['3.51', '3.71', '3.99'],
    trend: 'deteriorating',
    trendLabel: 'deteriorating',
  },
  {
    title: 'Net Profit Margin',
    values: [8.02, 4.01, 5.49],
    display: ['8.02%', '4.01%', '5.49%'],
    trend: 'recovering',
    trendLabel: 'recovering',
  },
  {
    title: 'Interest Coverage',
    values: [2.92, 1.68, 2.16],
    display: ['2.92x', '1.68x', '2.16x'],
    trend: 'improving',
    trendLabel: 'improving',
  },
  {
    title: 'DSCR',
    values: [1.71, 1.23, 1.42],
    display: ['1.71x', '1.23x', '1.42x'],
    trend: 'improving',
    trendLabel: 'improving',
  },
  {
    title: 'Return on Assets',
    values: [3.87, 2.05, 1.94],
    display: ['3.87%', '2.05%', '1.94%'],
    trend: 'declining',
    trendLabel: 'declining',
  },
  {
    title: 'Asset Turnover',
    values: [0.483, 0.511, 0.354],
    display: ['0.483', '0.511', '0.354'],
    trend: 'declining',
    trendLabel: 'declining',
  },
  {
    title: 'Stock Turnover Days',
    values: [502, 378, 824],
    display: ['502 days', '378 days', '824 days'],
    trend: 'worsening',
    trendLabel: 'worsening',
  },
]

function formatAmount(n: number): { text: string; negative: boolean } {
  const negative = n < 0
  const abs = Math.abs(n)
  const text = negative ? `(${abs.toLocaleString('en-US')})` : abs.toLocaleString('en-US')
  return { text, negative }
}

function yoyClass(tone?: YoyTone): string {
  if (tone === 'green') return 'font-semibold text-[#166534]'
  if (tone === 'red') return 'font-semibold text-[#B91C1C]'
  return 'text-[#4A5568]'
}

function trendStyles(trend: RatioTrend): {
  badge: string
  spark: string
  Icon: typeof TrendingUp | typeof TrendingDown | typeof ArrowRight
} {
  switch (trend) {
    case 'flat':
      return {
        badge: 'bg-[#FEF3C7] text-[#B45309]',
        spark: '#B45309',
        Icon: ArrowRight,
      }
    case 'recovering':
      return {
        badge: 'bg-[#FEF3C7] text-[#B45309]',
        spark: '#B45309',
        Icon: TrendingUp,
      }
    case 'improving':
      return {
        badge: 'bg-[#DCFCE7] text-[#166534]',
        spark: '#1A7C4A',
        Icon: TrendingUp,
      }
    case 'deteriorating':
    case 'declining':
    case 'worsening':
      return {
        badge: 'bg-[#FEE2E2] text-[#B91C1C]',
        spark: '#B91C1C',
        Icon: trend === 'declining' ? TrendingDown : TrendingUp,
      }
  }
}

function AmountCell({ value }: { value: number }) {
  const { text, negative } = formatAmount(value)
  return (
    <td
      className={[
        'px-4 py-2 text-right tabular-nums',
        negative ? 'font-medium text-[#B91C1C]' : 'text-[#0D1B3E]',
      ].join(' ')}
    >
      {text}
    </td>
  )
}

function RatioSparkCard({ card }: { card: RatioCardData }) {
  const styles = trendStyles(card.trend)
  const { Icon } = styles
  const sparkData = card.values.map((value, index) => ({ index, value }))

  return (
    <div className="flex min-h-[160px] flex-col rounded-lg border border-[#D0DCF0] bg-card-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[13px] font-medium text-[#4A5568]">{card.title}</p>
        <span
          className={[
            'inline-flex shrink-0 items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize',
            styles.badge,
          ].join(' ')}
        >
          <Icon className="h-3 w-3" strokeWidth={2.5} aria-hidden />
          {card.trendLabel}
        </span>
      </div>
      <p className="mt-2 text-[22px] font-bold leading-tight text-[#0D1B3E]">
        {card.display[2]}
      </p>
      <div className="mt-1 flex gap-3 text-[10px] tabular-nums text-[#4A5568]">
        <span>
          <span className="font-medium">FY23</span> {card.display[0]}
        </span>
        <span>
          <span className="font-medium">FY24</span> {card.display[1]}
        </span>
        <span>
          <span className="font-medium">FY25</span> {card.display[2]}
        </span>
      </div>
      <div className="mt-auto h-10 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sparkData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
            <XAxis dataKey="index" type="number" hide />
            <YAxis hide width={0} domain={['dataMin', 'dataMax']} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={styles.spark}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default function FSSTab() {
  let balanceRowIndex = 0

  return (
    <div className="space-y-8">
      <section
        className="grid grid-cols-1 gap-4 rounded-xl border border-[#D0DCF0] bg-card-white px-6 py-4 sm:grid-cols-2 lg:grid-cols-4"
        aria-label="Borrower information"
      >
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#4A5568]">
            Company
          </p>
          <p className="mt-1 text-[14px] font-semibold text-[#0D1B3E]">
            Outpace Spinning Mills Ltd.
          </p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#4A5568]">
            Audit Status
          </p>
          <span className="mt-1 inline-flex rounded-full bg-[#FEF3C7] px-2.5 py-0.5 text-[12px] font-semibold text-[#B45309]">
            Unaudited
          </span>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#4A5568]">
            Period
          </p>
          <p className="mt-1 text-[14px] font-medium text-[#0D1B3E]">FY2023 · FY2024 · FY2025</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#4A5568]">
            Currency
          </p>
          <p className="mt-1 text-[14px] font-medium text-[#0D1B3E]">
            BDT Thousands (&apos;000)
          </p>
        </div>
      </section>

      <section
        className="overflow-hidden rounded-xl border border-[#D0DCF0] bg-card-white"
        aria-label="Income statement"
      >
        <div className="flex flex-wrap items-center gap-3 border-b border-[#E2E8F0] px-6 py-4">
          <h2 className="text-[15px] font-bold text-[#0D1B3E]">Income Statement (P&amp;L)</h2>
          <span className="rounded-full bg-[#EFF6FF] px-2.5 py-0.5 text-[11px] font-semibold text-[#0052A5]">
            3-Year Spread
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-[13px]">
            <thead>
              <tr className="bg-[#0052A5] text-[11px] font-semibold uppercase tracking-wide text-white">
                <th className="px-4 py-3">Line Item</th>
                <th className="px-4 py-3 text-right">FY2023</th>
                <th className="px-4 py-3 text-right">FY2024</th>
                <th className="px-4 py-3 text-right">FY2025</th>
                <th className="px-4 py-3 text-right">YoY Change (FY24→25)</th>
              </tr>
            </thead>
            <tbody>
              {INCOME_STATEMENT.map((row) => (
                <tr
                  key={row.label}
                  className={[
                    'border-b border-[#E2E8F0]/60',
                    row.bold ? 'bg-[#EFF6FF] font-bold text-[#0D1B3E]' : 'text-[#0D1B3E]',
                  ].join(' ')}
                >
                  <td className="px-4 py-2.5">{row.label}</td>
                  <AmountCell value={row.fy23} />
                  <AmountCell value={row.fy24} />
                  <AmountCell value={row.fy25} />
                  <td className={['px-4 py-2.5 text-right tabular-nums', yoyClass(row.yoyTone)].join(' ')}>
                    {row.yoy ?? '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section
        className="overflow-hidden rounded-xl border border-[#D0DCF0] bg-card-white"
        aria-label="Balance sheet"
      >
        <div className="border-b border-[#E2E8F0] px-6 py-4">
          <h2 className="text-[15px] font-bold text-[#0D1B3E]">Balance Sheet</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-[13px]">
            <thead>
              <tr className="bg-[#0052A5] text-[11px] font-semibold uppercase tracking-wide text-white">
                <th className="px-4 py-3">Line Item</th>
                <th className="px-4 py-3 text-right">FY2023</th>
                <th className="px-4 py-3 text-right">FY2024</th>
                <th className="px-4 py-3 text-right">FY2025</th>
              </tr>
            </thead>
            <tbody>
              {BALANCE_SHEET.map((row) => {
                if (row.kind === 'group') {
                  return (
                    <tr key={row.label} className="bg-[#E8EDF5] font-bold text-[#0D1B3E]">
                      <td className="px-4 py-2.5" colSpan={4}>
                        {row.label}
                      </td>
                    </tr>
                  )
                }

                const stripe =
                  row.kind === 'data'
                    ? balanceRowIndex++ % 2 === 0
                      ? 'bg-card-white'
                      : 'bg-[#F4F7FB]'
                    : ''

                const rowClass = [
                  'border-b border-[#E2E8F0]/60',
                  stripe,
                  row.kind === 'subtotal' ? 'bg-[#EFF6FF] font-bold text-[#0D1B3E]' : '',
                  row.kind === 'total-double'
                    ? 'border-y-2 border-y-[#0052A5] bg-[#EFF6FF] font-bold text-[#0D1B3E]'
                    : '',
                ]
                  .filter(Boolean)
                  .join(' ')

                return (
                  <tr key={row.label} className={rowClass}>
                    <td className="px-4 py-2.5">{row.label}</td>
                    <AmountCell value={row.fy23} />
                    <AmountCell value={row.fy24} />
                    <AmountCell value={row.fy25} />
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section
        className="overflow-hidden rounded-xl border border-[#D0DCF0] bg-card-white"
        aria-label="Cash flow statement"
      >
        <div className="border-b border-[#E2E8F0] px-6 py-4">
          <h2 className="text-[15px] font-bold text-[#0D1B3E]">Cash Flow Statement</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left text-[13px]">
            <thead>
              <tr className="bg-[#0052A5] text-[11px] font-semibold uppercase tracking-wide text-white">
                <th className="px-4 py-3">Item</th>
                <th className="px-4 py-3 text-right">FY2023</th>
                <th className="px-4 py-3 text-right">FY2024</th>
                <th className="px-4 py-3 text-right">FY2025</th>
              </tr>
            </thead>
            <tbody>
              {CASH_FLOW.map((row, i) => (
                <tr
                  key={row.label}
                  className={[
                    'border-b border-[#E2E8F0]/60',
                    i % 2 === 0 ? 'bg-card-white' : 'bg-[#F4F7FB]',
                  ].join(' ')}
                >
                  <td className="px-4 py-2.5 text-[#0D1B3E]">{row.label}</td>
                  <AmountCell value={row.fy23} />
                  <AmountCell value={row.fy24} />
                  <AmountCell value={row.fy25} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-label="Key ratios summary">
        <h2 className="mb-4 text-[15px] font-bold text-[#0D1B3E]">Key Ratios Summary</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {KEY_RATIOS.map((card) => (
            <RatioSparkCard key={card.title} card={card} />
          ))}
        </div>
      </section>

      <div>
        <OsmlDownloadButton
          filename="OSML-FSS-30062024.xls"
          displayName="OSML-FSS-30062024.xls"
          label="Download FSS Workbook"
        />
      </div>
    </div>
  )
}
