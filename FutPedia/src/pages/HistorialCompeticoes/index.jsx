import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import PageHeader from "../../components/ui/PageHeader";
import DataTable from "../../components/ui/DataTable";
import SelectInput from "../../components/forms/SelectInput";
import Card from "../../components/cards/Card";

import { listarContinentes } from "../../services/continentesService";
import { listarPaises } from "../../services/paisesService";
import { listarTimes } from "../../services/timesService";
import { listarCompeticoes } from "../../services/competicoesService";
import { listarEdicoes } from "../../services/edicoesService";

function HistorialCompeticoes() {
  const [continentes, setContinentes] = useState([]);
  const [paises, setPaises] = useState([]);
  const [times, setTimes] = useState([]);
  const [competicoes, setCompeticoes] = useState([]);
  const [edicoes, setEdicoes] = useState([]);

  const [abrangencia, setAbrangencia] = useState("");
  const [paisId, setPaisId] = useState("");
  const [continenteId, setContinenteId] = useState("");
  const [grupoCompeticao, setGrupoCompeticao] = useState("");
  const [competicaoId, setCompeticaoId] = useState("");

  async function carregar() {
    try {
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
      console.error("Erro ao carregar historial:", erro);
      alert("Erro ao carregar o historial de competições.");
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  const gruposCompeticao = [
    { id: "Todos", nome: "Todos" },
    { id: "Liga Nacional", nome: "Liga Nacional" },
    { id: "Copa Nacional", nome: "Copa Nacional" },
    { id: "Copa Regional", nome: "Copas Regionais" },
    { id: "Campeonato Estadual", nome: "Estaduais" },
    { id: "Continental", nome: "Continentais" },
    { id: "Mundial", nome: "Mundiais" },
  ];

  function pertenceAoGrupo(competicao) {
    if (!grupoCompeticao || grupoCompeticao === "Todos") return true;

    if (grupoCompeticao === "Mundial") {
      return (
        competicao.tipo === "Mundial de Clubes" ||
        competicao.tipo === "Intercontinental" ||
        competicao.tipo === "Copa do Mundo de Seleções"
      );
    }

    if (grupoCompeticao === "Continental") {
      return (
        competicao.tipo === "Continental" ||
        competicao.tipo === "Copa Continental de Clubes" ||
        competicao.tipo === "Copa Continental de Seleções"
      );
    }

    return competicao.tipo === grupoCompeticao;
  }

  const competicoesFiltradas = competicoes.filter((competicao) => {
    if (!abrangencia) return false;

    if (abrangencia === "País") {
      return (
        String(competicao.pais_id) === String(paisId) &&
        pertenceAoGrupo(competicao)
      );
    }

    if (abrangencia === "Continente") {
      return (
        String(competicao.continente_id) === String(continenteId) &&
        pertenceAoGrupo(competicao)
      );
    }

    if (abrangencia === "Mundo") {
      return competicao.abrangencia === "Mundo" && pertenceAoGrupo(competicao);
    }

    return false;
  });

  const podeMostrarLista =
    !!competicaoId &&
    (abrangencia === "Mundo" ||
      (abrangencia === "País" && !!paisId) ||
      (abrangencia === "Continente" && !!continenteId));

  const dadosTabela = podeMostrarLista
    ? edicoes
        .filter((edicao) => String(edicao.competicao_id) === String(competicaoId))
        .map((edicao) => {
          const competicao = competicoes.find(
            (item) => Number(item.id) === Number(edicao.competicao_id)
          );

          if (!competicao) return null;

          const isSelecoes = competicao.categoria_participantes === "Seleções";

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

          const pais = paises.find(
            (item) => Number(item.id) === Number(competicao.pais_id)
          );

          const continente = continentes.find(
            (item) => Number(item.id) === Number(competicao.continente_id)
          );

          return {
            id: edicao.id,
            temporada: edicao.temporada,
            competicao_id: competicao.id,
            competicao: competicao.nome,
            tipo: competicao.tipo || "",
            local:
              competicao.abrangencia === "Mundo"
                ? "Mundo"
                : pais?.nome || continente?.nome || "",
            campeao: campeao?.nome || "",
            vice: vice?.nome || "",
            campeaoEscudo: !isSelecoes ? campeao?.escudo || null : null,
            viceEscudo: !isSelecoes ? vice?.escudo || null : null,
            campeaoId: !isSelecoes ? campeao?.id || null : null,
            viceId: !isSelecoes ? vice?.id || null : null,
          };
        })
        .filter(Boolean)
        .sort((a, b) => Number(b.temporada) - Number(a.temporada))
    : [];

  const columns = [
    { key: "temporada", label: "Ano" },
    { key: "local", label: "Local" },
    {
      key: "competicao",
      label: "Competição",
      render: (item) => (
        <Link
          to={`/competicoes/${item.competicao_id}`}
          style={{
            fontWeight: "bold",
            textDecoration: "none",
            color: "#0b3d91",
          }}
        >
          {item.competicao}
        </Link>
      ),
    },
    { key: "tipo", label: "Tipo" },
    {
      key: "campeao",
      label: "Campeão",
      render: (item) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {item.campeaoEscudo ? (
            <img
              src={item.campeaoEscudo}
              alt={item.campeao}
              style={{
                width: "32px",
                height: "32px",
                objectFit: "contain",
              }}
            />
          ) : (
            <span>⚽</span>
          )}

          {item.campeaoId ? (
            <Link
              to={`/times/${item.campeaoId}`}
              style={{
                fontWeight: "bold",
                textDecoration: "none",
                color: "#0b3d91",
              }}
            >
              {item.campeao}
            </Link>
          ) : (
            <strong>{item.campeao}</strong>
          )}
        </div>
      ),
    },
    {
      key: "vice",
      label: "Vice",
      render: (item) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {item.viceEscudo ? (
            <img
              src={item.viceEscudo}
              alt={item.vice}
              style={{
                width: "32px",
                height: "32px",
                objectFit: "contain",
              }}
            />
          ) : (
            <span>⚽</span>
          )}

          {item.viceId ? (
            <Link
              to={`/times/${item.viceId}`}
              style={{
                fontWeight: "bold",
                textDecoration: "none",
                color: "#0b3d91",
              }}
            >
              {item.vice}
            </Link>
          ) : (
            <strong>{item.vice}</strong>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="📜 Historial de Competições"
        subtitle="Selecione a abrangência, o grupo e a competição para visualizar campeões e vices."
      />

      <Card>
        <div className="row">
          <div className="col-md-3">
            <SelectInput
              label="Abrangência"
              value={abrangencia}
              onChange={(e) => {
                setAbrangencia(e.target.value);
                setPaisId("");
                setContinenteId("");
                setGrupoCompeticao("");
                setCompeticaoId("");
              }}
              options={[
                { id: "País", nome: "País" },
                { id: "Continente", nome: "Continente" },
                { id: "Mundo", nome: "Mundo" },
              ]}
            />
          </div>

          {abrangencia === "País" && (
            <div className="col-md-3">
              <SelectInput
                label="País"
                value={paisId}
                onChange={(e) => {
                  setPaisId(e.target.value);
                  setGrupoCompeticao("");
                  setCompeticaoId("");
                }}
                options={paises}
              />
            </div>
          )}

          {abrangencia === "Continente" && (
            <div className="col-md-3">
              <SelectInput
                label="Continente"
                value={continenteId}
                onChange={(e) => {
                  setContinenteId(e.target.value);
                  setGrupoCompeticao("");
                  setCompeticaoId("");
                }}
                options={continentes}
              />
            </div>
          )}

          {((abrangencia === "Mundo") ||
            (abrangencia === "País" && paisId) ||
            (abrangencia === "Continente" && continenteId)) && (
            <div className="col-md-3">
              <SelectInput
                label="Tipo de competição"
                value={grupoCompeticao}
                onChange={(e) => {
                  setGrupoCompeticao(e.target.value);
                  setCompeticaoId("");
                }}
                options={gruposCompeticao}
              />
            </div>
          )}

          {grupoCompeticao && (
            <div className="col-md-3">
              <SelectInput
                label="Competição"
                value={competicaoId}
                onChange={(e) => setCompeticaoId(e.target.value)}
                options={competicoesFiltradas}
              />
            </div>
          )}
        </div>
      </Card>

      {podeMostrarLista ? (
        <DataTable columns={columns} data={dadosTabela} />
      ) : (
        <Card>
          <p className="mb-0">
            Selecione a abrangência, o local, o tipo de competição e a competição para visualizar os registros.
          </p>
        </Card>
      )}
    </div>
  );
}

export default HistorialCompeticoes;