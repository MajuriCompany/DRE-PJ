import { formatCurrency } from '@/lib/utils'

interface TotalBadgeProps {
  total: number
  label?: string
  color?: 'income' | 'expense' | 'infoproduto' | 'default'
}

const colorMap = {
  income: 'border-green-200 bg-green-50 text-green-700',
  expense: 'border-red-200 bg-red-50 text-red-600',
  infoproduto: 'border-purple-200 bg-purple-50 text-purple-700',
  default: 'border-gray-200 bg-gray-50 text-gray-700',
}

export function TotalBadge({ total, label = 'Total', color = 'default' }: TotalBadgeProps) {
  return (
    <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${colorMap[color]}`}>
      <span className="text-gray-500">{label}:</span>
      <span className="font-mono font-semibold">{formatCurrency(total)}</span>
    </div>
  )
}
