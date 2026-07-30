/* RankingWikiClub - Correções de login, botões de edição e carregamento direto do Supabase
   - Esconde Inserir/Editor/Editar quando não há login.
   - Protege páginas de Inserir e Editor.
   - Garante que o botão Editar dos detalhes carregue o registro atual do Supabase.
   - Corrige estado brasileiro no formulário de edição, aceitando sigla (RJ) ou nome completo.
*/
(function () {
  const ESTADOS_BR = [
    ['AC','Acre'], ['AL','Alagoas'], ['AP','Amapá'], ['AM','Amazonas'], ['BA','Bahia'],
    ['CE','Ceará'], ['DF','Distrito Federal'], ['ES','Espírito Santo'], ['GO','Goiás'],
    ['MA','Maranhão'], ['MT','Mato Grosso'], ['MS','Mato Grosso do Sul'], ['MG','Minas Gerais'],
    ['PA','Pará'], ['PB','Paraíba'], ['PR','Paraná'], ['PE','Pernambuco'], ['PI','Piauí'],
    ['RJ','Rio de Janeiro'], ['RN','Rio Grande do Norte'], ['RS','Rio Grande do Sul'],
    ['RO','Rondônia'], ['RR','Roraima'], ['SC','Santa Catarina'], ['SP','São Paulo'],
    ['SE','Sergipe'], ['TO','Tocantins']
  ];

  const normalize = (v) => String(v || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();

  function estadoInfo(valor) {
    const v = String(valor || '').trim();
    const n = normalize(v);
    if (!v) return { sigla: '', nome: '' };
    const item = ESTADOS_BR.find(([sigla, nome]) => normalize(sigla) === n || normalize(nome) === n);
    return item ? { sigla: item[0], nome: item[1] } : { sigla: v.length <= 2 ? v.toUpperCase() : '', nome: v };
  }

  function tipoParaTabela(tipo) {
    const t = normalize(tipo);
    if (['time', 'times', 'clube', 'clubes'].includes(t)) return 'clubes';
    if (['selecao', 'selecoes', 'selecao nacional'].includes(t)) return 'selecoes';
    if (['competicao', 'competicoes', 'liga', 'ligas'].includes(t)) return 'competicoes';
    return t;
  }

  async function sessaoAtual() {
    try {
      if (typeof obterSessao === 'function') return await obterSessao();
      const supa = typeof clienteSupabase === 'function' ? clienteSupabase() : null;
      if (!supa) return { user: null, perfil: null };
      const { data } = await supa.auth.getSession();
      const user = data?.session?.user || null;
      if (!user) return { user: null, perfil: null };
      const { data: perfilData } = await supa.from('perfis').select('perfil').eq('id', user.id).maybeSingle();
      return { user, perfil: perfilData?.perfil || null };
    } catch (e) {
      console.warn('Falha ao verificar login:', e);
      return { user: null, perfil: null };
    }
  }

  function podeEditarPerfil(perfil) {
    if (typeof podeEditar === 'function') return podeEditar(perfil);
    return perfil === 'admin' || perfil === 'editor';
  }

  function aplicarVisibilidadeEdicao(logadoPodeEditar) {
    const seletorLinks = 'a[href$="cadastros.html"], a[href$="editor.html"], a[href$="edicoes.html"]';
    const seletorBotoes = '.btn-editar, .btn-editar-detalhes-global, button[data-edicao], [data-requer-login="editor"], .acao-editor';

    document.querySelectorAll(seletorLinks).forEach(el => {
      el.style.display = logadoPodeEditar ? '' : 'none';
      el.hidden = !logadoPodeEditar;
    });

    document.querySelectorAll(seletorBotoes).forEach(el => {
      el.style.display = logadoPodeEditar ? '' : 'none';
      el.hidden = !logadoPodeEditar;
      if ('disabled' in el) el.disabled = !logadoPodeEditar;
    });
  }

  async function protegerEVisual() {
    const { user, perfil } = await sessaoAtual();
    const ok = !!user && podeEditarPerfil(perfil);
    document.body.dataset.usuarioLogado = user ? 'sim' : 'nao';
    document.body.dataset.perfil = perfil || 'visitante';

    const paginaProtegida = document.body?.dataset?.protected === 'editor';
    if (paginaProtegida && !ok) {
      const atual = location.pathname.split('/').pop() || 'index.html';
      location.href = './login.html?redirect=' + encodeURIComponent(atual + location.search);
      return;
    }

    aplicarVisibilidadeEdicao(ok);
  }

  async function buscarPaisPorId(paisId) {
    const supa = typeof clienteSupabase === 'function' ? clienteSupabase() : null;
    if (!supa || !paisId) return {};
    const { data: pais } = await supa.from('paises').select('*').eq('id', paisId).maybeSingle();
    if (!pais) return {};
    let continente = '';
    if (pais.continente_id) {
      const { data: cont } = await supa.from('continentes').select('nome').eq('id', pais.continente_id).maybeSingle();
      continente = cont?.nome || '';
    }
    return { ...pais, continente };
  }

  function bandeiraPorSigla(sigla) {
    const codigo = String(sigla || '').slice(0, 2).toUpperCase();
    if (codigo.length !== 2) return '';
    return codigo.replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt(0)));
  }

  async function carregarRegistroSupabase(tipo, id) {
    const supa = typeof clienteSupabase === 'function' ? clienteSupabase() : null;
    if (!supa || !id) return null;
    const tabela = tipoParaTabela(tipo);

    if (tabela === 'clubes') {
      const { data } = await supa.from('times').select('*').eq('id', id).maybeSingle();
      if (!data) return null;
      const pais = await buscarPaisPorId(data.pais_id);
      const est = estadoInfo(data.estado);
      return {
        id: String(data.id),
        nome: data.nome || data.nome_curto || '',
        nomeCompleto: data.nome || data.nome_curto || '',
        nomeCurto: data.nome_curto || data.nome || '',
        apelido: data.apelido || '',
        pais: pais.nome || '',
        continente: pais.continente || '',
        bandeira: bandeiraPorSigla(pais.sigla),
        estado: est.nome || data.estado || '',
        siglaEstado: est.sigla || '',
        cidade: data.cidade || '',
        fundacao: data.fundacao || '',
        escudo: data.escudo_url || '',
        estadio: data.estadio || '',
        capacidade: data.capacidade_estadio || '',
        cores: data.cores || '',
        siteOficial: data.site_oficial || '',
        rivais: []
      };
    }

    if (tabela === 'selecoes') {
      const { data } = await supa.from('selecoes').select('*').eq('id', id).maybeSingle();
      if (!data) return null;
      const pais = await buscarPaisPorId(data.pais_id);
      return {
        id: String(data.id),
        nome: data.nome || pais.nome || '',
        pais: pais.nome || data.nome || '',
        continente: pais.continente || '',
        bandeira: bandeiraPorSigla(pais.sigla || data.codigo_fifa),
        escudo: data.escudo_url || '',
        codigoFifa: data.codigo_fifa || ''
      };
    }

    if (tabela === 'competicoes') {
      const { data } = await supa.from('competicoes').select('*').eq('id', id).maybeSingle();
      if (!data) return null;
      const pais = await buscarPaisPorId(data.pais_id);
      let continente = pais.continente || '';
      if (!continente && data.continente_id) {
        const { data: cont } = await supa.from('continentes').select('nome').eq('id', data.continente_id).maybeSingle();
        continente = cont?.nome || '';
      }
      const tipo = String(data.tipo || '').toLowerCase().includes('selec') ? 'selecao' : 'clube';
      const abr = String(data.abrangencia || '').toLowerCase();
      let abrangencia = '';
      if (abr.includes('mund')) abrangencia = 'Mundial';
      else if (abr.includes('pais') || abr.includes('país')) abrangencia = 'País';
      else if (abr.includes('continent')) abrangencia = 'Continental';
      else abrangencia = data.abrangencia || '';
      return {
        id: String(data.id),
        nome: data.nome || '',
        categoria: tipo,
        tipo: data.nivel || data.tipo || '',
        abrangencia,
        continente,
        pais: pais.nome || '',
        local: pais.nome || continente || (abrangencia === 'Mundial' ? 'Mundial' : ''),
        bandeira: pais.sigla ? bandeiraPorSigla(pais.sigla) : (abrangencia === 'Mundial' ? '🌍' : ''),
        escudo: data.logo_url || '',
        sigla: data.sigla || '',
        descricao: data.descricao || '',
        primeiraEdicao: data.primeira_edicao || '',
        periodicidade: data.periodicidade || ''
      };
    }
    return null;
  }

  async function garantirRegistroAtualizadoNoBanco(tipo, id) {
    const tabela = tipoParaTabela(tipo);
    if (!id || !tabela || typeof carregarBanco !== 'function' || typeof salvarBanco !== 'function') return null;
    const atual = await carregarRegistroSupabase(tabela, id);
    if (!atual) return null;
    const banco = carregarBanco();
    banco[tabela] = banco[tabela] || [];
    const idx = banco[tabela].findIndex(x => String(x.id) === String(id));
    if (idx >= 0) banco[tabela][idx] = { ...banco[tabela][idx], ...atual };
    else banco[tabela].push(atual);
    salvarBanco(banco);
    return atual;
  }

  function corrigirEstadoFormularioEdicao(id) {
    try {
      const pais = document.getElementById('editPais')?.value || '';
      const grupo = document.getElementById('grupoEditEstadoClube');
      const grupoSigla = document.getElementById('grupoEditSiglaEstadoClube');
      const sel = document.getElementById('editEstado');
      const siglaInput = document.getElementById('editSiglaEstado');
      if (!sel) return;

      if (pais !== 'Brasil') {
        if (grupo) grupo.classList.add('oculto');
        if (grupoSigla) grupoSigla.classList.add('oculto');
        sel.value = '';
        if (siglaInput) siglaInput.value = '';
        return;
      }

      if (grupo) grupo.classList.remove('oculto');
      if (grupoSigla) grupoSigla.classList.remove('oculto');

      let valor = sel.value;
      if (!valor && typeof carregarBanco === 'function') {
        const clube = (carregarBanco().clubes || []).find(c => String(c.id) === String(id));
        valor = clube?.estado || clube?.siglaEstado || '';
      }
      const est = estadoInfo(valor);
      if (est.nome && Array.from(sel.options).some(o => o.value === est.nome)) sel.value = est.nome;
      if (siglaInput) siglaInput.value = est.sigla || '';
    } catch (e) {
      console.warn('Não foi possível corrigir o estado no formulário:', e);
    }
  }

  function instalarPatchesEdicao() {
    if (window.__fpLoginEdicaoFixInstalado) return;
    window.__fpLoginEdicaoFixInstalado = true;

    const originalAbrir = window.abrirFormularioEdicao;
    if (typeof originalAbrir === 'function') {
      window.abrirFormularioEdicao = async function (tipo, id) {
        await garantirRegistroAtualizadoNoBanco(tipo, id);
        originalAbrir.call(this, tipo, id);
        if (tipoParaTabela(tipo) === 'clubes') setTimeout(() => corrigirEstadoFormularioEdicao(id), 80);
      };
    }

    const originalConfigDetalhes = window.configurarBotaoEditarDetalhes;
    if (typeof originalConfigDetalhes === 'function') {
      window.configurarBotaoEditarDetalhes = async function (tipo, id) {
        await originalConfigDetalhes.call(this, tipo, id);
        const botao = document.getElementById('btnEditarDetalhesGlobal');
        if (!botao || botao.style.display === 'none' || botao.hidden) return;
        botao.onclick = async () => {
          await garantirRegistroAtualizadoNoBanco(tipo, id);
          const tipoUrl = tipoParaTabela(tipo);
          const params = new URLSearchParams({ tipo: tipoUrl, id: String(id || ''), editar: '1', origem: 'detalhes' });
          location.href = `./editor.html?${params.toString()}`;
        };
      };
    }
  }

  async function abrirEdicaoDiretaSeVierDaUrl() {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    const tipo = tipoParaTabela(params.get('tipo'));
    const editar = params.get('editar') === '1' || (!!id && !!tipo);
    if (!editar || !id || !tipo) return;

    const chaveAbertura = `${tipo}:${id}`;
    if (window.__fpEditorAberturaExecutada === chaveAbertura) return;

    const { user, perfil } = await sessaoAtual();
    if (!user || !podeEditarPerfil(perfil)) {
      location.href = './login.html?redirect=' + encodeURIComponent('editor.html' + location.search);
      return;
    }

    await garantirRegistroAtualizadoNoBanco(tipo, id);

    const tentar = (n = 0) => {
      if (typeof window.mostrarEdicao === 'function' && typeof window.abrirFormularioEdicao === 'function') {
        window.__fpEditorAberturaExecutada = chaveAbertura;
        window.mostrarEdicao(tipo);
        setTimeout(() => window.abrirFormularioEdicao(tipo, id), 120);
        return;
      }
      if (n < 25) setTimeout(() => tentar(n + 1), 150);
    };
    tentar();
  }

  document.addEventListener('DOMContentLoaded', async () => {
    aplicarVisibilidadeEdicao(false);
    instalarPatchesEdicao();
    await protegerEVisual();
    await abrirEdicaoDiretaSeVierDaUrl();

    const obs = new MutationObserver(async () => {
      const { user, perfil } = await sessaoAtual();
      aplicarVisibilidadeEdicao(!!user && podeEditarPerfil(perfil));
    });
    obs.observe(document.body, { childList: true, subtree: true });
  });

  window.addEventListener('futpediaBancoSincronizado', () => {
    instalarPatchesEdicao();
    protegerEVisual();
    abrirEdicaoDiretaSeVierDaUrl();
  });
})();
