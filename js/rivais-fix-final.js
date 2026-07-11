/* FutPedia - correção final de rivais e abertura única do editor */
(function () {
  "use strict";

  function cliente() {
    if (typeof window.clienteSupabase === "function") return window.clienteSupabase();
    if (typeof window.fpEdicaoSqlCliente === "function") return window.fpEdicaoSqlCliente();
    return null;
  }

  function idsRivaisDoFormulario() {
    const ids = [];
    for (let i = 1; i <= 5; i++) {
      const valor = String(document.getElementById(`editRival${i}`)?.value || "").trim();
      if (valor && !ids.includes(valor)) ids.push(valor);
    }
    return ids;
  }

  async function salvarRivaisBidirecionais(timeId, rivaisIds) {
    const supa = cliente();
    if (!supa) throw new Error("Cliente Supabase não disponível.");

    const id = Number(timeId);
    if (!Number.isFinite(id) || !id) throw new Error("ID do time inválido.");

    const rivais = (rivaisIds || [])
      .map(Number)
      .filter(v => Number.isFinite(v) && v > 0 && v !== id)
      .filter((v, i, arr) => arr.indexOf(v) === i)
      .slice(0, 5);

    // Remove somente vínculos que envolvem o time editado.
    const { error: erroExcluir } = await supa
      .from("time_rivais")
      .delete()
      .or(`time_id.eq.${id},rival_id.eq.${id}`);

    if (erroExcluir) throw new Error(erroExcluir.message || "Erro ao limpar rivais antigos.");

    const linhas = [];
    for (const rivalId of rivais) {
      linhas.push({ time_id: id, rival_id: rivalId });
      linhas.push({ time_id: rivalId, rival_id: id });
    }

    if (linhas.length) {
      const { error: erroInserir } = await supa
        .from("time_rivais")
        .upsert(linhas, { onConflict: "time_id,rival_id", ignoreDuplicates: false });
      if (erroInserir) throw new Error(erroInserir.message || "Erro ao salvar rivais.");
    }

    // Atualiza imediatamente o banco local nos dois sentidos.
    if (typeof window.carregarBanco === "function" && typeof window.salvarBanco === "function") {
      const banco = window.carregarBanco();
      const atual = (banco.clubes || []).find(c => String(c.id) === String(id));
      if (atual) atual.rivais = rivais.map(String);

      for (const clube of banco.clubes || []) {
        clube.rivais = Array.isArray(clube.rivais) ? clube.rivais.map(String) : [];
        clube.rivais = clube.rivais.filter(r => String(r) !== String(id));
      }
      for (const rivalId of rivais) {
        const rival = (banco.clubes || []).find(c => String(c.id) === String(rivalId));
        if (rival) {
          rival.rivais = Array.isArray(rival.rivais) ? rival.rivais.map(String) : [];
          if (!rival.rivais.includes(String(id))) rival.rivais.push(String(id));
        }
      }
      if (atual) atual.rivais = rivais.map(String);
      window.salvarBanco(banco);
    }

    return true;
  }

  window.fpSalvarRivaisTimeSql = salvarRivaisBidirecionais;

  function instalarSalvamento() {
    const original = window.salvarEdicaoClube;
    if (typeof original !== "function" || original.__fpRivaisCorrigido) return;

    const corrigido = async function (event, id) {
      if (event?.preventDefault) event.preventDefault();
      const rivaisSelecionados = idsRivaisDoFormulario();

      try {
        // Executa o salvamento normal do time, mantendo upload e demais campos.
        await original.call(this, event, id);

        // Salva relações após o time existir/ter sido atualizado.
        await salvarRivaisBidirecionais(id, rivaisSelecionados);

        if (typeof window.carregarDadosRelacionaisSupabase === "function") {
          await window.carregarDadosRelacionaisSupabase();
        }
      } catch (erro) {
        console.error("Erro ao salvar rivais:", erro);
        alert("O time foi salvo, mas não foi possível salvar os rivais: " + (erro.message || erro));
      }
    };
    corrigido.__fpRivaisCorrigido = true;
    window.salvarEdicaoClube = corrigido;
  }

  function impedirAberturaTripla() {
    const params = new URLSearchParams(location.search);
    const id = params.get("id");
    const tipo = params.get("tipo");
    if (!id || !tipo) return;

    const chave = `${tipo}:${id}`;
    if (window.__fpEditorAbertoChave === chave) return;
    window.__fpEditorAbertoChave = chave;

    // Remove editar/origem da URL depois da primeira abertura para impedir novos gatilhos.
    params.delete("editar");
    params.delete("origem");
    history.replaceState({}, "", `${location.pathname}?${params.toString()}`);
  }

  document.addEventListener("DOMContentLoaded", () => {
    impedirAberturaTripla();
    setTimeout(instalarSalvamento, 0);
    setTimeout(instalarSalvamento, 300);
    setTimeout(instalarSalvamento, 1000);
  });

  window.addEventListener("futpediaBancoSincronizado", () => {
    instalarSalvamento();
  });
})();
