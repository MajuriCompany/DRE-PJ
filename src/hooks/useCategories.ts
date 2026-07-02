'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Category, TransactionType } from '@/types'

export function useCategories(userId: string | null, perfil = 'eu') {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCategories = useCallback(async () => {
    if (!userId) return
    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', userId)
      .eq('perfil', perfil)
      .order('name')
    setCategories(data as Category[] || [])
    setLoading(false)
  }, [userId, perfil])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const addCategory = useCallback(
    async (name: string, type: TransactionType): Promise<{ error?: string }> => {
      if (!userId) return { error: 'Não autenticado' }
      const { error } = await supabase
        .from('categories')
        .insert({ name, type, user_id: userId, perfil })
      if (!error) fetchCategories()
      return { error: error?.message }
    },
    [userId, fetchCategories, perfil]
  )

  const deleteCategory = useCallback(
    async (id: string): Promise<{ error?: string }> => {
      const { error } = await supabase.from('categories').delete().eq('id', id)
      if (!error) fetchCategories()
      return { error: error?.message }
    },
    [fetchCategories]
  )

  return { categories, loading, refetch: fetchCategories, addCategory, deleteCategory }
}
