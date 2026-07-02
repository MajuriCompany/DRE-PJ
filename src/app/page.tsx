'use client'
import { useState, useMemo } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useTransactions } from '@/hooks/useTransactions'
import { useCategories } from '@/hooks/useCategories'
import { useVertenteConfig } from '@/hooks/useVertenteConfig'
import { useMonthlyData } from '@/hooks/useMonthlyData'
import { useAllMonthlyData } from '@/hooks/useAllMonthlyData'
import { Header } from '@/components/dashboard/Header'
import { KPICards } from '@/components/dashboard/KPICards'
import { MarginCards } from '@/components/dashboard/MarginCards'
import { ChartsSection } from '@/components/dashboard/ChartsSection'
import { VertenteComparison } from '@/components/dashboard/VertenteComparison'
import { VertenteConfigManager } from '@/components/dashboard/VertenteConfigManager'
import { TransactionsTable } from '@/components/dashboard/TransactionsTable'
import { LoginPage } from '@/components/dashboard/LoginPage'
import {
  filterByMonth,
  filterUpToMonth,
  calcSaldoCaixa,
  calcKPI,
  calcMargins,
  calcLucroDistribution,
  calcReceitasPorTitulo,
  calcReceitasPorCategoria,
  calcDespesasPorCategoria,
  calcVertenteComparison,
} from '@/lib/financial'
import { exportTransactionsToCSV } from '@/lib/export'
import { getCurrentMonthValue, parseMonthValue, formatCurrency } from '@/lib/utils'
import type { Vertente, TransactionFormData } from '@/types'
import { Pencil, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type ActiveTab = 'GERAL' | Vertente
type SubTab = 'overview' | 'transactions' | 'settings'

const TAB_LABELS: Record<ActiveTab, string> = {
  GERAL: 'Geral',
  SERVICO: 'Serviço',
  INFOPRODUTO: 'Infoproduto',
}

const SUB_TABS: Array<{ key: SubTab; label: string }> = [
  { key: 'overview', label: 'Visão Geral' },
  { key: 'transactions', label: 'Transações' },
  { key: 'settings', label: 'Configurações' },
]

export default function DashboardPage() {
  const { user, loading: authLoading, signOut, signInWithEmail, signUpWithEmail, resetPassword } = useAuth()
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthValue())
  const [activeTab, setActiveTab] = useState<ActiveTab>('GERAL')
  const [subTab, setSubTab] = useState<SubTab>('overview')
  const [editingPL, setEditingPL] = useState(false)
  const [plDraft, setPlDraft] = useState(0)

  const userId = user?.id ?? null
  const monthParsed = parseMonthValue(selectedMonth)

  const { transactions, loading: txLoading, addTransaction, updateTransaction, deleteTransaction } =
    useTransactions(userId)
  const { categories, addCategory, deleteCategory } = useCategories(userId)
  const { configs, getTaxRate, upsertConfig } = useVertenteConfig(userId)
  const { allMonthlyData } = useAllMonthlyData(userId)
  const { proLabore, saldoInicial, upsertMonthlyData } = useMonthlyData(
    userId,
    monthParsed?.year,
    monthParsed?.month
  )

  const taxRates: Record<Vertente, number> = {
    GERAL: getTaxRate('GERAL'),
    SERVICO: getTaxRate('SERVICO'),
    INFOPRODUTO: getTaxRate('INFOPRODUTO'),
  }

  const filteredByMonth = useMemo(() => filterByMonth(transactions, selectedMonth), [transactions, selectedMonth])

  const filteredByTab = useMemo(() => {
    if (activeTab === 'GERAL') return filteredByMonth
    return filteredByMonth.filter((t) => t.vertente === activeTab || t.vertente === 'GERAL')
  }, [filteredByMonth, activeTab])

  const kpi = useMemo(() => calcKPI(filteredByTab, proLabore, saldoInicial, activeTab), [filteredByTab, proLabore, saldoInicial, activeTab])
  const margins = useMemo(() => calcMargins(kpi), [kpi])

  const saldoCaixa = useMemo(() => {
    const upToMonth = filterUpToMonth(transactions, selectedMonth)
    const proLaboreAcumulado = (() => {
      if (selectedMonth === 'all') return allMonthlyData.reduce((s, d) => s + (d.pro_labore || 0), 0)
      const [year, month] = selectedMonth.split('-').map(Number)
      return allMonthlyData
        .filter((d) => d.year < year || (d.year === year && d.month <= month))
        .reduce((s, d) => s + (d.pro_labore || 0), 0)
    })()
    return calcSaldoCaixa(upToMonth, proLaboreAcumulado)
  }, [transactions, selectedMonth, allMonthlyData])

  const lucroData = useMemo(() => calcLucroDistribution(filteredByMonth), [filteredByMonth])
  const receitasTituloData = useMemo(() => calcReceitasPorTitulo(filteredByTab), [filteredByTab])
  const receitasCatData = useMemo(() => calcReceitasPorCategoria(filteredByTab, categories), [filteredByTab, categories])
  const despesasCatData = useMemo(() => calcDespesasPorCategoria(filteredByTab, categories), [filteredByTab, categories])
  const comparisonData = useMemo(() => calcVertenteComparison(filteredByMonth, categories), [filteredByMonth, categories])

  function handleTabChange(tab: ActiveTab) {
    setActiveTab(tab)
    setSubTab('overview')
  }

  async function handleSavePL() {
    await upsertMonthlyData(plDraft, saldoInicial)
    setEditingPL(false)
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-400 text-sm">Carregando...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <LoginPage
        onLogin={signInWithEmail}
        onSignUp={signUpWithEmail}
        onResetPassword={resetPassword}
      />
    )
  }

  async function handleSaveTransaction(data: TransactionFormData, id?: string) {
    if (id) return updateTransaction(id, data)
    return addTransaction(data)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        onDownload={() => exportTransactionsToCSV(transactions)}
        onSignOut={signOut}
      />

      <main className="flex-1 px-6 sm:px-8 lg:px-12 py-5 space-y-4 max-w-[1200px] w-full mx-auto">

        {/* KPI Cards — reagem ao activeTab */}
        <KPICards data={kpi} activeTab={activeTab} saldoCaixa={saldoCaixa} />

        {/* Margens */}
        <MarginCards margins={margins} kpi={kpi} />

        {/* Seletor de Vertente */}
        <div className="flex justify-center">
        <div className="flex gap-1 bg-white border border-gray-100 rounded-xl p-1 shadow-sm">
          {(Object.keys(TAB_LABELS) as ActiveTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>
        </div>

        {/* Sub-navegação */}
        <div className="border-b border-gray-200">
          <div className="flex justify-center">
            {SUB_TABS.map((st) => (
              <button
                key={st.key}
                onClick={() => setSubTab(st.key)}
                className={`px-6 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  subTab === st.key
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Conteúdo da sub-aba */}
        {subTab === 'overview' && (
          <div className="space-y-4">
            {/* Pró-Labore (só na aba Geral) */}
            {activeTab === 'GERAL' && (
              <div className="flex justify-center">
                <div className="bg-white border border-gray-100 rounded-xl shadow-sm px-5 py-3 flex items-center gap-4 min-w-[280px]">
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 mb-0.5">Pró-Labore Mensal</p>
                    {editingPL ? (
                      <Input
                        type="number"
                        step="0.01"
                        value={plDraft}
                        onChange={(e) => setPlDraft(Number(e.target.value))}
                        className="h-7 text-sm font-bold"
                        autoFocus
                      />
                    ) : (
                      <p className="text-base font-bold text-gray-800">{formatCurrency(proLabore)}</p>
                    )}
                  </div>
                  {editingPL ? (
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-green-600 hover:text-green-700" onClick={handleSavePL}>
                        <Check className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-gray-400" onClick={() => setEditingPL(false)}>
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-gray-400 hover:text-blue-500"
                      onClick={() => { setPlDraft(proLabore); setEditingPL(true) }}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Comparativo Serviço vs Infoproduto (só no Geral) */}
            {activeTab === 'GERAL' && (
              <VertenteComparison rows={comparisonData} />
            )}

            {/* Gráficos */}
            {txLoading ? (
              <div className="h-48 rounded-xl border border-gray-100 bg-white flex items-center justify-center text-gray-400 text-sm">
                Carregando dados...
              </div>
            ) : (
              <ChartsSection
                activeTab={activeTab}
                lucroData={lucroData}
                receitasTituloData={receitasTituloData}
                receitasCategoriaData={receitasCatData}
                despesasCategoriaData={despesasCatData}
                transactions={filteredByMonth}
                categories={categories}
              />
            )}
          </div>
        )}

        {subTab === 'transactions' && (
          <TransactionsTable
            transactions={filteredByTab}
            categories={categories}
            taxRates={taxRates}
            onAdd={addTransaction}
            onUpdate={(id, data) => updateTransaction(id, data as TransactionFormData)}
            onDelete={deleteTransaction}
          />
        )}

        {subTab === 'settings' && (
          <VertenteConfigManager
            taxRates={taxRates}
            onSave={upsertConfig}
            categories={categories}
            onAddCategory={addCategory}
            onDeleteCategory={deleteCategory}
            proLabore={proLabore}
            saldoInicial={saldoInicial}
            onSaveMonthlyData={upsertMonthlyData}
          />
        )}
      </main>

      <footer className="border-t border-gray-200 py-3 bg-white">
        <div className="flex items-center justify-between px-8 max-w-[1200px] mx-auto">
        <p className="text-xs text-gray-400">DRE — Sistema de Controle Financeiro</p>
        <p className="text-xs text-gray-400">{user.email}</p>
        </div>
      </footer>
    </div>
  )
}
