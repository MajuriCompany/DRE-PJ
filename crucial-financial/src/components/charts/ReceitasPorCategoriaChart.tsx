import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { PieChartBase } from './PieChartBase'
import { TotalBadge } from './TotalBadge'
import type { ChartDataItem } from '@/types'

interface ReceitasPorCategoriaChartProps {
  data: ChartDataItem[]
}

export function ReceitasPorCategoriaChart({ data }: ReceitasPorCategoriaChartProps) {
  const total = data.reduce((s, d) => s + d.value, 0)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle>Receitas por Categoria</CardTitle>
          <TotalBadge total={total} label="Total" color="income" />
        </div>
      </CardHeader>
      <CardContent>
        <PieChartBase data={data} height={260} />
      </CardContent>
    </Card>
  )
}
