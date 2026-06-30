import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { PieChartBase } from './PieChartBase'
import { TotalBadge } from './TotalBadge'
import type { ChartDataItem } from '@/types'

interface LucroDistributionChartProps {
  data: ChartDataItem[]
}

export function LucroDistributionChart({ data }: LucroDistributionChartProps) {
  const total = data.reduce((s, d) => s + d.value, 0)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle>Distribuição de Lucro Líquido por Fonte</CardTitle>
          <TotalBadge total={total} label="Lucro" />
        </div>
      </CardHeader>
      <CardContent>
        <PieChartBase data={data} height={280} />
      </CardContent>
    </Card>
  )
}
