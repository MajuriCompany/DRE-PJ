'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { MonthlyData } from '@/types'

export function useMonthlyData(userId: string | null, year?: number, month?: number) {
  const [monthlyData, setMonthlyData] = useState<MonthlyData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchMonthlyData = useCallback(async () => {
    if (!userId || !year || !month) {
      setMonthlyData(null)
      setLoading(false)
      return
    }
    const { data } = await supabase
      .from('monthly_data')
      .select('*')
      .eq('user_id', userId)
      .eq('year', year)
      .eq('month', month)
      .maybeSingle()
    setMonthlyData(data as MonthlyData | null)
    setLoading(false)
  }, [userId, year, month])

  useEffect(() => {
    fetchMonthlyData()
  }, [fetchMonthlyData])

  const upsertMonthlyData = useCallback(
    async (proLabore: number, saldoInicial: number) => {
      if (!userId || !year || !month) return
      const existing = monthlyData
      if (existing) {
        await supabase
          .from('monthly_data')
          .update({ pro_labore: proLabore, saldo_inicial: saldoInicial, updated_at: new Date().toISOString() })
          .eq('id', existing.id)
      } else {
        await supabase
          .from('monthly_data')
          .insert({ user_id: userId, year, month, pro_labore: proLabore, saldo_inicial: saldoInicial })
      }
      fetchMonthlyData()
    },
    [userId, year, month, monthlyData, fetchMonthlyData]
  )

  return {
    proLabore: monthlyData?.pro_labore ?? 0,
    saldoInicial: monthlyData?.saldo_inicial ?? 0,
    loading,
    upsertMonthlyData,
    refetch: fetchMonthlyData,
  }
}
