'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { VertenteConfig, Vertente } from '@/types'

export function useVertenteConfig(userId: string | null) {
  const [configs, setConfigs] = useState<VertenteConfig[]>([])
  const [loading, setLoading] = useState(true)

  const fetchConfigs = useCallback(async () => {
    if (!userId) return
    const { data } = await supabase
      .from('vertente_config')
      .select('*')
      .eq('user_id', userId)
    setConfigs(data as VertenteConfig[] || [])
    setLoading(false)
  }, [userId])

  useEffect(() => {
    fetchConfigs()
  }, [fetchConfigs])

  const getTaxRate = useCallback(
    (vertente: Vertente): number => {
      return configs.find((c) => c.vertente === vertente)?.tax_rate ?? 0
    },
    [configs]
  )

  const upsertConfig = useCallback(
    async (vertente: Vertente, taxRate: number) => {
      if (!userId) return
      const existing = configs.find((c) => c.vertente === vertente)
      if (existing) {
        await supabase
          .from('vertente_config')
          .update({ tax_rate: taxRate, updated_at: new Date().toISOString() })
          .eq('id', existing.id)
      } else {
        await supabase
          .from('vertente_config')
          .insert({ user_id: userId, vertente, tax_rate: taxRate })
      }
      fetchConfigs()
    },
    [userId, configs, fetchConfigs]
  )

  return { configs, loading, getTaxRate, upsertConfig, refetch: fetchConfigs }
}
