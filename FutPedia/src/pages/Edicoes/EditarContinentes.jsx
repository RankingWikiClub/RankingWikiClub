import { useEffect, useState } from "react";

import Card from "../../components/cards/Card";
import TextInput from "../../components/forms/TextInput";
import PrimaryButton from "../../components/buttons/PrimaryButton";

import {
  listarContinentes,
  atualizarContinente,
  excluirContinente,
} from "../../services/continentesService";

function EditarContinentes() {
  const [continentes, setContinentes] = useState([]);
  const [busca, setBusca] = useState("");

  const [editandoId, setEditandoId] = useState(null);
  const [nome, setNome] = useState("");
  const [sigla, setSigla] = useState("");
  const [confederacao, setConfederacao] = useState("");

  async function carregar() {
    setContinentes((await listarContinentes()) || []);
  }

  useEffect(() => {
    carregar();
  }, []);

  function limpar() {
    setEditandoId(null);
    setNome("");
    setSigla("");
    setConfederacao("");
  }

  function editar(item) {
    setEditandoId(item.id);
    setNome(item.nome || "");
    setSigla(item.sigla || "");
    setConfederacao(item.confederacao || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function salvar(e) {
    e.preventDefault();

    if (!editandoId) {
      alert("Clique em Editar em um continente da lista.");
      return;
    }

    if (!nome.trim()) {
      alert("Informe o nome do continente.");
      return;
    }

    try {
      await atualizarContinente(editandoId, {
        nome,
        sigla: sigla || null,
        confederacao: confederacao || null,
      });

      alert("Continente atualizado com sucesso!");
      limpar();
      carregar();
    } catch (erro) {
      alert("Erro ao atualizar continente: " + erro.message);
    }
  }

  async function remover(id) {
    if (!confirm("Deseja realmente excluir este continente?")) return;

    try {
      await excluirContinente(id);
      alert("Continente excluído com sucesso!");
      if (editandoId === id) limpar();
      carregar();
    } catch (erro) {
      alert("Erro ao excluir continente: " + erro.message);
    }
  }

  const lista = continentes
    .filter((item) =>
      `${item.nome} ${item.sigla || ""} ${item.confederacao || ""}`
        .toLowerCase()
        .includes(busca.toLowerCase())
    )
    .sort((a, b) => a.nome.localeCompare(b.nome));

  return (
    <Card>
      <h5 className="mb-3">🌍 Editar Continentes</h5>

      {editandoId && (
        <form onSubmit={salvar} className="mb-4">
          <div className="row">
            <div className="col-md-3">
              <TextInput label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
            </div>

            <div className="col-md-3">
              <TextInput label="Sigla" value={sigla} onChange={(e) => setSigla(e.target.value)} />
            </div>

            <div className="col-md-3">
              <TextInput label="Confederação" value={confederacao} onChange={(e) => setConfederacao(e.target.value)} />
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
        placeholder="🔍 Pesquisar continente..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      <div className="table-responsive">
        <table className="table table-hover table-bordered align-middle bg-white">
          <thead className="table-primary">
            <tr>
              <th>Continente</th>
              <th>Sigla</th>
              <th>Confederação</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {lista.length === 0 ? (
              <tr>
                <td colSpan="4">Nenhum continente encontrado.</td>
              </tr>
            ) : (
              lista.map((item) => (
                <tr key={item.id}>
                  <td>{item.nome}</td>
                  <td>{item.sigla}</td>
                  <td>{item.confederacao}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button className="btn btn-warning btn-sm" onClick={() => editar(item)}>
                        Editar
                      </button>

                      <button className="btn btn-danger btn-sm" onClick={() => remover(item.id)}>
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

export default EditarContinentes;