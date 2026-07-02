'use client'
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Vertente } from '@/types'
import { Settings2, Plus, Trash2 } from 'lucide-react'

const VERTENTES: Array<{ key: Vertente; label: string }> = [
  { key: 'GERAL', label: 'Geral' },
  { key: 'SERVICO', label: 'Serviço' },
  { key: 'INFOPRODUTO', label: 'Infoproduto' },
]

interface VertenteConfigManagerProps {
  taxRates: Record<Vertente, number>
  onSave: (vertente: Vertente, rate: number) => Promise<void>
  categories: Array<{ id: string; name: string; type: string }>
  onAddCategory: (name: string, type: 'RECEITA' | 'DESPESA') => Promise<{ error?: string }>
  onDeleteCategory: (id: string) => Promise<{ error?: string }>
  proLabore: number
  saldoInicial: number
  onSaveMonthlyData: (proLabore: number, saldoInicial: number) => Promise<void>
}

export function VertenteConfigManager({
  taxRates, onSave, categories, onAddCategory, onDeleteCategory, proLabore, saldoInicial, onSaveMonthlyData
}: VertenteConfigManagerProps) {
  const [localRates, setLocalRates] = useState<Record<Vertente, number>>({ ...taxRates })
  const [savingRates, setSavingRates] = useState(false)
  const [newCatName, setNewCatName] = useState('')
  const [newCatType, setNewCatType] = useState<'RECEITA' | 'DESPESA'>('RECEITA')
  const [addingCat, setAddingCat] = useState(false)
  const [localProLabore, setLocalProLabore] = useState(proLabore)
  const [localSaldoInicial, setLocalSaldoInicial] = useState(saldoInicial)
  const [savingMonthly, setSavingMonthly] = useState(false)

  async function handleSaveRates() {
    setSavingRates(true)
    for (const v of VERTENTES) {
      await onSave(v.key, localRates[v.key] ?? 0)
    }
    setSavingRates(false)
  }

  async function handleAddCategory() {
    if (!newCatName.trim()) return
    setAddingCat(true)
    await onAddCategory(newCatName.trim(), newCatType)
    setNewCatName('')
    setAddingCat(false)
  }

  async function handleSaveMonthly() {
    setSavingMonthly(true)
    await onSaveMonthlyData(localProLabore, localSaldoInicial)
    setSavingMonthly(false)
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Accordion type="single" collapsible>
          <AccordionItem value="config" className="border-0">
            <AccordionTrigger className="px-5 py-4 hover:no-underline">
              <div className="flex items-center gap-2 text-gray-600">
                <Settings2 className="h-4 w-4" />
                <span className="text-sm font-medium">Configurações do Período</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="px-5 space-y-6 pb-2">
                {/* Dados mensais */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Dados do Mês
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label>Saldo Inicial (R$)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={localSaldoInicial}
                        onChange={(e) => setLocalSaldoInicial(Number(e.target.value))}
                        placeholder="0,00"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Pró-Labore Total (R$)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={localProLabore}
                        onChange={(e) => setLocalProLabore(Number(e.target.value))}
                        placeholder="0,00"
                      />
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="mt-2"
                    onClick={handleSaveMonthly}
                    disabled={savingMonthly}
                  >
                    {savingMonthly ? 'Salvando...' : 'Salvar Dados do Mês'}
                  </Button>
                </div>

                {/* Alíquotas por vertente */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Alíquota de Imposto por Vertente (%)
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    {VERTENTES.map((v) => (
                      <div key={v.key} className="space-y-1.5">
                        <Label>{v.label}</Label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          max="100"
                          value={localRates[v.key] ?? 0}
                          onChange={(e) =>
                            setLocalRates((prev) => ({ ...prev, [v.key]: Number(e.target.value) }))
                          }
                          placeholder="0"
                        />
                      </div>
                    ))}
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="mt-2"
                    onClick={handleSaveRates}
                    disabled={savingRates}
                  >
                    {savingRates ? 'Salvando...' : 'Salvar Alíquotas'}
                  </Button>
                </div>

                {/* Gerenciar categorias */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Gerenciar Categorias
                  </h4>
                  <div className="flex gap-2 mb-3">
                    <Input
                      placeholder="Nome da categoria"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      className="flex-1"
                      onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                    />
                    <select
                      value={newCatType}
                      onChange={(e) => setNewCatType(e.target.value as 'RECEITA' | 'DESPESA')}
                      className="h-9 rounded-lg border border-gray-200 bg-white px-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="RECEITA">Receita</option>
                      <option value="DESPESA">Despesa</option>
                    </select>
                    <Button size="sm" onClick={handleAddCategory} disabled={addingCat || !newCatName.trim()}>
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {categories.map((cat) => (
                      <div
                        key={cat.id}
                        className="flex items-center justify-between rounded-lg px-3 py-1.5 hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${cat.type === 'RECEITA' ? 'bg-green-500' : 'bg-red-500'}`}
                          />
                          <span className="text-xs text-gray-800">{cat.name}</span>
                          <span className="text-[10px] text-gray-400">{cat.type}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-red-400 hover:text-red-600"
                          onClick={() => onDeleteCategory(cat.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    {categories.length === 0 && (
                      <p className="text-xs text-gray-400 px-3 py-2">Nenhuma categoria cadastrada</p>
                    )}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}
