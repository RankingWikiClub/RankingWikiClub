import { useEffect, useState } from "react";

import Card from "../../components/cards/Card";
import TextInput from "../../components/forms/TextInput";
import SelectInput from "../../components/forms/SelectInput";
import PrimaryButton from "../../components/buttons/PrimaryButton";

import { listarContinentes } from "../../services/continentesService";
import { listarPaises } from "../../services/paisesService";
import {
  listarCompeticoes,
  atualizarCompeticao,
  excluirCompeticao,
} from "../../services/competicoesService";

function EditarCompeticoes() {
  const [continentes, setContinentes] = useState([]);
  const [paises, setPaises] = useState([]);
  const [competicoes, setCompeticoes] = useState([]);
  const [busca, setBusca] = useState("");

  const [editandoId, setEditandoId] = useState(null);
  const [abrangencia, setAbrangencia] = useState("País");
  const [paisId, setPaisId] = useState("");
  const [continenteId, setContinenteId] = useState("");
  const [nome, setNome] = useState("");
  const [nomeCurto, setNomeCurto] = useState("");
  const [tipo, setTipo] = useState("");
  const [categoriaParticipantes, setCategoriaParticipantes] = useState("Clubes");

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
    setContinentes((await listarContinentes()) || []);
    setPaises((await listarPaises()) || []);
    setCompeticoes((await listarCompeticoes()) || []);
  }

  useEffect(() => {
    carregar();
  }, []);

  function limpar() {
    setEditandoId(null);
    setAbrangencia("País");
    setPaisId("");
    setContinenteId("");
    setNome("");
    setNomeCurto("");
    setTipo("");
    setCategoriaParticipantes("Clubes");
  }

  function editar(item) {
    setEditandoId(item.id);
    setAbrangencia(item.abrangencia || "País");
    setPaisId(item.pais_id || "");
    setContinenteId(item.continente_id || "");
    setNome(item.nome || "");
    setNomeCurto(item.nome_curto || "");
    setTipo(item.tipo || "");
    setCategoriaParticipantes(item.categoria_participantes || "Clubes");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function salvar(e) {
    e.preventDefault();

    if (!editandoId) {
      alert("Clique em Editar em uma competição da lista.");
      return;
    }

    if (!nome.trim() || !tipo) {
      alert("Informe o nome e o tipo da competição.");
      return;
    }

    if (abrangencia === "País" && !paisId) {
      alert("Selecione o país.");
      return;
    }

    if (abrangencia === "Continente" && !continenteId) {
      alert("Selecione o continente.");
      return;
    }

    try {
      await atualizarCompeticao(editandoId, {
        nome,
        nome_curto: nomeCurto || null,
        tipo,
        abrangencia,
        categoria_participantes: categoriaParticipantes,
        pais_id: abrangencia === "País" ? Number(paisId) : null,
        continente_id: abrangencia === "Continente" ? Number(continenteId) : null,
        internacional: abrangencia !== "País",
      });

      alert("Competição atualizada com sucesso!");
      limpar();
      carregar();
    } catch (erro) {
      alert("Erro ao atualizar competição: " + erro.message);
    }
  }

  async function remover(id) {
    if (!confirm("Deseja realmente excluir esta competição?")) return;

    try {
      await excluirCompeticao(id);
      alert("Competição excluída com sucesso!");
      if (editandoId === id) limpar();
      carregar();
    } catch (erro) {
      alert("Erro ao excluir competição: " + erro.message);
    }
  }

  const lista = competicoes
    .map((item) => {
      const pais = paises.find((p) => Number(p.id) === Number(item.pais_id));
      const continente = continentes.find(
        (c) => Number(c.id) === Number(item.continente_id)
      );

      return {
        ...item,
        local:
          item.abrangencia === "Mundo"
            ? "Mundo"
            : pais?.nome || continente?.nome || "",
      };
    })
    .filter((item) =>
      `${item.nome} ${item.tipo} ${item.local}`
        .toLowerCase()
        .includes(busca.toLowerCase())
    )
    .sort((a, b) => a.nome.localeCompare(b.nome));

  return (
    <Card>
      <h5 className="mb-3">🏆 Editar Competições</h5>

      {editandoId && (
        <form onSubmit={salvar} className="mb-4">
          <div className="row">
            <div className="col-md-3">
              <SelectInput
                label="Abrangência"
                value={abrangencia}
                onChange={(e) => {
                  setAbrangencia(e.target.value);
                  setPaisId("");
                  setContinenteId("");
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
                  onChange={(e) => setPaisId(e.target.value)}
                  options={paises}
                />
              </div>
            )}

            {abrangencia === "Continente" && (
              <div className="col-md-3">
                <SelectInput
                  label="Continente"
                  value={continenteId}
                  onChange={(e) => setContinenteId(e.target.value)}
                  options={continentes}
                />
              </div>
            )}

            <div className="col-md-3">
              <TextInput
                label="Nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <TextInput
                label="Nome curto"
                value={nomeCurto}
                onChange={(e) => setNomeCurto(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <SelectInput
                label="Tipo"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                options={tiposCompeticao}
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
              />
            </div>

            <div className="col-md-4 d-flex align-items-end gap-2 mb-3">
              <PrimaryButton type="submit">Salvar alterações</PrimaryButton>
              <button type="button" className="btn btn-secondary" onClick={limpar}>
                Cancelar
              </button>
            </div>
          </div>
        </form>
      )}

      <input
        className="form-control mb-3"
        placeholder="🔍 Pesquisar competição..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      <div className="table-responsive">
        <table className="table table-hover table-bordered align-middle bg-white">
          <thead className="table-primary">
            <tr>
              <th>Competição</th>
              <th>Tipo</th>
              <th>Abrangência</th>
              <th>Local</th>
              <th>Participantes</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {lista.length === 0 ? (
              <tr>
                <td colSpan="6">Nenhuma competição encontrada.</td>
              </tr>
            ) : (
              lista.map((item) => (
                <tr key={item.id}>
                  <td>{item.nome}</td>
                  <td>{item.tipo}</td>
                  <td>{item.abrangencia}</td>
                  <td>{item.local}</td>
                  <td>{item.categoria_participantes}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => editar(item)}
                      >
                        Editar
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => remover(item.id)}
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
    </Card>
  );
}

export default EditarCompeticoes;