-- FutPedia - permissões para editar registros logado
-- Execute no Supabase se aparecer erro de Row Level Security ao salvar.

ALTER TABLE public.times ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.selecoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competicoes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "times_select" ON public.times;
DROP POLICY IF EXISTS "times_insert" ON public.times;
DROP POLICY IF EXISTS "times_update" ON public.times;
DROP POLICY IF EXISTS "times_delete" ON public.times;
CREATE POLICY "times_select" ON public.times FOR SELECT USING (true);
CREATE POLICY "times_insert" ON public.times FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "times_update" ON public.times FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "times_delete" ON public.times FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS "selecoes_select" ON public.selecoes;
DROP POLICY IF EXISTS "selecoes_insert" ON public.selecoes;
DROP POLICY IF EXISTS "selecoes_update" ON public.selecoes;
DROP POLICY IF EXISTS "selecoes_delete" ON public.selecoes;
CREATE POLICY "selecoes_select" ON public.selecoes FOR SELECT USING (true);
CREATE POLICY "selecoes_insert" ON public.selecoes FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "selecoes_update" ON public.selecoes FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "selecoes_delete" ON public.selecoes FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS "competicoes_select" ON public.competicoes;
DROP POLICY IF EXISTS "competicoes_insert" ON public.competicoes;
DROP POLICY IF EXISTS "competicoes_update" ON public.competicoes;
DROP POLICY IF EXISTS "competicoes_delete" ON public.competicoes;
CREATE POLICY "competicoes_select" ON public.competicoes FOR SELECT USING (true);
CREATE POLICY "competicoes_insert" ON public.competicoes FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "competicoes_update" ON public.competicoes FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "competicoes_delete" ON public.competicoes FOR DELETE TO authenticated USING (true);
