import type { Transaction, KPIData, MarginData, ChartDataItem, Vertente, VertenteComparisonRow } from '@/types'
import { CHART_COLORS } from './utils'

export function filterByMonth(
  transactions: Transaction[],
  monthValue: string
): Transaction[] {
  if (monthValue === 'all') return transactions
  const [year, month] = monthValue.split('-').map(Number)
  return transactions.filter((t) => {
    const [tYear, tMonth] = t.date.split('-').map(Number)
    return tYear === year && tMonth === month
  })
}

export function filterUpToMonth(
  transactions: Transaction[],
  monthValue: string
): Transaction[] {
  if (monthValue === 'all') return transactions
  const [year, month] = monthValue.split('-').map(Number)
  return transactions.filter((t) => {
    const [tYear, tMonth] = t.date.split('-').map(Number)
    return tYear < year || (tYear === year && tMonth <= month)
  })
}

export function calcSaldoCaixa(transactions: Transaction[], proLaboreTotal = 0): number {
  const receitas = transactions.filter((t) => t.type === 'RECEITA')
  const despesas = transactions.filter((t) => t.type === 'DESPESA')
  return (
    receitas.reduce((s, t) => s + (t.value_liquido || 0), 0) -
    despesas.reduce((s, t) => s + (t.value_total || 0), 0) -
    proLaboreTotal
  )
}

export function filterByVertente(
  transactions: Transaction[],
  vertente: Vertente | 'GERAL'
): Transaction[] {
  if (vertente === 'GERAL') return transactions
  return transactions.filter((t) => t.vertente === vertente || t.vertente === 'GERAL')
}

export function calcKPI(
  transactions: Transaction[],
  proLabore: number,
  saldoInicial: number,
  activeTab: Vertente | 'GERAL'
): KPIData {
  const receitas = transactions.filter((t) => t.type === 'RECEITA')
  const despesas = transactions.filter((t) => t.type === 'DESPESA')

  const faturamentoBruto = receitas.reduce((s, t) => s + (t.value_bruto || 0), 0)
  const faturamentoLiquido = receitas.reduce((s, t) => s + (t.value_liquido || 0), 0)
  const impostosPagos = receitas.reduce((s, t) => s + (t.tax_value || 0), 0)
  const despesasTotal = despesas.reduce((s, t) => s + (t.value_total || 0), 0)

  return {
    saldoInicial,
    faturamentoBruto,
    faturamentoLiquido,
    impostosPagos,
    despesasTotal,
    proLabore,
  }
}

export function calcMargins(kpi: KPIData): MarginData {
  const { faturamentoBruto, faturamentoLiquido, despesasTotal, proLabore } = kpi

  const lucrosBruto = faturamentoBruto - despesasTotal
  const lucroBrutoPosProLabore = lucrosBruto - proLabore
  const lucroLiquido = faturamentoLiquido - despesasTotal
  const lucroLiquidoPosProLabore = lucroLiquido - proLabore

  return {
    mgBruta: faturamentoBruto > 0 ? (lucrosBruto / faturamentoBruto) * 100 : 0,
    mgBrutaPosProLabore: faturamentoBruto > 0 ? (lucroBrutoPosProLabore / faturamentoBruto) * 100 : 0,
    mgLiquida: faturamentoLiquido > 0 ? (lucroLiquido / faturamentoLiquido) * 100 : 0,
    mgLiquidaPosProLabore: faturamentoLiquido > 0 ? (lucroLiquidoPosProLabore / faturamentoLiquido) * 100 : 0,
  }
}

