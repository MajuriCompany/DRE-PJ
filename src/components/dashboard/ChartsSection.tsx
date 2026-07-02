import { LucroDistributionChart } from '@/components/charts/LucroDistributionChart'
import { CategorySelectionChart } from '@/components/charts/CategorySelectionChart'
import type { ChartDataItem, Transaction, Category } from '@/types'

interface ChartsSectionProps {
  activeTab: string
  lucroData: ChartDataItem[]
  receitasTituloData: ChartDataItem[]
  receitasCategoriaData: ChartDataItem[]
  despesasCategoriaData: ChartDataItem[]
  transactions: Transaction[]
  categories: Category[]
}

export function ChartsSection({
  activeTab,
  lucroData,
  transactions,
  categories,
}: ChartsSectionProps) {
  const isGeral = activeTab === 'GERAL'

  return (
    <div className="space-y-4">
      {isGeral && <LucroDistributionChart data={lucroData} />}
      {isGeral && (
        <CategorySelectionChart transactions={transactions} categories={categories} />
      )}
    </div>
  )
}
