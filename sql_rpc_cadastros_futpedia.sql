-- =====================================================
-- FUTPEDIA - CORREÇÃO DEFINITIVA DE CADASTROS/EDIÇÕES
-- Estados Unidos funções SECURITY DEFINER para salvar no Supabase
-- mesmo quando o RLS bloquear INSERT/UPDATE direto do JS.
-- Execute este arquivo no Supabase SQL Editor.
-- =====================================================

ALTER TABLE public.times ADD COLUMN IF NOT EXISTS escudo_url text;
ALTER TABLE public.selecoes ADD COLUMN IF NOT EXISTS escudo_url text;
ALTER TABLE public.competicoes ADD COLUMN IF NOT EXISTS logo_url text;

-- -----------------------------------------------------
-- TIMES
-- -----------------------------------------------------
CREATE OR REPLACE FUNCTION public.fp_salvar_time(
  p_id bigint DEFAULT NULL,
  p_pais_nome text DEFAULT NULL,
  p_nome_curto text DEFAULT NULL,
  p_nome text DEFAULT NULL,
  p_fundacao text DEFAULT NULL,
  p_estado text DEFAULT NULL,
  p_cidade text DEFAULT NULL,
  p_escudo_url text DEFAULT NULL
)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_pais_id bigint;
  v_id bigint;
BEGIN
  SELECT id INTO v_pais_id
  FROM public.paises
  WHERE nome = p_pais_nome
  LIMIT 1;

  IF v_pais_id IS NULL THEN
    RAISE EXCEPTION 'País não encontrado: %', p_pais_nome;
  END IF;

  IF p_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.times WHERE id = p_id) THEN
    UPDATE public.times
    SET
      pais_id = v_pais_id,
      nome_curto = COALESCE(NULLIF(p_nome_curto, ''), nome_curto),
      nome = COALESCE(NULLIF(p_nome, ''), nome),
      fundacao = NULLIF(p_fundacao, ''),
      estado = NULLIF(p_estado, ''),
      cidade = NULLIF(p_cidade, ''),
      escudo_url = COALESCE(NULLIF(p_escudo_url, ''), escudo_url),
      ativo = true
    WHERE id = p_id
    RETURNING id INTO v_id;

    RETURN v_id;
  END IF;

  SELECT id INTO v_id
  FROM public.times
  WHERE pais_id = v_pais_id
    AND nome = p_nome
  LIMIT 1;

  IF v_id IS NOT NULL THEN
    UPDATE public.times
    SET
      nome_curto = COALESCE(NULLIF(p_nome_curto, ''), nome_curto),
      fundacao = NULLIF(p_fundacao, ''),
      estado = NULLIF(p_estado, ''),
      cidade = NULLIF(p_cidade, ''),
      escudo_url = COALESCE(NULLIF(p_escudo_url, ''), escudo_url),
      ativo = true
    WHERE id = v_id;

    RETURN v_id;
  END IF;

  INSERT INTO public.times (
    pais_id,
    nome_curto,
    nome,
    fundacao,
    estado,
    cidade,
    escudo_url,
    ativo
  ) VALUES (
    v_pais_id,
    NULLIF(p_nome_curto, ''),
    NULLIF(p_nome, ''),
    NULLIF(p_fundacao, ''),
    NULLIF(p_estado, ''),
    NULLIF(p_cidade, ''),
    NULLIF(p_escudo_url, ''),
    true
  )
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

-- -----------------------------------------------------
-- SELEÇÕES
-- -----------------------------------------------------
CREATE OR REPLACE FUNCTION public.fp_salvar_selecao(
  p_id bigint DEFAULT NULL,
  p_pais_nome text DEFAULT NULL,
  p_nome text DEFAULT NULL,
  p_escudo_url text DEFAULT NULL
)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_pais_id bigint;
  v_id bigint;
  v_sigla text;