export function calcLucroDistribution(transactions: Transaction[]): ChartDataItem[] {
  // INFOPRODUTO: mesmo cálculo do tab — receitas líquidas minus despesas da vertente
  const infoTxs = transactions.filter((t) => t.vertente === 'INFOPRODUTO')
  const infoLucro =
    infoTxs.filter((t) => t.type === 'RECEITA').reduce((s, t) => s + (t.value_liquido || 0), 0) -
    infoTxs.filter((t) => t.type === 'DESPESA').reduce((s, t) => s + (t.value_total || 0), 0)

  // SERVICO: lucro total da vertente, distribuído proporcionalmente por cliente
  const servicoTxs = transactions.filter((t) => t.vertente === 'SERVICO')
  const servicoReceitas = servicoTxs.filter((t) => t.type === 'RECEITA')
  const servicoDespTotal = servicoTxs
    .filter((t) => t.type === 'DESPESA')
    .reduce((s, t) => s + (t.value_total || 0), 0)
  const servicoLiqTotal = servicoReceitas.reduce((s, t) => s + (t.value_liquido || 0), 0)
  const servicoLucro = servicoLiqTotal - servicoDespTotal

  const items: ChartDataItem[] = []

  if (infoLucro > 0) {
    items.push({ name: 'Infoprodutos', value: infoLucro, color: CHART_COLORS.infoproduto })
  }

  if (servicoLucro > 0 && servicoLiqTotal > 0) {
    const clientMap = new Map<string, number>()
    servicoReceitas.forEach((t) => {
      const client = t.description || 'Outros'
      clientMap.set(client, (clientMap.get(client) || 0) + (t.value_liquido || 0))
    })

    let colorIdx = 0
    clientMap.forEach((liq, client) => {
      const clientLucro = (liq / servicoLiqTotal) * servicoLucro
      if (clientLucro > 0) {
        items.push({
          name: client,
          value: clientLucro,
          color: CHART_COLORS.service[colorIdx % CHART_COLORS.service.length],
        })
        colorIdx++
      }
    })
  }

  return items
}

export function calcReceitasPorTitulo(transactions: Transaction[]): ChartDataItem[] {
  const receitas = transactions.filter((t) => t.type === 'RECEITA')
  const map = new Map<string, number>()

  receitas.forEach((t) => {
    const key = t.description || 'Sem descrição'
    map.set(key, (map.get(key) || 0) + (t.value_bruto || 0))
  })

  return Array.from(map.entries())
    .map(([name, value], i) => ({
      name,
      value,
      color: CHART_COLORS.mixed[i % CHART_COLORS.mixed.length],
    }))
    .sort((a, b) => b.value - a.value)
}

export function calcReceitasPorCategoria(
  transactions: Transaction[],
  categories: Array<{ id: string; name: string }>
): ChartDataItem[] {
  const receitas = transactions.filter((t) => t.type === 'RECEITA')
  const map = new Map<string, number>()

  receitas.forEach((t) => {
    const cat = categories.find((c) => c.id === t.category_id)
    const key = cat?.name || 'Outros'
    map.set(key, (map.get(key) || 0) + (t.value_bruto || 0))
  })

  return Array.from(map.entries())
    .map(([name, value], i) => ({
      name,
      value,
      color: CHART_COLORS.income[i % CHART_COLORS.income.length],
    }))
    .sort((a, b) => b.value - a.value)
}

export function calcDespesasPorCategoria(
  transactions: Transaction[],
  categories: Array<{ id: string; name: string }>
): ChartDataItem[] {
  const despesas = transactions.filter((t) => t.type === 'DESPESA')
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
}

export function calcVertenteComparison(
  transactions: Transaction[],
  categories: Array<{ id: string; name: string }>
): VertenteComparisonRow[] {
  const vertentes: Array<Vertente | 'GERAL'> = ['GERAL', 'SERVICO', 'INFOPRODUTO']

  return vertentes.map((v) => {
    const filtered = v === 'GERAL' ? transactions : transactions.filter((t) => t.vertente === v)
    const receitas = filtered.filter((t) => t.type === 'RECEITA')
    const despesas = filtered.filter((t) => t.type === 'DESPESA')

    const bruto = receitas.reduce((s, t) => s + (t.value_bruto || 0), 0)
    const liquido = receitas.reduce((s, t) => s + (t.value_liquido || 0), 0)
    const desp = despesas.reduce((s, t) => s + (t.value_total || 0), 0)
    const lucro = liquido - desp
    const margem = liquido > 0 ? (lucro / liquido) * 100 : 0

    const labels: Record<string, string> = {
      GERAL: 'Geral (Consolidado)',
      SERVICO: 'Serviço',
      INFOPRODUTO: 'Infoproduto',
    }

    return {
      vertente: labels[v] || v,
      faturamentoBruto: bruto,
      faturamentoLiquido: liquido,
      despesas: desp,
      lucroLiquido: lucro,
      margemLiquida: margem,
    }
  })
}
