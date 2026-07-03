import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/cards/Card";

import { listarContinentes } from "../../services/continentesService";
import { listarPaises } from "../../services/paisesService";
import { listarTimes } from "../../services/timesService";
import { listarCompeticoes } from "../../services/competicoesService";
import { listarEdicoes } from "../../services/edicoesService";

function CompeticaoDetalhes() {
  const { id } = useParams();

  const [continentes, setContinentes] = useState([]);
  const [paises, setPaises] = useState([]);
  const [times, setTimes] = useState([]);
  const [competicoes, setCompeticoes] = useState([]);
  const [edicoes, setEdicoes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  async function carregar() {
    try {
      setCarregando(true);

      const [
        listaContinentes,
        listaPaises,
        listaTimes,
        listaCompeticoes,
        listaEdicoes,
      ] = await Promise.all([
        listarContinentes(),
        listarPaises(),
        listarTimes(),
        listarCompeticoes(),
        listarEdicoes(),
      ]);

      setContinentes(listaContinentes || []);
      setPaises(listaPaises || []);
      setTimes(listaTimes || []);
      setCompeticoes(listaCompeticoes || []);
      setEdicoes(listaEdicoes || []);
    } catch (erro) {
      console.error("Erro ao carregar detalhes da competição:", erro);
      alert("Erro ao carregar detalhes da competição.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, [id]);

  const competicao = competicoes.find(
    (item) => String(item.id) === String(id)
  );

  const pais = paises.find(
    (item) => Number(item.id) === Number(competicao?.pais_id)
  );

  const continente = continentes.find(
    (item) => Number(item.id) === Number(competicao?.continente_id)
  );

  const isSelecoes = competicao?.categoria_participantes === "Seleções";

  const edicoesDaCompeticao = edicoes
    .filter((edicao) => String(edicao.competicao_id) === String(id))
    .map((edicao) => {
      const campeao = isSelecoes
        ? paises.find(
            (item) => Number(item.id) === Number(edicao.campeao_pais_id)
          )
        : times.find(
            (item) => Number(item.id) === Number(edicao.campeao_id)
          );

      const vice = isSelecoes
        ? paises.find(
            (item) => Number(item.id) === Number(edicao.vice_pais_id)
          )
        : times.find(
            (item) => Number(item.id) === Number(edicao.vice_id)
          );

      return {
        ...edicao,
        campeaoNome: campeao?.nome || "",
        viceNome: vice?.nome || "",
        campeaoEscudo: !isSelecoes ? campeao?.escudo || null : null,
        viceEscudo: !isSelecoes ? vice?.escudo || null : null,
        campeaoId: !isSelecoes ? campeao?.id || null : null,
        viceId: !isSelecoes ? vice?.id || null : null,
      };
    })
    .sort((a, b) => Number(b.temporada) - Number(a.temporada));

  function gerarRanking(campoId, campoPaisId) {
    const mapa = {};

    edicoesDaCompeticao.forEach((edicao) => {
      const participanteId = isSelecoes ? edicao[campoPaisId] : edicao[campoId];

      if (!participanteId) return;

      const participante = isSelecoes
        ? paises.find((item) => Number(item.id) === Number(participanteId))
        : times.find((item) => Number(item.id) === Number(participanteId));

      if (!participante) return;

      if (!mapa[participanteId]) {
        mapa[participanteId] = {
          id: participante.id,
          nome: participante.nome,
          escudo: !isSelecoes ? participante.escudo || null : null,
          quantidade: 0,
          anos: [],
        };
      }

      mapa[participanteId].quantidade += 1;

      if (edicao.temporada) {
        mapa[participanteId].anos.push(Number(edicao.temporada));
      }
    });

    return Object.values(mapa)
      .map((item) => ({
        ...item,
        anos: item.anos.sort((a, b) => a - b),
      }))
      .sort((a, b) => b.quantidade - a.quantidade || a.nome.localeCompare(b.nome));
  }

  const maioresCampeoes = gerarRanking("campeao_id", "campeao_pais_id");
  const maioresVices = gerarRanking("vice_id", "vice_pais_id");

  const anos = edicoesDaCompeticao
    .map((edicao) => Number(edicao.temporada))
    .filter(Boolean)
    .sort((a, b) => a - b);

  const primeiroAno = anos[0] || null;
  const ultimoAno = anos[anos.length - 1] || null;

  const primeiroCampeao = edicoesDaCompeticao
    .slice()
    .sort((a, b) => Number(a.temporada) - Number(b.temporada))[0];

  const ultimoCampeao = edicoesDaCompeticao
    .slice()
    .sort((a, b) => Number(b.temporada) - Number(a.temporada))[0];

  const tipoTexto =
    competicao?.tipo === "Liga"
      ? "Liga Nacional"
      : competicao?.tipo === "Copa"
      ? "Copa Nacional"
      : competicao?.tipo || "";

  const local =
    competicao?.abrangencia === "Mundo"
      ? "Mundo"
      : pais?.nome || continente?.nome || "Não informado";

  if (carregando) {
    return (
      <div>
        <PageHeader title="🏆 Detalhes da Competição" subtitle="Carregando..." />
        <Card>
          <p className="mb-0">Carregando informações da competição...</p>
        </Card>
      </div>
    );
  }

  if (!competicao) {
    return (
      <div>
        <PageHeader title="🏆 Competição não encontrada" subtitle="" />
        <Card>
          <p>A competição solicitada não foi encontrada.</p>
          <Link to="/competicoes" className="btn btn-primary">
            Voltar para Competições
          </Link>
        </Card>
      </div>
    );
  }

  function ParticipanteComEscudo({ nome, escudo, linkId }) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {escudo ? (
          <img
            src={escudo}
            alt={nome}
            style={{
              width: "32px",
              height: "32px",
              objectFit: "contain",
            }}
          />
        ) : (
          <span>⚽</span>
        )}

        {linkId ? (
          <Link
            to={`/times/${linkId}`}
            style={{
              fontWeight: "bold",
              textDecoration: "none",
              color: "#0b3d91",
            }}
          >
            {nome}
          </Link>
        ) : (
          <strong>{nome}</strong>
        )}
      </div>
    );
  }

  function RankingTabela({ titulo, dados, coluna }) {
    return (
      <Card>
        <h5 className="mb-3">{titulo}</h5>

        {dados.length === 0 ? (
          <p className="mb-0">Nenhum registro encontrado.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover table-bordered align-middle bg-white">
              <thead className="table-primary">
                <tr>
                  <th>Posição</th>
                  <th>Participante</th>
                  <th>{coluna}</th>
                  <th>Anos</th>
                </tr>
              </thead>

              <tbody>
                {dados.map((item, index) => (
                  <tr key={`${titulo}-${item.id}`}>
                    <td>{index + 1}º</td>
                    <td>
                      <ParticipanteComEscudo
                        nome={item.nome}
                        escudo={item.escudo}
                        linkId={!isSelecoes ? item.id : null}
                      />
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
    );
  }

  return (
    <div>
      <PageHeader
        title={`🏆 ${competicao.nome}`}
        subtitle="Histórico, maiores campeões, maiores vices e estatísticas."
      />

      <Card>
        <div className="row">
          <div className="col-md-3">
            <strong>Nome curto:</strong>
            <p>{competicao.nome_curto || "Não informado"}</p>
          </div>

          <div className="col-md-3">
            <strong>Tipo:</strong>
            <p>{tipoTexto}</p>
          </div>

          <div className="col-md-3">
            <strong>Abrangência:</strong>
            <p>{competicao.abrangencia || "Não informado"}</p>
          </div>

          <div className="col-md-3">
            <strong>Local:</strong>
            <p>{local}</p>
          </div>

          <div className="col-md-3">
            <strong>Participantes:</strong>
            <p>{competicao.categoria_participantes || "Não informado"}</p>
          </div>

          <div className="col-md-3">
            <strong>Total de edições:</strong>
            <p>{edicoesDaCompeticao.length}</p>
          </div>

          <div className="col-md-3">
            <strong>Primeira edição cadastrada:</strong>
            <p>{primeiroAno || "Não informado"}</p>
          </div>

          <div className="col-md-3">
            <strong>Última edição cadastrada:</strong>
            <p>{ultimoAno || "Não informado"}</p>
          </div>
        </div>
      </Card>

      <Card>
        <h5 className="mb-3">📊 Estatísticas rápidas</h5>

        <div className="row">
          <div className="col-md-3">
            <strong>Campeões diferentes:</strong>
            <p>{maioresCampeoes.length}</p>
          </div>

          <div className="col-md-3">
            <strong>Vice-campeões diferentes:</strong>
            <p>{maioresVices.length}</p>
          </div>

          <div className="col-md-3">
            <strong>Primeiro campeão cadastrado:</strong>
            <p>{primeiroCampeao?.campeaoNome || "Não informado"}</p>
          </div>

          <div className="col-md-3">
            <strong>Último campeão cadastrado:</strong>
            <p>{ultimoCampeao?.campeaoNome || "Não informado"}</p>
          </div>
        </div>
      </Card>

      <RankingTabela
        titulo="🥇 Maiores campeões"
        dados={maioresCampeoes}
        coluna="Títulos"
      />

      <RankingTabela
        titulo="🥈 Maiores vices"
        dados={maioresVices}
        coluna="Vices"
      />

      <Card>
        <h5 className="mb-3">📜 Histórico da competição</h5>

        {edicoesDaCompeticao.length === 0 ? (
          <p className="mb-0">Nenhum campeão ou vice cadastrado.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover table-bordered align-middle bg-white">
              <thead className="table-primary">
                <tr>
                  <th>Ano</th>
                  <th>Campeão</th>
                  <th>Vice</th>
                </tr>
              </thead>

              <tbody>
                {edicoesDaCompeticao.map((edicao) => (
                  <tr key={edicao.id}>
                    <td>{edicao.temporada}</td>
                    <td>
                      <ParticipanteComEscudo
                        nome={edicao.campeaoNome}
                        escudo={edicao.campeaoEscudo}
                        linkId={edicao.campeaoId}
                      />
                    </td>
                    <td>
                      <ParticipanteComEscudo
                        nome={edicao.viceNome}
                        escudo={edicao.viceEscudo}
                        linkId={edicao.viceId}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Link to="/historial-competicoes" className="btn btn-secondary">
        Voltar
      </Link>
    </div>
  );
}

export default CompeticaoDetalhes;