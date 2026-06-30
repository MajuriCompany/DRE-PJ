'use client'
import { useState, useMemo } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useTransactions } from '@/hooks/useTransactions'
import { useCategories } from '@/hooks/useCategories'
import { useVertenteConfig } from '@/hooks/useVertenteConfig'
import { useMonthlyData } from '@/hooks/useMonthlyData'
import { Header } from '@/components/dashboard/Header'
import { KPICards } from '@/components/dashboard/KPICards'
import { MarginCards } from '@/components/dashboard/MarginCards'
import { ChartsSection } from '@/components/dashboard/ChartsSection'
import { VertenteComparison } from '@/components/dashboard/VertenteComparison'
import { VertenteConfigManager } from '@/components/dashboard/VertenteConfigManager'
import { TransactionsTable } from '@/components/dashboard/TransactionsTable'
import { LoginPage } from '@/components/dashboard/LoginPage'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  filterByMonth,
  calcKPI,
  calcMargins,
  calcLucroDistribution,
  calcReceitasPorTitulo,
  calcReceitasPorCategoria,
  calcDespesasPorCategoria,
  calcVertenteComparison,
} from '@/lib/financial'
import { exportTransactionsToCSV } from '@/lib/export'
import { getCurrentMonthValue, parseMonthValue } from '@/lib/utils'
import type { Vertente, TransactionFormData } from '@/types'

type ActiveTab = 'GERAL' | Vertente

const TAB_LABELS: Record<ActiveTab, string> = {
  GERAL: 'Geral',
  SERVICO: 'Serviço',
  INFOPRODUTO: 'Infoproduto',
}

export default function DashboardPage() {
  const { user, loading: authLoading, signOut, signInWithEmail, signUpWithEmail, resetPassword } = useAuth()
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthValue())
  const [activeTab, setActiveTab] = useState<ActiveTab>('GERAL')

  const userId = user?.id ?? null
  const monthParsed = parseMonthValue(selectedMonth)

  const { transactions, loading: txLoading, addTransaction, updateTransaction, deleteTransaction } =
    useTransactions(userId)
  const { categories, addCategory, deleteCategory } = useCategories(userId)
  const { configs, getTaxRate, upsertConfig } = useVertenteConfig(userId)
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

  const lucroData = useMemo(() => calcLucroDistribution(filteredByMonth), [filteredByMonth])
  const receitasTituloData = useMemo(() => calcReceitasPorTitulo(filteredByTab), [filteredByTab])
  const receitasCatData = useMemo(() => calcReceitasPorCategoria(filteredByTab, categories), [filteredByTab, categories])
  const despesasCatData = useMemo(() => calcDespesasPorCategoria(filteredByTab, categories), [filteredByTab, categories])
  const comparisonData = useMemo(() => calcVertenteComparison(filteredByMonth, categories), [filteredByMonth, categories])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[#475569] text-sm">Carregando...</div>
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
    <div className="min-h-screen flex flex-col">
      <Header
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        onDownload={() => exportTransactionsToCSV(transactions)}
        onSignOut={signOut}
      />

      <main className="flex-1 px-4 sm:px-6 py-6 space-y-6 max-w-[1400px] w-full mx-auto">
        {/* Barra de Abas de Vertente */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ActiveTab)}>
          <TabsList className="w-full sm:w-auto">
            {(Object.keys(TAB_LABELS) as ActiveTab[]).map((tab) => (
              <TabsTrigger key={tab} value={tab} className="flex-1 sm:flex-none">
                {TAB_LABELS[tab]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Grid de 4 KPI Cards */}
        <KPICards data={kpi} activeTab={activeTab} />

        {/* Margens de Lucro */}
        <MarginCards margins={margins} kpi={kpi} />

        {/* Seção de Gráficos */}
        {txLoading ? (
          <div className="h-64 rounded-xl border border-[#2D3E57] bg-[#1E293B] flex items-center justify-center text-[#475569] text-sm">
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

        {/* Comparativo por Vertente */}
        <VertenteComparison rows={comparisonData} />

        {/* Configurações */}
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

        {/* Tabela Master de Transações */}
        <TransactionsTable
          transactions={filteredByTab}
          categories={categories}
          taxRates={taxRates}
          onAdd={addTransaction}
          onUpdate={(id, data) => updateTransaction(id, data as TransactionFormData)}
          onDelete={deleteTransaction}
        />
      </main>

      <footer className="border-t border-[#2D3E57] py-3 px-6 flex items-center justify-between">
        <p className="text-xs text-[#334155]">Crucial Financial — Sistema de Controle Corporativo</p>
        <p className="text-xs text-[#334155]">{user.email}</p>
      </footer>
    </div>
  )
}
