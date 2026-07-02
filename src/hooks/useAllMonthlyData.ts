'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { MonthlyData } from '@/types'

export function useAllMonthlyData(userId: string | null, perfil = 'eu') {
  const [allMonthlyData, setAllMonthlyData] = useState<MonthlyData[]>([])

  const fetch = useCallback(async () => {
    if (!userId) { setAllMonthlyData([]); return }
    const { data } = await supabase
      .from('monthly_data')
      .select('*')
      .eq('user_id', userId)
      .eq('perfil', perfil)
    setAllMonthlyData((data as MonthlyData[]) ?? [])
  }, [userId, perfil])

  useEffect(() => { fetch() }, [fetch])

  return { allMonthlyData, refetch: fetch }
}
