(function () {
  'use strict';

  const CHAVE_SESSAO = 'futpedia_visita_contabilizada';
  const ID_CONTADOR = 'inicioVisitas';
  const ID_STATUS = 'statusContadorVisitas';

  function formatar(total) {
    const numero = Number(total);
    return Number.isFinite(numero) ? numero.toLocaleString('pt-BR') : '0';
  }

  function atualizarTela(total, status) {
    const contador = document.getElementById(ID_CONTADOR);
    const textoStatus = document.getElementById(ID_STATUS);
    if (contador) contador.textContent = formatar(total);
    if (textoStatus) textoStatus.textContent = status || 'visitas ao site';
  }

  async function carregarContador() {
    const cliente = typeof window.clienteSupabase === 'function'
      ? window.clienteSupabase()
      : null;

    if (!cliente) {
      atualizarTela(0, 'contador aguardando configuração');
      return;
    }

    try {
      const jaContabilizada = sessionStorage.getItem(CHAVE_SESSAO) === '1';

      if (!jaContabilizada) {
        const { data, error } = await cliente.rpc('registrar_visita_futpedia');
        if (error) throw error;

        sessionStorage.setItem(CHAVE_SESSAO, '1');
        atualizarTela(data, 'visitas ao site');
        return;
      }

      const { data, error } = await cliente
        .from('contador_visitas')
        .select('total')
        .eq('id', 1)
        .maybeSingle();

      if (error) throw error;
      atualizarTela(data?.total || 0, 'visitas ao site');
    } catch (erro) {
      console.warn('Não foi possível carregar o contador de visitas:', erro);
      atualizarTela(0, 'contador indisponível');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', carregarContador, { once: true });
  } else {
    carregarContador();
  }
})();
