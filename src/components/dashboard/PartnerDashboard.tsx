'use client'
import { useState, useMemo } from 'react'
import { useTransactions } from '@/hooks/useTransactions'
import { useCategories } from '@/hooks/useCategories'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TransactionsTable } from './TransactionsTable'
import { filterByMonth } from '@/lib/financial'
import { formatCurrency, formatPercent } from '@/lib/utils'
import type { Vertente, TransactionFormData, TransactionType } from '@/types'
import { TrendingUp, TrendingDown, Receipt, DollarSign, Trash2, Plus } from 'lucide-react'

interface PartnerDashboardProps {
  userId: string
  selectedMonth: string
  taxRates: Record<Vertente, number>
}

type SubTab = 'overview' | 'transactions' | 'settings'

const SUB_TABS: Array<{ key: SubTab; label: string }> = [
  { key: 'overview', label: 'Visão Geral' },
  { key: 'transactions', label: 'Transações' },
  { key: 'settings', label: 'Categorias' },
]

export function PartnerDashboard({ userId, selectedMonth, taxRates }: PartnerDashboardProps) {
  const [subTab, setSubTab] = useState<SubTab>('overview')
  const [newCatName, setNewCatName] = useState('')
  const [newCatType, setNewCatType] = useState<TransactionType>('RECEITA')
  const [addingCat, setAddingCat] = useState(false)

  const { transactions, addTransaction, updateTransaction, deleteTransaction } =
    useTransactions(userId, 'rafa')
  const { categories, addCategory, deleteCategory } = useCategories(userId, 'rafa')

  const filteredByMonth = useMemo(
    () => filterByMonth(transactions, selectedMonth),
    [transactions, selectedMonth]
  )

  const receitas = filteredByMonth.filter((t) => t.type === 'RECEITA')
  const despesas = filteredByMonth.filter((t) => t.type === 'DESPESA')
  const faturamentoBruto = receitas.reduce((s, t) => s + (t.value_bruto || 0), 0)
  const impostosPagos = receitas.reduce((s, t) => s + (t.tax_value || 0), 0)
  const despTotal = despesas.reduce((s, t) => s + (t.value_total || 0), 0)
  const faturamentoLiquido = receitas.reduce((s, t) => s + (t.value_liquido || 0), 0)
  const lucroLiquido = faturamentoLiquido - despTotal
  const margem = faturamentoLiquido > 0 ? (lucroLiquido / faturamentoLiquido) * 100 : 0

  async function handleSaveTransaction(data: TransactionFormData, id?: string) {
    if (id) return updateTransaction(id, data)
    return addTransaction(data)
  }

  async function handleAddCategory() {
    if (!newCatName.trim()) return
    setAddingCat(true)
    await addCategory(newCatName.trim(), newCatType)
    setNewCatName('')
    setAddingCat(false)
  }

  return (
    <div className="space-y-4">
      {/* Partner badge */}
      <div className="flex justify-center">
        <div className="flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-xl px-4 py-2">
          <div className="h-2 w-2 rounded-full bg-purple-500" />
          <span className="text-sm font-semibold text-purple-700">Dashboard Rafa — Infoprodutos</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard
          label="Faturamento Bruto"
          value={faturamentoBruto}
          bgColor="bg-green-50"
          borderColor="border-green-100"
          textColor="text-green-700"
          labelColor="text-green-600"
          icon={<TrendingUp className="h-4 w-4 text-green-500" />}
        />
        <KpiCard
          label="Impostos Pagos"
          value={impostosPagos}
          bgColor="bg-orange-50"
          borderColor="border-orange-100"
          textColor="text-orange-700"
          labelColor="text-orange-600"
          icon={<Receipt className="h-4 w-4 text-orange-500" />}
        />
        <KpiCard
          label="Despesas"
          value={despTotal}
          bgColor="bg-red-50"
          borderColor="border-red-100"
          textColor="text-red-600"
          labelColor="text-red-500"
          icon={<TrendingDown className="h-4 w-4 text-red-500" />}
        />
        <KpiCard
          label="Lucro Líquido"
          value={lucroLiquido}
          bgColor={lucroLiquido >= 0 ? 'bg-blue-50' : 'bg-red-50'}
          borderColor={lucroLiquido >= 0 ? 'border-blue-100' : 'border-red-100'}
          textColor={lucroLiquido >= 0 ? 'text-blue-700' : 'text-red-600'}
          labelColor={lucroLiquido >= 0 ? 'text-blue-600' : 'text-red-500'}
          icon={<DollarSign className="h-4 w-4 text-blue-500" />}
        />
      </div>

      {/* Margem */}
      <div className="flex justify-center">
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm px-5 py-2.5 flex items-center gap-3">
          <span className="text-xs text-gray-500">Margem Líquida:</span>
          <span
            className={`text-sm font-bold tabular-nums ${
              margem >= 30 ? 'text-green-600' : margem >= 10 ? 'text-orange-500' : 'text-red-500'
            }`}
          >
            {formatPercent(margem)}
          </span>
          <span className="text-gray-200">|</span>
          <span className="text-xs text-gray-500">Fat. Líquido:</span>
          <span className="text-sm font-bold text-gray-700 tabular-nums">
            {formatCurrency(faturamentoLiquido)}
          </span>
        </div>
      </div>

      {/* Sub-nav */}
      <div className="border-b border-gray-200">
        <div className="flex justify-center">
          {SUB_TABS.map((st) => (
            <button
              key={st.key}
              onClick={() => setSubTab(st.key)}
              className={`px-6 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                subTab === st.key
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview */}
      {subTab === 'overview' && (
        <div className="py-6 text-center text-gray-400 text-sm">
          Adicione transações na aba{' '}
          <button
            className="text-purple-600 font-medium underline underline-offset-2"
            onClick={() => setSubTab('transactions')}
          >
            Transações
          </button>{' '}
          para visualizar os dados aqui.
        </div>
      )}

      {/* Transactions */}
      {subTab === 'transactions' && (
        <TransactionsTable
          transactions={filteredByMonth}
          categories={categories}
          taxRates={taxRates}
          onAdd={addTransaction}
          onUpdate={(id, data) => updateTransaction(id, data as TransactionFormData)}
          onDelete={deleteTransaction}
          fixedVertente="INFOPRODUTO"
        />
      )}

      {/* Categories settings */}
      {subTab === 'settings' && (
        <Card>
          <CardHeader>
            <CardTitle>Categorias (Rafa)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add category form */}
            <div className="flex gap-2 items-end">
              <div className="flex-1 space-y-1">
                <Label className="text-xs">Nome</Label>
                <Input
                  placeholder="Ex: Vendas Curso, Taxa Plataforma..."
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Tipo</Label>
                <Select value={newCatType} onValueChange={(v) => setNewCatType(v as TransactionType)}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RECEITA">Receita</SelectItem>
                    <SelectItem value="DESPESA">Despesa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleAddCategory}
                disabled={addingCat || !newCatName.trim()}
                className="gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                Adicionar
              </Button>
            </div>

            {/* Category list */}
            {categories.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">
                Nenhuma categoria cadastrada ainda.
              </p>
            ) : (
              <div className="divide-y divide-gray-50">
                {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center justify-between py-2.5">
                    <div>
                      <span className="text-sm text-gray-700">{cat.name}</span>
                      <span
                        className={`ml-2 text-[10px] font-medium px-1.5 py-0.5 rounded ${
                          cat.type === 'RECEITA'
                            ? 'bg-green-50 text-green-700'
                            : 'bg-red-50 text-red-600'
                        }`}
                      >
                        {cat.type === 'RECEITA' ? 'Receita' : 'Despesa'}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-gray-400 hover:text-red-500"
                      onClick={() => deleteCategory(cat.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function KpiCard({
  label, value, bgColor, borderColor, textColor, labelColor, icon,
}: {
  label: string
  value: number
  bgColor: string
  borderColor: string
  textColor: string
  labelColor: string
  icon: React.ReactNode
}) {
  return (
    <Card className={`${bgColor} border ${borderColor}`}>
      <CardContent className="p-4 text-center">
        <div className="flex items-center justify-center mb-1">{icon}</div>
        <p className={`text-[11px] font-medium ${labelColor} mb-1`}>{label}</p>
        <p className={`text-lg font-bold tabular-nums ${textColor}`}>{formatCurrency(value)}</p>
      </CardContent>
    </Card>
  )
}
