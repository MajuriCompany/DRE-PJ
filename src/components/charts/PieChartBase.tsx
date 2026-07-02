'use client'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { ChartDataItem } from '@/types'
import { formatCurrency } from '@/lib/utils'

interface PieChartBaseProps {
  data: ChartDataItem[]
  height?: number
  showLegend?: boolean
  innerRadius?: number
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: ChartDataItem }> }) {
  if (!active || !payload?.length) return null
  const item = payload[0]
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-lg text-xs">
      <p className="font-medium text-gray-800 mb-1">{item.name}</p>
      <p className="font-mono text-green-600">{formatCurrency(item.value)}</p>
    </div>
  )
}

function CustomLegend({ payload }: { payload?: Array<{ value: string; color: string; payload: ChartDataItem }> }) {
  if (!payload?.length) return null
  const total = payload.reduce((s, e) => s + (e.payload?.value || 0), 0)
  return (
    <ul className="space-y-2 mt-4 px-1">
      {payload.map((entry, i) => {
        const val = entry.payload?.value || 0
        const pct = total > 0 ? ((val / total) * 100).toFixed(1) : '0.0'
        return (
          <li key={i} className="flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
              <span className="truncate text-gray-600 max-w-[120px]">{entry.value}</span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="font-mono text-gray-700">{formatCurrency(val)}</span>
              <span className="text-gray-400 w-10 text-right font-medium">{pct}%</span>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export function PieChartBase({ data, height = 260, showLegend = true, innerRadius = 55 }: PieChartBaseProps) {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center text-gray-400 text-sm" style={{ height }}>
        Sem dados para exibir
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={showLegend ? height + data.length * 28 : height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy={height / 2}
          innerRadius={innerRadius}
          outerRadius={innerRadius + 55}
          paddingAngle={2}
          dataKey="value"
          nameKey="name"
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} strokeWidth={0} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        {showLegend && <Legend content={<CustomLegend />} />}
      </PieChart>
    </ResponsiveContainer>
  )
}
