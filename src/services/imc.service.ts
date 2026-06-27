import type {
  CalcularImcRequest,
  CalcularImcResponse,
  FaixaClassificacao,
  PesoIdeal,
  ResultadoImc,
  UnidadeAltura,
  UnidadePeso,
} from '../types/imc.types';

const EMPRESA = 'NutriVitta';

const FAIXAS_ABESO: Omit<FaixaClassificacao, 'selecionado'>[] = [
  {
    id: 'abaixo-peso',
    faixa: '< 18,5',
    classificacao: 'abaixo do peso',
    cor: '#29B6F6',
    imcMin: 0,
    imcMax: 18.49,
  },
  {
    id: 'peso-normal',
    faixa: '18,5 – 24,9',
    classificacao: 'peso normal',
    cor: '#66BB6A',
    imcMin: 18.5,
    imcMax: 24.9,
  },
  {
    id: 'sobrepeso',
    faixa: '25 – 29,9',
    classificacao: 'sobrepeso',
    cor: '#FFCA28',
    imcMin: 25,
    imcMax: 29.9,
  },
  {
    id: 'obesidade-i',
    faixa: '30 – 34,9',
    classificacao: 'obesidade Grau I',
    cor: '#FFA726',
    imcMin: 30,
    imcMax: 34.9,
  },
  {
    id: 'obesidade-ii',
    faixa: '35 – 39,9',
    classificacao: 'obesidade Grau II',
    cor: '#FF7043',
    imcMin: 35,
    imcMax: 39.9,
  },
  {
    id: 'obesidade-iii',
    faixa: '> 39,9',
    classificacao: 'obesidade Grau III',
    cor: '#EF5350',
    imcMin: 40,
    imcMax: null,
  },
];

const MENSAGENS: Record<string, string> = {
  'abaixo do peso': 'Você está abaixo do peso ideal. Consulte um nutricionista da NutriVitta.',
  'peso normal': 'Você está com peso corporal normal! Continue cuidando da sua saúde.',
  sobrepeso: 'Você está com sobrepeso. A NutriVitta pode ajudar no seu acompanhamento.',
  'obesidade Grau I': 'Obesidade Grau I identificada. Recomendamos acompanhamento clínico.',
  'obesidade Grau II': 'Obesidade Grau II identificada. Busque orientação nutricional especializada.',
  'obesidade Grau III': 'Obesidade Grau III identificada. Acompanhamento clínico é essencial.',
};

function arredondar(valor: number, casas = 1): number {
  const fator = 10 ** casas;
  return Math.round(valor * fator) / fator;
}

export function converterPesoParaKg(peso: number, unidade: UnidadePeso): number {
  return unidade === 'lb' ? peso * 0.453592 : peso;
}

export function converterAlturaParaMetros(altura: number, unidade: UnidadeAltura): number {
  switch (unidade) {
    case 'cm':
      return altura / 100;
    case 'm':
      return altura;
    case 'in':
      return altura * 0.0254;
  }
}

export function calcularImc(pesoKg: number, alturaMetros: number): number {
  if (pesoKg <= 0 || alturaMetros <= 0) {
    throw new Error('Peso e altura devem ser maiores que zero.');
  }

  return arredondar(pesoKg / (alturaMetros * alturaMetros));
}

export function classificarImc(imc: number): ResultadoImc {
  const faixa = FAIXAS_ABESO.find((item) => {
    if (item.imcMax === null) {
      return imc >= item.imcMin;
    }
    return imc >= item.imcMin && imc <= item.imcMax;
  });

  if (!faixa) {
    return {
      imc,
      classificacao: 'abaixo do peso',
      mensagem: MENSAGENS['abaixo do peso'],
      cor: FAIXAS_ABESO[0].cor,
    };
  }

  return {
    imc,
    classificacao: faixa.classificacao,
    mensagem: MENSAGENS[faixa.classificacao],
    cor: faixa.cor,
  };
}

export function obterTabelaClassificacao(imc: number): FaixaClassificacao[] {
  const resultado = classificarImc(imc);

  return FAIXAS_ABESO.map((faixa) => ({
    ...faixa,
    selecionado: faixa.classificacao === resultado.classificacao,
  }));
}

export function calcularPesoIdeal(
  alturaMetros: number,
  unidadePeso: UnidadePeso
): PesoIdeal {
  const minimoKg = arredondar(18.5 * alturaMetros * alturaMetros, 1);
  const maximoKg = arredondar(24.9 * alturaMetros * alturaMetros, 1);

  if (unidadePeso === 'lb') {
    const minimo = arredondar(minimoKg / 0.453592, 1);
    const maximo = arredondar(maximoKg / 0.453592, 1);
    return {
      minimo,
      maximo,
      unidade: 'lb',
      descricao: `Peso normal: ${minimo}-${maximo} Lb`,
    };
  }

  return {
    minimo: minimoKg,
    maximo: maximoKg,
    unidade: 'kg',
    descricao: `Peso normal: ${minimoKg}-${maximoKg} Kg`,
  };
}

export function processarCalculoImc(dados: CalcularImcRequest): CalcularImcResponse {
  const pesoKg = converterPesoParaKg(dados.peso, dados.unidadePeso);
  const alturaMetros = converterAlturaParaMetros(dados.altura, dados.unidadeAltura);
  const imc = calcularImc(pesoKg, alturaMetros);
  const resultado = classificarImc(imc);

  return {
    empresa: EMPRESA,
    paciente: {
      nome: dados.nome ?? 'Paciente',
      genero: dados.genero,
      idade: dados.idade,
      peso: dados.peso,
      unidadePeso: dados.unidadePeso,
      altura: dados.altura,
      unidadeAltura: dados.unidadeAltura,
    },
    resultado,
    pesoIdeal: calcularPesoIdeal(alturaMetros, dados.unidadePeso),
    tabelaClassificacao: obterTabelaClassificacao(imc),
  };
}

export function obterFaixasAbeso(): Omit<FaixaClassificacao, 'selecionado'>[] {
  return FAIXAS_ABESO;
}

export { EMPRESA, FAIXAS_ABESO };
