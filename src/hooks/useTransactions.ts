'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Transaction, TransactionFormData } from '@/types'

export function useTransactions(userId: string | null, perfil = 'eu') {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactions = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    const { data, error } = await supabase
      .from('transactions')
      .select('*, categories(id, name, type)')
      .eq('user_id', userId)
      .eq('perfil', perfil)
      .order('date', { ascending: false })

    if (error) {
      setError(error.message)
    } else {
      setTransactions(data as Transaction[])
    }
    setLoading(false)
  }, [userId, perfil])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  const addTransaction = useCallback(
    async (data: TransactionFormData) => {
      if (!userId) return { error: 'Usuário não autenticado' }
      const { error } = await supabase
        .from('transactions')
        .insert({ ...data, user_id: userId, perfil })
      if (!error) fetchTransactions()
      return { error: error?.message }
    },
    [userId, fetchTransactions, perfil]
  )

  const updateTransaction = useCallback(
    async (id: string, data: Partial<TransactionFormData>) => {
      const { error } = await supabase
        .from('transactions')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)
      if (!error) fetchTransactions()
      return { error: error?.message }
    },
    [fetchTransactions]
  )

  const deleteTransaction = useCallback(
    async (id: string) => {
      const { error } = await supabase.from('transactions').delete().eq('id', id)
      if (!error) fetchTransactions()
      return { error: error?.message }
    },
    [fetchTransactions]
  )

  return { transactions, loading, error, refetch: fetchTransactions, addTransaction, updateTransaction, deleteTransaction }
}
