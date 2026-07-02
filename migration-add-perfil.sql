-- Run this in your Supabase SQL editor (https://supabase.com/dashboard)
-- Go to your project > SQL Editor > paste and run

ALTER TABLE transactions ADD COLUMN IF NOT EXISTS perfil TEXT NOT NULL DEFAULT 'eu';
ALTER TABLE categories    ADD COLUMN IF NOT EXISTS perfil TEXT NOT NULL DEFAULT 'eu';
ALTER TABLE monthly_data  ADD COLUMN IF NOT EXISTS perfil TEXT NOT NULL DEFAULT 'eu';
