import { Card, CardContent } from '@/components/ui/card'
import { formatPercent, formatCurrency } from '@/lib/utils'
import type { MarginData, KPIData } from '@/types'

interface MarginCardsProps {
  margins: MarginData
  kpi: KPIData
}

function MarginItem({ label, value }: { label: string; value: number }) {
  const color =
    value >= 30 ? 'text-green-600' : value >= 10 ? 'text-orange-500' : value < 0 ? 'text-red-500' : 'text-orange-400'
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-xs text-gray-500">{label}</span>
      <span className={`text-sm font-bold tabular-nums ${color}`}>
        {formatPercent(value)}
      </span>
    </div>
  )
}

export function MarginCards({ margins, kpi }: MarginCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <Card className="bg-white border border-gray-100 shadow-sm">
        <CardContent className="p-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-blue-600 mb-3">
            BASE: FATURAMENTO BRUTO
          </p>
          <MarginItem label="MG Bruta" value={margins.mgBruta} />
          <div className="border-t border-gray-100 my-1" />
          <MarginItem
            label={`MG Bruta (pós PL${kpi.proLabore > 0 ? ` ${formatCurrency(kpi.proLabore)}` : ''})`}
            value={margins.mgBrutaPosProLabore}
          />
        </CardContent>
      </Card>

      <Card className="bg-white border border-gray-100 shadow-sm">
        <CardContent className="p-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-blue-600 mb-3">
            BASE: COMISSÃO
          </p>
          <MarginItem label="MG Líquida" value={margins.mgLiquida} />
          <div className="border-t border-gray-100 my-1" />
          <MarginItem
            label={`MG Líquida (pós PL${kpi.proLabore > 0 ? ` ${formatCurrency(kpi.proLabore)}` : ''})`}
            value={margins.mgLiquidaPosProLabore}
          />
        </CardContent>
      </Card>
    </div>
  )
}
