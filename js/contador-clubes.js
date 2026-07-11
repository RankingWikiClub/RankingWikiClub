
(function () {
  "use strict";

  const ID_CONTADOR = "contadorResultadosClubes";

  function elementoVisivel(el) {
    if (!el) return false;
    const estilo = window.getComputedStyle(el);
    return estilo.display !== "none" &&
           estilo.visibility !== "hidden" &&
           !el.hidden &&
           el.getAttribute("aria-hidden") !== "true";
  }

  function localizarItensClubes() {
    const seletoresPrioritarios = [
      "#listaClubes .card-clube",
      "#listaClubes .clube-card",
      "#lista-clubes .card-clube",
      "#lista-clubes .clube-card",
      "#resultadoClubes .card-clube",
      "#resultadosClubes .card-clube",
      ".lista-clubes .card-clube",
      ".grid-clubes .card-clube",
      ".club-card",
      ".clube-card"
    ];

    for (const seletor of seletoresPrioritarios) {
      const itens = Array.from(document.querySelectorAll(seletor));
      if (itens.length) return itens;
    }

    const tabelas = Array.from(document.querySelectorAll("table"));
    for (const tabela of tabelas) {
      const identificador = `${tabela.id || ""} ${tabela.className || ""}`.toLowerCase();
      if (identificador.includes("club") || identificador.includes("time")) {
        const linhas = Array.from(tabela.querySelectorAll("tbody tr"));
        if (linhas.length) return linhas;
      }
    }

    return [];
  }

  function atualizarContadorResultadosClubes() {
    const contador = document.getElementById(ID_CONTADOR);
    if (!contador) return;

    const itens = localizarItensClubes();
    const total = itens.filter(elementoVisivel).length;
    const palavra = total === 1 ? "time encontrado" : "times encontrados";

    contador.textContent = `${total.toLocaleString("pt-BR")} ${palavra}`;
    contador.classList.toggle("sem-resultados", total === 0);
  }

  function agendarAtualizacao() {
    window.clearTimeout(window.__contadorClubesTimer);
    window.__contadorClubesTimer = window.setTimeout(atualizarContadorResultadosClubes, 40);
  }

  document.addEventListener("DOMContentLoaded", function () {
    atualizarContadorResultadosClubes();

    const campos = document.querySelectorAll(
      'input[type="search"], input[id*="busca" i], input[id*="pesquisa" i], ' +
      'select[id*="pais" i], select[id*="estado" i], select[id*="cidade" i], ' +
      'select[id*="filtro" i]'
    );

    campos.forEach(function (campo) {
      campo.addEventListener("input", agendarAtualizacao);
      campo.addEventListener("change", agendarAtualizacao);
    });

    const alvo = document.querySelector("main") || document.body;
    const observador = new MutationObserver(agendarAtualizacao);
    observador.observe(alvo, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class", "hidden", "aria-hidden"]
    });

    window.atualizarContadorResultadosClubes = atualizarContadorResultadosClubes;
  });
})();
