import { useEffect, useState } from "react";

import PageHeader from "../../components/ui/PageHeader";
import TextInput from "../../components/forms/TextInput";
import SelectInput from "../../components/forms/SelectInput";
import PrimaryButton from "../../components/buttons/PrimaryButton";
import Card from "../../components/cards/Card";

import { listarContinentes } from "../../services/continentesService";
import { listarPaises } from "../../services/paisesService";
import { listarTimes } from "../../services/timesService";
import { listarCompeticoes } from "../../services/competicoesService";
import {
  listarEdicoes,
  atualizarEdicao,
  excluirEdicao,
} from "../../services/edicoesService";

function EditarCampeoes() {
  const [continentes, setContinentes] = useState([]);
  const [paises, setPaises] = useState([]);
  const [times, setTimes] = useState([]);
  const [competicoes, setCompeticoes] = useState([]);
  const [edicoes, setEdicoes] = useState([]);

  const [abrangencia, setAbrangencia] = useState("");
  const [paisId, setPaisId] = useState("");
  const [continenteId, setContinenteId] = useState("");
  const [competicaoId, setCompeticaoId] = useState("");

  const [editandoId, setEditandoId] = useState(null);
  const [temporada, setTemporada] = useState("");
  const [campeaoId, setCampeaoId] = useState("");
  const [viceId, setViceId] = useState("");

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
      console.error("Erro ao carregar dados:", erro);
      alert("Erro ao carregar dados da página Editar Campeões.");
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  function limparFormulario() {
    setEditandoId(null);
    setTemporada("");
    setCampeaoId("");
    setViceId("");
  }

  const competicoesFiltradas = competicoes
    .filter((competicao) => {
      if (!abrangencia) return false;

      if (abrangencia === "País") {
        return String(competicao.pais_id) === String(paisId);
      }

      if (abrangencia === "Continente") {
        return String(competicao.continente_id) === String(continenteId);
      }

      if (abrangencia === "Mundo") {
        return competicao.abrangencia === "Mundo";
      }

      return false;
    })
    .sort((a, b) => a.nome.localeCompare(b.nome));

  const competicaoSelecionada = competicoes.find(
    (competicao) => String(competicao.id) === String(competicaoId)
  );

  const isSelecoes =
    competicaoSelecionada?.categoria_participantes === "Seleções";

  const participantesSelecoes = paises
    .filter((pais) => {
      if (abrangencia === "País") {
        return String(pais.id) === String(paisId);
      }

      if (abrangencia === "Continente") {
        return String(pais.continente_id) === String(continenteId);
      }

      if (abrangencia === "Mundo") {
        return true;
      }

      return false;
    })
    .sort((a, b) => a.nome.localeCompare(b.nome));

  const participantesTimes = times
    .filter((time) => {
      if (abrangencia === "País") {
        return String(time.pais_id) === String(paisId);
      }

      if (abrangencia === "Continente") {
        const paisDoTime = paises.find(
          (pais) => Number(pais.id) === Number(time.pais_id)
        );

        return String(paisDoTime?.continente_id) === String(continenteId);
      }

      if (abrangencia === "Mundo") {
        return true;
      }

      return false;
    })
    .sort((a, b) => a.nome.localeCompare(b.nome));

  const participantes = isSelecoes ? participantesSelecoes : participantesTimes;

  const edicoesFiltradas = edicoes
    .filter((edicao) => String(edicao.competicao_id) === String(competicaoId))
    .map((edicao) => {
      const competicao = competicoes.find(
        (item) => Number(item.id) === Number(edicao.competicao_id)
      );

      if (!competicao) return null;

      const edicaoSelecoes =
        competicao.categoria_participantes === "Seleções";

      const campeao = edicaoSelecoes
        ? paises.find(
            (item) => Number(item.id) === Number(edicao.campeao_pais_id)
          )
        : times.find((item) => Number(item.id) === Number(edicao.campeao_id));

      const vice = edicaoSelecoes
        ? paises.find(
            (item) => Number(item.id) === Number(edicao.vice_pais_id)
          )
        : times.find((item) => Number(item.id) === Number(edicao.vice_id));

      return {
        ...edicao,
        edicaoSelecoes,
        competicaoNome: competicao.nome,
        campeaoNome: campeao?.nome || "",
        viceNome: vice?.nome || "",
        campeaoEscudo: !edicaoSelecoes ? campeao?.escudo || null : null,
        viceEscudo: !edicaoSelecoes ? vice?.escudo || null : null,
      };
    })
    .filter(Boolean)
    .sort((a, b) => Number(b.temporada) - Number(a.temporada));

  function editarEdicao(edicao) {
    setEditandoId(edicao.id);
    setTemporada(edicao.temporada || "");

    if (edicao.edicaoSelecoes) {
      setCampeaoId(edicao.campeao_pais_id || "");
      setViceId(edicao.vice_pais_id || "");
    } else {
      setCampeaoId(edicao.campeao_id || "");
      setViceId(edicao.vice_id || "");
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function salvarEdicao(e) {
    e.preventDefault();

    if (!editandoId) {
      alert("Clique em Editar em um registro da tabela.");
      return;
    }

    if (!temporada || !campeaoId || !viceId) {
      alert("Informe o ano, campeão e vice.");
      return;
    }

    if (campeaoId === viceId) {
      alert("Campeão e vice não podem ser iguais.");
      return;
    }

    const dados = {
      temporada: Number(temporada),
      campeao_id: isSelecoes ? null : Number(campeaoId),
      vice_id: isSelecoes ? null : Number(viceId),
      campeao_pais_id: isSelecoes ? Number(campeaoId) : null,
      vice_pais_id: isSelecoes ? Number(viceId) : null,
    };

    try {
      await atualizarEdicao(editandoId, dados);

      alert("Registro atualizado com sucesso!");
      limparFormulario();
      carregar();
    } catch (erro) {
      console.error("Erro ao atualizar registro:", erro);
      alert("Erro ao atualizar registro: " + erro.message);
    }
  }

  async function removerEdicao(id) {
    if (!confirm("Deseja realmente excluir este campeão e vice?")) return;

    try {
      await excluirEdicao(id);

      alert("Registro excluído com sucesso!");

      if (editandoId === id) {
        limparFormulario();
      }

      carregar();
    } catch (erro) {
      console.error("Erro ao excluir registro:", erro);
      alert("Erro ao excluir registro: " + erro.message);
    }
  }

  return (
    <div>
      <PageHeader
        title="✏️ Editar Campeões"
        subtitle="Edite ou exclua campeões e vices cadastrados nas competições."
      />

      <Card>
        <h5 className="mb-3">Filtros</h5>

        <div className="row">
          <div className="col-md-3">
            <SelectInput
              label="Abrangência"
              value={abrangencia}
              onChange={(e) => {
                setAbrangencia(e.target.value);
                setPaisId("");
                setContinenteId("");
                setCompeticaoId("");
                limparFormulario();
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
                  setCompeticaoId("");
                  limparFormulario();
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
                  setCompeticaoId("");
                  limparFormulario();
                }}
                options={continentes}
              />
            </div>
          )}

          {((abrangencia === "País" && paisId) ||
            (abrangencia === "Continente" && continenteId) ||
            abrangencia === "Mundo") && (
            <div className="col-md-3">
              <SelectInput
                label="Competição"
                value={competicaoId}
                onChange={(e) => {
                  setCompeticaoId(e.target.value);
                  limparFormulario();
                }}
                options={competicoesFiltradas}
              />
            </div>
          )}
        </div>
      </Card>

      {editandoId && (
        <Card>
          <h5 className="mb-3">Editar registro</h5>

          <form onSubmit={salvarEdicao}>
            <div className="row">
              <div className="col-md-2">
                <TextInput
                  label="Ano"
                  type="number"
                  value={temporada}
                  onChange={(e) => setTemporada(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-4">
                <SelectInput
                  label="Campeão"
                  value={campeaoId}
                  onChange={(e) => setCampeaoId(e.target.value)}
                  options={participantes}
                  required
                />
              </div>

              <div className="col-md-4">
                <SelectInput
                  label="Vice"
                  value={viceId}
                  onChange={(e) => setViceId(e.target.value)}
                  options={participantes}
                  required
                />
              </div>

              <div className="col-md-2 d-flex align-items-end gap-2 mb-3">
                <PrimaryButton type="submit">Salvar</PrimaryButton>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={limparFormulario}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </form>
        </Card>
      )}

      <Card>
        <h5 className="mb-3">Registros cadastrados</h5>

        {!competicaoId ? (
          <p className="mb-0">
            Selecione a abrangência, o local e a competição para visualizar os registros.
          </p>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover table-bordered align-middle bg-white">
              <thead className="table-primary">
                <tr>
                  <th>Ano</th>
                  <th>Competição</th>
                  <th>Campeão</th>
                  <th>Vice</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {edicoesFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan="5">Nenhum registro encontrado.</td>
                  </tr>
                ) : (
                  edicoesFiltradas.map((item) => (
                    <tr key={item.id}>
                      <td>{item.temporada}</td>
                      <td>{item.competicaoNome}</td>

                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          {item.campeaoEscudo ? (
                            <img
                              src={item.campeaoEscudo}
                              alt={item.campeaoNome}
                              style={{
                                width: "32px",
                                height: "32px",
                                objectFit: "contain",
                              }}
                            />
                          ) : (
                            <span>⚽</span>
                          )}

                          <strong>{item.campeaoNome}</strong>
                        </div>
                      </td>

                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          {item.viceEscudo ? (
                            <img
                              src={item.viceEscudo}
                              alt={item.viceNome}
                              style={{
                                width: "32px",
                                height: "32px",
                                objectFit: "contain",
                              }}
                            />
                          ) : (
                            <span>⚽</span>
                          )}

                          <strong>{item.viceNome}</strong>
                        </div>
                      </td>

                      <td>
                        <div className="d-flex gap-2">
                          <button
                            type="button"
                            className="btn btn-warning btn-sm"
                            onClick={() => editarEdicao(item)}
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => removerEdicao(item.id)}
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

export default EditarCampeoes;