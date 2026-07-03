import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/cards/Card";
import SelectInput from "../../components/forms/SelectInput";

import { listarPaises } from "../../services/paisesService";
import { listarTimes } from "../../services/timesService";
import { listarCompeticoes } from "../../services/competicoesService";
import { listarEdicoes } from "../../services/edicoesService";

function Comparador() {
  const [paises, setPaises] = useState([]);
  const [times, setTimes] = useState([]);
  const [competicoes, setCompeticoes] = useState([]);
  const [edicoes, setEdicoes] = useState([]);

  const [timeAId, setTimeAId] = useState("");
  const [timeBId, setTimeBId] = useState("");

  useEffect(() => {
    async function carregar() {
      try {
        const [listaPaises, listaTimes, listaCompeticoes, listaEdicoes] =
          await Promise.all([
            listarPaises(),
            listarTimes(),
            listarCompeticoes(),
            listarEdicoes(),
          ]);

        setPaises(listaPaises || []);
        setTimes(listaTimes || []);
        setCompeticoes(listaCompeticoes || []);
        setEdicoes(listaEdicoes || []);
      } catch (erro) {
        console.error("Erro ao carregar comparador:", erro);
        alert("Erro ao carregar dados do comparador.");
      }
    }

    carregar();
  }, []);

  const timeA = times.find((time) => String(time.id) === String(timeAId));
  const timeB = times.find((time) => String(time.id) === String(timeBId));

  function nomePais(paisId) {
    const pais = paises.find((item) => Number(item.id) === Number(paisId));
    return pais?.nome || "Não informado";
  }

  function tipoTexto(tipo) {
    if (tipo === "Liga") return "Liga Nacional";
    if (tipo === "Copa") return "Copa Nacional";
    return tipo || "Outros";
  }

  function gerarResumo(timeId) {
    const titulos = edicoes.filter(
      (edicao) => String(edicao.campeao_id) === String(timeId)
    );

    const vices = edicoes.filter(
      (edicao) => String(edicao.vice_id) === String(timeId)
    );

    const titulosPorTipo = {};
    const vicesPorTipo = {};
    const titulosPorCompeticao = {};

    titulos.forEach((edicao) => {
      const competicao = competicoes.find(
        (item) => Number(item.id) === Number(edicao.competicao_id)
      );

      if (!competicao) return;

      const tipo = tipoTexto(competicao.tipo);

      titulosPorTipo[tipo] = (titulosPorTipo[tipo] || 0) + 1;

      if (!titulosPorCompeticao[competicao.id]) {
        titulosPorCompeticao[competicao.id] = {
          id: competicao.id,
          nome: competicao.nome,
          quantidade: 0,
          anos: [],
        };
      }

      titulosPorCompeticao[competicao.id].quantidade += 1;

      if (edicao.temporada) {
        titulosPorCompeticao[competicao.id].anos.push(Number(edicao.temporada));
      }
    });

    vices.forEach((edicao) => {
      const competicao = competicoes.find(
        (item) => Number(item.id) === Number(edicao.competicao_id)
      );

      if (!competicao) return;

      const tipo = tipoTexto(competicao.tipo);
      vicesPorTipo[tipo] = (vicesPorTipo[tipo] || 0) + 1;
    });

    return {
      totalTitulos: titulos.length,
      totalVices: vices.length,
      totalFinais: titulos.length + vices.length,
      aproveitamento:
        titulos.length + vices.length > 0
          ? Math.round((titulos.length / (titulos.length + vices.length)) * 100)
          : 0,
      titulosPorTipo,
      vicesPorTipo,
      titulosPorCompeticao: Object.values(titulosPorCompeticao)
        .map((item) => ({
          ...item,
          anos: item.anos.sort((a, b) => a - b),
        }))
        .sort(
          (a, b) =>
            b.quantidade - a.quantidade || a.nome.localeCompare(b.nome)
        ),
    };
  }

  const resumoA = useMemo(
    () => (timeAId ? gerarResumo(timeAId) : null),
    [timeAId, edicoes, competicoes]
  );

  const resumoB = useMemo(
    () => (timeBId ? gerarResumo(timeBId) : null),
    [timeBId, edicoes, competicoes]
  );

  const tiposComparacao = [
    "Liga Nacional",
    "Copa Nacional",
    "Estadual",
    "Copa Regional",
    "Continental",
    "Mundial de Clubes",
    "Intercontinental",
    "Copa Continental de Clubes",
    "Copa Continental de Seleções",
    "Copa do Mundo de Seleções",
  ];

  function CardTime({ time, resumo }) {
    if (!time || !resumo) {
      return (
        <Card>
          <p className="mb-0">Selecione um time para comparar.</p>
        </Card>
      );
    }

    return (
      <Card>
        <div className="text-center mb-3">
          {time.escudo ? (
            <img
              src={time.escudo}
              alt={time.nome}
              style={{
                width: "110px",
                height: "110px",
                objectFit: "contain",
              }}
            />
          ) : (
            <div style={{ fontSize: "70px" }}>⚽</div>
          )}

          <h4 className="mt-2">
            <Link to={`/times/${time.id}`}>{time.nome}</Link>
          </h4>
        </div>

        <p>
          <strong>País:</strong> {nomePais(time.pais_id)}
        </p>
        <p>
          <strong>Cidade:</strong> {time.cidade || "Não informado"}
        </p>
        <p>
          <strong>Estádio:</strong> {time.estadio || "Não informado"}
        </p>
        <p>
          <strong>Fundação:</strong> {time.fundacao || "Não informado"}
        </p>

        <hr />

        <div className="row text-center">
          <div className="col-4">
            <h3>{resumo.totalTitulos}</h3>
            <small>Títulos</small>
          </div>

          <div className="col-4">
            <h3>{resumo.totalVices}</h3>
            <small>Vices</small>
          </div>

          <div className="col-4">
            <h3>{resumo.aproveitamento}%</h3>
            <small>Aproveitamento</small>
          </div>
        </div>
      </Card>
    );
  }

  function valorMaior(a, b) {
    if (a > b) return "table-success";
    if (a < b) return "table-danger";
    return "";
  }

  return (
    <div>
      <PageHeader
        title="⚖️ Comparador de Times"
        subtitle="Compare títulos, vices e informações cadastradas dos clubes."
      />

      <Card>
        <div className="row">
          <div className="col-md-6">
            <SelectInput
              label="Time A"
              value={timeAId}
              onChange={(e) => setTimeAId(e.target.value)}
              options={times}
            />
          </div>

          <div className="col-md-6">
            <SelectInput
              label="Time B"
              value={timeBId}
              onChange={(e) => setTimeBId(e.target.value)}
              options={times}
            />
          </div>
        </div>
      </Card>

      <div className="row">
        <div className="col-md-6">
          <CardTime time={timeA} resumo={resumoA} />
        </div>

        <div className="col-md-6">
          <CardTime time={timeB} resumo={resumoB} />
        </div>
      </div>

      {timeA && timeB && resumoA && resumoB && (
        <>
          <Card>
            <h5 className="mb-3">📊 Comparação Geral</h5>

            <div className="table-responsive">
              <table className="table table-hover table-bordered align-middle bg-white">
                <thead className="table-primary">
                  <tr>
                    <th>Indicador</th>
                    <th>{timeA.nome}</th>
                    <th>{timeB.nome}</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>Total de títulos</td>
                    <td className={valorMaior(resumoA.totalTitulos, resumoB.totalTitulos)}>
                      <strong>{resumoA.totalTitulos}</strong>
                    </td>
                    <td className={valorMaior(resumoB.totalTitulos, resumoA.totalTitulos)}>
                      <strong>{resumoB.totalTitulos}</strong>
                    </td>
                  </tr>

                  <tr>
                    <td>Total de vices</td>
                    <td>{resumoA.totalVices}</td>
                    <td>{resumoB.totalVices}</td>
                  </tr>

                  <tr>
                    <td>Total de finais</td>
                    <td>{resumoA.totalFinais}</td>
                    <td>{resumoB.totalFinais}</td>
                  </tr>

                  <tr>
                    <td>Aproveitamento em finais</td>
                    <td>{resumoA.aproveitamento}%</td>
                    <td>{resumoB.aproveitamento}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          <Card>
            <h5 className="mb-3">🏆 Títulos por tipo de competição</h5>

            <div className="table-responsive">
              <table className="table table-hover table-bordered align-middle bg-white">
                <thead className="table-primary">
                  <tr>
                    <th>Tipo</th>
                    <th>{timeA.nome}</th>
                    <th>{timeB.nome}</th>
                  </tr>
                </thead>

                <tbody>
                  {tiposComparacao.map((tipo) => {
                    const valorA = resumoA.titulosPorTipo[tipo] || 0;
                    const valorB = resumoB.titulosPorTipo[tipo] || 0;

                    return (
                      <tr key={tipo}>
                        <td>{tipo}</td>
                        <td className={valorMaior(valorA, valorB)}>
                          <strong>{valorA}</strong>
                        </td>
                        <td className={valorMaior(valorB, valorA)}>
                          <strong>{valorB}</strong>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="row">
            <div className="col-md-6">
              <Card>
                <h5 className="mb-3">🏆 Títulos de {timeA.nome}</h5>

                {resumoA.titulosPorCompeticao.length === 0 ? (
                  <p className="mb-0">Nenhum título cadastrado.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover table-bordered bg-white">
                      <thead className="table-primary">
                        <tr>
                          <th>Competição</th>
                          <th>Qtd.</th>
                          <th>Anos</th>
                        </tr>
                      </thead>

                      <tbody>
                        {resumoA.titulosPorCompeticao.map((item) => (
                          <tr key={`a-${item.id}`}>
                            <td>
                              <Link to={`/competicoes/${item.id}`}>
                                {item.nome}
                              </Link>
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
            </div>

            <div className="col-md-6">
              <Card>
                <h5 className="mb-3">🏆 Títulos de {timeB.nome}</h5>

                {resumoB.titulosPorCompeticao.length === 0 ? (
                  <p className="mb-0">Nenhum título cadastrado.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover table-bordered bg-white">
                      <thead className="table-primary">
                        <tr>
                          <th>Competição</th>
                          <th>Qtd.</th>
                          <th>Anos</th>
                        </tr>
                      </thead>

                      <tbody>
                        {resumoB.titulosPorCompeticao.map((item) => (
                          <tr key={`b-${item.id}`}>
                            <td>
                              <Link to={`/competicoes/${item.id}`}>
                                {item.nome}
                              </Link>
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
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Comparador;