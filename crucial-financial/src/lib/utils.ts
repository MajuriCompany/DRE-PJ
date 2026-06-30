import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`
}

export function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-')
  return `${day}/${month}/${year}`
}

export function getMonthLabel(year: number, month: number): string {
  const date = new Date(year, month - 1, 1)
  return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
}

export function parseMonthValue(value: string): { year: number; month: number } | null {
  if (value === 'all') return null
  const [year, month] = value.split('-').map(Number)
  return { year, month }
}

export function getCurrentMonthValue(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  return `${year}-${month}`
}

export function generateMonthOptions(startYear = 2024): Array<{ label: string; value: string }> {
  const options: Array<{ label: string; value: string }> = [
    { label: 'Todos os Meses', value: 'all' },
  ]
  const now = new Date()
  const endYear = now.getFullYear()
  const endMonth = now.getMonth() + 1

  for (let year = endYear; year >= startYear; year--) {
    const lastMonth = year === endYear ? endMonth : 12
    const firstMonth = 1
    for (let month = lastMonth; month >= firstMonth; month--) {
      const value = `${year}-${month.toString().padStart(2, '0')}`
      const label = getMonthLabel(year, month)
      options.push({ label, value })
    }
  }
  return options
}

export const CHART_COLORS = {
  income: ['#22C55E', '#16A34A', '#15803D', '#14532D', '#4ADE80', '#86EFAC'],
  expense: ['#EF4444', '#F97316', '#EAB308', '#DC2626', '#EA580C', '#CA8A04'],
  infoproduto: '#A855F7',
  service: ['#3B82F6', '#06B6D4', '#8B5CF6', '#EC4899', '#14B8A6', '#F59E0B'],
  mixed: ['#22C55E', '#3B82F6', '#A855F7', '#F97316', '#06B6D4', '#EF4444', '#8B5CF6'],
}
