'use client'
import { useState, useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { PieChartBase } from './PieChartBase'
import { TotalBadge } from './TotalBadge'
import { formatCurrency } from '@/lib/utils'
import { CHART_COLORS } from '@/lib/utils'
import type { Transaction, Category } from '@/types'

interface CategorySelectionChartProps {
  transactions: Transaction[]
  categories: Category[]
}

export function CategorySelectionChart({ transactions, categories }: CategorySelectionChartProps) {
  const despesaCategories = categories.filter((c) => c.type === 'DESPESA')
  const [selected, setSelected] = useState<Set<string>>(new Set(despesaCategories.map((c) => c.id)))

  const chartData = useMemo(() => {
    const despesas = transactions.filter((t) => t.type === 'DESPESA' && selected.has(t.category_id))
    const map = new Map<string, number>()
    despesas.forEach((t) => {
      const cat = categories.find((c) => c.id === t.category_id)
      const key = cat?.name || 'Outros'
      map.set(key, (map.get(key) || 0) + (t.value_total || 0))
    })
    return Array.from(map.entries())
      .map(([name, value], i) => ({
        name,
        value,
        color: CHART_COLORS.expense[i % CHART_COLORS.expense.length],
      }))
      .sort((a, b) => b.value - a.value)
  }, [transactions, categories, selected])

  const total = chartData.reduce((s, d) => s + d.value, 0)

  const toggleCategory = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    if (selected.size === despesaCategories.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(despesaCategories.map((c) => c.id)))
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle>Análise por Categorias Selecionadas</CardTitle>
          <TotalBadge total={total} label="Total Selecionado" color="expense" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Checkbox
                id="toggle-all"
                checked={selected.size === despesaCategories.length}
                onCheckedChange={toggleAll}
              />
              <Label htmlFor="toggle-all" className="cursor-pointer text-[#E2E8F0] text-xs font-semibold">
                Selecionar Todas
              </Label>
            </div>
            <div className="space-y-2.5 max-h-[200px] overflow-y-auto pr-1">
              {despesaCategories.map((cat) => {
                const total = transactions
                  .filter((t) => t.type === 'DESPESA' && t.category_id === cat.id)
                  .reduce((s, t) => s + (t.value_total || 0), 0)
                return (
                  <div key={cat.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`cat-${cat.id}`}
                        checked={selected.has(cat.id)}
                        onCheckedChange={() => toggleCategory(cat.id)}
                      />
                      <Label htmlFor={`cat-${cat.id}`} className="cursor-pointer">
                        {cat.name}
                      </Label>
                    </div>
                    <span className="text-xs font-mono text-[#94A3B8]">{formatCurrency(total)}</span>
                  </div>
                )
              })}
              {despesaCategories.length === 0 && (
                <p className="text-[#475569] text-xs">Nenhuma categoria de despesa cadastrada</p>
              )}
            </div>
          </div>
          <PieChartBase data={chartData} height={220} showLegend={false} innerRadius={45} />
        </div>
      </CardContent>
    </Card>
  )
}
