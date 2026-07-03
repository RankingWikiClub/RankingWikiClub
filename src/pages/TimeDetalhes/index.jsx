import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/cards/Card";

import { listarPaises } from "../../services/paisesService";
import { listarTimes } from "../../services/timesService";
import { listarCompeticoes } from "../../services/competicoesService";
import { listarEdicoes } from "../../services/edicoesService";

function TimeDetalhes() {
  const { id } = useParams();

  const [time, setTime] = useState(null);
  const [pais, setPais] = useState(null);
  const [competicoes, setCompeticoes] = useState([]);
  const [edicoes, setEdicoes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  async function carregar() {
    try {
      setCarregando(true);

      const [listaTimes, listaPaises, listaCompeticoes, listaEdicoes] =
        await Promise.all([
          listarTimes(),
          listarPaises(),
          listarCompeticoes(),
          listarEdicoes(),
        ]);

      const timeEncontrado = (listaTimes || []).find(
        (item) => String(item.id) === String(id)
      );

      const paisEncontrado = (listaPaises || []).find(
        (item) => Number(item.id) === Number(timeEncontrado?.pais_id)
      );

      setTime(timeEncontrado || null);
      setPais(paisEncontrado || null);
      setCompeticoes(listaCompeticoes || []);
      setEdicoes(listaEdicoes || []);
    } catch (erro) {
      console.error("Erro ao carregar detalhes do time:", erro);
      alert("Erro ao carregar detalhes do time.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, [id]);

  function agruparRegistros(tipoRegistro) {
    const registrosDoTime = edicoes.filter((edicao) => {
      if (tipoRegistro === "campeao") {
        return String(edicao.campeao_id) === String(id);
      }

      if (tipoRegistro === "vice") {
        return String(edicao.vice_id) === String(id);
      }

      return false;
    });

    const grupos = {};

    registrosDoTime.forEach((edicao) => {
      const competicao = competicoes.find(
        (item) => Number(item.id) === Number(edicao.competicao_id)
      );

      if (!competicao) return;

      const chave =
        competicao.tipo === "Estadual"
          ? "Estadual"
          : competicao.nome;

      if (!grupos[chave]) {
        grupos[chave] = {
          nome: chave,
          competicao_id: competicao.id,
          tipo: competicao.tipo,
          quantidade: 0,
          anos: [],
        };
      }

      grupos[chave].quantidade += 1;

      if (edicao.temporada) {
        grupos[chave].anos.push(Number(edicao.temporada));
      }
    });

    return Object.values(grupos)
      .map((grupo) => ({
        ...grupo,
        anos: grupo.anos.sort((a, b) => a - b),
      }))
      .sort((a, b) => b.quantidade - a.quantidade || a.nome.localeCompare(b.nome));
  }

  const titulosAgrupados = agruparRegistros("campeao");
  const vicesAgrupados = agruparRegistros("vice");

  const totalTitulos = titulosAgrupados.reduce(
    (total, item) => total + item.quantidade,
    0
  );

  const totalVices = vicesAgrupados.reduce(
    (total, item) => total + item.quantidade,
    0
  );

  if (carregando) {
    return (
      <div>
        <PageHeader title="⚽ Detalhes do Time" subtitle="Carregando..." />
        <Card>
          <p className="mb-0">Carregando informações do time...</p>
        </Card>
      </div>
    );
  }

  if (!time) {
    return (
      <div>
        <PageHeader title="⚽ Time não encontrado" subtitle="" />
        <Card>
          <p>O time solicitado não foi encontrado.</p>
          <Link to="/times" className="btn btn-primary">
            Voltar para Times
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={`⚽ ${time.nome}`}
        subtitle="Informações cadastradas, títulos e vice-campeonatos."
      />

      <Card>
        <div className="row align-items-center">
          <div className="col-md-2 text-center">
            {time.escudo ? (
              <img
                src={time.escudo}
                alt={time.nome}
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "contain",
                }}
              />
            ) : (
              <div
                style={{
                  width: "120px",
                  height: "120px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "56px",
                  border: "1px solid #ddd",
                  borderRadius: "12px",
                  margin: "0 auto",
                }}
              >
                ⚽
              </div>
            )}
          </div>

          <div className="col-md-10">
            <h3>{time.nome}</h3>

            <div className="row mt-3">
              <div className="col-md-4">
                <strong>País:</strong>
                <p>{pais?.nome || "Não informado"}</p>
              </div>

              <div className="col-md-4">
                <strong>Cidade:</strong>
                <p>{time.cidade || "Não informado"}</p>
              </div>

              <div className="col-md-4">
                <strong>Estádio:</strong>
                <p>{time.estadio || "Não informado"}</p>
              </div>

              <div className="col-md-4">
                <strong>Fundação:</strong>
                <p>{time.fundacao || "Não informado"}</p>
              </div>

              <div className="col-md-4">
                <strong>Total de títulos:</strong>
                <p>{totalTitulos}</p>
              </div>

              <div className="col-md-4">
                <strong>Total de vices:</strong>
                <p>{totalVices}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <h5 className="mb-3">🏆 Títulos conquistados</h5>

        {titulosAgrupados.length === 0 ? (
          <p className="mb-0">Nenhum título cadastrado para este time.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover table-bordered align-middle bg-white">
              <thead className="table-primary">
                <tr>
                  <th>Competição</th>
                  <th>Quantidade</th>
                  <th>Anos</th>
                </tr>
              </thead>

              <tbody>
                {titulosAgrupados.map((item) => (
                  <tr key={`titulo-${item.nome}`}>
                    <td>
                      {item.nome === "Estadual" ? (
                        <strong>Estadual</strong>
                      ) : (
                        <Link
                          to={`/competicoes/${item.competicao_id}`}
                          style={{
                            fontWeight: "bold",
                            textDecoration: "none",
                            color: "#0b3d91",
                          }}
                        >
                          {item.nome}
                        </Link>
                      )}
                    </td>
                    <td>
                      <strong>{item.quantidade}</strong>
                    </td>
                    <td>{item.anos.join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card>
        <h5 className="mb-3">🥈 Vice-campeonatos</h5>

        {vicesAgrupados.length === 0 ? (
          <p className="mb-0">Nenhum vice-campeonato cadastrado para este time.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover table-bordered align-middle bg-white">
              <thead className="table-primary">
                <tr>
                  <th>Competição</th>
                  <th>Quantidade</th>
                  <th>Anos</th>
                </tr>
              </thead>

              <tbody>
                {vicesAgrupados.map((item) => (
                  <tr key={`vice-${item.nome}`}>
                    <td>
                      {item.nome === "Estadual" ? (
                        <strong>Estadual</strong>
                      ) : (
                        <Link
                          to={`/competicoes/${item.competicao_id}`}
                          style={{
                            fontWeight: "bold",
                            textDecoration: "none",
                            color: "#0b3d91",
                          }}
                        >
                          {item.nome}
                        </Link>
                      )}
                    </td>
                    <td>
                      <strong>{item.quantidade}</strong>
                    </td>
                    <td>{item.anos.join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Link to="/times" className="btn btn-secondary">
        Voltar
      </Link>
    </div>
  );
}

export default TimeDetalhes;