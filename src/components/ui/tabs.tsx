'use client'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils'

export const Tabs = TabsPrimitive.Root

export function TabsList({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn(
        'inline-flex h-9 items-center justify-center rounded-lg bg-[#0F172A] p-1 text-[#94A3B8] border border-[#2D3E57]',
        className
      )}
      {...props}
    />
  )
}

export function TabsTrigger({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-1.5 text-sm font-medium ring-offset-background transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E]',
        'disabled:pointer-events-none disabled:opacity-50',
        'data-[state=active]:bg-[#1E293B] data-[state=active]:text-[#E2E8F0] data-[state=active]:shadow-sm',
        'hover:text-[#E2E8F0]',
        className
      )}
      {...props}
    />
  )
}

export function TabsContent({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      className={cn(
        'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E]',
        className
      )}
      {...props}
    />
  )
}
