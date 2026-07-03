-- =====================================================
-- FUTPÉDIA
-- Script 09 - Views
-- =====================================================

-- ===========================================
-- Ranking de títulos por competição
-- ===========================================

CREATE OR REPLACE VIEW vw_ranking_competicao AS

SELECT

    c.nome AS competicao,

    t.nome AS time,

    COUNT(*) AS titulos

FROM titulos tt

INNER JOIN times t
    ON t.id = tt.time_id

INNER JOIN competicoes c
    ON c.id = tt.competicao_id

WHERE tt.tipo = 'Campeão'

GROUP BY
    c.nome,
    t.nome

ORDER BY
    c.nome,
    titulos DESC,
    t.nome;

-- ===========================================
-- Ranking geral de títulos
-- ===========================================

CREATE OR REPLACE VIEW vw_ranking_geral AS

SELECT

    t.id,

    t.nome,

    COUNT(*) AS titulos

FROM titulos tt

INNER JOIN times t
    ON t.id = tt.time_id

WHERE tt.tipo = 'Campeão'

GROUP BY
    t.id,
    t.nome

ORDER BY
    titulos DESC,
    t.nome;

-- ===========================================
-- Campeões e Vice-Campeões
-- ===========================================

CREATE OR REPLACE VIEW vw_campeoes AS

SELECT

    cp.nome AS competicao,

    e.temporada,

    tm.nome AS time,

    cl.posicao

FROM classificacao cl

INNER JOIN edicoes e
ON e.id = cl.edicao_id

INNER JOIN competicoes cp
ON cp.id = e.competicao_id

INNER JOIN times tm
ON tm.id = cl.time_id

WHERE cl.posicao IN (1,2)

ORDER BY
cp.nome,
e.temporada DESC,
cl.posicao;