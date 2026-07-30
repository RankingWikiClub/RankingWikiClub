/* RankingWikiClub — correção definitiva do cadastro de campeão e vice (clubes / Mundo)
   Fluxo: Ano > Competição mundial > País campeão > País vice > Time campeão > Time vice. */
(function () {
  'use strict';

  function normalizar(valor) {
    return String(valor || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase();
  }

  function categoriaDaCompeticao(comp) {
    const categoria = normalizar(comp?.categoria || comp?.categoria_competicao || comp?.tipo_entidade);
    if (categoria.includes('selec')) return 'selecao';
    if (categoria.includes('club') || categoria.includes('time')) return 'clube';

    const tipo = normalizar(comp?.tipo);
    const abrangencia = normalizar(comp?.abrangencia);
    if (tipo.includes('selec') || abrangencia === 'selecoes') return 'selecao';
    return 'clube';
  }

  function nivelDaCompeticao(comp) {
    const campos = [
      comp?.abrangencia,
      comp?.nivel,
      comp?.nivel_competicao,
      comp?.escopo,
      comp?.local,
      comp?.tipo,
      comp?.nome
    ].map(normalizar);

    if (campos.some(v =>
      v === 'mundo' ||
      v === 'mundial' ||
      v.includes('nivel mundo') ||
      v.includes('nivel mundial') ||
      v.includes('campeonato mundial') ||
      v.includes('mundial de clubes') ||
      v.includes('intercontinental')
    )) return 'Mundial';

    if (campos.some(v => v === 'continente' || v === 'continental' || v.includes('continental'))) {
      return 'Continental';
    }

    if (campos.some(v => v === 'pais' || v === 'nacional' || v.includes('nacional'))) {
      return 'País';
    }

    return '';
  }

  function bancoAtual() {
    try {
      return typeof carregarBanco === 'function' ? carregarBanco() : { clubes: [], competicoes: [] };
    } catch (erro) {
      console.error('Não foi possível carregar o banco para o cadastro de títulos:', erro);
      return { clubes: [], competicoes: [] };
    }
  }

  function definirOpcoes(select, itens, placeholder, valorAtual, valorFn, textoFn) {
    if (!select) return;
    select.innerHTML = '';

    const inicial = document.createElement('option');
    inicial.value = '';
    inicial.textContent = placeholder;
    select.appendChild(inicial);

    itens.forEach(item => {
      const option = document.createElement('option');
      option.value = String(valorFn(item) || '');
      option.textContent = textoFn(item);
      select.appendChild(option);
    });

    if (valorAtual && [...select.options].some(opcao => opcao.value === String(valorAtual))) {
      select.value = String(valorAtual);
    }
  }

  function paisesComClubes(banco) {
    const mapa = new Map();

    (banco.clubes || []).forEach(clube => {
      const paisNome = String(clube?.pais || '').trim();
      if (!paisNome) return;

      let bandeira = clube?.bandeira || '';
      try {
        if (!bandeira && typeof buscarPais === 'function') bandeira = buscarPais(paisNome)?.bandeira || '';
      } catch (_) {}

      mapa.set(normalizar(paisNome), { nome: paisNome, bandeira });
    });

    return [...mapa.values()].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
  }

  function nomeDoClube(clube) {
    const nome = clube?.nome || clube?.nomeCurto || clube?.nome_curto || clube?.nomeCompleto || clube?.nome_completo || '';
    const sigla = clube?.siglaEstado || clube?.sigla_estado || '';
    return sigla ? `${nome} — ${sigla}` : nome;
  }

  function preencherPaisesMundo() {
    const banco = bancoAtual();
    const paises = paisesComClubes(banco);
    const campeao = document.getElementById('paisCampeaoTitulo');
    const vice = document.getElementById('paisViceTitulo');
    const atualCampeao = campeao?.value || '';
    const atualVice = vice?.value || '';

    definirOpcoes(campeao, paises, 'Selecione o país do campeão', atualCampeao, p => p.nome, p => `${p.bandeira || ''} ${p.nome}`.trim());
    definirOpcoes(vice, paises, 'Selecione o país do vice', atualVice, p => p.nome, p => `${p.bandeira || ''} ${p.nome}`.trim());
  }

  function preencherTimesMundo(tipo) {
    const banco = bancoAtual();
    const ehVice = tipo === 'vice';
    const pais = document.getElementById(ehVice ? 'paisViceTitulo' : 'paisCampeaoTitulo')?.value || '';
    const select = document.getElementById(ehVice ? 'vice' : 'campeao');
    const atual = select?.value || '';

    const clubes = (banco.clubes || [])
      .filter(clube => clube?.id && nomeDoClube(clube))
      .filter(clube => pais && normalizar(clube?.pais) === normalizar(pais))
      .sort((a, b) => nomeDoClube(a).localeCompare(nomeDoClube(b), 'pt-BR'));

    const placeholder = !pais
      ? (ehVice ? 'Selecione primeiro o país do vice' : 'Selecione primeiro o país do campeão')
      : (clubes.length ? (ehVice ? 'Selecione o time vice' : 'Selecione o time campeão') : 'Nenhum time cadastrado neste país');

    definirOpcoes(select, clubes, placeholder, atual, clube => clube.id, nomeDoClube);
  }

  function preencherCompeticoesMundo() {
    const banco = bancoAtual();
    const select = document.getElementById('competicaoTitulo');
    const atual = select?.value || '';

    const competicoes = (banco.competicoes || [])
      .filter(comp => comp?.id && comp?.nome)
      .filter(comp => categoriaDaCompeticao(comp) === 'clube')
      .filter(comp => nivelDaCompeticao(comp) === 'Mundial')
      .sort((a, b) => String(a.nome).localeCompare(String(b.nome), 'pt-BR'));

    definirOpcoes(
      select,
      competicoes,
      competicoes.length ? 'Selecione a competição de nível Mundo' : 'Nenhuma competição de nível Mundo cadastrada',
      atual,
      comp => comp.id,
      comp => comp.nome
    );
  }

  function rotuloAnterior(campo) {
    const anterior = campo?.previousElementSibling;
    return anterior?.tagName === 'LABEL' ? anterior : null;
  }

  function organizarCamposMundo() {
    const grupo = document.getElementById('grupoTitulo');
    if (!grupo) return;

    const ano = document.getElementById('ano');
    const competicao = document.getElementById('competicaoTitulo');
    const paisCampeao = document.getElementById('grupoPaisCampeaoTitulo');
    const paisVice = document.getElementById('grupoPaisViceTitulo');
    const campeao = document.getElementById('campeao');
    const vice = document.getElementById('vice');

    const elementos = [
      rotuloAnterior(ano), ano,
      rotuloAnterior(competicao), competicao,
      paisCampeao, paisVice,
      rotuloAnterior(campeao), campeao,
      rotuloAnterior(vice), vice
    ];

    elementos.forEach(elemento => {
      if (elemento) grupo.appendChild(elemento);
    });

    const labelPaisCampeao = paisCampeao?.querySelector('label');
    const labelPaisVice = paisVice?.querySelector('label');
    const labelCampeao = rotuloAnterior(campeao);
    const labelVice = rotuloAnterior(vice);

    if (labelPaisCampeao) labelPaisCampeao.textContent = 'País do campeão';
    if (labelPaisVice) labelPaisVice.textContent = 'País do vice';
    if (labelCampeao) labelCampeao.textContent = 'Time campeão';
    if (labelVice) labelVice.textContent = 'Time vice';
  }

  function ehFluxoMundoClubes() {
    return (document.getElementById('tipoCadastro')?.value || '') === 'titulo' &&
      (document.getElementById('categoriaTitulo')?.value || '') === 'clube' &&
      nivelDaCompeticao({ abrangencia: document.getElementById('abrangenciaTitulo')?.value || '' }) === 'Mundial';
  }

  function atualizarFluxoMundo() {
    if (!ehFluxoMundoClubes()) return false;

    const grupoCampeao = document.getElementById('grupoPaisCampeaoTitulo');
    const grupoVice = document.getElementById('grupoPaisViceTitulo');
    grupoCampeao?.classList.remove('oculto');
    grupoVice?.classList.remove('oculto');

    organizarCamposMundo();
    preencherCompeticoesMundo();
    preencherPaisesMundo();
    preencherTimesMundo('campeao');
    preencherTimesMundo('vice');
    return true;
  }

  document.addEventListener('DOMContentLoaded', function () {
    const tipoCadastro = document.getElementById('tipoCadastro');
    const categoria = document.getElementById('categoriaTitulo');
    const abrangencia = document.getElementById('abrangenciaTitulo');
    const paisCampeao = document.getElementById('paisCampeaoTitulo');
    const paisVice = document.getElementById('paisViceTitulo');

    function reagir() {
      window.setTimeout(atualizarFluxoMundo, 0);
    }

    tipoCadastro?.addEventListener('change', reagir);
    categoria?.addEventListener('change', reagir);
    abrangencia?.addEventListener('change', reagir);

    paisCampeao?.addEventListener('change', function () {
      if (ehFluxoMundoClubes()) preencherTimesMundo('campeao');
    });

    paisVice?.addEventListener('change', function () {
      if (ehFluxoMundoClubes()) preencherTimesMundo('vice');
    });

    reagir();
  });

  /* Mantém compatibilidade com os onchange e funções já existentes. */
  const carregarCompeticoesOriginal = window.carregarCompeticoesPorAbrangencia;
  window.carregarCompeticoesPorAbrangencia = function () {
    if (atualizarFluxoMundo()) return;
    if (typeof carregarCompeticoesOriginal === 'function') return carregarCompeticoesOriginal.apply(this, arguments);
  };

  const carregarParticipantesOriginal = window.carregarParticipantesTituloNoSelect;
  window.carregarParticipantesTituloNoSelect = function (tipo) {
    if (ehFluxoMundoClubes()) return preencherTimesMundo(tipo === 'vice' ? 'vice' : 'campeao');
    if (typeof carregarParticipantesOriginal === 'function') return carregarParticipantesOriginal.apply(this, arguments);
  };
})();
