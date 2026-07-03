-- =====================================================
-- FUTPÉDIA
-- Script 01 - Estrutura do Banco de Dados
-- =====================================================

-- Apagar tabelas caso existam
DROP TABLE IF EXISTS campeonatos CASCADE;
DROP TABLE IF EXISTS times CASCADE;
DROP TABLE IF EXISTS ligas CASCADE;
DROP TABLE IF EXISTS paises CASCADE;
DROP TABLE IF EXISTS continentes CASCADE;

-- =====================================================
-- TABELA CONTINENTES
-- =====================================================

CREATE TABLE continentes (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO continentes (nome) VALUES
('América Central'),
('América do Norte'),
('América do Sul'),
('África'),
('Ásia'),
('Caribe'),
('Europa'),
('Oceania');

-- =====================================================
-- TABELA PAÍSES
-- =====================================================

CREATE TABLE paises (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    continente_id BIGINT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    sigla CHAR(3),
    bandeira TEXT,

    CONSTRAINT fk_paises_continentes
        FOREIGN KEY (continente_id)
        REFERENCES continentes(id)
);

-- =====================================================
-- TABELA LIGAS
-- =====================================================

CREATE TABLE ligas (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    pais_id BIGINT NOT NULL,
    nome VARCHAR(150) NOT NULL,
    tipo VARCHAR(50),
    escudo TEXT,

    CONSTRAINT fk_ligas_paises
        FOREIGN KEY (pais_id)
        REFERENCES paises(id)
);

-- =====================================================
-- TABELA TIMES
-- =====================================================

CREATE TABLE times (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    pais_id BIGINT NOT NULL,
    liga_id BIGINT,

    nome VARCHAR(150) NOT NULL,
    nome_curto VARCHAR(80),

    cidade VARCHAR(100),
    estado VARCHAR(100),

    fundacao DATE,

    estadio VARCHAR(150),

    capacidade_estadio INTEGER,

    escudo TEXT,

    site_oficial TEXT,

    cor_primaria VARCHAR(20),
    cor_secundaria VARCHAR(20),

    ativo BOOLEAN DEFAULT TRUE,

    CONSTRAINT fk_times_paises
        FOREIGN KEY (pais_id)
        REFERENCES paises(id),

    CONSTRAINT fk_times_ligas
        FOREIGN KEY (liga_id)
        REFERENCES ligas(id)
);

-- =====================================================
-- TABELA CAMPEONATOS
-- =====================================================

CREATE TABLE campeonatos (

    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    liga_id BIGINT NOT NULL,

    nome VARCHAR(150) NOT NULL,

    temporada INTEGER NOT NULL,

    campeao_id BIGINT,

    vice_id BIGINT,

    terceiro_id BIGINT,

    quarto_id BIGINT,

    CONSTRAINT fk_campeonatos_ligas
        FOREIGN KEY (liga_id)
        REFERENCES ligas(id),

    CONSTRAINT fk_campeao
        FOREIGN KEY (campeao_id)
        REFERENCES times(id),

    CONSTRAINT fk_vice
        FOREIGN KEY (vice_id)
        REFERENCES times(id),

    CONSTRAINT fk_terceiro
        FOREIGN KEY (terceiro_id)
        REFERENCES times(id),

    CONSTRAINT fk_quarto
        FOREIGN KEY (quarto_id)
        REFERENCES times(id)
);

-- =====================================================
-- CONSULTAS DE TESTE
-- =====================================================

SELECT * FROM continentes;
SELECT * FROM paises;
SELECT * FROM ligas;
SELECT * FROM times;
SELECT * FROM campeonatos;