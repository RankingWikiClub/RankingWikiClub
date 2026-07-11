-- FutPedia - Correção final para escudos/logos no Supabase

ALTER TABLE public.times
ADD COLUMN IF NOT EXISTS escudo_url text;

ALTER TABLE public.selecoes
ADD COLUMN IF NOT EXISTS escudo_url text;

ALTER TABLE public.competicoes
ADD COLUMN IF NOT EXISTS logo_url text;

ALTER TABLE public.times ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.selecoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competicoes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "times_update" ON public.times;
CREATE POLICY "times_update"
ON public.times
FOR UPDATE
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "selecoes_update" ON public.selecoes;
CREATE POLICY "selecoes_update"
ON public.selecoes
FOR UPDATE
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "competicoes_update" ON public.competicoes;
CREATE POLICY "competicoes_update"
ON public.competicoes
FOR UPDATE
USING (true)
WITH CHECK (true);

INSERT INTO storage.buckets (id, name, public)
VALUES
  ('escudos-times', 'escudos-times', true),
  ('escudos-selecoes', 'escudos-selecoes', true),
  ('logos-competicoes', 'logos-competicoes', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "storage_select_public_futpedia" ON storage.objects;
CREATE POLICY "storage_select_public_futpedia"
ON storage.objects
FOR SELECT
USING (bucket_id IN ('escudos-times', 'escudos-selecoes', 'logos-competicoes'));

DROP POLICY IF EXISTS "storage_insert_public_futpedia" ON storage.objects;
CREATE POLICY "storage_insert_public_futpedia"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id IN ('escudos-times', 'escudos-selecoes', 'logos-competicoes'));

DROP POLICY IF EXISTS "storage_update_public_futpedia" ON storage.objects;
CREATE POLICY "storage_update_public_futpedia"
ON storage.objects
FOR UPDATE
USING (bucket_id IN ('escudos-times', 'escudos-selecoes', 'logos-competicoes'))
WITH CHECK (bucket_id IN ('escudos-times', 'escudos-selecoes', 'logos-competicoes'));

DROP POLICY IF EXISTS "storage_delete_public_futpedia" ON storage.objects;
CREATE POLICY "storage_delete_public_futpedia"
ON storage.objects
FOR DELETE
USING (bucket_id IN ('escudos-times', 'escudos-selecoes', 'logos-competicoes'));
