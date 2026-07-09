// Inicialização exclusiva da página Edições
// Garante que todos os botões de Edições abram a área correta no celular e no computador.

document.addEventListener('DOMContentLoaded', () => {
  const botoes = document.querySelectorAll('[data-edicao]');

  botoes.forEach(botao => {
    botao.addEventListener('click', event => {
      event.preventDefault();
      const tipo = botao.getAttribute('data-edicao');

      botoes.forEach(b => b.classList.remove('ativo'));
      botao.classList.add('ativo');

      if (typeof mostrarEdicao === 'function') {
        mostrarEdicao(tipo);
      } else {
        const area = document.getElementById('areaEdicao');
        if (area) {
          area.innerHTML = '<p>Erro: arquivo de edição não foi carregado corretamente.</p>';
        }
      }
    });
  });
});


/* Abre automaticamente o formulário de edição quando a página vier da tela de detalhes.
   Exemplo: edicoes.html?tipo=clubes&id=123&editar=1 */
function fpNormalizarTipoEdicaoUrl(tipo) {
  const t = String(tipo || '').toLowerCase();
  if (['time', 'times', 'clube', 'clubes'].includes(t)) return 'clubes';
  if (['selecao', 'selecoes', 'seleção', 'seleções'].includes(t)) return 'selecoes';
  if (['competicao', 'competicoes', 'competição', 'competições', 'liga', 'ligas'].includes(t)) return 'competicoes';
  if (['titulo', 'titulos', 'títulos'].includes(t)) return 'titulos';
  return t;
}

function fpAbrirEdicaoDiretaDaUrl(tentativa = 0) {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const tipo = fpNormalizarTipoEdicaoUrl(params.get('tipo'));
  const deveAbrir = params.get('editar') === '1' || !!(id && tipo);
  if (!deveAbrir || !id || !tipo) return;

  if (typeof mostrarEdicao !== 'function' || typeof abrirFormularioEdicao !== 'function' || typeof carregarBanco !== 'function') {
    if (tentativa < 20) setTimeout(() => fpAbrirEdicaoDiretaDaUrl(tentativa + 1), 150);
    return;
  }

  const banco = carregarBanco();
  const lista = banco?.[tipo] || [];
  const encontrado = lista.some(item => String(item.id) === String(id));

  if (!encontrado && tentativa < 20) {
    setTimeout(() => fpAbrirEdicaoDiretaDaUrl(tentativa + 1), 250);
    return;
  }

  const botao = document.querySelector(`[data-edicao="${tipo}"]`);
  document.querySelectorAll('[data-edicao]').forEach(b => b.classList.remove('ativo'));
  if (botao) botao.classList.add('ativo');

  mostrarEdicao(tipo);
  setTimeout(() => {
    abrirFormularioEdicao(tipo, id);
    const area = document.getElementById('areaEdicao');
    if (area) area.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 80);
}

document.addEventListener('DOMContentLoaded', () => fpAbrirEdicaoDiretaDaUrl());
window.addEventListener('futpediaBancoSincronizado', () => fpAbrirEdicaoDiretaDaUrl());