BEGIN
  SELECT id, sigla INTO v_pais_id, v_sigla
  FROM public.paises
  WHERE nome = p_pais_nome
  LIMIT 1;

  IF v_pais_id IS NULL THEN
    RAISE EXCEPTION 'País não encontrado: %', p_pais_nome;
  END IF;

  IF p_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.selecoes WHERE id = p_id) THEN
    UPDATE public.selecoes
    SET
      pais_id = v_pais_id,
      nome = COALESCE(NULLIF(p_nome, ''), p_pais_nome),
      codigo_fifa = COALESCE(codigo_fifa, v_sigla),
      escudo_url = COALESCE(NULLIF(p_escudo_url, ''), escudo_url),
      ativa = true
    WHERE id = p_id
    RETURNING id INTO v_id;

    RETURN v_id;
  END IF;

  SELECT id INTO v_id
  FROM public.selecoes
  WHERE pais_id = v_pais_id
  LIMIT 1;

  IF v_id IS NOT NULL THEN
    UPDATE public.selecoes
    SET
      nome = COALESCE(NULLIF(p_nome, ''), nome),
      codigo_fifa = COALESCE(codigo_fifa, v_sigla),
      escudo_url = COALESCE(NULLIF(p_escudo_url, ''), escudo_url),
      ativa = true
    WHERE id = v_id;

    RETURN v_id;
  END IF;

  INSERT INTO public.selecoes (
    pais_id,
    nome,
    codigo_fifa,
    escudo_url,
    ativa
  ) VALUES (
    v_pais_id,
    COALESCE(NULLIF(p_nome, ''), p_pais_nome),
    v_sigla,
    NULLIF(p_escudo_url, ''),
    true
  )
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

-- -----------------------------------------------------
-- COMPETIÇÕES
-- -----------------------------------------------------
CREATE OR REPLACE FUNCTION public.fp_salvar_competicao(
  p_id bigint DEFAULT NULL,
  p_nome text DEFAULT NULL,
  p_tipo text DEFAULT NULL,
  p_abrangencia text DEFAULT NULL,
  p_pais_nome text DEFAULT NULL,
  p_continente_nome text DEFAULT NULL,
  p_logo_url text DEFAULT NULL,
  p_organizador text DEFAULT NULL,
  p_nivel text DEFAULT NULL,
  p_genero text DEFAULT NULL,
  p_sigla text DEFAULT NULL,
  p_descricao text DEFAULT NULL,
  p_divisao int DEFAULT NULL,
  p_periodicidade text DEFAULT NULL,
  p_primeira_edicao int DEFAULT NULL,
  p_status text DEFAULT NULL,
  p_categoria text DEFAULT NULL
)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_pais_id bigint;
  v_continente_id bigint;
  v_id bigint;
