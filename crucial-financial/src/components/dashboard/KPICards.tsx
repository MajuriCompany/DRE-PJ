import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import type { KPIData } from '@/types'
import { Wallet, TrendingUp, DollarSign, TrendingDown } from 'lucide-react'

interface KPICardsProps {
  data: KPIData
  activeTab: string
}

interface KPICardProps {
  title: string
  value: number
  icon: React.ReactNode
  color: 'default' | 'income' | 'expense' | 'neutral'
  subtitle?: string
}

const colorStyles = {
  default: { icon: 'bg-[#334155] text-[#94A3B8]', value: 'text-[#E2E8F0]' },
  income: { icon: 'bg-[#22C55E]/10 text-[#22C55E]', value: 'text-[#22C55E]' },
  expense: { icon: 'bg-[#EF4444]/10 text-[#EF4444]', value: 'text-[#EF4444]' },
  neutral: { icon: 'bg-[#A855F7]/10 text-[#A855F7]', value: 'text-[#E2E8F0]' },
}

function KPICard({ title, value, icon, color, subtitle }: KPICardProps) {
  const styles = colorStyles[color]
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-2">{title}</p>
            <p className={`text-xl font-bold tabular-nums truncate ${styles.value}`}>
              {formatCurrency(value)}
            </p>
            {subtitle && <p className="text-xs text-[#475569] mt-1">{subtitle}</p>}
          </div>
          <div className={`ml-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${styles.icon}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function KPICards({ data, activeTab }: KPICardsProps) {
  const isInfo = activeTab === 'INFOPRODUTO'
  const receitaLabel = isInfo ? 'Faturamento Bruto (Plataforma)' : 'Faturamento Bruto'
  const liquidoLabel = isInfo ? 'Comissão Recebida' : 'Faturamento Líquido'

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <KPICard
        title="Saldo Inicial"
        value={data.saldoInicial}
        icon={<Wallet className="h-4 w-4" />}
        color="neutral"
        subtitle="Configurado no mês anterior"
      />
      <KPICard
        title={receitaLabel}
        value={data.faturamentoBruto}
        icon={<TrendingUp className="h-4 w-4" />}
        color="income"
        subtitle="Soma value_bruto"
      />
      <KPICard
        title={liquidoLabel}
        value={data.faturamentoLiquido}
        icon={<DollarSign className="h-4 w-4" />}
        color={isInfo ? 'income' : 'neutral'}
        subtitle={isInfo ? 'Valor real depositado' : 'Após impostos'}
      />
      <KPICard
        title="Despesas Totais"
        value={data.despesasTotal}
        icon={<TrendingDown className="h-4 w-4" />}
        color="expense"
        subtitle="Todas as saídas do período"
      />
    </div>
  )
}
