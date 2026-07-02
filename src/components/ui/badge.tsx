import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'border-gray-200 bg-gray-100 text-gray-700',
        income: 'border-green-200 bg-green-50 text-green-700',
        expense: 'border-red-200 bg-red-50 text-red-600',
        warning: 'border-orange-200 bg-orange-50 text-orange-600',
        infoproduto: 'border-purple-200 bg-purple-50 text-purple-700',
        outline: 'border-gray-200 bg-transparent text-gray-500',
        total: 'border-gray-200 bg-gray-50 text-gray-700 font-mono',
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
