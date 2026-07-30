(function () {
  'use strict';

  const CHAVE_SESSAO = 'rankingwikiclub_visita_contabilizada';
  const CHAVE_CACHE_TOTAL = 'rankingwikiclub_contador_total';
  const CHAVE_CACHE_TEMPO = 'rankingwikiclub_contador_atualizado_em';
  const ID_CONTADOR = 'inicioVisitas';
  const ID_STATUS = 'statusContadorVisitas';
  const CACHE_MS = 5 * 60 * 1000;
  const TIMEOUT_MS = 5000;

  function formatar(total) {
    const numero = Number(total);
    return Number.isFinite(numero) ? numero.toLocaleString('pt-BR') : '—';
  }

  function atualizarTela(total, status, indisponivel) {
    const contador = document.getElementById(ID_CONTADOR);
    const textoStatus = document.getElementById(ID_STATUS);
    if (contador) contador.textContent = indisponivel ? '—' : formatar(total);
    if (textoStatus) {
      textoStatus.textContent = status || 'visitas ao site';
      textoStatus.dataset.erro = indisponivel ? '1' : '0';
    }
  }

  function lerCache() {
    try {
      const total = Number(localStorage.getItem(CHAVE_CACHE_TOTAL));
      const tempo = Number(localStorage.getItem(CHAVE_CACHE_TEMPO));
      if (!Number.isFinite(total) || !Number.isFinite(tempo)) return null;
      return { total, recente: Date.now() - tempo < CACHE_MS };
    } catch (_) {
      return null;
    }
  }

  function salvarCache(total) {
    try {
      localStorage.setItem(CHAVE_CACHE_TOTAL, String(Number(total) || 0));
      localStorage.setItem(CHAVE_CACHE_TEMPO, String(Date.now()));
    } catch (_) {}
  }

  function comTimeout(promessa, ms) {
    let temporizador;
    const limite = new Promise((_, rejeitar) => {
      temporizador = setTimeout(() => rejeitar(new Error('contador_timeout')), ms);
    });
    return Promise.race([promessa, limite]).finally(() => clearTimeout(temporizador));
  }

  async function consultarEmSegundoPlano() {
    const cliente = typeof window.clienteSupabase === 'function'
      ? window.clienteSupabase()
      : null;

    if (!cliente) {
      const cache = lerCache();
      if (!cache) atualizarTela(null, 'contador indisponível', true);
      return;
    }

    const jaContabilizada = sessionStorage.getItem(CHAVE_SESSAO) === '1';

    try {
      let requisicao;
      if (!jaContabilizada) {
        requisicao = cliente.rpc('registrar_visita_rankingwikiclub');
      } else {
        requisicao = cliente
          .from('contador_visitas')
          .select('total')
          .eq('id', 1)
          .maybeSingle();
      }

      const { data, error } = await comTimeout(Promise.resolve(requisicao), TIMEOUT_MS);
      if (error) throw error;

      const total = jaContabilizada ? Number(data?.total || 0) : Number(data || 0);
      if (!jaContabilizada) sessionStorage.setItem(CHAVE_SESSAO, '1');
      salvarCache(total);
      atualizarTela(total, 'visitas ao site', false);
    } catch (erro) {
      // O contador nunca deve atrasar nem interromper o restante do site.
      console.warn('Contador de visitas não respondeu em segundo plano:', erro);
      const cache = lerCache();
      if (!cache) atualizarTela(null, 'visitas ao site', true);
    }
  }

  function iniciarSemBloquear() {
    const cache = lerCache();
    if (cache) atualizarTela(cache.total, 'visitas ao site', false);
    else atualizarTela(null, 'carregando...', false);

    const executar = () => consultarEmSegundoPlano();

    // Aguarda a página e os dados principais iniciarem. O contador usa apenas
    // o tempo ocioso do navegador e jamais participa do carregamento crítico.
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(executar, { timeout: 2500 });
    } else {
      setTimeout(executar, 1200);
    }
  }

  if (document.readyState === 'complete') {
    iniciarSemBloquear();
  } else {
    window.addEventListener('load', iniciarSemBloquear, { once: true });
  }
})();
