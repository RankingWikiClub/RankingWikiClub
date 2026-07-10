-- FutPedia - exclusão segura de times, seleções e competições pelo Editor
CREATE OR REPLACE FUNCTION public.fp_excluir_registro(
  p_tipo text,
  p_id bigint
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_tipo text := lower(trim(coalesce(p_tipo, '')));
BEGIN
  IF p_id IS NULL THEN
    RAISE EXCEPTION 'ID não informado.';
  END IF;

  IF v_tipo = 'clubes' THEN
    IF to_regclass('public.time_rivais') IS NOT NULL THEN
      DELETE FROM public.time_rivais
      WHERE time_id = p_id OR rival_id = p_id;
    END IF;

    IF to_regclass('public.titulos') IS NOT NULL THEN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema='public' AND table_name='titulos' AND column_name='campeao_id'
      ) THEN
        EXECUTE 'DELETE FROM public.titulos WHERE campeao_id = $1 OR vice_id = $1'
        USING p_id;
      END IF;
    END IF;

    DELETE FROM public.times WHERE id = p_id;
    RETURN FOUND;

  ELSIF v_tipo = 'selecoes' THEN
    IF to_regclass('public.titulos') IS NOT NULL THEN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema='public' AND table_name='titulos' AND column_name='campeao_id'
      ) THEN
        EXECUTE 'DELETE FROM public.titulos WHERE campeao_id = $1 OR vice_id = $1'
        USING p_id;
      END IF;
    END IF;

    DELETE FROM public.selecoes WHERE id = p_id;
    RETURN FOUND;

  ELSIF v_tipo = 'competicoes' THEN
    IF to_regclass('public.titulos') IS NOT NULL THEN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema='public' AND table_name='titulos' AND column_name='competicao_id'
      ) THEN
        EXECUTE 'DELETE FROM public.titulos WHERE competicao_id = $1'
        USING p_id;
      END IF;
    END IF;

    DELETE FROM public.competicoes WHERE id = p_id;
    RETURN FOUND;

  ELSE
    RAISE EXCEPTION 'Tipo inválido: %', p_tipo;
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.fp_excluir_registro(text,bigint) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.fp_excluir_registro(text,bigint) TO authenticated;
GRANT EXECUTE ON FUNCTION public.fp_excluir_registro(text,bigint) TO anon;
