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
