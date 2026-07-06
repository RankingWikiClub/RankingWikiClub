// Inicialização exclusiva da página Edições
// Corrige os botões para funcionarem no celular e em navegadores que falham com onclick inline.

document.addEventListener('DOMContentLoaded', () => {
  const botoes = document.querySelectorAll('[data-edicao]');

  botoes.forEach(botao => {
    botao.addEventListener('click', event => {
      event.preventDefault();
      const tipo = botao.getAttribute('data-edicao');

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
