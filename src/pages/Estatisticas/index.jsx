import { useEffect, useMemo, useState } from "react";

import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/cards/Card";
import SelectInput from "../../components/forms/SelectInput";

import { listarCompeticoes } from "../../services/competicoesService";
import { listarEdicoes } from "../../services/edicoesService";
import { listarTimes } from "../../services/timesService";
import { listarPaises } from "../../services/paisesService";

function Estatisticas() {
  const [competicoes, setCompeticoes] = useState([]);
  const [edicoes, setEdicoes] = useState([]);
  const [times, setTimes] = useState([]);
  const [paises, setPaises] = useState([]);

  const [carregando, setCarregando] = useState(true);
  const [abrangenciaSelecionada, setAbrangenciaSelecionada] = useState("");
  const [paisSelecionado, setPaisSelecionado] = useState("");
  const [competicaoSelecionada, setCompeticaoSelecionada] = useState("");

  async function carregarDados() {
    try {
      setCarregando(true);

      const [listaCompeticoes, listaEdicoes, listaTimes, listaPaises] =
        await Promise.all([
          listarCompeticoes(),
          listarEdicoes(),
          listarTimes(),
          listarPaises(),
        ]);

      setCompeticoes(listaCompeticoes || []);
      setEdicoes(listaEdicoes || []);
      setTimes(listaTimes || []);
      setPaises(listaPaises || []);
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
      alert("Erro ao carregar estatísticas: " + error.message);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  const abrangencias = useMemo(() => {
    const valores = competicoes
      .map((competicao) => competicao.abrangencia)
      .filter(Boolean);

    const unicas = [...new Set(valores)].sort((a, b) => a.localeCompare(b));

    return [
      { id: "", nome: "Todas as abrangências" },
      ...unicas.map((abrangencia) => ({
        id: abrangencia,
        nome: abrangencia,
      })),
    ];
  }, [competicoes]);

  const opcoesPaises = useMemo(() => {
    return [
      { id: "", nome: "Selecione um país" },
      ...paises
        .slice()
        .sort((a, b) => a.nome.localeCompare(b.nome))
        .map((pais) => ({
          id: pais.id,
          nome: pais.nome,
        })),
    ];
  }, [paises]);

  const deveMostrarPaises = abrangenciaSelecionada === "País";

  const competicoesFiltradas = useMemo(() => {
    let filtradas = [...competicoes];

    if (abrangenciaSelecionada) {
      filtradas = filtradas.filter(
        (competicao) => competicao.abrangencia === abrangenciaSelecionada
      );
    }

    if (abrangenciaSelecionada === "País") {
      if (!paisSelecionado) return [];

      filtradas = filtradas.filter(
        (competicao) => String(competicao.pais_id) === String(paisSelecionado)
      );
    }

    return filtradas.sort((a, b) => a.nome.localeCompare(b.nome));
  }, [competicoes, abrangenciaSelecionada, paisSelecionado]);

  const opcoesCompeticoes = useMemo(() => {
    return [
      { id: "", nome: "Selecione uma competição" },
      ...competicoesFiltradas.map((competicao) => ({
        id: competicao.id,
        nome: competicao.nome,
      })),
    ];
  }, [competicoesFiltradas]);

  const competicaoAtual = useMemo(() => {
    return competicoes.find(
      (competicao) => String(competicao.id) === String(competicaoSelecionada)
    );
  }, [competicoes, competicaoSelecionada]);

  const paisAtual = useMemo(() => {
    return paises.find((pais) => String(pais.id) === String(paisSelecionado));
  }, [paises, paisSelecionado]);

  const edicoesDaCompeticao = useMemo(() => {
    if (!competicaoSelecionada) return [];

    return edicoes
      .filter(
        (edicao) =>
          String(edicao.competicao_id) === String(competicaoSelecionada)
      )
      .sort((a, b) => Number(a.temporada || 0) - Number(b.temporada || 0));
  }, [edicoes, competicaoSelecionada]);

  function buscarTime(id) {
    return times.find((time) => String(time.id) === String(id));
  }

  function criarRanking(campo) {
    const mapa = {};

    edicoesDaCompeticao.forEach((edicao) => {
      const timeId = edicao[campo];

      if (!timeId) return;

      if (!mapa[timeId]) {
        const time = buscarTime(timeId);

        mapa[timeId] = {
          id: timeId,
          nome: time?.nome || "Time não encontrado",
          escudo: time?.escudo || "",
          quantidade: 0,
          anos: [],
        };
      }

      mapa[timeId].quantidade += 1;

      if (edicao.temporada) {
        mapa[timeId].anos.push(Number(edicao.temporada));
      }
    });

    return Object.values(mapa)
      .map((item) => ({
        ...item,
        anos: item.anos.sort((a, b) => a - b),
      }))
      .sort(
        (a, b) => b.quantidade - a.quantidade || a.nome.localeCompare(b.nome)
      );
  }

  const rankingCampeoes = criarRanking("campeao_id");
  const rankingVices = criarRanking("vice_id");

  const maiorCampeao = rankingCampeoes[0] || null;
  const maiorVice = rankingVices[0] || null;

  const totalEdicoes = edicoesDaCompeticao.length;
  const totalCampeoesDiferentes = rankingCampeoes.length;
  const totalVicesDiferentes = rankingVices.length;

  function alterarAbrangencia(valor) {
    setAbrangenciaSelecionada(valor);
    setPaisSelecionado("");
    setCompeticaoSelecionada("");
  }

  function alterarPais(valor) {
    setPaisSelecionado(valor);
    setCompeticaoSelecionada("");
  }

  return (
    <div>
      <PageHeader
        title="📊 Estatísticas"
        subtitle="Selecione a abrangência, depois o país quando necessário, e por fim a competição."
      />

      <Card>
        {carregando ? (
          <p>Carregando estatísticas...</p>
        ) : (
          <div className="row">
            <div className="col-md-4">
              <SelectInput
                label="Abrangência"
                value={abrangenciaSelecionada}
                onChange={(e) => alterarAbrangencia(e.target.value)}
                options={abrangencias}
              />
            </div>

            {deveMostrarPaises && (
              <div className="col-md-4">
                <SelectInput
                  label="País"
                  value={paisSelecionado}
                  onChange={(e) => alterarPais(e.target.value)}
                  options={opcoesPaises}
                />
              </div>
            )}

            <div className="col-md-4">
              <SelectInput
                label="Competição"
                value={competicaoSelecionada}
                onChange={(e) => setCompeticaoSelecionada(e.target.value)}
                options={opcoesCompeticoes}
                disabled={deveMostrarPaises && !paisSelecionado}
              />
            </div>
          </div>
        )}
      </Card>

      {!carregando && deveMostrarPaises && !paisSelecionado && (
        <Card>
          <p className="mb-0 text-muted">
            Selecione um país para carregar somente as competições cadastradas
            desse país.
          </p>
        </Card>
      )}

      {!carregando && !competicaoSelecionada && !deveMostrarPaises && (
        <Card>
          <p className="mb-0 text-muted">
            Selecione uma competição para visualizar as estatísticas.
          </p>
        </Card>
      )}

      {!carregando && deveMostrarPaises && paisSelecionado && !competicaoSelecionada && (
        <Card>
          <p className="mb-0 text-muted">
            País selecionado: <strong>{paisAtual?.nome}</strong>. Agora selecione
            uma competição.
          </p>
        </Card>
      )}

      {!carregando && competicaoSelecionada && (
        <>
          <Card>
            <h5 className="mb-3">🏆 {competicaoAtual?.nome}</h5>

            <div className="row">
              <div className="col-md-3">
                <strong>Abrangência:</strong>
                <p>{competicaoAtual?.abrangencia || "Não informada"}</p>
              </div>

              <div className="col-md-3">
                <strong>País:</strong>
                <p>{paisAtual?.nome || "Não informado"}</p>
              </div>

              <div className="col-md-3">
                <strong>Tipo:</strong>
                <p>{competicaoAtual?.tipo || "Não informado"}</p>
              </div>

              <div className="col-md-3">
                <strong>Total de edições:</strong>
                <p>{totalEdicoes}</p>
              </div>

              <div className="col-md-3">
                <strong>Campeões diferentes:</strong>
                <p>{totalCampeoesDiferentes}</p>
              </div>

              <div className="col-md-3">
                <strong>Vices diferentes:</strong>
                <p>{totalVicesDiferentes}</p>
              </div>

              <div className="col-md-3">
                <strong>Maior campeão:</strong>
                <p>
                  {maiorCampeao
                    ? `${maiorCampeao.nome} (${maiorCampeao.quantidade})`
                    : "Não informado"}
                </p>
              </div>

              <div className="col-md-3">
                <strong>Maior vice:</strong>
                <p>
                  {maiorVice
                    ? `${maiorVice.nome} (${maiorVice.quantidade})`
                    : "Não informado"}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <h5 className="mb-3">🥇 Ranking de campeões</h5>

            {rankingCampeoes.length === 0 ? (
              <p className="mb-0">Nenhum campeão cadastrado para esta competição.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover table-bordered align-middle bg-white">
                  <thead className="table-primary">
                    <tr>
                      <th>#</th>
                      <th>Time</th>
                      <th>Títulos</th>
                      <th>Anos</th>
                    </tr>
                  </thead>

                  <tbody>
                    {rankingCampeoes.map((item, index) => (
                      <tr key={`campeao-${item.id}`}>
                        <td>{index + 1}</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            {item.escudo ? (
                              <img
                                src={item.escudo}
                                alt={item.nome}
                                style={{
                                  width: "32px",
                                  height: "32px",
                                  objectFit: "contain",
                                }}
                              />
                            ) : (
                              <span>⚽</span>
                            )}

                            <strong>{item.nome}</strong>
                          </div>
                        </td>
                        <td>{item.quantidade}</td>
                        <td>{item.anos.join(", ")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          <Card>
            <h5 className="mb-3">🥈 Ranking de vices</h5>

            {rankingVices.length === 0 ? (
              <p className="mb-0">Nenhum vice cadastrado para esta competição.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover table-bordered align-middle bg-white">
                  <thead className="table-primary">
                    <tr>
                      <th>#</th>
                      <th>Time</th>
                      <th>Vices</th>
                      <th>Anos</th>
                    </tr>
                  </thead>

                  <tbody>
                    {rankingVices.map((item, index) => (
                      <tr key={`vice-${item.id}`}>
                        <td>{index + 1}</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            {item.escudo ? (
                              <img
                                src={item.escudo}
                                alt={item.nome}
                                style={{
                                  width: "32px",
                                  height: "32px",
                                  objectFit: "contain",
                                }}
                              />
                            ) : (
                              <span>⚽</span>
                            )}

                            <strong>{item.nome}</strong>
                          </div>
                        </td>
                        <td>{item.quantidade}</td>
                        <td>{item.anos.join(", ")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          <Card>
            <h5 className="mb-3">📅 Histórico de edições</h5>

            {edicoesDaCompeticao.length === 0 ? (
              <p className="mb-0">Nenhuma edição cadastrada para esta competição.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover table-bordered align-middle bg-white">
                  <thead className="table-primary">
                    <tr>
                      <th>Temporada</th>
                      <th>Campeão</th>
                      <th>Vice</th>
                    </tr>
                  </thead>

                  <tbody>
                    {edicoesDaCompeticao.map((edicao) => {
                      const campeao = buscarTime(edicao.campeao_id);
                      const vice = buscarTime(edicao.vice_id);

                      return (
                        <tr key={edicao.id}>
                          <td>{edicao.temporada || "-"}</td>
                          <td>{campeao?.nome || "-"}</td>
                          <td>{vice?.nome || "-"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}

export default Estatisticas;