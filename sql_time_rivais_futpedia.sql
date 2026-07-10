-- FutPedia - tabela para vincular rivais entre times
CREATE TABLE IF NOT EXISTS public.time_rivais (
  time_id bigint NOT NULL REFERENCES public.times(id) ON DELETE CASCADE,
  rival_id bigint NOT NULL REFERENCES public.times(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT time_rivais_pkey PRIMARY KEY (time_id, rival_id),
  CONSTRAINT time_rivais_nao_auto CHECK (time_id <> rival_id)
);

ALTER TABLE public.time_rivais ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "time_rivais_select" ON public.time_rivais;
DROP POLICY IF EXISTS "time_rivais_insert" ON public.time_rivais;
DROP POLICY IF EXISTS "time_rivais_update" ON public.time_rivais;
DROP POLICY IF EXISTS "time_rivais_delete" ON public.time_rivais;

CREATE POLICY "time_rivais_select"
ON public.time_rivais
FOR SELECT
USING (true);

CREATE POLICY "time_rivais_insert"
ON public.time_rivais
FOR INSERT
WITH CHECK (true);

CREATE POLICY "time_rivais_update"
ON public.time_rivais
FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "time_rivais_delete"
ON public.time_rivais
FOR DELETE
USING (true);
