import { formatCurrency } from '@/lib/utils'

interface TotalBadgeProps {
  total: number
  label?: string
  color?: 'income' | 'expense' | 'infoproduto' | 'default'
}

const colorMap = {
  income: 'border-[#22C55E]/30 bg-[#22C55E]/10 text-[#22C55E]',
  expense: 'border-[#EF4444]/30 bg-[#EF4444]/10 text-[#EF4444]',
  infoproduto: 'border-[#A855F7]/30 bg-[#A855F7]/10 text-[#A855F7]',
  default: 'border-[#2D3E57] bg-[#0F172A] text-[#E2E8F0]',
}

export function TotalBadge({ total, label = 'Total', color = 'default' }: TotalBadgeProps) {
  return (
    <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${colorMap[color]}`}>
      <span className="text-[#94A3B8]">{label}:</span>
      <span className="font-mono font-semibold">{formatCurrency(total)}</span>
    </div>
  )
}
