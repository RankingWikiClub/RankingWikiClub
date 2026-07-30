-- RankingWikiClub: tabela e permissões para rivalidades bidirecionais

CREATE TABLE IF NOT EXISTS public.time_rivais (
  time_id bigint NOT NULL REFERENCES public.times(id) ON DELETE CASCADE,
  rival_id bigint NOT NULL REFERENCES public.times(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT time_rivais_pkey PRIMARY KEY (time_id, rival_id),
  CONSTRAINT time_rivais_sem_autorrival CHECK (time_id <> rival_id)
);

CREATE INDEX IF NOT EXISTS idx_time_rivais_time_id ON public.time_rivais(time_id);
CREATE INDEX IF NOT EXISTS idx_time_rivais_rival_id ON public.time_rivais(rival_id);

ALTER TABLE public.time_rivais ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS time_rivais_select ON public.time_rivais;
DROP POLICY IF EXISTS time_rivais_insert ON public.time_rivais;
DROP POLICY IF EXISTS time_rivais_update ON public.time_rivais;
DROP POLICY IF EXISTS time_rivais_delete ON public.time_rivais;
DROP POLICY IF EXISTS "time_rivais_select" ON public.time_rivais;
DROP POLICY IF EXISTS "time_rivais_insert" ON public.time_rivais;
DROP POLICY IF EXISTS "time_rivais_update" ON public.time_rivais;
DROP POLICY IF EXISTS "time_rivais_delete" ON public.time_rivais;

CREATE POLICY time_rivais_select ON public.time_rivais FOR SELECT USING (true);
CREATE POLICY time_rivais_insert ON public.time_rivais FOR INSERT WITH CHECK (true);
CREATE POLICY time_rivais_update ON public.time_rivais FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY time_rivais_delete ON public.time_rivais FOR DELETE USING (true);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.time_rivais TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
