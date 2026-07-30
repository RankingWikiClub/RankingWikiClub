(function () {
  'use strict';

  const CHAVE_SESSAO = 'rankingwikiclub_visita_contabilizada';
  const CHAVE_ANTIGA = 'futpedia_visita_contabilizada';
  const ID_CONTADOR = 'inicioVisitas';
  const ID_STATUS = 'statusContadorVisitas';

  function formatar(total) {
    const numero = Number(total);
    return Number.isFinite(numero) ? numero.toLocaleString('pt-BR') : '0';
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

  function mensagemErro(erro) {
    const codigo = erro?.code ? String(erro.code) : '';
    const mensagem = erro?.message ? String(erro.message) : '';
    const combinado = `${codigo} ${mensagem}`.toLowerCase();

    if (combinado.includes('registrar_visita') || combinado.includes('function')) {
      return 'Execute o SQL do contador no Supabase';
    }
    if (combinado.includes('contador_visitas') || combinado.includes('relation')) {
      return 'Tabela do contador não encontrada no Supabase';
    }
    if (combinado.includes('permission') || combinado.includes('policy') || combinado.includes('42501')) {
      return 'Permissão do contador precisa ser corrigida no Supabase';
    }
    if (combinado.includes('failed to fetch') || combinado.includes('network')) {
      return 'Sem conexão com o Supabase';
    }
    return 'Contador temporariamente indisponível';
  }

  async function lerTotal(cliente) {
    const { data, error } = await cliente
      .from('contador_visitas')
      .select('total')
      .eq('id', 1)
      .single();
    if (error) throw error;
    return Number(data?.total || 0);
  }

  async function registrar(cliente) {
    // Tenta primeiro o novo nome. Mantém compatibilidade com a função antiga.
    let resposta = await cliente.rpc('registrar_visita_rankingwikiclub');
    if (!resposta.error) return Number(resposta.data || 0);

    const erroNovo = resposta.error;
    resposta = await cliente.rpc('registrar_visita_futpedia');
    if (!resposta.error) return Number(resposta.data || 0);

    // Propaga o erro mais útil para o diagnóstico visível.
    throw resposta.error || erroNovo;
  }

  async function carregarContador() {
    const cliente = typeof window.clienteSupabase === 'function'
      ? window.clienteSupabase()
      : null;

    if (!cliente) {
      atualizarTela(0, 'Supabase não configurado', true);
      return;
    }

    try {
      const jaContabilizada = sessionStorage.getItem(CHAVE_SESSAO) === '1' ||
        sessionStorage.getItem(CHAVE_ANTIGA) === '1';

      let total;
      if (!jaContabilizada) {
        total = await registrar(cliente);
        sessionStorage.setItem(CHAVE_SESSAO, '1');
        sessionStorage.removeItem(CHAVE_ANTIGA);
      } else {
        total = await lerTotal(cliente);
      }

      atualizarTela(total, 'visitas contabilizadas', false);
    } catch (erro) {
      console.error('Falha no contador de visitas:', erro);
      atualizarTela(0, mensagemErro(erro), true);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', carregarContador, { once: true });
  } else {
    carregarContador();
  }
})();
