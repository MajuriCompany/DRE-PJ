'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { MonthlyData } from '@/types'

export function useAllMonthlyData(userId: string | null) {
  const [allMonthlyData, setAllMonthlyData] = useState<MonthlyData[]>([])

  const fetch = useCallback(async () => {
    if (!userId) { setAllMonthlyData([]); return }
    const { data } = await supabase
      .from('monthly_data')
      .select('*')
      .eq('user_id', userId)
    setAllMonthlyData((data as MonthlyData[]) ?? [])
  }, [userId])

  useEffect(() => { fetch() }, [fetch])

  return { allMonthlyData, refetch: fetch }
}
