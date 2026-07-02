'use client'
import { useState, useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { PieChartBase } from './PieChartBase'
import { TotalBadge } from './TotalBadge'
import { formatCurrency } from '@/lib/utils'
import { CHART_COLORS } from '@/lib/utils'
import type { Transaction, Category, Vertente } from '@/types'

type VertenteFilter = 'GERAL' | Vertente

interface CategorySelectionChartProps {
  transactions: Transaction[]
  categories: Category[]
}

const VERTENTE_OPTS: Array<{ key: VertenteFilter; label: string }> = [
  { key: 'GERAL', label: 'Geral' },
  { key: 'SERVICO', label: 'Serviço' },
  { key: 'INFOPRODUTO', label: 'Infoproduto' },
]

export function CategorySelectionChart({ transactions, categories }: CategorySelectionChartProps) {
  const [vertenteFilter, setVertenteFilter] = useState<VertenteFilter>('GERAL')

  const despesaCategories = categories.filter((c) => c.type === 'DESPESA')

  // Se tipo não estiver no banco, inferir pelas transações
  const despesaCatIds = useMemo(() => {
    const ids = new Set(transactions.filter((t) => t.type === 'DESPESA').map((t) => t.category_id))
    return categories.filter((c) => c.type === 'DESPESA' || ids.has(c.id))
  }, [transactions, categories])

  const [selected, setSelected] = useState<Set<string>>(new Set(despesaCatIds.map((c) => c.id)))

  // Transações de despesa filtradas pela vertente selecionada
  const baseTxs = useMemo(() => {
    const despesas = transactions.filter((t) => t.type === 'DESPESA')
    if (vertenteFilter === 'GERAL') return despesas
    return despesas.filter((t) => t.vertente === vertenteFilter || t.vertente === 'GERAL')
  }, [transactions, vertenteFilter])

  const chartData = useMemo(() => {
    const filtered = baseTxs.filter((t) => selected.has(t.category_id))
    const map = new Map<string, number>()
    filtered.forEach((t) => {
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
  }, [baseTxs, categories, selected])

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
    if (selected.size === despesaCatIds.length) setSelected(new Set())
    else setSelected(new Set(despesaCatIds.map((c) => c.id)))
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <CardTitle>Análise por Categorias Selecionadas</CardTitle>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Filtro de Vertente */}
            <div className="flex gap-1 bg-gray-50 border border-gray-100 rounded-lg p-0.5">
              {VERTENTE_OPTS.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setVertenteFilter(opt.key)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    vertenteFilter === opt.key
                      ? 'bg-white shadow-sm text-blue-600 border border-gray-100'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <TotalBadge total={total} label="Total Selecionado" color="expense" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Checkbox
                id="toggle-all"
                checked={selected.size === despesaCatIds.length}
                onCheckedChange={toggleAll}
              />
              <Label htmlFor="toggle-all" className="cursor-pointer text-gray-700 text-xs font-semibold">
                Selecionar Todas
              </Label>
            </div>
            <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
              {despesaCatIds.map((cat) => {
                const catTotal = baseTxs
                  .filter((t) => t.category_id === cat.id)
                  .reduce((s, t) => s + (t.value_total || 0), 0)
                return (
                  <div key={cat.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`cat-${cat.id}`}
                        checked={selected.has(cat.id)}
                        onCheckedChange={() => toggleCategory(cat.id)}
                      />
                      <Label htmlFor={`cat-${cat.id}`} className="cursor-pointer text-gray-700">
                        {cat.name}
                      </Label>
                    </div>
                    <span className="text-xs font-mono text-gray-500">{formatCurrency(catTotal)}</span>
                  </div>
                )
              })}
              {despesaCatIds.length === 0 && (
                <p className="text-gray-400 text-xs">Nenhuma categoria de despesa cadastrada</p>
              )}
            </div>
          </div>
          <PieChartBase data={chartData} height={220} showLegend={false} innerRadius={45} />
        </div>
      </CardContent>
    </Card>
  )
}
