import { useEffect, useState } from "react";

import PageHeader from "../../components/ui/PageHeader";
import TextInput from "../../components/forms/TextInput";
import SelectInput from "../../components/forms/SelectInput";
import PrimaryButton from "../../components/buttons/PrimaryButton";
import Card from "../../components/cards/Card";

import { listarContinentes } from "../../services/continentesService";
import { listarPaises } from "../../services/paisesService";
import { listarTimes } from "../../services/timesService";
import {
  listarCompeticoes,
  inserirCompeticao,
} from "../../services/competicoesService";
import { inserirEdicao } from "../../services/edicoesService";

function Competicoes() {
  const [continentes, setContinentes] = useState([]);
  const [paises, setPaises] = useState([]);
  const [times, setTimes] = useState([]);
  const [competicoes, setCompeticoes] = useState([]);

  const [abrangencia, setAbrangencia] = useState("País");
  const [paisCompeticaoId, setPaisCompeticaoId] = useState("");
  const [continenteCompeticaoId, setContinenteCompeticaoId] = useState("");
  const [nomeCompeticao, setNomeCompeticao] = useState("");
  const [nomeCurto, setNomeCurto] = useState("");
  const [tipoCompeticao, setTipoCompeticao] = useState("");
  const [categoriaParticipantes, setCategoriaParticipantes] = useState("Clubes");

  const [abrangenciaEdicao, setAbrangenciaEdicao] = useState("");
  const [paisEdicaoId, setPaisEdicaoId] = useState("");
  const [continenteEdicaoId, setContinenteEdicaoId] = useState("");
  const [opcaoCompeticao, setOpcaoCompeticao] = useState("");
  const [competicaoId, setCompeticaoId] = useState("");
  const [temporada, setTemporada] = useState("");
  const [campeaoId, setCampeaoId] = useState("");
  const [viceId, setViceId] = useState("");

  const OPCAO_ESTADUAIS = "__ESTADUAIS__";

  const tiposCompeticao = [
    { id: "Liga Nacional", nome: "Liga Nacional" },
    { id: "Copa Nacional", nome: "Copa Nacional" },
    { id: "Campeonato Estadual", nome: "Campeonato Estadual" },
    { id: "Copa Regional", nome: "Copa Regional" },
    { id: "Continental", nome: "Continental" },
    { id: "Mundial de Clubes", nome: "Mundial de Clubes" },
    { id: "Intercontinental", nome: "Intercontinental" },
    { id: "Copa Continental de Clubes", nome: "Copa Continental de Clubes" },
    { id: "Copa Continental de Seleções", nome: "Copa Continental de Seleções" },
    { id: "Copa do Mundo de Seleções", nome: "Copa do Mundo de Seleções" },
  ];

  async function carregar() {
    try {
      const [
        listaContinentes,
        listaPaises,
        listaTimes,
        listaCompeticoes,
      ] = await Promise.all([
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
      console.error("Erro ao carregar dados:", erro);
      alert("Erro ao carregar dados da página Competições.");
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  function limparCompeticao() {
    setAbrangencia("País");
    setPaisCompeticaoId("");
    setContinenteCompeticaoId("");
    setNomeCompeticao("");
    setNomeCurto("");
    setTipoCompeticao("");
    setCategoriaParticipantes("Clubes");
  }

  function limparEdicao() {
    setAbrangenciaEdicao("");
    setPaisEdicaoId("");
    setContinenteEdicaoId("");
    setOpcaoCompeticao("");
    setCompeticaoId("");
    setTemporada("");
    setCampeaoId("");
    setViceId("");
  }

  async function salvarCompeticao(e) {
    e.preventDefault();

    if (!nomeCompeticao.trim() || !tipoCompeticao) {
      alert("Informe o nome e o tipo da competição.");
      return;
    }

    if (abrangencia === "País" && !paisCompeticaoId) {
      alert("Selecione o país.");
      return;
    }

    if (abrangencia === "Continente" && !continenteCompeticaoId) {
      alert("Selecione o continente.");
      return;
    }

    const dados = {
      nome: nomeCompeticao,
      nome_curto: nomeCurto || null,
      tipo: tipoCompeticao,
      abrangencia,
      categoria_participantes: categoriaParticipantes,
      pais_id: abrangencia === "País" ? Number(paisCompeticaoId) : null,
      continente_id:
        abrangencia === "Continente" ? Number(continenteCompeticaoId) : null,
      liga_id: null,
      nivel: 1,
      internacional: abrangencia !== "País",
    };

    try {
      await inserirCompeticao(dados);
      alert("Competição cadastrada com sucesso!");

      limparCompeticao();
      carregar();
    } catch (erro) {
      console.error("Erro ao salvar competição:", erro);
      alert("Erro ao salvar competição: " + erro.message);
    }
  }

  const competicoesDoPais = competicoes.filter(
    (competicao) => String(competicao.pais_id) === String(paisEdicaoId)
  );

  const competicoesNaoEstaduaisDoPais = competicoesDoPais
    .filter((competicao) => competicao.tipo !== "Estadual")
    .sort((a, b) => a.nome.localeCompare(b.nome))
    .map((competicao) => ({
      id: String(competicao.id),
      nome: competicao.nome,
    }));

  const competicoesEstaduaisDoPais = competicoesDoPais
    .filter((competicao) => competicao.tipo === "Estadual")
    .sort((a, b) => a.nome.localeCompare(b.nome));

  const opcoesCompeticoesPais = [
    ...competicoesNaoEstaduaisDoPais,
    { id: OPCAO_ESTADUAIS, nome: "Estaduais" },
  ];

  const competicoesContinente = competicoes
    .filter(
      (competicao) =>
        String(competicao.continente_id) === String(continenteEdicaoId)
    )
    .sort((a, b) => a.nome.localeCompare(b.nome));

  const competicoesMundo = competicoes
    .filter((competicao) => competicao.abrangencia === "Mundo")
    .sort((a, b) => a.nome.localeCompare(b.nome));

  const competicaoSelecionada = competicoes.find(
    (competicao) => String(competicao.id) === String(competicaoId)
  );

  const selecoes = paises.filter((pais) => {
    if (abrangenciaEdicao === "País") {
      return String(pais.id) === String(paisEdicaoId);
    }

    if (abrangenciaEdicao === "Continente") {
      return String(pais.continente_id) === String(continenteEdicaoId);
    }

    if (abrangenciaEdicao === "Mundo") {
      return true;
    }

    return false;
  });

  const timesFiltrados = times.filter((time) => {
    if (abrangenciaEdicao === "País") {
      return String(time.pais_id) === String(paisEdicaoId);
    }

    if (abrangenciaEdicao === "Continente") {
      const paisDoTime = paises.find((pais) => pais.id === time.pais_id);
      return String(paisDoTime?.continente_id) === String(continenteEdicaoId);
    }

    if (abrangenciaEdicao === "Mundo") {
      return true;
    }

    return false;
  });

  const participantes =
    competicaoSelecionada?.categoria_participantes === "Seleções"
      ? selecoes
      : timesFiltrados;

  async function salvarEdicao(e) {
    e.preventDefault();

    if (!abrangenciaEdicao) {
      alert("Selecione a abrangência.");
      return;
    }

    if (abrangenciaEdicao === "País" && !paisEdicaoId) {
      alert("Selecione o país.");
      return;
    }

    if (abrangenciaEdicao === "Continente" && !continenteEdicaoId) {
      alert("Selecione o continente.");
      return;
    }

    if (!competicaoId || !temporada || !campeaoId || !viceId) {
      alert("Informe competição, ano, campeão e vice.");
      return;
    }

    if (campeaoId === viceId) {
      alert("Campeão e vice não podem ser iguais.");
      return;
    }

    const isSelecoes =
      competicaoSelecionada?.categoria_participantes === "Seleções";

    const dados = {
      competicao_id: Number(competicaoId),
      temporada: Number(temporada),
      campeao_id: isSelecoes ? null : Number(campeaoId),
      vice_id: isSelecoes ? null : Number(viceId),
      campeao_pais_id: isSelecoes ? Number(campeaoId) : null,
      vice_pais_id: isSelecoes ? Number(viceId) : null,
    };

    try {
      await inserirEdicao(dados);
      alert("Campeão e vice cadastrados com sucesso!");

      limparEdicao();
      carregar();
    } catch (erro) {
      console.error("Erro ao salvar edição:", erro);
      alert("Erro ao salvar campeão e vice: " + erro.message);
    }
  }

  return (
    <div>
      <PageHeader
        title="🏆 Competições"
        subtitle="Cadastre competições, campeões e vice-campeões."
      />

      <Card>
        <h5 className="mb-3">Cadastrar competição</h5>

        <form onSubmit={salvarCompeticao}>
          <div className="row">
            <div className="col-md-3">
              <SelectInput
                label="Abrangência"
                value={abrangencia}
                onChange={(e) => {
                  setAbrangencia(e.target.value);
                  setPaisCompeticaoId("");
                  setContinenteCompeticaoId("");
                }}
                options={[
                  { id: "País", nome: "País" },
                  { id: "Continente", nome: "Continente" },
                  { id: "Mundo", nome: "Mundo" },
                ]}
                required
              />
            </div>

            {abrangencia === "País" && (
              <div className="col-md-3">
                <SelectInput
                  label="País"
                  value={paisCompeticaoId}
                  onChange={(e) => setPaisCompeticaoId(e.target.value)}
                  options={paises}
                  required
                />
              </div>
            )}

            {abrangencia === "Continente" && (
              <div className="col-md-3">
                <SelectInput
                  label="Continente"
                  value={continenteCompeticaoId}
                  onChange={(e) => setContinenteCompeticaoId(e.target.value)}
                  options={continentes}
                  required
                />
              </div>
            )}

            <div className="col-md-3">
              <TextInput
                label="Nome da Competição"
                value={nomeCompeticao}
                onChange={(e) => setNomeCompeticao(e.target.value)}
                placeholder="Ex: Campeonato Paulista"
                required
              />
            </div>

            <div className="col-md-3">
              <TextInput
                label="Nome Curto"
                value={nomeCurto}
                onChange={(e) => setNomeCurto(e.target.value)}
                placeholder="Ex: Paulistão"
              />
            </div>

            <div className="col-md-3">
              <SelectInput
                label="Tipo"
                value={tipoCompeticao}
                onChange={(e) => setTipoCompeticao(e.target.value)}
                options={tiposCompeticao}
                required
              />
            </div>

            <div className="col-md-3">
              <SelectInput
                label="Participantes"
                value={categoriaParticipantes}
                onChange={(e) => setCategoriaParticipantes(e.target.value)}
                options={[
                  { id: "Clubes", nome: "Clubes" },
                  { id: "Seleções", nome: "Seleções" },
                ]}
                required
              />
            </div>

            <div className="col-md-2 d-flex align-items-end mb-3">
              <PrimaryButton type="submit">Salvar</PrimaryButton>
            </div>
          </div>
        </form>
      </Card>

      <Card>
        <h5 className="mb-3">Cadastrar campeão e vice</h5>

        <form onSubmit={salvarEdicao}>
          <div className="row">
            <div className="col-md-3">
              <SelectInput
                label="Abrangência"
                value={abrangenciaEdicao}
                onChange={(e) => {
                  setAbrangenciaEdicao(e.target.value);
                  setPaisEdicaoId("");
                  setContinenteEdicaoId("");
                  setOpcaoCompeticao("");
                  setCompeticaoId("");
                  setCampeaoId("");
                  setViceId("");
                }}
                options={[
                  { id: "País", nome: "País" },
                  { id: "Continente", nome: "Continente" },
                  { id: "Mundo", nome: "Mundo" },
                ]}
                required
              />
            </div>

            {abrangenciaEdicao === "País" && (
              <div className="col-md-3">
                <SelectInput
                  label="País"
                  value={paisEdicaoId}
                  onChange={(e) => {
                    setPaisEdicaoId(e.target.value);
                    setOpcaoCompeticao("");
                    setCompeticaoId("");
                    setCampeaoId("");
                    setViceId("");
                  }}
                  options={paises}
                  required
                />
              </div>
            )}

            {abrangenciaEdicao === "Continente" && (
              <div className="col-md-3">
                <SelectInput
                  label="Continente"
                  value={continenteEdicaoId}
                  onChange={(e) => {
                    setContinenteEdicaoId(e.target.value);
                    setOpcaoCompeticao("");
                    setCompeticaoId("");
                    setCampeaoId("");
                    setViceId("");
                  }}
                  options={continentes}
                  required
                />
              </div>
            )}

            {abrangenciaEdicao === "País" && paisEdicaoId && (
              <div className="col-md-3">
                <SelectInput
                  label="Competição"
                  value={opcaoCompeticao}
                  onChange={(e) => {
                    const valor = e.target.value;

                    setOpcaoCompeticao(valor);
                    setCampeaoId("");
                    setViceId("");

                    if (valor === OPCAO_ESTADUAIS) {
                      setCompeticaoId("");
                    } else {
                      setCompeticaoId(valor);
                    }
                  }}
                  options={opcoesCompeticoesPais}
                  required
                />
              </div>
            )}

            {abrangenciaEdicao === "País" &&
              paisEdicaoId &&
              opcaoCompeticao === OPCAO_ESTADUAIS && (
                <div className="col-md-3">
                  <SelectInput
                    label="Campeonato Estadual"
                    value={competicaoId}
                    onChange={(e) => {
                      setCompeticaoId(e.target.value);
                      setCampeaoId("");
                      setViceId("");
                    }}
                    options={competicoesEstaduaisDoPais}
                    required
                  />
                </div>
              )}

            {abrangenciaEdicao === "Continente" && continenteEdicaoId && (
              <div className="col-md-3">
                <SelectInput
                  label="Competição"
                  value={competicaoId}
                  onChange={(e) => {
                    setCompeticaoId(e.target.value);
                    setCampeaoId("");
                    setViceId("");
                  }}
                  options={competicoesContinente}
                  required
                />
              </div>
            )}

            {abrangenciaEdicao === "Mundo" && (
              <div className="col-md-3">
                <SelectInput
                  label="Competição"
                  value={competicaoId}
                  onChange={(e) => {
                    setCompeticaoId(e.target.value);
                    setCampeaoId("");
                    setViceId("");
                  }}
                  options={competicoesMundo}
                  required
                />
              </div>
            )}

            <div className="col-md-2">
              <TextInput
                label="Ano"
                type="number"
                value={temporada}
                onChange={(e) => setTemporada(e.target.value)}
                placeholder="2026"
                required
              />
            </div>

            <div className="col-md-3">
              <SelectInput
                label="Campeão"
                value={campeaoId}
                onChange={(e) => setCampeaoId(e.target.value)}
                options={participantes}
                required
              />
            </div>

            <div className="col-md-3">
              <SelectInput
                label="Vice"
                value={viceId}
                onChange={(e) => setViceId(e.target.value)}
                options={participantes}
                required
              />
            </div>

            <div className="col-md-2 d-flex align-items-end mb-3">
              <PrimaryButton type="submit">Salvar</PrimaryButton>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default Competicoes;