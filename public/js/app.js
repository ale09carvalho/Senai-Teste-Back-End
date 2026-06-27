const telas = {
  welcome: document.getElementById('tela-boas-vindas'),
  form: document.getElementById('tela-formulario'),
  result: document.getElementById('tela-resultado'),
};

const form = document.getElementById('form-imc');
const nomeInput = document.getElementById('nome');
const saudacao = document.getElementById('saudacao');
const erroForm = document.getElementById('erro-form');
const generoInput = document.getElementById('genero');
const generoBtns = document.querySelectorAll('.genero-btn');
const avatars = document.querySelectorAll('.avatar');

function mostrarTela(tela) {
  Object.values(telas).forEach((el) => el.classList.remove('tela-ativa'));
  tela.classList.add('tela-ativa');
}

function atualizarSaudacao() {
  const nome = nomeInput.value.trim();
  saudacao.textContent = nome ? `Olá ${nome}!` : 'Olá!';
}

function selecionarGenero(genero) {
  generoInput.value = genero;
  generoBtns.forEach((btn) => {
    btn.classList.toggle('ativo', btn.dataset.genero === genero);
  });
  avatars.forEach((av) => {
    av.classList.toggle('ativo', av.classList.contains(genero));
  });
}

function resetarFormulario() {
  form.reset();
  generoInput.value = '';
  generoBtns.forEach((btn) => btn.classList.remove('ativo'));
  avatars.forEach((av) => av.classList.remove('ativo'));
  erroForm.hidden = true;
  erroForm.textContent = '';
  atualizarSaudacao();
}

function atualizarAnel(imc, cor) {
  const ring = document.getElementById('ring-progress');
  const maxImc = 45;
  const progresso = Math.min(imc / maxImc, 1);
  const circunferencia = 326.7;
  ring.style.strokeDashoffset = circunferencia - progresso * circunferencia;
  ring.style.stroke = cor;
}

function renderizarResultado(dados) {
  document.getElementById('imc-valor').textContent = dados.resultado.imc;
  document.getElementById('resultado-mensagem').textContent = dados.resultado.mensagem;
  atualizarAnel(dados.resultado.imc, dados.resultado.cor);

  const p = dados.paciente;
  document.getElementById('resumo-dados').innerHTML = `
    <div><span>Idade</span><strong>${p.idade}</strong></div>
    <div><span>Peso</span><strong>${p.peso} ${p.unidadePeso}</strong></div>
    <div><span>Altura</span><strong>${p.altura} ${p.unidadeAltura}</strong></div>
  `;

  const lista = document.getElementById('tabela-classificacao');
  lista.innerHTML = dados.tabelaClassificacao
    .map(
      (item) => `
    <li class="${item.selecionado ? 'selecionado' : ''}">
      <span class="dot" style="background:${item.cor}"></span>
      <span>${capitalize(item.classificacao)}</span>
      <span class="faixa">${item.faixa}</span>
    </li>
  `
    )
    .join('');

  document.getElementById('peso-ideal').innerHTML =
    `<strong>${dados.pesoIdeal.descricao}</strong>`;
}

function capitalize(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

async function calcularImc(event) {
  event.preventDefault();
  erroForm.hidden = true;

  if (!generoInput.value) {
    erroForm.textContent = 'Selecione o gênero.';
    erroForm.hidden = false;
    return;
  }

  const btn = document.getElementById('btn-calcular');
  btn.disabled = true;
  btn.textContent = 'Calculando...';

  const body = {
    nome: nomeInput.value.trim(),
    genero: generoInput.value,
    idade: Number(document.getElementById('idade').value),
    peso: Number(document.getElementById('peso').value),
    unidadePeso: document.getElementById('unidadePeso').value,
    altura: Number(document.getElementById('altura').value),
    unidadeAltura: document.getElementById('unidadeAltura').value,
  };

  try {
    const resposta = await fetch('/api/v1/imc/calcular', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      const msg =
        dados.detalhes?.map((d) => d.mensagem).join(' ') || dados.erro || 'Erro ao calcular.';
      throw new Error(msg);
    }

    renderizarResultado(dados);
    mostrarTela(telas.result);
  } catch (erro) {
    erroForm.textContent = erro.message;
    erroForm.hidden = false;
  } finally {
    btn.disabled = false;
    btn.textContent = 'Calcule seu IMC';
  }
}

document.getElementById('btn-start').addEventListener('click', () => {
  atualizarSaudacao();
  mostrarTela(telas.form);
});

nomeInput.addEventListener('input', atualizarSaudacao);

generoBtns.forEach((btn) => {
  btn.addEventListener('click', () => selecionarGenero(btn.dataset.genero));
});

form.addEventListener('submit', calcularImc);

document.getElementById('btn-voltar').addEventListener('click', () => {
  mostrarTela(telas.form);
});

document.getElementById('btn-novo-calculo').addEventListener('click', () => {
  resetarFormulario();
  mostrarTela(telas.form);
});
