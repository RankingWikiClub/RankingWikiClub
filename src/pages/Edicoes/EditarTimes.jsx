import { useEffect, useState } from "react";

import Card from "../../components/cards/Card";
import TextInput from "../../components/forms/TextInput";
import SelectInput from "../../components/forms/SelectInput";
import PrimaryButton from "../../components/buttons/PrimaryButton";

import { listarPaises } from "../../services/paisesService";
import {
  listarTimes,
  atualizarTime,
  excluirTime,
} from "../../services/timesService";

import { uploadEscudoTime } from "../../services/storageService.js";

function EditarTimes() {
  const [paises, setPaises] = useState([]);
  const [times, setTimes] = useState([]);
  const [busca, setBusca] = useState("");

  const [editandoId, setEditandoId] = useState(null);
  const [nome, setNome] = useState("");
  const [nomeCurto, setNomeCurto] = useState("");
  const [paisId, setPaisId] = useState("");
  const [cidade, setCidade] = useState("");
  const [estadio, setEstadio] = useState("");
  const [fundacao, setFundacao] = useState("");
  const [escudo, setEscudo] = useState("");
  const [arquivoEscudo, setArquivoEscudo] = useState(null);
  const [previewEscudo, setPreviewEscudo] = useState("");

  async function carregar() {
    try {
      setPaises((await listarPaises()) || []);
      setTimes((await listarTimes()) || []);
    } catch (erro) {
      console.error("Erro ao carregar dados:", erro);
      alert("Erro ao carregar dados: " + erro.message);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  function limpar() {
    setEditandoId(null);
    setNome("");
    setNomeCurto("");
    setPaisId("");
    setCidade("");
    setEstadio("");
    setFundacao("");
    setEscudo("");
    setArquivoEscudo(null);
    setPreviewEscudo("");
  }

  function selecionarEscudo(e) {
    const arquivo = e.target.files?.[0];

    if (!arquivo) return;

    setArquivoEscudo(arquivo);
    setPreviewEscudo(URL.createObjectURL(arquivo));
  }

  function editar(item) {
    setEditandoId(item.id);
    setNome(item.nome || "");
    setNomeCurto(item.nome_curto || "");
    setPaisId(item.pais_id || "");
    setCidade(item.cidade || "");
    setEstadio(item.estadio || "");
    setFundacao(item.fundacao || "");
    setEscudo(item.escudo || "");
    setPreviewEscudo(item.escudo || "");
    setArquivoEscudo(null);

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function salvar(e) {
    e.preventDefault();

    if (!editandoId) {
      alert("Clique em Editar em um time da lista.");
      return;
    }

    if (!nome.trim()) {
      alert("Informe o nome do time.");
      return;
    }

    try {
      let urlEscudo = escudo;

      if (arquivoEscudo) {
        urlEscudo = await uploadEscudoTime(arquivoEscudo);
      }

      await atualizarTime(editandoId, {
        nome: nome.trim(),
        nome_curto: nomeCurto || null,
        pais_id: paisId ? Number(paisId) : null,
        cidade: cidade || null,
        estadio: estadio || null,
        fundacao: fundacao || null,
        escudo: urlEscudo || null,
      });

      alert("Time atualizado com sucesso!");
      limpar();
      await carregar();
    } catch (erro) {
      console.error("Erro ao atualizar time:", erro);
      alert("Erro ao atualizar time: " + erro.message);
    }
  }

  async function remover(id) {
    if (!confirm("Deseja realmente excluir este time?")) return;

    try {
      await excluirTime(id);
      alert("Time excluído com sucesso!");

      if (editandoId === id) limpar();

      await carregar();
    } catch (erro) {
      console.error("Erro ao excluir time:", erro);
      alert("Erro ao excluir time: " + erro.message);
    }
  }

  const lista = times
    .map((item) => {
      const pais = paises.find((p) => Number(p.id) === Number(item.pais_id));
      return { ...item, pais: pais?.nome || "" };
    })
    .filter((item) =>
      `${item.nome || ""} ${item.pais || ""} ${item.cidade || ""}`
        .toLowerCase()
        .includes(busca.toLowerCase())
    )
    .sort((a, b) => (a.nome || "").localeCompare(b.nome || ""));

  return (
    <Card>
      <h5 className="mb-3">⚽ Editar Times</h5>

      {editandoId && (
        <form onSubmit={salvar} className="mb-4">
          <div className="row">
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
                label="País"
                value={paisId}
                onChange={(e) => setPaisId(e.target.value)}
                options={paises}
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
                label="Estádio"
                value={estadio}
                onChange={(e) => setEstadio(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <TextInput
                label="Fundação"
                value={fundacao}
                onChange={(e) => setFundacao(e.target.value)}
              />
            </div>

            <div className="col-md-4">
              <TextInput
                label="Escudo URL"
                value={escudo}
                onChange={(e) => {
                  setEscudo(e.target.value);
                  setPreviewEscudo(e.target.value);
                }}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Enviar novo escudo</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={selecionarEscudo}
              />
            </div>

            <div className="col-md-2 d-flex align-items-end mb-3">
              {previewEscudo ? (
                <img
                  src={previewEscudo}
                  alt="Preview do escudo"
                  style={{
                    width: 70,
                    height: 70,
                    objectFit: "contain",
                    border: "1px solid #ddd",
                    borderRadius: 10,
                    padding: 5,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 70,
                    height: 70,
                    border: "1px solid #ddd",
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ⚽
                </div>
              )}
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
        placeholder="🔍 Pesquisar time..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      <div className="table-responsive">
        <table className="table table-hover table-bordered align-middle bg-white">
          <thead className="table-primary">
            <tr>
              <th>Escudo</th>
              <th>Time</th>
              <th>País</th>
              <th>Cidade</th>
              <th>Estádio</th>
              <th>Fundação</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {lista.length === 0 ? (
              <tr>
                <td colSpan="7">Nenhum time encontrado.</td>
              </tr>
            ) : (
              lista.map((item) => (
                <tr key={item.id}>
                  <td>
                    {item.escudo ? (
                      <img
                        src={item.escudo}
                        alt={item.nome}
                        style={{ width: 36, height: 36, objectFit: "contain" }}
                      />
                    ) : (
                      "⚽"
                    )}
                  </td>

                  <td>{item.nome}</td>
                  <td>{item.pais}</td>
                  <td>{item.cidade}</td>
                  <td>{item.estadio}</td>
                  <td>{item.fundacao}</td>

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

export default EditarTimes;
                    
