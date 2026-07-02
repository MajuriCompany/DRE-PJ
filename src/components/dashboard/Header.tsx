'use client'
import { Button } from '@/components/ui/button'
import { MonthSelector } from './MonthSelector'
import { Download, LogOut, BarChart3 } from 'lucide-react'

interface HeaderProps {
  selectedMonth: string
  onMonthChange: (value: string) => void
  onDownload: () => void
  onSignOut: () => void
  activeProfile: string
  onProfileChange: (p: string) => void
}

export function Header({ selectedMonth, onMonthChange, onDownload, onSignOut, activeProfile, onProfileChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="flex h-14 items-center justify-between px-8 gap-4 max-w-[1200px] mx-auto w-full">
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center">
            <BarChart3 className="h-4 w-4 text-white" />
          </div>
          <h1 className="text-base font-bold text-gray-800 tracking-tight hidden sm:block">
            Dashboard Financeiro
          </h1>
          <div className="flex gap-0.5 bg-gray-100 rounded-lg p-0.5 ml-1">
            <button
              onClick={() => onProfileChange('eu')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                activeProfile === 'eu'
                  ? 'bg-white shadow-sm text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Meu DRE
            </button>
            <button
              onClick={() => onProfileChange('rafa')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                activeProfile === 'rafa'
                  ? 'bg-white shadow-sm text-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Rafa
            </button>
          </div>
        </div>

        <MonthSelector value={selectedMonth} onChange={onMonthChange} />

        <div className="flex items-center gap-2 shrink-0">
          <Button variant="secondary" size="sm" onClick={onDownload} className="gap-1.5">
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Baixar CSV</span>
            <span className="sm:hidden">CSV</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={onSignOut} className="gap-1.5 text-gray-400">
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Sair</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