BEGIN
  IF p_pais_nome IS NOT NULL AND p_pais_nome <> '' THEN
    SELECT id INTO v_pais_id
    FROM public.paises
    WHERE nome = p_pais_nome
    LIMIT 1;
  END IF;

  IF p_continente_nome IS NOT NULL AND p_continente_nome <> '' THEN
    SELECT id INTO v_continente_id
    FROM public.continentes
    WHERE nome = p_continente_nome
    LIMIT 1;
  END IF;

  IF p_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.competicoes WHERE id = p_id) THEN
    UPDATE public.competicoes
    SET
      nome = COALESCE(NULLIF(p_nome, ''), nome),
      tipo = COALESCE(NULLIF(p_tipo, ''), tipo),
      abrangencia = COALESCE(NULLIF(p_abrangencia, ''), abrangencia),
      pais_id = v_pais_id,
      continente_id = v_continente_id,
      logo_url = COALESCE(NULLIF(p_logo_url, ''), logo_url),
      ativa = true,
      organizador = COALESCE(NULLIF(p_organizador, ''), organizador),
      nivel = COALESCE(NULLIF(p_nivel, ''), nivel),
      genero = COALESCE(NULLIF(p_genero, ''), genero),
      sigla = COALESCE(NULLIF(p_sigla, ''), sigla),
      descricao = COALESCE(NULLIF(p_descricao, ''), descricao),
      divisao = COALESCE(p_divisao, divisao),
      periodicidade = COALESCE(NULLIF(p_periodicidade, ''), periodicidade),
      primeira_edicao = COALESCE(p_primeira_edicao, primeira_edicao),
      status = COALESCE(NULLIF(p_status, ''), status),
      categoria = COALESCE(NULLIF(p_categoria, ''), categoria)
    WHERE id = p_id
    RETURNING id INTO v_id;

    RETURN v_id;
  END IF;

  SELECT id INTO v_id
  FROM public.competicoes
  WHERE nome = p_nome
    AND tipo = p_tipo
  LIMIT 1;

  IF v_id IS NOT NULL THEN
    UPDATE public.competicoes
    SET
      abrangencia = COALESCE(NULLIF(p_abrangencia, ''), abrangencia),
      pais_id = v_pais_id,
      continente_id = v_continente_id,
      logo_url = COALESCE(NULLIF(p_logo_url, ''), logo_url),
      ativa = true,
      organizador = COALESCE(NULLIF(p_organizador, ''), organizador),
      nivel = COALESCE(NULLIF(p_nivel, ''), nivel),
      genero = COALESCE(NULLIF(p_genero, ''), genero),
      sigla = COALESCE(NULLIF(p_sigla, ''), sigla),
      descricao = COALESCE(NULLIF(p_descricao, ''), descricao),
      divisao = COALESCE(p_divisao, divisao),
      periodicidade = COALESCE(NULLIF(p_periodicidade, ''), periodicidade),
      primeira_edicao = COALESCE(p_primeira_edicao, primeira_edicao),
      status = COALESCE(NULLIF(p_status, ''), status),
      categoria = COALESCE(NULLIF(p_categoria, ''), categoria)
    WHERE id = v_id;

    RETURN v_id;
  END IF;

  INSERT INTO public.competicoes (
    nome,
    tipo,
    abrangencia,
    continente_id,
    pais_id,
    logo_url,
    ativa,
    organizador,
    nivel,
    genero,
    sigla,
    descricao,
    divisao,
    periodicidade,
    primeira_edicao,
    status,
    categoria
  ) VALUES (
    NULLIF(p_nome, ''),
    COALESCE(NULLIF(p_tipo, ''), 'clubes'),
    NULLIF(p_abrangencia, ''),
    v_continente_id,
    v_pais_id,
    NULLIF(p_logo_url, ''),
    true,
    NULLIF(p_organizador, ''),
    NULLIF(p_nivel, ''),
    COALESCE(NULLIF(p_genero, ''), 'masculino'),
    NULLIF(p_sigla, ''),
    NULLIF(p_descricao, ''),
    p_divisao,
    NULLIF(p_periodicidade, ''),
    p_primeira_edicao,
    COALESCE(NULLIF(p_status, ''), 'Ativa'),
    COALESCE(NULLIF(p_categoria, ''), 'Profissional')
  )
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.fp_salvar_time(bigint,text,text,text,text,text,text,text) TO anon, authenticated, public;
GRANT EXECUTE ON FUNCTION public.fp_salvar_selecao(bigint,text,text,text) TO anon, authenticated, public;
GRANT EXECUTE ON FUNCTION public.fp_salvar_competicao(bigint,text,text,text,text,text,text,text,text,text,text,text,int,text,int,text,text) TO anon, authenticated, public;

-- -----------------------------------------------------
-- STORAGE: buckets e policies para upload de imagens
-- -----------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('escudos-times', 'escudos-times', true),
  ('escudos-selecoes', 'escudos-selecoes', true),
  ('logos-competicoes', 'logos-competicoes', true)
ON CONFLICT (id) DO UPDATE SET public = true;

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
