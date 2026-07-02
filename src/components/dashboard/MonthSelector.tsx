'use client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { generateMonthOptions } from '@/lib/utils'
import { CalendarDays } from 'lucide-react'

interface MonthSelectorProps {
  value: string
  onChange: (value: string) => void
}

export function MonthSelector({ value, onChange }: MonthSelectorProps) {
  const options = generateMonthOptions(2023)

  return (
    <div className="flex items-center gap-2">
      <CalendarDays className="h-4 w-4 text-gray-400 shrink-0" />
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[210px]">
          <SelectValue placeholder="Selecionar período" />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
