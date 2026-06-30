'use client'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E] disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-[#22C55E] text-[#0F172A] hover:bg-[#16A34A]',
        destructive: 'bg-[#EF4444] text-white hover:bg-[#DC2626]',
        outline: 'border border-[#2D3E57] bg-transparent text-[#E2E8F0] hover:bg-[#1E293B]',
        secondary: 'bg-[#1E293B] text-[#E2E8F0] hover:bg-[#334155] border border-[#2D3E57]',
        ghost: 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-[#E2E8F0]',
        link: 'text-[#22C55E] underline-offset-4 hover:underline',
        warning: 'bg-[#F97316] text-white hover:bg-[#EA580C]',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-lg px-6',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />
}
