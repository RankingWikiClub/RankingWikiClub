
(function () {
  "use strict";

  function cliente() {
    if (typeof window.clienteSupabase === "function") return window.clienteSupabase();
    if (window.supabaseClient?.from) return window.supabaseClient;
    if (window.supabase?.from) return window.supabase;
    return null;
  }

  function participantePorCategoria(banco, id, categoria) {
    const lista = categoria === "selecao"
      ? (banco.selecoes || [])
      : (banco.clubes || []);

    return lista.find(item => String(item.id) === String(id)) || null;
  }

  function nomeParticipante(item) {
    return String(
      item?.nomeCurto ||
      item?.nome_curto ||
      item?.nome ||
      item?.pais ||
      ""
    ).trim();
  }

  function payloadTitulo(titulo) {
    return {
      id: String(titulo.id),
      ano: String(titulo.ano || ""),
      competicao_id: Number(titulo.competicaoId),
      competicao_nome: titulo.competicaoNome || "",
      abrangencia: titulo.abrangencia || "",
      campeao_id: Number(titulo.campeaoId),
      campeao_nome: titulo.campeaoNome || "",
      campeao_tipo: titulo.campeaoTipo || "clube",
      vice_id: Number(titulo.viceId),
      vice_nome: titulo.viceNome || "",
      vice_tipo: titulo.viceTipo || "clube"
    };
  }

  async function salvarTituloNoSupabase(titulo) {
    const supabase = cliente();
    if (!supabase) throw new Error("Supabase não está disponível.");

    const { error } = await supabase
      .from("titulos")
      .upsert(payloadTitulo(titulo), { onConflict: "id" });

    if (error) throw error;
  }

  async function cadastrarTituloSupabase() {
    const banco = carregarBanco();
    const ano = document.getElementById("ano")?.value || "";
    const competicaoId = document.getElementById("competicaoTitulo")?.value || "";
    const campeaoId = document.getElementById("campeao")?.value || "";
    const viceId = document.getElementById("vice")?.value || "";
    const categoria = document.getElementById("categoriaTitulo")?.value || "clube";

    if (!ano || !competicaoId || !campeaoId || !viceId) {
      alert("Preencha ano, competição, campeão e vice.");
      return;
    }

    if (String(campeaoId) === String(viceId)) {
      alert("Campeão e vice não podem ser o mesmo participante.");
      return;
    }

    const competicao = (banco.competicoes || []).find(
      item => String(item.id) === String(competicaoId)
    );
    const campeao = participantePorCategoria(banco, campeaoId, categoria);
    const vice = participantePorCategoria(banco, viceId, categoria);

    if (!competicao || !campeao || !vice) {
      alert("Não foi possível localizar competição, campeão ou vice.");
      return;
    }

    const titulo = {
      id: String(typeof gerarId === "function" ? gerarId() : Date.now()),
      ano,
      competicaoId: String(competicao.id),
      competicaoNome: competicao.nome || "",
      abrangencia: competicao.abrangencia || "",
      campeaoId: String(campeao.id),
      campeaoNome: nomeParticipante(campeao),
      campeaoTipo: categoria,
      viceId: String(vice.id),
      viceNome: nomeParticipante(vice),
      viceTipo: categoria
    };

    try {
      await salvarTituloNoSupabase(titulo);

      banco.titulos ||= [];
      banco.titulos = banco.titulos.filter(item => String(item.id) !== String(titulo.id));
      banco.titulos.push(titulo);
      salvarBanco(banco);

      alert("Campeão e vice cadastrados e salvos no Supabase!");
      location.reload();
    } catch (erro) {
      console.error("Erro ao salvar campeão e vice no Supabase:", erro);
      alert(
        "Não foi possível salvar no Supabase. " +
        (erro?.message || "Execute o arquivo sql_titulos_futpedia.sql.")
      );
    }
  }

  async function editarTituloSupabase(event, id) {
    event?.preventDefault?.();

    const banco = carregarBanco();
    const titulo = (banco.titulos || []).find(
      item => String(item.id) === String(id)
    );

    if (!titulo) {
      alert("Registro não encontrado.");
      return;
    }

    const ano = document.getElementById("editAno")?.value || "";
    const categoria = document.getElementById("editCategoriaTitulo")?.value || "clube";
    const competicaoId = document.getElementById("editCompeticaoTitulo")?.value || "";
    const campeaoId = document.getElementById("editCampeao")?.value || "";
    const viceId = document.getElementById("editVice")?.value || "";

    if (!ano || !competicaoId || !campeaoId || !viceId) {
      alert("Preencha ano, competição, campeão e vice.");
      return;
    }

    if (String(campeaoId) === String(viceId)) {
      alert("Campeão e vice não podem ser o mesmo participante.");
      return;
    }

    const competicao = (banco.competicoes || []).find(
      item => String(item.id) === String(competicaoId)
    );
    const campeao = participantePorCategoria(banco, campeaoId, categoria);
    const vice = participantePorCategoria(banco, viceId, categoria);

    if (!competicao || !campeao || !vice) {
      alert("Não foi possível localizar competição, campeão ou vice.");
      return;
    }

    const atualizado = {
      ...titulo,
      ano,
      competicaoId: String(competicao.id),
      competicaoNome: competicao.nome || "",
      abrangencia: competicao.abrangencia || "",
      campeaoId: String(campeao.id),
      campeaoNome: nomeParticipante(campeao),
      campeaoTipo: categoria,
      viceId: String(vice.id),
      viceNome: nomeParticipante(vice),
      viceTipo: categoria
    };

    try {
      await salvarTituloNoSupabase(atualizado);

      Object.assign(titulo, atualizado);
      salvarBanco(banco);

      alert("Campeão e vice atualizados no Supabase!");
      if (typeof mostrarEdicao === "function") mostrarEdicao("titulos");
    } catch (erro) {
      console.error("Erro ao atualizar campeão e vice:", erro);
      alert("Não foi possível atualizar no Supabase. " + (erro?.message || ""));
    }
  }

  async function excluirTituloSupabase(id) {
    if (!confirm("Deseja excluir este registro?")) return;

    const supabase = cliente();
    if (!supabase) {
      alert("Supabase não está disponível.");
      return;
    }

    try {
      const { error } = await supabase
        .from("titulos")
        .delete()
        .eq("id", String(id));

      if (error) throw error;

      const banco = carregarBanco();
      banco.titulos = (banco.titulos || []).filter(
        item => String(item.id) !== String(id)
      );
      salvarBanco(banco);

      alert("Registro excluído do Supabase.");
      if (typeof mostrarEdicao === "function") mostrarEdicao("titulos");
    } catch (erro) {
      console.error("Erro ao excluir título:", erro);
      alert("Não foi possível excluir do Supabase. " + (erro?.message || ""));
    }
  }

  window.salvarTitulo = cadastrarTituloSupabase;
  window.salvarEdicaoTitulo = editarTituloSupabase;
  window.excluirTituloSupabase = excluirTituloSupabase;
})();
