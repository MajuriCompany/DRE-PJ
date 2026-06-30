import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { formatCurrency, formatPercent } from '@/lib/utils'
import type { VertenteComparisonRow } from '@/types'

interface VertenteComparisonProps {
  rows: VertenteComparisonRow[]
}

export function VertenteComparison({ rows }: VertenteComparisonProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparativo por Vertente</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2D3E57]">
                {['Vertente', 'Fat. Bruto', 'Fat. Líquido', 'Despesas', 'Lucro Líquido', 'Margem Líquida'].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => {
                const isTotal = row.vertente.includes('Consolidado')
                const lucroColor = row.lucroLiquido >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'
                const margemColor =
                  row.margemLiquida >= 30
                    ? 'text-[#22C55E]'
                    : row.margemLiquida >= 10
                    ? 'text-[#F97316]'
                    : 'text-[#EF4444]'
                return (
                  <tr
                    key={i}
                    className={`border-b border-[#2D3E57]/50 ${isTotal ? 'bg-[#1E293B]/80 font-semibold' : 'hover:bg-[#1E293B]/30'}`}
                  >
                    <td className="px-4 py-3 text-[#E2E8F0] text-xs whitespace-nowrap">
                      {isTotal ? (
                        <span className="font-bold">{row.vertente}</span>
                      ) : (
                        <span className="text-[#94A3B8]">{row.vertente}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-[#E2E8F0] whitespace-nowrap">
                      {formatCurrency(row.faturamentoBruto)}
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-[#94A3B8] whitespace-nowrap">
                      {formatCurrency(row.faturamentoLiquido)}
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-[#EF4444] whitespace-nowrap">
                      {formatCurrency(row.despesas)}
                    </td>
                    <td className={`px-4 py-3 text-xs font-mono whitespace-nowrap ${lucroColor}`}>
                      {formatCurrency(row.lucroLiquido)}
                    </td>
                    <td className={`px-4 py-3 text-xs font-bold whitespace-nowrap ${margemColor}`}>
                      {formatPercent(row.margemLiquida)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
