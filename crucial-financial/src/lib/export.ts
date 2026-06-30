import type { Transaction } from '@/types'
import { formatCurrency, formatDate } from './utils'

export function exportTransactionsToCSV(transactions: Transaction[]): void {
  const headers = [
    'Data',
    'Descrição',
    'Tipo',
    'Vertente',
    'Categoria',
    'Fat. Bruto',
    'Alíquota (%)',
    'Imposto',
    'Fat. Líquido',
    'Valor Total',
    'Notas',
  ]

  const rows = transactions.map((t) => [
    formatDate(t.date),
    t.description,
    t.type,
    t.vertente,
    t.categories?.name || '',
    formatCurrency(t.value_bruto),
    t.tax_rate.toString(),
    formatCurrency(t.tax_value),
    formatCurrency(t.value_liquido),
    formatCurrency(t.value_total),
    t.notes || '',
  ])

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n')

  const BOM = '﻿'
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `crucial-financeiro-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
