import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import type { KPIData } from '@/types'
import { DollarSign, TrendingUp, Receipt, TrendingDown, PiggyBank, Wallet } from 'lucide-react'

interface KPICardsProps {
  data: KPIData
  activeTab: string
}

interface KPICardProps {
  title: string
  value: number
  icon: React.ReactNode
  iconBg: string
  valueColor?: string
}

function KPICard({ title, value, icon, iconBg, valueColor = 'text-gray-900' }: KPICardProps) {
  return (
    <Card className="bg-white border border-gray-100 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 mb-1">{title}</p>
            <p className={`text-lg font-bold tabular-nums truncate ${valueColor}`}>
              {formatCurrency(value)}
            </p>
          </div>
          <div className={`ml-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconBg}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function KPICards({ data, activeTab }: KPICardsProps) {
  const isGeral = activeTab === 'GERAL'
  const isInfo = activeTab === 'INFOPRODUTO'

  const lucroLiquido = data.faturamentoLiquido - data.despesasTotal
  const lucroPosProLabore = lucroLiquido - data.proLabore
  const saldoCaixa = data.saldoInicial + lucroPosProLabore

  const fatBrutoLabel = isInfo ? 'Faturamento Bruto (Plataforma)' : 'Faturamento Bruto'
  const fatLiqLabel = isInfo ? 'Comissão Recebida' : 'Faturamento Líquido'

  return (
    <div className="space-y-3">
      {/* Linha 1 — sempre visível */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPICard
          title={fatBrutoLabel}
          value={data.faturamentoBruto}
          icon={<DollarSign className="h-4 w-4 text-blue-600" />}
          iconBg="bg-blue-50"
          valueColor="text-gray-900"
        />
        <KPICard
          title={fatLiqLabel}
          value={data.faturamentoLiquido}
          icon={<TrendingUp className="h-4 w-4 text-green-600" />}
          iconBg="bg-green-50"
          valueColor="text-green-700"
        />
        <KPICard
          title="Impostos Pagos"
          value={data.impostosPagos}
          icon={<Receipt className="h-4 w-4 text-orange-500" />}
          iconBg="bg-orange-50"
          valueColor="text-orange-600"
        />
        <KPICard
          title="Despesas Totais"
          value={data.despesasTotal}
          icon={<TrendingDown className="h-4 w-4 text-red-500" />}
          iconBg="bg-red-50"
          valueColor="text-red-600"
        />
      </div>

      {/* Linha 2 — varia por aba */}
      {isGeral ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <KPICard
            title="Lucro Líquido"
            value={lucroLiquido}
            icon={<PiggyBank className="h-4 w-4 text-green-600" />}
            iconBg="bg-green-50"
            valueColor={lucroLiquido >= 0 ? 'text-green-700' : 'text-red-600'}
          />
          <KPICard
            title="Lucro Líquido Após Pró-Labore"
            value={lucroPosProLabore}
            icon={<PiggyBank className="h-4 w-4 text-green-600" />}
            iconBg="bg-green-50"
            valueColor={lucroPosProLabore >= 0 ? 'text-green-700' : 'text-red-600'}
          />
          <KPICard
            title="Saldo em Caixa"
            value={saldoCaixa}
            icon={<Wallet className="h-4 w-4 text-green-600" />}
            iconBg="bg-green-50"
            valueColor={saldoCaixa >= 0 ? 'text-green-700' : 'text-red-600'}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <KPICard
            title="Lucro Líquido"
            value={lucroLiquido}
            icon={<PiggyBank className="h-4 w-4 text-green-600" />}
            iconBg="bg-green-50"
            valueColor={lucroLiquido >= 0 ? 'text-green-700' : 'text-red-600'}
          />
        </div>
      )}
    </div>
  )
}
