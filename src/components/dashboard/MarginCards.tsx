import { Card, CardContent } from '@/components/ui/card'
import { formatPercent, formatCurrency } from '@/lib/utils'
import type { MarginData, KPIData } from '@/types'

interface MarginCardsProps {
  margins: MarginData
  kpi: KPIData
}

function MarginItem({ label, value }: { label: string; value: number }) {
  const isPositive = value >= 0
  const color = value >= 30 ? 'text-[#22C55E]' : value >= 10 ? 'text-[#F97316]' : 'text-[#EF4444]'
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-xs text-[#94A3B8]">{label}</span>
      <span className={`text-sm font-bold tabular-nums ${isPositive ? color : 'text-[#EF4444]'}`}>
        {formatPercent(value)}
      </span>
    </div>
  )
}

export function MarginCards({ margins, kpi }: MarginCardsProps) {
  const lucroLiquido = kpi.faturamentoLiquido - kpi.despesasTotal

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="border-l-4 border-l-[#F97316]">
        <CardContent className="p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-3">
            Margens — Base: Faturamento Bruto
          </p>
          <MarginItem label="Margem Bruta" value={margins.mgBruta} />
          <div className="border-t border-[#2D3E57] my-1" />
          <MarginItem
            label={`Margem Bruta (pós Pró-Labore ${formatCurrency(kpi.proLabore)})`}
            value={margins.mgBrutaPosProLabore}
          />
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-[#F97316]">
        <CardContent className="p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-3">
            Margens — Base: Faturamento Líquido / Comissão
          </p>
          <MarginItem label="Margem Líquida" value={margins.mgLiquida} />
          <div className="border-t border-[#2D3E57] my-1" />
          <MarginItem
            label={`Margem Líquida (pós Pró-Labore ${formatCurrency(kpi.proLabore)})`}
            value={margins.mgLiquidaPosProLabore}
          />
          <div className="border-t border-[#2D3E57] mt-2 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#475569]">Lucro Líquido</span>
              <span className={`text-sm font-bold tabular-nums ${lucroLiquido >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                {formatCurrency(lucroLiquido)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
