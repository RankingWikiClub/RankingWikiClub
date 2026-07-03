import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import PageHeader from "../../components/ui/PageHeader";
import DataTable from "../../components/ui/DataTable";
import TextInput from "../../components/forms/TextInput";
import SelectInput from "../../components/forms/SelectInput";
import PrimaryButton from "../../components/buttons/PrimaryButton";
import Card from "../../components/cards/Card";

import { listarPaises } from "../../services/paisesService";
import {
  listarTimes,
  inserirTime,
  atualizarTime,
  excluirTime,
} from "../../services/timesService";

import { uploadEscudoTime } from "../../services/storageService";

function Times() {
  const [times, setTimes] = useState([]);
  const [paises, setPaises] = useState([]);
  const [busca, setBusca] = useState("");

  const [editandoId, setEditandoId] = useState(null);
  const [paisId, setPaisId] = useState("");
  const [nome, setNome] = useState("");
  const [nomeCurto, setNomeCurto] = useState("");
  const [apelido, setApelido] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [fundacao, setFundacao] = useState("");
  const [siteOficial, setSiteOficial] = useState("");
  const [escudo, setEscudo] = useState("");
  const [arquivoEscudo, setArquivoEscudo] = useState(null);
  const [previewEscudo, setPreviewEscudo] = useState("");

  async function carregar() {
    setTimes(await listarTimes());
    setPaises(await listarPaises());
  }

  useEffect(() => {
    carregar();
  }, []);

  function limparFormulario() {
    setEditandoId(null);
    setPaisId("");
    setNome("");
    setNomeCurto("");
    setApelido("");
    setCidade("");
    setEstado("");
    setFundacao("");
    setSiteOficial("");
    setEscudo("");
    setArquivoEscudo(null);
    setPreviewEscudo("");
  }

  function selecionarEscudo(e) {
    const arquivo = e.target.files[0];

    if (!arquivo) return;

    setArquivoEscudo(arquivo);
    setPreviewEscudo(URL.createObjectURL(arquivo));
  }

  async function salvar(e) {
    e.preventDefault();

    if (!paisId || !nome.trim()) {
      alert("Informe o país e o nome do time.");
      return;
    }

    let urlEscudo = escudo;

    if (arquivoEscudo) {
      urlEscudo = await uploadEscudoTime(arquivoEscudo);
    }

    const dadosTime = {
      pais_id: Number(paisId),
      liga_id: null,
      nome,
      nome_curto: nomeCurto || null,
      apelido: apelido || null,
      cidade: cidade || null,
      estado: estado || null,
      fundacao: fundacao || null,
      site_oficial: siteOficial || null,
      escudo: urlEscudo || null,
    };

    if (editandoId) {
      await atualizarTime(editandoId, dadosTime);
      alert("Time atualizado com sucesso!");
    } else {
      await inserirTime(dadosTime);
      alert("Time cadastrado com sucesso!");
    }

    limparFormulario();
    carregar();
  }

  function editar(time) {
    setEditandoId(time.id);
    setPaisId(time.pais_id || "");
    setNome(time.nome || "");
    setNomeCurto(time.nome_curto || "");
    setApelido(time.apelido || "");
    setCidade(time.cidade || "");
    setEstado(time.estado || "");
    setFundacao(time.fundacao || "");
    setSiteOficial(time.site_oficial || "");
    setEscudo(time.escudo || "");
    setPreviewEscudo(time.escudo || "");
    setArquivoEscudo(null);
  }

  async function remover(id) {
    if (!confirm("Deseja realmente excluir este time?")) return;

    await excluirTime(id);
    carregar();
  }

  const dadosTabela = times
    .map((time) => {
      const pais = paises.find((p) => p.id === time.pais_id);

      return {
        ...time,
        pais: pais ? pais.nome : "",
      };
    })
    .filter((time) =>
      time.nome.toLowerCase().includes(busca.toLowerCase())
    );

  const columns = [
    {
      key: "escudo",
      label: "Escudo",
      render: (item) =>
        item.escudo ? (
          <img
            src={item.escudo}
            alt={item.nome}
            style={{
              width: "42px",
              height: "42px",
              objectFit: "contain",
            }}
          />
        ) : (
          <span>⚽</span>
        ),
    },
    {
      key: "nome",
      label: "Time",
      render: (item) => (
        <Link
          to={`/times/${item.id}`}
          style={{
            fontWeight: "bold",
            color: "#0b3d91",
            textDecoration: "none",
          }}
        >
          {item.nome}
        </Link>
      ),
    },
    { key: "pais", label: "País" },
    { key: "cidade", label: "Cidade" },
    { key: "estado", label: "Estado" },
    { key: "fundacao", label: "Fundação" },
  ];

  return (
    <div>
      <PageHeader
        title="⚽ Cadastro de Times"
        subtitle="Cadastre clubes com escudo, país e informações gerais."
      />

      <Card>
        <form onSubmit={salvar}>
          <div className="row">
            <div className="col-md-3">
              <SelectInput
                label="País"
                value={paisId}
                onChange={(e) => setPaisId(e.target.value)}
                options={paises}
                required
              />
            </div>

            <div className="col-md-3">
              <TextInput
                label="Nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>

            <div className="col-md-3">
              <TextInput
                label="Nome Curto"
                value={nomeCurto}
                onChange={(e) => setNomeCurto(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <TextInput
                label="Apelido"
                value={apelido}
                onChange={(e) => setApelido(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <TextInput
                label="Cidade"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <TextInput
                label="Estado"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <TextInput
                label="Fundação"
                type="date"
                value={fundacao}
                onChange={(e) => setFundacao(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <TextInput
                label="Site Oficial"
                value={siteOficial}
                onChange={(e) => setSiteOficial(e.target.value)}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Escudo do time</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={selecionarEscudo}
              />
            </div>

            <div className="col-md-2 d-flex align-items-end">
              {previewEscudo ? (
                <img
                  src={previewEscudo}
                  alt="Preview"
                  style={{
                    width: "70px",
                    height: "70px",
                    objectFit: "contain",
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                    padding: "5px",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "70px",
                    height: "70px",
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ⚽
                </div>
              )}
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

      <input
        className="form-control mb-3"
        placeholder="🔍 Pesquisar time..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

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

export default Times;