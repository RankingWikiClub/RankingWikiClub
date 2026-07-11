
(function () {
  "use strict";

  const SELETORES_PAIS = [
    'select[id*="pais" i]',
    'select[name*="pais" i]',
    'select[data-campo="pais"]',
    'select[data-tipo="pais"]'
  ].join(",");

  function normalizarTexto(valor) {
    return String(valor || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]+/g, " ")
      .trim()
      .toLowerCase();
  }

  function nomePaisAtualizado(valor) {
    if (typeof window.nomePaisEmPortugues === "function") {
      return window.nomePaisEmPortugues(valor);
    }
    return String(valor || "").trim();
  }

  function paisesDoBancoLocal() {
    try {
      if (typeof window.carregarBanco !== "function") return [];
      const banco = window.carregarBanco();
      const paises = Array.isArray(banco?.paises) ? banco.paises : [];

      return paises
        .map(pais => ({
          id: pais?.id ?? pais?.pais_id ?? "",
          nome: nomePaisAtualizado(pais?.nome ?? pais?.pais ?? "")
        }))
        .filter(pais => pais.nome);
    } catch (erro) {
      console.warn("Não foi possível ler países do banco local:", erro);
      return [];
    }
  }

  async function paisesDoSupabase() {
    try {
      const cliente =
        window.supabaseClient ||
        window.supabase ||
        (typeof window.getSupabaseClient === "function"
          ? window.getSupabaseClient()
          : null);

      if (!cliente || typeof cliente.from !== "function") return [];

      const { data, error } = await cliente
        .from("paises")
        .select("id,nome")
        .order("nome", { ascending: true });

      if (error) throw error;

      return (data || [])
        .map(pais => ({
          id: pais.id,
          nome: nomePaisAtualizado(pais.nome)
        }))
        .filter(pais => pais.nome);
    } catch (erro) {
      console.warn("Não foi possível carregar países do Supabase:", erro);
      return [];
    }
  }

  function removerDuplicados(paises) {
    const mapa = new Map();

    (paises || []).forEach(pais => {
      const chave = normalizarTexto(nomePaisAtualizado(pais.nome));
      if (!chave) return;

      const atual = mapa.get(chave);
      if (!atual || (!atual.id && pais.id)) {
        mapa.set(chave, {
          id: pais.id ?? "",
          nome: nomePaisAtualizado(pais.nome)
        });
      }
    });

    return Array.from(mapa.values()).sort((a, b) =>
      a.nome.localeCompare(b.nome, "pt-BR")
    );
  }

  function valorSelecionado(select) {
    const opcao = select.options[select.selectedIndex];
    return {
      value: select.value,
      text: opcao?.textContent?.trim() || "",
      paisId:
        select.dataset.paisId ||
        select.dataset.valorPaisId ||
        select.getAttribute("data-selected-id") ||
        ""
    };
  }

  function encontrarPaisSelecionado(paises, selecionado) {
    if (selecionado.paisId) {
      const porId = paises.find(
        pais => String(pais.id) === String(selecionado.paisId)
      );
      if (porId) return porId;
    }

    if (selecionado.value) {
      const porIdValor = paises.find(
        pais => String(pais.id) === String(selecionado.value)
      );
      if (porIdValor) return porIdValor;

      const chaveValor = normalizarTexto(nomePaisAtualizado(selecionado.value));
      const porNomeValor = paises.find(
        pais => normalizarTexto(pais.nome) === chaveValor
      );
      if (porNomeValor) return porNomeValor;
    }

    if (selecionado.text) {
      const chaveTexto = normalizarTexto(nomePaisAtualizado(selecionado.text));
      return paises.find(pais => normalizarTexto(pais.nome) === chaveTexto);
    }

    return null;
  }

  function usaIdComoValor(select) {
    if (
      select.dataset.valor === "id" ||
      select.dataset.valueType === "id" ||
      select.dataset.tipoValor === "id"
    ) {
      return true;
    }

    const opcoesComValor = Array.from(select.options).filter(op => op.value);
    if (!opcoesComValor.length) return false;

    const numericas = opcoesComValor.filter(op => /^\d+$/.test(op.value));
    return numericas.length >= Math.ceil(opcoesComValor.length / 2);
  }

  function atualizarSelect(select, paises) {
    if (!select || select.dataset.naoSincronizarPaises === "1") return;

    const selecionado = valorSelecionado(select);
    const paisSelecionado = encontrarPaisSelecionado(paises, selecionado);
    const valorPorId = usaIdComoValor(select);

    const primeiraOpcao = Array.from(select.options).find(op =>
      !op.value ||
      /selecione|todos|todas|pa[ií]s/i.test(op.textContent || "")
    );

    const placeholder = primeiraOpcao
      ? {
          value: primeiraOpcao.value || "",
          text: primeiraOpcao.textContent || "Selecione o país"
        }
      : {
          value: "",
          text: "Selecione o país"
        };

    select.innerHTML = "";

    const opcaoInicial = document.createElement("option");
    opcaoInicial.value = placeholder.value;
    opcaoInicial.textContent = placeholder.text;
    select.appendChild(opcaoInicial);

    paises.forEach(pais => {
      const option = document.createElement("option");
      option.value = valorPorId ? String(pais.id ?? "") : pais.nome;
      option.textContent = pais.nome;
      option.dataset.paisId = String(pais.id ?? "");
      select.appendChild(option);
    });

    if (paisSelecionado) {
      select.value = valorPorId
        ? String(paisSelecionado.id ?? "")
        : paisSelecionado.nome;
      select.dataset.paisId = String(paisSelecionado.id ?? "");
    } else if (selecionado.value) {
      const opcaoCompativel = Array.from(select.options).find(op =>
        normalizarTexto(op.value) === normalizarTexto(selecionado.value) ||
        normalizarTexto(op.textContent) ===
          normalizarTexto(nomePaisAtualizado(selecionado.text))
      );

      if (opcaoCompativel) {
        select.value = opcaoCompativel.value;
        select.dataset.paisId = opcaoCompativel.dataset.paisId || "";
      }
    }

    select.dispatchEvent(
      new CustomEvent("paisesAtualizados", {
        bubbles: true,
        detail: { total: paises.length }
      })
    );
  }

  async function sincronizarListasPaises() {
    const locais = paisesDoBancoLocal();
    const remotos = await paisesDoSupabase();
    const paises = removerDuplicados([...remotos, ...locais]);

    if (!paises.length) return;

    document.querySelectorAll(SELETORES_PAIS).forEach(select =>
      atualizarSelect(select, paises)
    );

    window.__paisesAtualizados = paises;
  }

  function agendarSincronizacao() {
    clearTimeout(window.__timerSincronizarPaises);
    window.__timerSincronizarPaises = setTimeout(
      sincronizarListasPaises,
      80
    );
  }

  document.addEventListener("DOMContentLoaded", () => {
    sincronizarListasPaises();

    const observer = new MutationObserver(mutations => {
      const possuiNovoSelectPais = mutations.some(mutation =>
        Array.from(mutation.addedNodes || []).some(node => {
          if (!(node instanceof Element)) return false;
          return node.matches?.(SELETORES_PAIS) ||
            node.querySelector?.(SELETORES_PAIS);
        })
      );

      if (possuiNovoSelectPais) agendarSincronizacao();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });

  window.sincronizarListasPaises = sincronizarListasPaises;
})();
