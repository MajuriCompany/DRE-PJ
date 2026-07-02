import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency, formatPercent } from '@/lib/utils'
import type { VertenteComparisonRow } from '@/types'
import { TrendingUp, TrendingDown, DollarSign, Percent } from 'lucide-react'

interface VertenteComparisonProps {
  rows: VertenteComparisonRow[]
}

function ComparisonColumn({ row, color }: { row: VertenteComparisonRow; color: string }) {
  const lucroColor = row.lucroLiquido >= 0 ? 'text-green-600' : 'text-red-500'
  const margemColor =
    row.margemLiquida >= 30 ? 'text-green-600' : row.margemLiquida >= 10 ? 'text-orange-500' : 'text-red-500'

  return (
    <div className="flex-1 space-y-3">
      <h3 className={`text-sm font-semibold text-center ${color}`}>{row.vertente}</h3>

      <div className="rounded-lg border border-green-100 bg-green-50 p-3">
        <div className="flex items-center gap-1.5 mb-1">
          <TrendingUp className="h-3.5 w-3.5 text-green-500" />
          <span className="text-[10px] font-medium text-green-700 uppercase tracking-wider">Receitas</span>
        </div>
        <p className="text-base font-bold text-green-700 tabular-nums">{formatCurrency(row.faturamentoBruto)}</p>
        <p className="text-[10px] text-green-600 mt-0.5">0.0% do total</p>
      </div>

      <div className="rounded-lg border border-red-100 bg-red-50 p-3">
        <div className="flex items-center gap-1.5 mb-1">
          <TrendingDown className="h-3.5 w-3.5 text-red-500" />
          <span className="text-[10px] font-medium text-red-700 uppercase tracking-wider">Despesas</span>
        </div>
        <p className="text-base font-bold text-red-600 tabular-nums">{formatCurrency(row.despesas)}</p>
      </div>

      <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
        <div className="flex items-center gap-1.5 mb-1">
          <DollarSign className="h-3.5 w-3.5 text-gray-500" />
          <span className="text-[10px] font-medium text-gray-600 uppercase tracking-wider">Lucro Líquido</span>
        </div>
        <p className={`text-base font-bold tabular-nums ${lucroColor}`}>{formatCurrency(row.lucroLiquido)}</p>
      </div>

      <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
        <div className="flex items-center gap-1.5 mb-1">
          <Percent className="h-3.5 w-3.5 text-gray-500" />
          <span className="text-[10px] font-medium text-gray-600 uppercase tracking-wider">Margem de Lucro</span>
        </div>
        <p className={`text-base font-bold tabular-nums ${margemColor}`}>{formatPercent(row.margemLiquida)}</p>
      </div>
    </div>
  )
}

export function VertenteComparison({ rows }: VertenteComparisonProps) {
  const servico = rows.find((r) => r.vertente === 'Serviço')
  const info = rows.find((r) => r.vertente === 'Infoproduto')

  if (!servico || !info) return null

  return (
    <Card className="bg-white border border-gray-100 shadow-sm">
      <CardContent className="p-5">
        <h2 className="text-sm font-semibold text-gray-800 mb-4 text-center">Comparativo: Serviço vs Infoproduto</h2>
        <div className="flex gap-4">
          <ComparisonColumn row={servico} color="text-blue-600" />
          <div className="w-px bg-gray-100" />
          <ComparisonColumn row={info} color="text-purple-600" />
        </div>
      </CardContent>
    </Card>
  )
}
