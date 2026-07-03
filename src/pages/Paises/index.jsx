import { useEffect, useState } from "react";

import PageHeader from "../../components/ui/PageHeader";
import DataTable from "../../components/ui/DataTable";
import TextInput from "../../components/forms/TextInput";
import SelectInput from "../../components/forms/SelectInput";
import PrimaryButton from "../../components/buttons/PrimaryButton";
import Card from "../../components/cards/Card";

import { listarContinentes } from "../../services/continentesService";
import {
  listarPaises,
  inserirPais,
  atualizarPais,
  excluirPais,
} from "../../services/paisesService";

function Paises() {
  const [paises, setPaises] = useState([]);
  const [continentes, setContinentes] = useState([]);
  const [busca, setBusca] = useState("");

  const [editandoId, setEditandoId] = useState(null);
  const [continenteId, setContinenteId] = useState("");
  const [nome, setNome] = useState("");
  const [nomeOficial, setNomeOficial] = useState("");
  const [iso2, setIso2] = useState("");
  const [iso3, setIso3] = useState("");
  const [codigoFifa, setCodigoFifa] = useState("");
  const [capital, setCapital] = useState("");

  async function carregar() {
    const listaPaises = await listarPaises();
    const listaContinentes = await listarContinentes();

    setPaises(listaPaises);
    setContinentes(listaContinentes);
  }

  useEffect(() => {
    carregar();
  }, []);

  function limparFormulario() {
    setEditandoId(null);
    setContinenteId("");
    setNome("");
    setNomeOficial("");
    setIso2("");
    setIso3("");
    setCodigoFifa("");
    setCapital("");
  }

  async function salvar(e) {
    e.preventDefault();

    if (!continenteId || !nome.trim()) {
      alert("Informe o continente e o nome do país.");
      return;
    }

    const dadosPais = {
      continente_id: Number(continenteId),
      nome,
      nome_oficial: nomeOficial || null,
      sigla_iso2: iso2 || null,
      sigla_iso3: iso3 || null,
      codigo_fifa: codigoFifa || null,
      capital: capital || null,
    };

    try {
      if (editandoId) {
        await atualizarPais(editandoId, dadosPais);
        alert("País atualizado com sucesso!");
      } else {
        await inserirPais(dadosPais);
        alert("País cadastrado com sucesso!");
      }

      limparFormulario();
      carregar();
    } catch (erro) {
      alert("Erro ao salvar: " + erro.message);
    }
  }

  function editar(pais) {
    setEditandoId(pais.id);
    setContinenteId(pais.continente_id);
    setNome(pais.nome || "");
    setNomeOficial(pais.nome_oficial || "");
    setIso2(pais.sigla_iso2 || "");
    setIso3(pais.sigla_iso3 || "");
    setCodigoFifa(pais.codigo_fifa || "");
    setCapital(pais.capital || "");
  }

  async function remover(id) {
    if (!confirm("Deseja realmente excluir este país?")) return;

    await excluirPais(id);
    carregar();
  }

  const dadosTabela = paises
    .map((pais) => {
      const continente = continentes.find(
        (c) => c.id === pais.continente_id
      );

      return {
        ...pais,
        continente: continente ? continente.nome : "",
      };
    })
    .filter((pais) =>
      pais.nome.toLowerCase().includes(busca.toLowerCase())
    );

  const columns = [
    { key: "id", label: "ID" },
    { key: "nome", label: "País" },
    { key: "continente", label: "Continente" },
    { key: "codigo_fifa", label: "FIFA" },
    { key: "sigla_iso2", label: "ISO2" },
    { key: "sigla_iso3", label: "ISO3" },
    { key: "capital", label: "Capital" },
  ];

  return (
    <div>
      <PageHeader
        title="🗺️ Cadastro de Países"
        subtitle="Gerencie todos os países do FutPédia."
      />

      <Card>
        <form onSubmit={salvar}>
          <div className="row">
            <div className="col-md-4">
              <SelectInput
                label="Continente"
                value={continenteId}
                onChange={(e) => setContinenteId(e.target.value)}
                options={continentes}
                required
              />
            </div>

            <div className="col-md-4">
              <TextInput
                label="Nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Brasil"
                required
              />
            </div>

            <div className="col-md-4">
              <TextInput
                label="Nome Oficial"
                value={nomeOficial}
                onChange={(e) => setNomeOficial(e.target.value)}
                placeholder="República Federativa do Brasil"
              />
            </div>

            <div className="col-md-2">
              <TextInput
                label="ISO2"
                value={iso2}
                onChange={(e) => setIso2(e.target.value.toUpperCase())}
                placeholder="BR"
              />
            </div>

            <div className="col-md-2">
              <TextInput
                label="ISO3"
                value={iso3}
                onChange={(e) => setIso3(e.target.value.toUpperCase())}
                placeholder="BRA"
              />
            </div>

            <div className="col-md-2">
              <TextInput
                label="Código FIFA"
                value={codigoFifa}
                onChange={(e) => setCodigoFifa(e.target.value.toUpperCase())}
                placeholder="BRA"
              />
            </div>

            <div className="col-md-4">
              <TextInput
                label="Capital"
                value={capital}
                onChange={(e) => setCapital(e.target.value)}
                placeholder="Brasília"
              />
            </div>

            <div className="col-md-2 d-flex align-items-end mb-3">
              <PrimaryButton type="submit">
                {editandoId ? "Atualizar" : "Salvar"}
              </PrimaryButton>
            </div>

            {editandoId && (
              <div className="col-md-2 d-flex align-items-end mb-3">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={limparFormulario}
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </form>
      </Card>

      <div className="mb-3">
        <input
          className="form-control"
          placeholder="🔍 Pesquisar país..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      <DataTable
        columns={columns}
        data={dadosTabela}
        actions={(item) => (
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
        )}
      />
    </div>
  );
}

export default Paises;