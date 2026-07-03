import { useEffect, useState } from "react";

import PageHeader from "../../components/ui/PageHeader";
import DataTable from "../../components/ui/DataTable";
import TextInput from "../../components/forms/TextInput";
import PrimaryButton from "../../components/buttons/PrimaryButton";
import Card from "../../components/cards/Card";

import {
  listarContinentes,
  inserirContinente,
  excluirContinente,
} from "../../services/continentesService";

function Continentes() {
  const [continentes, setContinentes] = useState([]);
  const [nome, setNome] = useState("");
  const [sigla, setSigla] = useState("");
  const [confederacao, setConfederacao] = useState("");

  async function carregar() {
    const dados = await listarContinentes();
    setContinentes(dados);
  }

  async function salvar(e) {
    e.preventDefault();

    if (!nome.trim()) {
      alert("Informe o nome do continente.");
      return;
    }

    await inserirContinente(nome, sigla, confederacao);

    setNome("");
    setSigla("");
    setConfederacao("");

    carregar();
  }

  async function remover(id) {
    if (!confirm("Deseja excluir este continente?")) return;

    await excluirContinente(id);
    carregar();
  }

  useEffect(() => {
    carregar();
  }, []);

  const columns = [
    { key: "id", label: "ID" },
    { key: "nome", label: "Nome" },
    { key: "sigla", label: "Sigla" },
    { key: "confederacao", label: "Confederação" },
  ];

  return (
    <div>
      <PageHeader
        title="🌎 Continentes"
        subtitle="Gerencie os continentes e confederações do FutPédia."
      />

      <Card>
        <form onSubmit={salvar}>
          <div className="row">
            <div className="col-md-4">
              <TextInput
                label="Nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: América do Sul"
                required
              />
            </div>

            <div className="col-md-3">
              <TextInput
                label="Sigla"
                value={sigla}
                onChange={(e) => setSigla(e.target.value)}
                placeholder="Ex: AMS"
              />
            </div>

            <div className="col-md-3">
              <TextInput
                label="Confederação"
                value={confederacao}
                onChange={(e) => setConfederacao(e.target.value)}
                placeholder="Ex: CONMEBOL"
              />
            </div>

            <div className="col-md-2 d-flex align-items-end mb-3">
              <PrimaryButton type="submit">Salvar</PrimaryButton>
            </div>
          </div>
        </form>
      </Card>

      <DataTable
        columns={columns}
        data={continentes}
        actions={(item) => (
          <button
            className="btn btn-sm btn-danger"
            onClick={() => remover(item.id)}
          >
            Excluir
          </button>
        )}
      />
    </div>
  );
}

export default Continentes;