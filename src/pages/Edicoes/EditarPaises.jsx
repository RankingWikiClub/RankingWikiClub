import { useEffect, useState } from "react";

import Card from "../../components/cards/Card";
import TextInput from "../../components/forms/TextInput";
import SelectInput from "../../components/forms/SelectInput";
import PrimaryButton from "../../components/buttons/PrimaryButton";

import { listarContinentes } from "../../services/continentesService";
import {
  listarPaises,
  atualizarPais,
  excluirPais,
} from "../../services/paisesService";

function EditarPaises() {
  const [continentes, setContinentes] = useState([]);
  const [paises, setPaises] = useState([]);
  const [busca, setBusca] = useState("");

  const [editandoId, setEditandoId] = useState(null);
  const [nome, setNome] = useState("");
  const [bandeira, setBandeira] = useState("");
  const [continenteId, setContinenteId] = useState("");

  async function carregar() {
    setContinentes((await listarContinentes()) || []);
    setPaises((await listarPaises()) || []);
  }

  useEffect(() => {
    carregar();
  }, []);

  function limpar() {
    setEditandoId(null);
    setNome("");
    setBandeira("");
    setContinenteId("");
  }

  function editar(item) {
    setEditandoId(item.id);
    setNome(item.nome || "");
    setBandeira(item.bandeira || "");
    setContinenteId(item.continente_id || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function salvar(e) {
    e.preventDefault();

    if (!editandoId) {
      alert("Clique em Editar em um país da lista.");
      return;
    }

    if (!nome.trim() || !continenteId) {
      alert("Informe nome e continente.");
      return;
    }

    try {
      await atualizarPais(editandoId, {
        nome,
        bandeira: bandeira || null,
        continente_id: Number(continenteId),
      });

      alert("País atualizado com sucesso!");
      limpar();
      carregar();
    } catch (erro) {
      alert("Erro ao atualizar país: " + erro.message);
    }
  }

  async function remover(id) {
    if (!confirm("Deseja realmente excluir este país?")) return;

    try {
      await excluirPais(id);
      alert("País excluído com sucesso!");
      if (editandoId === id) limpar();
      carregar();
    } catch (erro) {
      alert("Erro ao excluir país: " + erro.message);
    }
  }

  const lista = paises
    .map((item) => {
      const continente = continentes.find(
        (c) => Number(c.id) === Number(item.continente_id)
      );

      return { ...item, continente: continente?.nome || "" };
    })
    .filter((item) =>
      `${item.nome} ${item.continente}`.toLowerCase().includes(busca.toLowerCase())
    )
    .sort((a, b) => a.nome.localeCompare(b.nome));

  return (
    <Card>
      <h5 className="mb-3">🏳️ Editar Países</h5>

      {editandoId && (
        <form onSubmit={salvar} className="mb-4">
          <div className="row">
            <div className="col-md-3">
              <TextInput label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
            </div>

            <div className="col-md-3">
              <TextInput label="Bandeira" value={bandeira} onChange={(e) => setBandeira(e.target.value)} />
            </div>

            <div className="col-md-3">
              <SelectInput label="Continente" value={continenteId} onChange={(e) => setContinenteId(e.target.value)} options={continentes} />
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
        placeholder="🔍 Pesquisar país..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      <div className="table-responsive">
        <table className="table table-hover table-bordered align-middle bg-white">
          <thead className="table-primary">
            <tr>
              <th>Bandeira</th>
              <th>País</th>
              <th>Continente</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {lista.length === 0 ? (
              <tr>
                <td colSpan="4">Nenhum país encontrado.</td>
              </tr>
            ) : (
              lista.map((item) => (
                <tr key={item.id}>
                  <td>{item.bandeira || "🏳️"}</td>
                  <td>{item.nome}</td>
                  <td>{item.continente}</td>
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

export default EditarPaises;