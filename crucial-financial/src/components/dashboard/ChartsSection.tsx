import { LucroDistributionChart } from '@/components/charts/LucroDistributionChart'
import { ReceitasPorTituloChart } from '@/components/charts/ReceitasPorTituloChart'
import { ReceitasPorCategoriaChart } from '@/components/charts/ReceitasPorCategoriaChart'
import { DespesasPorCategoriaChart } from '@/components/charts/DespesasPorCategoriaChart'
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
  receitasTituloData,
  receitasCategoriaData,
  despesasCategoriaData,
  transactions,
  categories,
}: ChartsSectionProps) {
  const isGeral = activeTab === 'GERAL'
  const isInfoproduto = activeTab === 'INFOPRODUTO'

  return (
    <div className="space-y-4">
      {isGeral && <LucroDistributionChart data={lucroData} />}

      {!isInfoproduto && (
        <ReceitasPorTituloChart
          data={receitasTituloData}
          label={isGeral ? 'Receitas por Cliente/Título' : 'Receitas de Serviço por Cliente'}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ReceitasPorCategoriaChart data={receitasCategoriaData} />
        <DespesasPorCategoriaChart data={despesasCategoriaData} />
      </div>

      {isGeral && (
        <CategorySelectionChart transactions={transactions} categories={categories} />
      )}
    </div>
  )
}
