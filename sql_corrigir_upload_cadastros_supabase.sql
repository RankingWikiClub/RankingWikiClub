-- RankingWikiClub - Correção de permissões para cadastrar/editar e salvar imagens
-- Execute no Supabase SQL Editor antes de testar os cadastros e uploads.

-- Garante as colunas usadas pelo site
ALTER TABLE public.times ADD COLUMN IF NOT EXISTS escudo_url text;
ALTER TABLE public.selecoes ADD COLUMN IF NOT EXISTS escudo_url text;
ALTER TABLE public.competicoes ADD COLUMN IF NOT EXISTS logo_url text;

-- Libera leitura, cadastro, edição e exclusão das tabelas usadas no editor
ALTER TABLE public.times ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.selecoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competicoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.continentes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "times_select" ON public.times;
DROP POLICY IF EXISTS "times_insert" ON public.times;
DROP POLICY IF EXISTS "times_update" ON public.times;
DROP POLICY IF EXISTS "times_delete" ON public.times;
CREATE POLICY "times_select" ON public.times FOR SELECT USING (true);
CREATE POLICY "times_insert" ON public.times FOR INSERT WITH CHECK (true);
CREATE POLICY "times_update" ON public.times FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "times_delete" ON public.times FOR DELETE USING (true);

DROP POLICY IF EXISTS "selecoes_select" ON public.selecoes;
DROP POLICY IF EXISTS "selecoes_insert" ON public.selecoes;
DROP POLICY IF EXISTS "selecoes_update" ON public.selecoes;
DROP POLICY IF EXISTS "selecoes_delete" ON public.selecoes;
CREATE POLICY "selecoes_select" ON public.selecoes FOR SELECT USING (true);
CREATE POLICY "selecoes_insert" ON public.selecoes FOR INSERT WITH CHECK (true);
CREATE POLICY "selecoes_update" ON public.selecoes FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "selecoes_delete" ON public.selecoes FOR DELETE USING (true);

DROP POLICY IF EXISTS "competicoes_select" ON public.competicoes;
DROP POLICY IF EXISTS "competicoes_insert" ON public.competicoes;
DROP POLICY IF EXISTS "competicoes_update" ON public.competicoes;
DROP POLICY IF EXISTS "competicoes_delete" ON public.competicoes;
CREATE POLICY "competicoes_select" ON public.competicoes FOR SELECT USING (true);
CREATE POLICY "competicoes_insert" ON public.competicoes FOR INSERT WITH CHECK (true);
CREATE POLICY "competicoes_update" ON public.competicoes FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "competicoes_delete" ON public.competicoes FOR DELETE USING (true);

DROP POLICY IF EXISTS "paises_select" ON public.paises;
CREATE POLICY "paises_select" ON public.paises FOR SELECT USING (true);

DROP POLICY IF EXISTS "continentes_select" ON public.continentes;
CREATE POLICY "continentes_select" ON public.continentes FOR SELECT USING (true);

-- Cria buckets públicos, se ainda não existirem
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('escudos-times', 'escudos-times', true),
  ('escudos-selecoes', 'escudos-selecoes', true),
  ('logos-competicoes', 'logos-competicoes', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Políticas do Storage para leitura e upload/troca de imagens
DROP POLICY IF EXISTS "futpedia_storage_select" ON storage.objects;
DROP POLICY IF EXISTS "futpedia_storage_insert" ON storage.objects;
DROP POLICY IF EXISTS "futpedia_storage_update" ON storage.objects;
DROP POLICY IF EXISTS "futpedia_storage_delete" ON storage.objects;

CREATE POLICY "futpedia_storage_select"
ON storage.objects
FOR SELECT
USING (bucket_id IN ('escudos-times', 'escudos-selecoes', 'logos-competicoes'));

CREATE POLICY "futpedia_storage_insert"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id IN ('escudos-times', 'escudos-selecoes', 'logos-competicoes'));

CREATE POLICY "futpedia_storage_update"
ON storage.objects
FOR UPDATE
USING (bucket_id IN ('escudos-times', 'escudos-selecoes', 'logos-competicoes'))
WITH CHECK (bucket_id IN ('escudos-times', 'escudos-selecoes', 'logos-competicoes'));

CREATE POLICY "futpedia_storage_delete"
ON storage.objects
FOR DELETE
USING (bucket_id IN ('escudos-times', 'escudos-selecoes', 'logos-competicoes'));
