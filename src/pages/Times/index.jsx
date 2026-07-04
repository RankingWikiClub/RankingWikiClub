import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import PageHeader from "../../components/ui/PageHeader";
import DataTable from "../../components/ui/DataTable";
import TextInput from "../../components/forms/TextInput";
import SelectInput from "../../components/forms/SelectInput";
import PrimaryButton from "../../components/buttons/PrimaryButton";
import Card from "../../components/cards/Card";

import { supabase } from "../../services/supabase";
import { listarPaises } from "../../services/paisesService";
import {
  listarTimes,
  inserirTime,
  atualizarTime,
  excluirTime,
} from "../../services/timesService";

import { uploadEscudoTime } from "../../services/storageService.js";

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
  const [rivaisSelecionados, setRivaisSelecionados] = useState([]);

  async function carregar() {
    try {
      const listaTimes = await listarTimes();
      const listaPaises = await listarPaises();

      setTimes(listaTimes || []);
      setPaises(listaPaises || []);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      alert("Erro ao carregar dados: " + error.message);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  function calcularIdade(dataFundacao) {
    if (!dataFundacao) return "-";

    const anoFundacao = new Date(dataFundacao).getFullYear();
    const anoAtual = new Date().getFullYear();

    if (!anoFundacao) return "-";

    return anoAtual - anoFundacao;
  }

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
    setRivaisSelecionados([]);
  }

  function selecionarEscudo(e) {
    const arquivo = e.target.files?.[0];

    if (!arquivo) return;

    setArquivoEscudo(arquivo);
    setPreviewEscudo(URL.createObjectURL(arquivo));
  }

  function alterarRivais(e) {
    const selecionados = Array.from(e.target.selectedOptions).map((option) =>
      Number(option.value)
    );

    setRivaisSelecionados(selecionados);
  }

  async function salvarRivais(timeId, rivais) {
    if (!timeId) return;

    const { error: erroDelete } = await supabase
      .from("times_rivais")
      .delete()
      .eq("time_id", timeId);

    if (erroDelete) {
      console.error("Erro ao limpar rivais:", erroDelete);
      throw erroDelete;
    }

    if (!rivais || rivais.length === 0) return;

    const dados = rivais.map((rivalId) => ({
      time_id: timeId,
      rival_id: rivalId,
    }));

    const { error } = await supabase.from("times_rivais").insert(dados);

    if (error) {
      console.error("Erro ao salvar rivais:", error);
      throw error;
    }
  }

  async function carregarRivais(timeId) {
    if (!timeId) {
      setRivaisSelecionados([]);
      return;
    }

    const { data, error } = await supabase
      .from("times_rivais")
      .select("rival_id")
      .eq("time_id", timeId);

    if (error) {
      console.error("Erro ao carregar rivais:", error);
      setRivaisSelecionados([]);
      return;
    }

    setRivaisSelecionados((data || []).map((item) => item.rival_id));
  }

  async function salvar(e) {
    e.preventDefault();

    try {
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
        nome: nome.trim(),
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
        await salvarRivais(editandoId, rivaisSelecionados);
        alert("Time atualizado com sucesso!");
      } else {
        const timeSalvo = await inserirTime(dadosTime);

        const novoTimeId = Array.isArray(timeSalvo)
          ? timeSalvo[0]?.id
          : timeSalvo?.id;

        if (novoTimeId) {
          await salvarRivais(novoTimeId, rivaisSelecionados);
        }

        alert("Time cadastrado com sucesso!");
      }

      limparFormulario();
      await carregar();
    } catch (error) {
      console.error("Erro ao salvar time:", error);
      alert("Erro ao salvar time: " + error.message);
    }
  }

  async function editar(time) {
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

    await carregarRivais(time.id);
  }

  async function remover(id) {
    if (!confirm("Deseja realmente excluir este time?")) return;

    try {
      await supabase.from("times_rivais").delete().eq("time_id", id);
      await excluirTime(id);
      await carregar();
    } catch (error) {
      console.error("Erro ao excluir time:", error);
      alert("Erro ao excluir time: " + error.message);
    }
  }

  const dadosTabela = times
    .map((time) => {
      const pais = paises.find((p) => p.id === time.pais_id);

      return {
        ...time,
        pais: pais ? pais.nome : "",
        idade: calcularIdade(time.fundacao),
      };
    })
    .filter((time) =>
      (time.nome || "").toLowerCase().includes(busca.toLowerCase())
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
            style={{ width: "42px", height: "42px", objectFit: "contain" }}
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
    {
      key: "idade",
      label: "Idade",
      render: (item) => (item.idade === "-" ? "-" : `${item.idade} anos`),
    },
  ];

  return (
    <div>
      <PageHeader
        title="⚽ Cadastro de Times"
        subtitle="Cadastre clubes com escudo, país, rivais e informações gerais."
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

            <div className="col-md-6">
              <label className="form-label">Times rivais</label>
              <select
                multiple
                className="form-select"
                value={rivaisSelecionados}
                onChange={alterarRivais}
                style={{ minHeight: "140px" }}
              >
                {times
                  .filter((time) => time.id !== editandoId)
                  .map((time) => (
                    <option key={time.id} value={time.id}>
                      {time.nome}
                    </option>
                  ))}
              </select>
              <small className="text-muted">
                Segure CTRL para selecionar vários rivais.
              </small>
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
  const [arquivoEscudo, setArquivoEscudo] = useState(null);
  const [previewEscudo, setPreviewEscudo] = useState("");

  const [rivaisSelecionados, setRivaisSelecionados] = useState([
    "",
    "",
    "",
    "",
    "",
  ]);

  async function carregar() {
    const listaTimes = await listarTimes();
    const listaPaises = await listarPaises();

    setTimes(listaTimes || []);
    setPaises(listaPaises || []);
  }

  useEffect(() => {
    carregar();
  }, []);

  function calcularIdade(fundacao) {
    if (!fundacao) return "-";

    const dataFundacao = new Date(fundacao);

    if (Number.isNaN(dataFundacao.getTime())) return "-";

    const hoje = new Date();

    let idade = hoje.getFullYear() - dataFundacao.getFullYear();

    const aindaNaoFezAniversario =
      hoje.getMonth() < dataFundacao.getMonth() ||
      (hoje.getMonth() === dataFundacao.getMonth() &&
        hoje.getDate() < dataFundacao.getDate());

    if (aindaNaoFezAniversario) idade -= 1;

    return idade;
  }

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
    setRivaisSelecionados(["", "", "", "", ""]);
  }

  function selecionarEscudo(e) {
    const arquivo = e.target.files[0];

    if (!arquivo) return;

    setArquivoEscudo(arquivo);
    setPreviewEscudo(URL.createObjectURL(arquivo));
  }

  function alterarRival(index, valor) {
    const novosRivais = [...rivaisSelecionados];

    novosRivais[index] = valor;

    setRivaisSelecionados(novosRivais);
  }

  function obterRivaisValidos() {
    const rivaisNumericos = rivaisSelecionados
      .filter((id) => id !== "")
      .map((id) => Number(id))
      .filter((id) => id && id !== Number(editandoId));

    return [...new Set(rivaisNumericos)];
  }

  async function salvarRivais(timeId, rivais) {
    if (!timeId) return;

    const { error: erroExcluir } = await supabase
      .from("times_rivais")
      .delete()
      .eq("time_id", timeId);

    if (erroExcluir) throw erroExcluir;

    if (!rivais || rivais.length === 0) return;

    const dados = rivais.map((rivalId) => ({
      time_id: timeId,
      rival_id: rivalId,
    }));

    const { error } = await supabase.from("times_rivais").insert(dados);

    if (error) throw error;
  }

  async function carregarRivais(timeId) {
    const { data, error } = await supabase
      .from("times_rivais")
      .select("rival_id")
      .eq("time_id", timeId);

    if (error) {
      console.error("Erro ao carregar rivais:", error);
      setRivaisSelecionados(["", "", "", "", ""]);
      return;
    }

    const cincoCampos = ["", "", "", "", ""];

    (data || []).slice(0, 5).forEach((item, index) => {
      cincoCampos[index] = String(item.rival_id);
    });

    setRivaisSelecionados(cincoCampos);
  }

  async function salvar(e) {
    e.preventDefault();

    try {
      if (!paisId || !nome.trim()) {
        alert("Informe o país e o nome do time.");
        return;
      }

      let urlEscudo = escudo;

      if (arquivoEscudo) {
        try {
          urlEscudo = await uploadEscudoTime(arquivoEscudo);
        } catch (error) {
          console.error("Erro ao enviar escudo:", error);
          alert("Não foi possível enviar o escudo, mas o time será salvo sem imagem.");
          urlEscudo = escudo || null;
        }
      }

      const dadosTime = {
        pais_id: Number(paisId),
        nome: nome.trim(),
        nome_curto: nomeCurto || null,
        apelido: apelido || null,
        cidade: cidade || null,
        estado: estado || null,
        fundacao: fundacao || null,
        site_oficial: siteOficial || null,
        escudo: urlEscudo || null,
      };

      const rivaisValidos = obterRivaisValidos();

      if (editandoId) {
        await atualizarTime(editandoId, dadosTime);
        await salvarRivais(editandoId, rivaisValidos);
        alert("Time atualizado com sucesso!");
      } else {
        const timeSalvo = await inserirTime(dadosTime);

        const novoTimeId = Array.isArray(timeSalvo)
          ? timeSalvo[0]?.id
          : timeSalvo?.id;

        if (novoTimeId) {
          await salvarRivais(novoTimeId, rivaisValidos);
        }

        alert("Time cadastrado com sucesso!");
      }

      limparFormulario();
      await carregar();
    } catch (error) {
      console.error("Erro ao salvar time:", error);
      alert("Erro ao salvar time: " + error.message);
    }
  }

  async function editar(time) {
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

    await carregarRivais(time.id);
  }

  async function remover(id) {
    if (!confirm("Deseja realmente excluir este time?")) return;

    try {
      await excluirTime(id);
      await carregar();
    } catch (error) {
      console.error("Erro ao excluir time:", error);
      alert("Erro ao excluir time: " + error.message);
    }
  }

  const dadosTabela = times
    .map((time) => {
      const pais = paises.find((p) => p.id === time.pais_id);

      return {
        ...time,
        pais: pais ? pais.nome : "",
        idade: calcularIdade(time.fundacao),
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
    {
      key: "idade",
      label: "Idade",
      render: (item) => (item.idade === "-" ? "-" : `${item.idade} anos`),
    },
  ];

  const opcoesRivais = times
    .filter((time) => time.id !== editandoId)
    .map((time) => ({
      id: time.id,
      nome: time.nome,
    }));

  return (
    <div>
      <PageHeader
        title="⚽ Cadastro de Times"
        subtitle="Cadastre clubes com escudo, país, rivais e informações gerais."
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

            <div className="col-md-12">
              <h5 className="mt-3 mb-3">⚔️ Rivais do time</h5>
            </div>

            {[0, 1, 2, 3, 4].map((index) => (
              <div className="col-md-4" key={index}>
                <label className="form-label">Rival {index + 1}</label>
                <select
                  className="form-select"
                  value={rivaisSelecionados[index]}
                  onChange={(e) => alterarRival(index, e.target.value)}
                >
                  <option value="">Selecione o Rival {index + 1}</option>

                  {opcoesRivais.map((time) => (
                    <option key={time.id} value={time.id}>
                      {time.nome}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            <div className="col-md-12">
              <hr />
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
