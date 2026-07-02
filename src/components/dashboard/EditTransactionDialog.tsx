'use client'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import type { Transaction, TransactionFormData, Category, Vertente, TransactionType } from '@/types'

interface EditTransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction?: Transaction | null
  categories: Category[]
  taxRates: Record<Vertente, number>
  onSave: (data: TransactionFormData, id?: string) => Promise<{ error?: string }>
}

const VERTENTES: Vertente[] = ['GERAL', 'SERVICO', 'INFOPRODUTO']
const TYPES: TransactionType[] = ['RECEITA', 'DESPESA']

const VERTENTE_LABELS: Record<Vertente, string> = {
  GERAL: 'Geral',
  SERVICO: 'Serviço',
  INFOPRODUTO: 'Infoproduto',
}

export function EditTransactionDialog({
  open, onOpenChange, transaction, categories, taxRates, onSave
}: EditTransactionDialogProps) {
  const isEditing = !!transaction
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<TransactionFormData>({
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      description: '',
      category_id: '',
      type: 'RECEITA',
      vertente: 'GERAL',
      value_bruto: 0,
      tax_rate: 0,
      tax_value: 0,
      value_liquido: 0,
      value_total: 0,
      notes: '',
    },
  })

  const watchType = watch('type')
  const watchVertente = watch('vertente')
  const watchBruto = watch('value_bruto')
  const watchTaxRate = watch('tax_rate')

  useEffect(() => {
    if (transaction) {
      reset({
        date: transaction.date,
        description: transaction.description,
        category_id: transaction.category_id,
        type: transaction.type,
        vertente: transaction.vertente,
        value_bruto: transaction.value_bruto,
        tax_rate: transaction.tax_rate,
        tax_value: transaction.tax_value,
        value_liquido: transaction.value_liquido,
        value_total: transaction.value_total,
        notes: transaction.notes || '',
      })
    } else {
      reset({
        date: new Date().toISOString().slice(0, 10),
        description: '',
        category_id: '',
        type: 'RECEITA',
        vertente: 'GERAL',
        value_bruto: 0,
        tax_rate: 0,
        tax_value: 0,
        value_liquido: 0,
        value_total: 0,
        notes: '',
      })
    }
  }, [transaction, reset, open])

  useEffect(() => {
    const rate = taxRates[watchVertente as Vertente] ?? 0
    setValue('tax_rate', rate)
  }, [watchVertente, taxRates, setValue])

  useEffect(() => {
    const bruto = Number(watchBruto) || 0
    const rate = Number(watchTaxRate) || 0
    const taxValue = (bruto * rate) / 100
    const liquido = bruto - taxValue
    setValue('tax_value', parseFloat(taxValue.toFixed(2)))
    setValue('value_liquido', parseFloat(liquido.toFixed(2)))
    setValue('value_total', watchType === 'RECEITA' ? parseFloat(bruto.toFixed(2)) : parseFloat(bruto.toFixed(2)))
  }, [watchBruto, watchTaxRate, watchType, setValue])

  const filteredCategories = categories.filter((c) => c.type === watchType)

  async function onSubmit(data: TransactionFormData) {
    setSaving(true)
    setError(null)
    const result = await onSave(data, transaction?.id)
    setSaving(false)
    if (result.error) {
      setError(result.error)
    } else {
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Transação' : 'Nova Transação'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Tipo *</Label>
              <Select
                value={watchType}
                onValueChange={(v) => {
                  setValue('type', v as TransactionType)
                  setValue('category_id', '')
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t === 'RECEITA' ? '↑ Receita' : '↓ Despesa'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Vertente *</Label>
              <Select
                value={watchVertente}
                onValueChange={(v) => setValue('vertente', v as Vertente)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VERTENTES.map((v) => (
                    <SelectItem key={v} value={v}>{VERTENTE_LABELS[v]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Data *</Label>
              <Input type="date" {...register('date', { required: true })} />
            </div>
            <div className="space-y-1.5">
              <Label>Categoria *</Label>
              <Select
                value={watch('category_id')}
                onValueChange={(v) => setValue('category_id', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar..." />
                </SelectTrigger>
                <SelectContent>
                  {filteredCategories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Descrição / Cliente *</Label>
            <Input
              placeholder={watchType === 'RECEITA' ? 'Ex: Cliente Empresa X' : 'Ex: Anúncios Meta'}
              {...register('description', { required: true })}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label>Fat. Bruto (R$) *</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                {...register('value_bruto', { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Alíquota (%)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                max="100"
                placeholder="0"
                {...register('tax_rate', { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Imposto (R$)</Label>
              <Input
                type="number"
                step="0.01"
                readOnly
                className="opacity-60"
                {...register('tax_value', { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-green-600">Fat. Líquido / Comissão (R$) *</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="Calculado automaticamente"
                className="border-green-300 focus:ring-green-500"
                {...register('value_liquido', { valueAsNumber: true })}
              />
              <p className="text-[10px] text-gray-400">Editável — sobrescreva se necessário</p>
            </div>
            <div className="space-y-1.5">
              <Label>Valor Total (R$)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                {...register('value_total', { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Notas (opcional)</Label>
            <Input placeholder="Observações sobre esta transação..." {...register('notes')} />
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Salvando...' : isEditing ? 'Salvar Alterações' : 'Adicionar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
