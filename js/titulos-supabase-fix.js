
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
      competicao_id: String(titulo.competicaoId || ""),
      competicao_nome: titulo.competicaoNome || "",
      abrangencia: titulo.abrangencia || "",
      campeao_id: String(titulo.campeaoId || ""),
      campeao_nome: titulo.campeaoNome || "",
      campeao_tipo: titulo.campeaoTipo || "clube",
      vice_id: String(titulo.viceId || ""),
      vice_nome: titulo.viceNome || "",
      vice_tipo: titulo.viceTipo || "clube"
    };
  }

  async function salvarTituloNoSupabase(titulo) {
    const supabase = cliente();
    if (!supabase) throw new Error("Supabase não está disponível.");

    const { error } = await supabase
      .from("titulos_futpedia")
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
        ([erro?.message, erro?.details, erro?.hint, erro?.code].filter(Boolean).join(" | ") || "Execute sql_criar_titulos_futpedia_definitivo.sql.")
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
      alert("Não foi possível atualizar no Supabase. " + ([erro?.message, erro?.details, erro?.hint, erro?.code].filter(Boolean).join(" | ")));
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
        .from("titulos_futpedia")
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
      alert("Não foi possível excluir do Supabase. " + ([erro?.message, erro?.details, erro?.hint, erro?.code].filter(Boolean).join(" | ")));
    }
  }

  window.salvarTitulo = cadastrarTituloSupabase;
  window.salvarEdicaoTitulo = editarTituloSupabase;
  window.excluirTituloSupabase = excluirTituloSupabase;
})();


