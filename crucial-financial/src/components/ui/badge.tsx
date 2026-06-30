import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'border-[#2D3E57] bg-[#1E293B] text-[#E2E8F0]',
        income: 'border-[#22C55E]/30 bg-[#22C55E]/10 text-[#22C55E]',
        expense: 'border-[#EF4444]/30 bg-[#EF4444]/10 text-[#EF4444]',
        warning: 'border-[#F97316]/30 bg-[#F97316]/10 text-[#F97316]',
        infoproduto: 'border-[#A855F7]/30 bg-[#A855F7]/10 text-[#A855F7]',
        outline: 'border-[#2D3E57] bg-transparent text-[#94A3B8]',
        total: 'border-[#2D3E57] bg-[#0F172A] text-[#E2E8F0] font-mono',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}
