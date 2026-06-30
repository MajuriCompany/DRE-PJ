import { createClient } from '@supabase/supabase-js'
import type { Transaction, Category, VertenteConfig, MonthlyData } from '@/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      transactions: {
        Row: Transaction
        Insert: Omit<Transaction, 'id' | 'created_at' | 'updated_at' | 'categories'>
        Update: Partial<Omit<Transaction, 'id' | 'created_at' | 'categories'>>
      }
      categories: {
        Row: Category
        Insert: Omit<Category, 'id' | 'created_at'>
        Update: Partial<Omit<Category, 'id' | 'created_at'>>
      }
      vertente_config: {
        Row: VertenteConfig
        Insert: Omit<VertenteConfig, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<VertenteConfig, 'id' | 'created_at'>>
      }
      monthly_data: {
        Row: MonthlyData
        Insert: Omit<MonthlyData, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<MonthlyData, 'id' | 'created_at'>>
      }
    }
  }
}
