import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/cards/Card";

import { listarContinentes } from "../../services/continentesService";
import { listarPaises } from "../../services/paisesService";
import { listarTimes } from "../../services/timesService";
import { listarCompeticoes } from "../../services/competicoesService";

function BuscaGlobal() {
  const [continentes, setContinentes] = useState([]);
  const [paises, setPaises] = useState([]);
  const [times, setTimes] = useState([]);
  const [competicoes, setCompeticoes] = useState([]);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    async function carregar() {
      try {
        const [listaContinentes, listaPaises, listaTimes, listaCompeticoes] =
          await Promise.all([
            listarContinentes(),
            listarPaises(),
            listarTimes(),
            listarCompeticoes(),
          ]);

        setContinentes(listaContinentes || []);
        setPaises(listaPaises || []);
        setTimes(listaTimes || []);
        setCompeticoes(listaCompeticoes || []);
      } catch (erro) {
        console.error("Erro ao carregar busca global:", erro);
        alert("Erro ao carregar dados da Busca Global.");
      }
    }

    carregar();
  }, []);

  const termo = busca.trim().toLowerCase();

  const resultados = useMemo(() => {
    if (!termo) {
      return {
        times: [],
        competicoes: [],
        paises: [],
        continentes: [],
      };
    }

    const filtrar = (lista, campos) =>
      lista.filter((item) =>
        campos.some((campo) =>
          String(item[campo] || "")
            .toLowerCase()
            .includes(termo)
        )
      );

    return {
      times: filtrar(times, ["nome", "nome_curto", "cidade", "estadio"]).slice(
        0,
        20
      ),
      competicoes: filtrar(competicoes, [
        "nome",
        "nome_curto",
        "tipo",
        "abrangencia",
      ]).slice(0, 20),
      paises: filtrar(paises, ["nome"]).slice(0, 20),
      continentes: filtrar(continentes, ["nome", "sigla", "confederacao"]).slice(
        0,
        20
      ),
    };
  }, [termo, times, competicoes, paises, continentes]);

  function nomePais(paisId) {
    const pais = paises.find((item) => Number(item.id) === Number(paisId));
    return pais?.nome || "";
  }

  function nomeContinente(continenteId) {
    const continente = continentes.find(
      (item) => Number(item.id) === Number(continenteId)
    );
    return continente?.nome || "";
  }

  function tipoCompeticaoTexto(tipo) {
    if (tipo === "Liga") return "Liga Nacional";
    if (tipo === "Copa") return "Copa Nacional";
    return tipo || "";
  }

  function SecaoResultados({ titulo, quantidade, children }) {
    return (
      <Card>
        <h5 className="mb-3">
          {titulo}{" "}
          <span className="badge bg-primary">{quantidade}</span>
        </h5>
        {quantidade === 0 ? (
          <p className="mb-0">Nenhum resultado encontrado.</p>
        ) : (
          children
        )}
      </Card>
    );
  }

  return (
    <div>
      <PageHeader
        title="🔍 Busca Global"
        subtitle="Pesquise times, competições, países e continentes."
      />

      <Card>
        <label className="form-label">Pesquisar</label>
        <input
          className="form-control form-control-lg"
          placeholder="Digite Flamengo, Brasil, Copa do Brasil, Europa..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          autoFocus
        />
      </Card>

      {!termo ? (
        <Card>
          <p className="mb-0">
            Digite algo para iniciar a busca no banco de dados do FutPédia.
          </p>
        </Card>
      ) : (
        <>
          <SecaoResultados
            titulo="⚽ Times"
            quantidade={resultados.times.length}
          >
            <div className="list-group">
              {resultados.times.map((time) => (
                <Link
                  key={time.id}
                  to={`/times/${time.id}`}
                  className="list-group-item list-group-item-action"
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    {time.escudo ? (
                      <img
                        src={time.escudo}
                        alt={time.nome}
                        style={{
                          width: "36px",
                          height: "36px",
                          objectFit: "contain",
                        }}
                      />
                    ) : (
                      <span style={{ fontSize: "24px" }}>⚽</span>
                    )}

                    <div>
                      <strong>{time.nome}</strong>
                      <br />
                      <small>
                        {nomePais(time.pais_id)}
                        {time.cidade ? ` • ${time.cidade}` : ""}
                      </small>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </SecaoResultados>

          <SecaoResultados
            titulo="🏆 Competições"
            quantidade={resultados.competicoes.length}
          >
            <div className="list-group">
              {resultados.competicoes.map((competicao) => (
                <Link
                  key={competicao.id}
                  to={`/competicoes/${competicao.id}`}
                  className="list-group-item list-group-item-action"
                >
                  <strong>{competicao.nome}</strong>
                  <br />
                  <small>
                    {tipoCompeticaoTexto(competicao.tipo)} •{" "}
                    {competicao.abrangencia}
                    {competicao.pais_id
                      ? ` • ${nomePais(competicao.pais_id)}`
                      : ""}
                    {competicao.continente_id
                      ? ` • ${nomeContinente(competicao.continente_id)}`
                      : ""}
                  </small>
                </Link>
              ))}
            </div>
          </SecaoResultados>

          <SecaoResultados
            titulo="🏳️ Países"
            quantidade={resultados.paises.length}
          >
            <div className="list-group">
              {resultados.paises.map((pais) => (
                <div key={pais.id} className="list-group-item">
                  <strong>
                    {pais.bandeira ? `${pais.bandeira} ` : ""}
                    {pais.nome}
                  </strong>
                  <br />
                  <small>{nomeContinente(pais.continente_id)}</small>
                </div>
              ))}
            </div>
          </SecaoResultados>

          <SecaoResultados
            titulo="🌍 Continentes"
            quantidade={resultados.continentes.length}
          >
            <div className="list-group">
              {resultados.continentes.map((continente) => (
                <div key={continente.id} className="list-group-item">
                  <strong>{continente.nome}</strong>
                  <br />
                  <small>
                    {continente.sigla || ""}
                    {continente.confederacao
                      ? ` • ${continente.confederacao}`
                      : ""}
                  </small>
                </div>
              ))}
            </div>
          </SecaoResultados>
        </>
      )}
    </div>
  );
}

export default BuscaGlobal;