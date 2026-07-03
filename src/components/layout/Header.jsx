import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { pesquisarTudo } from "../../services/searchService";

import "./Header.css";

function Header() {
  const [texto, setTexto] = useState("");
  const [resultado, setResultado] = useState({
    times: [],
    competicoes: [],
    paises: [],
    continentes: [],
    organizacoes: [],
  });

  useEffect(() => {
    async function pesquisar() {
      if (!texto.trim()) {
        setResultado({
          times: [],
          competicoes: [],
          paises: [],
          continentes: [],
          organizacoes: [],
        });
        return;
      }

      const dados = await pesquisarTudo(texto);
      setResultado(dados);
    }

    pesquisar();
  }, [texto]);

  function limparBusca() {
    setTexto("");
  }

  return (
    <header className="top-header">
      <div>
        <h2>Painel Administrativo</h2>
        <span>Gerencie dados de futebol do mundo inteiro</span>
      </div>

      <div className="header-search">
        <input
          className="search-input"
          placeholder="🔍 Pesquisar clube, competição, país..."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        />

        {texto && (
          <div className="search-results">
            {resultado.times.length > 0 && (
              <>
                <h6>⚽ Clubes</h6>
                {resultado.times.map((item) => (
                  <Link key={item.id} to={`/times/${item.id}`} onClick={limparBusca}>
                    {item.nome}
                  </Link>
                ))}
              </>
            )}

            {resultado.competicoes.length > 0 && (
              <>
                <h6>🏆 Competições</h6>
                {resultado.competicoes.map((item) => (
                  <Link key={item.id} to={`/competicoes/${item.id}`} onClick={limparBusca}>
                    {item.nome}
                  </Link>
                ))}
              </>
            )}

            {resultado.paises.length > 0 && (
              <>
                <h6>🌎 Países</h6>
                {resultado.paises.map((item) => (
                  <Link key={item.id} to={`/paises/${item.id}`} onClick={limparBusca}>
                    {item.nome}
                  </Link>
                ))}
              </>
            )}

            {resultado.continentes.length > 0 && (
              <>
                <h6>🌍 Continentes</h6>
                {resultado.continentes.map((item) => (
                  <Link key={item.id} to={`/continentes/${item.id}`} onClick={limparBusca}>
                    {item.nome}
                  </Link>
                ))}
              </>
            )}

            {resultado.organizacoes.length > 0 && (
              <>
                <h6>🏛 Organizações</h6>
                {resultado.organizacoes.map((item) => (
                  <Link key={item.id} to={`/organizacoes/${item.id}`} onClick={limparBusca}>
                    {item.nome}
                  </Link>
                ))}
              </>
            )}

            {resultado.times.length === 0 &&
              resultado.competicoes.length === 0 &&
              resultado.paises.length === 0 &&
              resultado.continentes.length === 0 &&
              resultado.organizacoes.length === 0 && (
                <div className="sem-resultados">Nenhum resultado encontrado.</div>
              )}
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;