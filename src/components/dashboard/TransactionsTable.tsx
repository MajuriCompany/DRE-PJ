'use client'
import { useState, useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { EditTransactionDialog } from './EditTransactionDialog'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Transaction, Category, Vertente, TransactionFormData } from '@/types'
import { Plus, Search, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'

const PAGE_SIZE = 15

interface TransactionsTableProps {
  transactions: Transaction[]
  categories: Category[]
  taxRates: Record<Vertente, number>
  onAdd: (data: TransactionFormData) => Promise<{ error?: string }>
  onUpdate: (id: string, data: Partial<TransactionFormData>) => Promise<{ error?: string }>
  onDelete: (id: string) => Promise<{ error?: string }>
}

export function TransactionsTable({
  transactions, categories, taxRates, onAdd, onUpdate, onDelete
}: TransactionsTableProps) {
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [page, setPage] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Transaction | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchSearch =
        !search ||
        t.description?.toLowerCase().includes(search.toLowerCase()) ||
        t.categories?.name?.toLowerCase().includes(search.toLowerCase())
      const matchCat = filterCategory === 'all' || t.category_id === filterCategory
      const matchType = filterType === 'all' || t.type === filterType
      return matchSearch && matchCat && matchType
    })
  }, [transactions, search, filterCategory, filterType])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function openAdd() { setEditing(null); setDialogOpen(true) }
  function openEdit(t: Transaction) { setEditing(t); setDialogOpen(true) }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir esta transação?')) return
    setDeletingId(id)
    await onDelete(id)
    setDeletingId(null)
  }

  async function handleSave(data: TransactionFormData, id?: string) {
    if (id) return onUpdate(id, data)
    return onAdd(data)
  }

  return (
    <>
      <Card className="bg-white border border-gray-100 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="text-sm text-gray-700">Transações ({filtered.length})</CardTitle>
            <Button size="sm" onClick={openAdd} className="gap-1.5 w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white">
              <Plus className="h-3.5 w-3.5" />
              Nova Transação
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 mt-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <Input
                placeholder="Buscar por descrição ou categoria..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                className="pl-8 bg-white border-gray-200 text-gray-700 placeholder:text-gray-400"
              />
            </div>
            <Select value={filterType} onValueChange={(v) => { setFilterType(v); setPage(1) }}>
              <SelectTrigger className="w-full sm:w-[130px] bg-white border-gray-200 text-gray-700">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="RECEITA">Receitas</SelectItem>
                <SelectItem value="DESPESA">Despesas</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={(v) => { setFilterCategory(v); setPage(1) }}>
              <SelectTrigger className="w-full sm:w-[160px] bg-white border-gray-200 text-gray-700">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {['Data', 'Descrição', 'Categoria', 'Tipo', 'Vertente', 'Fat. Bruto', 'Líquido', 'Total', ''].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-12 text-center text-gray-400 text-sm">
                      Nenhuma transação encontrada
                    </td>
                  </tr>
                ) : (
                  paginated.map((t) => (
                    <tr
                      key={t.id}
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap font-mono">
                        {formatDate(t.date)}
                      </td>
                      <td className="px-4 py-3 max-w-[200px]">
                        <p className="text-gray-800 truncate text-xs font-medium">{t.description}</p>
                        {t.notes && <p className="text-gray-400 text-[10px] truncate">{t.notes}</p>}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                        {t.categories?.name || '—'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Badge variant={t.type === 'RECEITA' ? 'income' : 'expense'}>
                          {t.type === 'RECEITA' ? '↑ Receita' : '↓ Despesa'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Badge variant={t.vertente === 'INFOPRODUTO' ? 'infoproduto' : 'outline'}>
                          {t.vertente}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-gray-700 whitespace-nowrap">
                        {formatCurrency(t.value_bruto)}
                      </td>
                      <td className="px-4 py-3 text-xs font-mono whitespace-nowrap">
                        <span className={t.type === 'RECEITA' ? 'text-green-600' : 'text-gray-400'}>
                          {formatCurrency(t.value_liquido)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs font-mono whitespace-nowrap">
                        <span className={t.type === 'DESPESA' ? 'text-red-500 font-semibold' : 'text-gray-500'}>
                          {formatCurrency(t.value_total)}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-blue-600" onClick={() => openEdit(t)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost" size="icon"
                            className="h-7 w-7 text-gray-400 hover:text-red-500"
                            onClick={() => handleDelete(t.id)}
                            disabled={deletingId === t.id}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                Página {page} de {totalPages} · {filtered.length} transações
              </p>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-500"
                  onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-500"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <EditTransactionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        transaction={editing}
        categories={categories}
        taxRates={taxRates}
        onSave={handleSave}
      />
    </>
  )
}
