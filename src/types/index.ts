export type Vertente = 'GERAL' | 'SERVICO' | 'INFOPRODUTO'
export type TransactionType = 'RECEITA' | 'DESPESA'

export interface Transaction {
  id: string
  user_id: string
  perfil: string
  date: string
  description: string
  category_id: string
  type: TransactionType
  vertente: Vertente
  value_bruto: number
  tax_rate: number
  tax_value: number
  value_liquido: number
  value_total: number
  notes?: string
  created_at: string
  updated_at: string
  categories?: Category
}

export interface Category {
  id: string
  user_id: string
  perfil: string
  name: string
  type: TransactionType
  created_at: string
}

export interface VertenteConfig {
  id: string
  user_id: string
  vertente: Vertente
  tax_rate: number
  created_at: string
  updated_at: string
}

export interface MonthlyData {
  id: string
  user_id: string
  perfil: string
  year: number
  month: number
  pro_labore: number
  saldo_inicial: number
  created_at: string
  updated_at: string
}

export interface MonthOption {
  label: string
  value: string // 'YYYY-MM' or 'all'
  year?: number
  month?: number
}

export interface KPIData {
  saldoInicial: number
  faturamentoBruto: number
  faturamentoLiquido: number
  impostosPagos: number
  despesasTotal: number
  proLabore: number
}

export interface MarginData {
  mgBruta: number
  mgBrutaPosProLabore: number
  mgLiquida: number
  mgLiquidaPosProLabore: number
}

export interface ChartDataItem {
  name: string
  value: number
  color?: string
}

export interface VertenteComparisonRow {
  vertente: string
  faturamentoBruto: number
  faturamentoLiquido: number
  despesas: number
  lucroLiquido: number
  margemLiquida: number
}

export interface TransactionFormData {
  date: string
  description: string
  category_id: string
  type: TransactionType
  vertente: Vertente
  value_bruto: number
  tax_rate: number
  tax_value: number
  value_liquido: number
  value_total: number
  notes?: string
}
