-- RankingWikiClub - Supabase Storage para escudos e logos
-- Execute no SQL Editor do Supabase.

INSERT INTO storage.buckets (id, name, public)
VALUES
  ('escudos-times', 'escudos-times', true),
  ('escudos-selecoes', 'escudos-selecoes', true),
  ('logos-competicoes', 'logos-competicoes', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Leitura pública das imagens
DROP POLICY IF EXISTS "futpedia_storage_select_public" ON storage.objects;
CREATE POLICY "futpedia_storage_select_public"
ON storage.objects
FOR SELECT
USING (bucket_id IN ('escudos-times', 'escudos-selecoes', 'logos-competicoes'));

-- Usuários logados podem enviar imagens
DROP POLICY IF EXISTS "futpedia_storage_insert_authenticated" ON storage.objects;
CREATE POLICY "futpedia_storage_insert_authenticated"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id IN ('escudos-times', 'escudos-selecoes', 'logos-competicoes'));

-- Usuários logados podem atualizar imagens
DROP POLICY IF EXISTS "futpedia_storage_update_authenticated" ON storage.objects;
CREATE POLICY "futpedia_storage_update_authenticated"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id IN ('escudos-times', 'escudos-selecoes', 'logos-competicoes'))
WITH CHECK (bucket_id IN ('escudos-times', 'escudos-selecoes', 'logos-competicoes'));

-- Usuários logados podem remover imagens, se necessário
DROP POLICY IF EXISTS "futpedia_storage_delete_authenticated" ON storage.objects;
CREATE POLICY "futpedia_storage_delete_authenticated"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id IN ('escudos-times', 'escudos-selecoes', 'logos-competicoes'));

-- Garantir colunas de imagem nas tabelas principais
ALTER TABLE public.times ADD COLUMN IF NOT EXISTS escudo_url text;
ALTER TABLE public.selecoes ADD COLUMN IF NOT EXISTS escudo_url text;
ALTER TABLE public.competicoes ADD COLUMN IF NOT EXISTS logo_url text;
