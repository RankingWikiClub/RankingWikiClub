import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { pesquisarTudo } from "../../services/searchService";

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

  return (
    <header
      style={{
        background: "#0B3D91",
        padding: "15px 25px",
        color: "#fff",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
        }}
      >
        <h2 style={{ margin: 0 }}>⚽ FutPédia</h2>

        <div style={{ flex: 1, maxWidth: "500px", position: "relative" }}>
          <input
            className="form-control"
            placeholder="Pesquisar clube, competição, país..."
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
          />

          {texto !== "" && (
            <div
              style={{
                position: "absolute",
                top: "45px",
                left: 0,
                right: 0,
                background: "#fff",
                color: "#000",
                borderRadius: "10px",
                boxShadow: "0 10px 25px rgba(0,0,0,.2)",
                zIndex: 9999,
                maxHeight: "450px",
                overflowY: "auto",
              }}
            >
              {resultado.times.length > 0 && (
                <>
                  <h6 className="p-2 bg-light mb-0">⚽ Clubes</h6>

                  {resultado.times.map((item) => (
                    <Link
                      key={item.id}
                      className="dropdown-item"
                      to={`/times/${item.id}`}
                    >
                      {item.nome}
                    </Link>
                  ))}
                </>
              )}

              {resultado.competicoes.length > 0 && (
                <>
                  <h6 className="p-2 bg-light mb-0">🏆 Competições</h6>

                  {resultado.competicoes.map((item) => (
                    <Link
                      key={item.id}
                      className="dropdown-item"
                      to={`/competicoes/${item.id}`}
                    >
                      {item.nome}
                    </Link>
                  ))}
                </>
              )}

              {resultado.paises.length > 0 && (
                <>
                  <h6 className="p-2 bg-light mb-0">🌎 Países</h6>

                  {resultado.paises.map((item) => (
                    <Link
                      key={item.id}
                      className="dropdown-item"
                      to={`/paises/${item.id}`}
                    >
                      {item.nome}
                    </Link>
                  ))}
                </>
              )}

              {resultado.continentes.length > 0 && (
                <>
                  <h6 className="p-2 bg-light mb-0">🌍 Continentes</h6>

                  {resultado.continentes.map((item) => (
                    <Link
                      key={item.id}
                      className="dropdown-item"
                      to={`/continentes/${item.id}`}
                    >
                      {item.nome}
                    </Link>
                  ))}
                </>
              )}

              {resultado.organizacoes.length > 0 && (
                <>
                  <h6 className="p-2 bg-light mb-0">🏛 Organizações</h6>

                  {resultado.organizacoes.map((item) => (
                    <Link
                      key={item.id}
                      className="dropdown-item"
                      to={`/organizacoes/${item.id}`}
                    >
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
                  <div className="p-3 text-center">
                    Nenhum resultado encontrado.
                  </div>
                )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;