/* ===== Correção definitiva da página Edição ===== */
(function () {
  "use strict";

  function fpClienteTitulosEdicao() {
    if (typeof window.clienteSupabase === "function") {
      return window.clienteSupabase();
    }
    return null;
  }

  function fpTextoErroSupabase(erro) {
    return [
      erro?.message,
      erro?.details,
      erro?.hint,
      erro?.code
    ].filter(Boolean).join(" | ");
  }

  function fpParticipanteTituloEdicao(banco, id, categoria) {
    const lista = categoria === "selecao"
      ? (banco.selecoes || [])
      : (banco.clubes || []);

    return lista.find(item => String(item.id) === String(id)) || null;
  }

  function fpNomeParticipanteTituloEdicao(item) {
    return String(
      item?.nomeCurto ||
      item?.nome_curto ||
      item?.nome ||
      item?.pais ||
      ""
    ).trim();
  }

  function fpPayloadTituloEdicao(titulo) {
    return {
      id: String(titulo.id),
      ano: String(titulo.ano || ""),
      competicao_id: String(titulo.competicaoId || ""),
      competicao_nome: String(titulo.competicaoNome || ""),
      abrangencia: String(titulo.abrangencia || ""),
      campeao_id: String(titulo.campeaoId || ""),
      campeao_nome: String(titulo.campeaoNome || ""),
      campeao_tipo: String(titulo.campeaoTipo || "clube"),
      vice_id: String(titulo.viceId || ""),
      vice_nome: String(titulo.viceNome || ""),
      vice_tipo: String(titulo.viceTipo || "clube"),
      atualizado_em: new Date().toISOString()
    };
  }

  async function fpSalvarEConfirmarTituloEdicao(titulo) {
    const supabase = fpClienteTitulosEdicao();

    if (!supabase) {
      throw new Error("Não foi possível conectar ao Supabase.");
    }

    const payload = fpPayloadTituloEdicao(titulo);

    const { data, error } = await supabase
      .from("titulos_futpedia")
      .upsert(payload, { onConflict: "id" })
      .select("*")
      .single();

    if (error) throw error;
    if (!data) throw new Error("O Supabase não retornou o registro salvo.");

    return data;
  }

  async function fpSalvarEdicaoTituloSupabase(event, id) {
    event?.preventDefault?.();
    event?.stopPropagation?.();

    if (window.__fpSalvandoTituloEdicao) return;
    window.__fpSalvandoTituloEdicao = true;

    const botao = event?.submitter ||
      document.querySelector('.form-edicao button[type="submit"]');

    const textoOriginal = botao?.textContent || "";

    try {
      if (botao) {
        botao.disabled = true;
        botao.textContent = "Salvando...";
      }

      const banco = carregarBanco();
      const titulo = (banco.titulos || []).find(
        item => String(item.id) === String(id)
      );

      if (!titulo) {
        throw new Error("O registro de campeão e vice não foi encontrado.");
      }

      const ano = document.getElementById("editAno")?.value?.trim() || "";
      const categoria =
        document.getElementById("editCategoriaTitulo")?.value || "clube";
      const competicaoId =
        document.getElementById("editCompeticaoTitulo")?.value || "";
      const campeaoId =
        document.getElementById("editCampeao")?.value || "";
      const viceId =
        document.getElementById("editVice")?.value || "";

      if (!ano || !competicaoId || !campeaoId || !viceId) {
        throw new Error("Preencha ano, competição, campeão e vice.");
      }

      if (String(campeaoId) === String(viceId)) {
        throw new Error(
          categoria === "selecao"
            ? "Campeão e vice não podem ser a mesma seleção."
            : "Campeão e vice não podem ser o mesmo clube."
        );
      }

      const competicao = (banco.competicoes || []).find(
        item => String(item.id) === String(competicaoId)
      );
      const campeao = fpParticipanteTituloEdicao(
        banco,
        campeaoId,
        categoria
      );
      const vice = fpParticipanteTituloEdicao(
        banco,
        viceId,
        categoria
      );

      if (!competicao || !campeao || !vice) {
        throw new Error(
          "Não foi possível localizar a competição, o campeão ou o vice."
        );
      }

      const atualizado = {
        ...titulo,
        ano,
        competicaoId: String(competicao.id),
        competicaoNome: competicao.nome || "",
        abrangencia: competicao.abrangencia || "",
        campeaoId: String(campeao.id),
        campeaoNome: fpNomeParticipanteTituloEdicao(campeao),
        campeaoTipo: categoria,
        viceId: String(vice.id),
        viceNome: fpNomeParticipanteTituloEdicao(vice),
        viceTipo: categoria
      };

      const salvo = await fpSalvarEConfirmarTituloEdicao(atualizado);

      Object.assign(titulo, {
        id: String(salvo.id),
        ano: String(salvo.ano || ""),
        competicaoId: String(salvo.competicao_id || ""),
        competicaoNome: salvo.competicao_nome || "",
        abrangencia: salvo.abrangencia || "",
        campeaoId: String(salvo.campeao_id || ""),
        campeaoNome: salvo.campeao_nome || "",
        campeaoTipo: salvo.campeao_tipo || "clube",
        viceId: String(salvo.vice_id || ""),
        viceNome: salvo.vice_nome || "",
        viceTipo: salvo.vice_tipo || "clube"
      });

      salvarBanco(banco);

      alert("Campeão e vice atualizados e confirmados no Supabase.");

      if (typeof mostrarEdicao === "function") {
        mostrarEdicao("titulos");
      }
    } catch (erro) {
      console.error("Erro ao salvar edição de campeão e vice:", erro);
      alert(
        "Não foi possível salvar no Supabase. " +
        (fpTextoErroSupabase(erro) || "Erro desconhecido.")
      );
    } finally {
      window.__fpSalvandoTituloEdicao = false;

      if (botao) {
        botao.disabled = false;
        botao.textContent = textoOriginal || "Salvar alterações";
      }
    }
  }

  // Garante que nenhuma versão antiga de banco.js seja usada.
  window.salvarEdicaoTitulo = fpSalvarEdicaoTituloSupabase;
  window.fpSalvarEdicaoTituloSupabase = fpSalvarEdicaoTituloSupabase;

  // Reaplica depois que a página terminar de montar o Editor.
  document.addEventListener("DOMContentLoaded", function () {
    window.salvarEdicaoTitulo = fpSalvarEdicaoTituloSupabase;
  });

  window.addEventListener("futpediaBancoSincronizado", function () {
    window.salvarEdicaoTitulo = fpSalvarEdicaoTituloSupabase;
  });
})();
