// Inicialização exclusiva da página Edições
// Garante que todos os botões de Edições abram a área correta no celular e no computador.

function abrirTipoEdicao(tipo) {
  const botoes = document.querySelectorAll('[data-edicao]');

  botoes.forEach(b => b.classList.remove('ativo'));

  const botao = document.querySelector(`[data-edicao="${tipo}"]`);
  if (botao) botao.classList.add('ativo');

  if (typeof mostrarEdicao === 'function') {
    mostrarEdicao(tipo);
  } else {
    const area = document.getElementById('areaEdicao');
    if (area) {
      area.innerHTML = '<p>Erro: arquivo de edição não foi carregado corretamente.</p>';
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const botoes = document.querySelectorAll('[data-edicao]');

  botoes.forEach(botao => {
    botao.addEventListener('click', event => {
      event.preventDefault();
      abrirTipoEdicao(botao.getAttribute('data-edicao'));
    });
  });

  const params = new URLSearchParams(window.location.search);
  const tipo = params.get('tipo');

  if (tipo) {
    setTimeout(() => abrirTipoEdicao(tipo), 0);
  }
});
