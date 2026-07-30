/* RankingWikiClub - correção definitiva de cadastros/edições com Supabase
   - Cadastra times, seleções e competições diretamente nas tabelas SQL.
   - Faz upload de escudos/logos para Storage e salva a URL pública no banco.
   - Atualiza registros ao editar sem depender de RPCs antigas.
*/
(function () {
  function supa() {
    return typeof clienteSupabase === "function" ? clienteSupabase() : null;
  }

  function valor(id) {
    return (document.getElementById(id)?.value || "").trim();
  }

  function normalizarData(v) {
    v = String(v || "").trim();
    if (!v) return null;
    if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
    const m = v.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (m) return `${m[3]}-${m[2]}-${m[1]}`;
    return null;
  }

  function tipoUrl() {
    const p = new URLSearchParams(location.search);
    return (p.get("tipo") || "").toLowerCase();
  }

  function idUrl() {
    const id = new URLSearchParams(location.search).get("id");
    return id && /^\d+$/.test(id) ? Number(id) : null;
  }

  function estaEditando(tipoEsperado) {
    const t = tipoUrl();
    const id = idUrl();
    if (!id) return false;
    if (tipoEsperado === "clube") return ["clube", "clubes", "time", "times"].includes(t);
    if (tipoEsperado === "selecao") return ["selecao", "selecoes", "seleção", "seleções"].includes(t);
    if (tipoEsperado === "competicao") return ["competicao", "competicoes", "competição", "competições"].includes(t);
    return false;
  }

  function normalizarNomePais(valor) {
    return String(valor || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[’‘`´]/g, "'")
      .replace(/[^a-zA-Z0-9]+/g, " ")
      .trim()
      .toLowerCase();
  }

  const ALIASES_PAISES_SUPABASE = {
    "Países Baixos": "paises baixos",
    "Países Baixos": "paises baixos",
    "Países Baixos": "paises baixos",

    "Moldávia": "moldavia",
    "republica da Moldávia": "moldavia",
    "Moldávia": "moldavia",

    "tchequia": "republica tcheca",
    "Tchéquia": "republica tcheca",
    "Tchéquia": "republica tcheca",
    "Tchéquia": "republica tcheca",

    "bielorrussia": "belarus",
    "bielo Rússia": "belarus",
    "Belarus": "belarus",

    "Macedônia do Norte": "Macedônia do Norte do norte",
    "Macedônia do Norte": "Macedônia do Norte do norte",

    "Essuatíni": "essuatini",
    "suazilandia": "essuatini",
    "Essuatíni": "essuatini",

    "cabo verde": "cabo verde",
    "Cabo Verde": "cabo verde",

    "estados unidos da america": "estados unidos",
    "Estados Unidos": "estados unidos",
    "Estados Unidos": "estados unidos",

    "coreia norte": "coreia do norte",
    "Coreia do Norte": "coreia do norte",

    "coreia sul": "coreia do sul",
    "Coreia do Sul": "coreia do sul",

    "emirados arabes": "emirados arabes unidos",
    "Emirados Árabes Unidos": "emirados arabes unidos",

    "republica da irlanda": "irlanda",
    "Irlanda": "irlanda",

    "pais de País de País de Gales": "pais de País de País de Gales",
    "País de País de Gales": "pais de País de País de Gales",
    "País de País de Gales": "pais de País de País de Gales",

    "vaticano": "vaticano",
    "Vaticano": "vaticano",
    "Vaticano": "vaticano",

    "turkiye": "turquia",
    "Turquia": "turquia",

    "Rússia": "Rússia",
    "Ucrânia": "ucrania",
    "Sérvia": "servia",
    "Suécia": "suecia",
    "Suíça": "suica",
    "Noruega": "noruega",
    "Polônia": "polonia",
    "Romênia": "romenia",
    "Armênia": "Armênia",
    "montenegro": "montenegro",
    "andorra": "andorra",
    "san marino": "san marino"
  };

  function chaveCanonicaPais(valor) {
    const normalizado = normalizarNomePais(valor);
    return ALIASES_PAISES_SUPABASE[normalizado] || normalizado;
  }

  async function buscarPais(nome) {
    const db = supa();
    const nomeInformado = String(nome || "").trim();

    if (!db || !nomeInformado) {
      throw new Error("País não informado.");
    }

    // Carrega a tabela real do Supabase e compara de forma tolerante.
    const { data: paises, error } = await db
      .from("paises")
      .select("id,nome,sigla,continente_id");

    if (error) throw error;

    const chaveProcurada = chaveCanonicaPais(nomeInformado);

    const paisEncontrado = (paises || []).find(pais => {
      const chaveBanco = chaveCanonicaPais(pais.nome);
      return chaveBanco === chaveProcurada;
    });

    if (paisEncontrado) return paisEncontrado;

    // Segunda tentativa: comparação parcial segura para pequenas variações.
    const nomeNormalizado = normalizarNomePais(nomeInformado);
    const candidatos = (paises || []).filter(pais => {
      const nomeBanco = normalizarNomePais(pais.nome);
      return nomeBanco === nomeNormalizado ||
             nomeBanco.includes(nomeNormalizado) ||
             nomeNormalizado.includes(nomeBanco);
    });

    if (candidatos.length === 1) return candidatos[0];

    const nomesDisponiveis = (paises || [])
      .map(p => p.nome)
      .sort((a, b) => a.localeCompare(b, "pt-BR"))
      .join(", ");

    throw new Error(
      `País não encontrado no Supabase: "${nomeInformado}". ` +
      `Verifique se ele existe na tabela public.paises. ` +
      `Países disponíveis: ${nomesDisponiveis}`
    );
  }

  async function buscarContinente(nome) {
    const db = supa();
    if (!db || !nome) return null;
    const { data, error } = await db
      .from("continentes")
      .select("id,nome")
      .eq("nome", nome)
      .maybeSingle();
    if (error) throw error;
    return data || null;
  }

  async function uploadInput(inputId, bucket, nomeBase) {
    if (typeof fpUploadImagemInput !== "function") return "";
    return await fpUploadImagemInput(inputId, bucket, nomeBase);
  }

  function erroCadastro(erro, contexto) {
    console.error(contexto, erro);
    alert(`${contexto}: ${erro.message || erro}`);
  }

  async function recarregarDados() {
    if (typeof carregarDadosRelacionaisSupabase === "function") {
      await carregarDadosRelacionaisSupabase();
    }
  }

  async function salvarTimeDireto(dados, id = null) {
    const db = supa();
    if (!db) throw new Error("Supabase não configurado.");
    const pais = await buscarPais(dados.pais);

    const payload = {
      pais_id: pais.id,
      nome: dados.nome,
      nome_curto: dados.nome_curto,
      estado: dados.estado || null,
      cidade: dados.cidade || null,
      fundacao: normalizarData(dados.fundacao),
      ativo: true
    };

    if (dados.escudo_url) payload.escudo_url = dados.escudo_url;

    let resp;
    if (id) {
      resp = await db.from("times").update(payload).eq("id", id).select("id").single();
    } else {
      resp = await db.from("times").insert(payload).select("id").single();
    }
    if (resp.error) throw resp.error;
    return resp.data?.id;
  }

  async function salvarSelecaoDireto(dados, id = null) {
    const db = supa();
    if (!db) throw new Error("Supabase não configurado.");
    const pais = await buscarPais(dados.pais);

    const payload = {
      pais_id: pais.id,
      nome: dados.nome || dados.pais,
      codigo_fifa: pais.sigla || null,
      ativa: true
    };
    if (dados.escudo_url) payload.escudo_url = dados.escudo_url;

    let resp;
    if (id) {
      resp = await db.from("selecoes").update(payload).eq("id", id).select("id").single();
    } else {
      resp = await db.from("selecoes").insert(payload).select("id").single();
    }
    if (resp.error) throw resp.error;
    return resp.data?.id;
  }

  function abrangenciaSql(v) {
    const s = String(v || "").toLowerCase();
    if (s.includes("mund")) return "mundo";
    if (s.includes("continent")) return "continente";
    if (s.includes("país") || s.includes("pais")) return "pais";
    if (s.includes("sele")) return "continente";
    return s || null;
  }

  async function salvarCompeticaoDireto(dados, id = null) {
    const db = supa();
    if (!db) throw new Error("Supabase não configurado.");

    let paisId = null;
    let continenteId = null;

    if (dados.pais) {
      const pais = await buscarPais(dados.pais);
      paisId = pais.id;
      continenteId = pais.continente_id || null;
    }

    if (!continenteId && dados.continente) {
      const continente = await buscarContinente(dados.continente);
      continenteId = continente?.id || null;
    }

    const payload = {
      nome: dados.nome,
      tipo: dados.tipo || "clubes",
      abrangencia: dados.abrangencia || null,
      continente_id: continenteId,
      pais_id: paisId,
      ativa: true,
      organizador: dados.organizador || null,
      nivel: dados.nivel || null,
      genero: dados.genero || "masculino",
      sigla: dados.sigla || null,
      descricao: dados.descricao || null,
      divisao: dados.divisao || null,
      periodicidade: dados.periodicidade || null,
      primeira_edicao: dados.primeira_edicao || null,
      status: dados.status || "Ativa",
      categoria: dados.categoria || "Profissional"
    };
    if (dados.logo_url) payload.logo_url = dados.logo_url;

    let resp;
    if (id) {
      resp = await db.from("competicoes").update(payload).eq("id", id).select("id").single();
    } else {
      resp = await db.from("competicoes").insert(payload).select("id").single();
    }
    if (resp.error) throw resp.error;
    return resp.data?.id;
  }

  window.salvarClube = salvarClube = async function salvarClube() {
    const nomeCurto = valor("nomeCurto");
    const nomeCompleto = valor("nomeCompleto");
    const paisNome = valor("pais");

    if (!nomeCurto || !nomeCompleto || !paisNome) {
      alert("Preencha o nome curto, o nome completo e o país do time.");
      return;
    }

    try {
      const escudoUrl = await uploadInput("escudo", "escudos-times", nomeCompleto || nomeCurto);
      const id = estaEditando("clube") ? idUrl() : null;
      await salvarTimeDireto({
        nome: nomeCompleto,
        nome_curto: nomeCurto,
        pais: paisNome,
        estado: paisNome === "Brasil" ? (valor("siglaEstado") || valor("estado")) : null,
        cidade: valor("cidade"),
        fundacao: valor("fundacao"),
        escudo_url: escudoUrl || null
      }, id);

      await recarregarDados();
      alert(id ? "Time atualizado com sucesso!" : "Time cadastrado com sucesso!");
      location.href = "./clubes.html";
    } catch (erro) {
      erroCadastro(erro, "Não foi possível salvar o time");
    }
  };

  window.salvarSelecao = salvarSelecao = async function salvarSelecao() {
    const paisNome = valor("paisSelecao");
    if (!paisNome) {
      alert("Selecione o país da seleção.");
      return;
    }

    try {
      const escudoUrl = await uploadInput("escudoSelecao", "escudos-selecoes", paisNome);
      const id = estaEditando("selecao") ? idUrl() : null;
      await salvarSelecaoDireto({
        pais: paisNome,
        nome: paisNome,
        escudo_url: escudoUrl || null
      }, id);

      await recarregarDados();
      alert(id ? "Seleção atualizada com sucesso!" : "Seleção cadastrada com sucesso!");
      location.href = "./selecoes.html";
    } catch (erro) {
      erroCadastro(erro, "Não foi possível salvar a seleção");
    }
  };

  window.salvarCompeticao = salvarCompeticao = async function salvarCompeticao() {
    const nome = valor("nomeCompeticao");
    const tipoCompeticao = valor("tipoCompeticao");
    const categoriaCompeticao = valor("categoriaCompeticao") || "clube";
    const abrangenciaCampo = valor("abrangencia");
    const abrangenciaTela = categoriaCompeticao === "selecao" ? "Seleções" : abrangenciaCampo;

    if (!nome || !tipoCompeticao || (categoriaCompeticao === "clube" && !abrangenciaCampo)) {
      alert(categoriaCompeticao === "selecao" ? "Preencha o nome e o tipo da competição." : "Preencha o nome, o tipo e a abrangência da competição.");
      return;
    }

    let paisNome = "";
    let continenteNome = "";

    if (categoriaCompeticao === "clube" && abrangenciaTela === "País") {
      paisNome = valor("paisCompeticao");
      if (!paisNome) {
        alert("Selecione o país da competição.");
        return;
      }
    }

    if (categoriaCompeticao === "clube" && abrangenciaTela === "Continental") {
      continenteNome = valor("continenteCompeticao");
      if (!continenteNome) {
        alert("Selecione o continente da competição.");
        return;
      }
    }

    try {
      const logoUrl = await uploadInput("escudoCompeticao", "logos-competicoes", nome);
      const id = estaEditando("competicao") ? idUrl() : null;
      await salvarCompeticaoDireto({
        nome,
        tipo: categoriaCompeticao === "selecao" ? "selecoes" : "clubes",
        abrangencia: categoriaCompeticao === "selecao" ? "continente" : abrangenciaSql(abrangenciaTela),
        pais: paisNome || null,
        continente: continenteNome || null,
        logo_url: logoUrl || null,
        nivel: tipoCompeticao,
        genero: "masculino",
        status: "Ativa",
        categoria: "Profissional"
      }, id);

      await recarregarDados();
      alert(id ? "Competição atualizada com sucesso!" : "Competição cadastrada com sucesso!");
      location.href = "./competicoes.html";
    } catch (erro) {
      erroCadastro(erro, "Não foi possível salvar a competição");
    }
  };

  window.salvarEdicaoClube = async function salvarEdicaoClube(event, id) {
    event.preventDefault();
    try {
      const paisNome = valor("editPais");
      const nomeCurto = valor("editNome");
      const nomeCompleto = valor("editNomeCompleto") || nomeCurto;
      const escudoUrl = await uploadInput("editEscudo", "escudos-times", nomeCompleto || nomeCurto);

      await salvarTimeDireto({
        nome: nomeCompleto,
        nome_curto: nomeCurto,
        pais: paisNome,
        estado: paisNome === "Brasil" ? (valor("editSiglaEstado") || valor("editEstado")) : null,
        cidade: valor("editCidade"),
        fundacao: valor("editFundacao"),
        escudo_url: escudoUrl || null
      }, Number(id));

      await recarregarDados();
      alert("Time atualizado com sucesso!");
      if (typeof mostrarEdicao === "function") mostrarEdicao("clubes");
    } catch (erro) {
      erroCadastro(erro, "Não foi possível atualizar o time");
    }
  };

  window.salvarEdicaoSelecao = async function salvarEdicaoSelecao(event, id) {
    event.preventDefault();
    try {
      const paisNome = valor("editPaisSelecao");
      const escudoUrl = await uploadInput("editEscudo", "escudos-selecoes", paisNome);
      await salvarSelecaoDireto({ pais: paisNome, nome: paisNome, escudo_url: escudoUrl || null }, Number(id));
      await recarregarDados();
      alert("Seleção atualizada com sucesso!");
      if (typeof mostrarEdicao === "function") mostrarEdicao("selecoes");
    } catch (erro) {
      erroCadastro(erro, "Não foi possível atualizar a seleção");
    }
  };

  window.salvarEdicaoCompeticao = async function salvarEdicaoCompeticao(event, id) {
    event.preventDefault();
    try {
      const categoria = valor("editCategoriaCompeticao") || "clube";
      const abrangenciaTela = categoria === "selecao" ? "Seleções" : valor("editAbrangencia");
      const nome = valor("editNome");
      const logoUrl = await uploadInput("editEscudo", "logos-competicoes", nome);

      await salvarCompeticaoDireto({
        nome,
        tipo: categoria === "selecao" ? "selecoes" : "clubes",
        abrangencia: categoria === "selecao" ? "continente" : abrangenciaSql(abrangenciaTela),
        pais: valor("editPaisCompeticao") || null,
        continente: valor("editContinenteCompeticao") || null,
        logo_url: logoUrl || null,
        nivel: valor("editTipoCompeticao") || null,
        genero: "masculino",
        status: "Ativa",
        categoria: "Profissional"
      }, Number(id));

      await recarregarDados();
      alert("Competição atualizada com sucesso!");
      if (typeof mostrarEdicao === "function") mostrarEdicao("competicoes");
    } catch (erro) {
      erroCadastro(erro, "Não foi possível atualizar a competição");
    }
  };
})();
