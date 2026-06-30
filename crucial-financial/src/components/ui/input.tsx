import { cn } from '@/lib/utils'

export function Input({ className, type, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type={type}
      className={cn(
        'flex h-9 w-full rounded-lg border border-[#2D3E57] bg-[#0F172A] px-3 py-1 text-sm text-[#E2E8F0] shadow-sm transition-colors',
        'placeholder:text-[#475569]',
        'focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'file:border-0 file:bg-transparent file:text-sm file:font-medium',
        className
      )}
      {...props}
    />
  )
}
