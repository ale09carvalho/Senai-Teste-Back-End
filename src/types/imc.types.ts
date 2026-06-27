export type Genero = 'masculino' | 'feminino';
export type UnidadePeso = 'kg' | 'lb';
export type UnidadeAltura = 'cm' | 'm' | 'in';

export interface CalcularImcRequest {
  nome?: string;
  genero: Genero;
  idade: number;
  peso: number;
  unidadePeso: UnidadePeso;
  altura: number;
  unidadeAltura: UnidadeAltura;
}

export interface FaixaClassificacao {
  id: string;
  faixa: string;
  classificacao: string;
  cor: string;
  imcMin: number;
  imcMax: number | null;
  selecionado: boolean;
}

export interface PesoIdeal {
  minimo: number;
  maximo: number;
  unidade: UnidadePeso;
  descricao: string;
}

export interface ResultadoImc {
  imc: number;
  classificacao: string;
  mensagem: string;
  cor: string;
}

export interface CalcularImcResponse {
  empresa: string;
  paciente: {
    nome: string;
    genero: Genero;
    idade: number;
    peso: number;
    unidadePeso: UnidadePeso;
    altura: number;
    unidadeAltura: UnidadeAltura;
  };
  resultado: ResultadoImc;
  pesoIdeal: PesoIdeal;
  tabelaClassificacao: FaixaClassificacao[];
}

export interface BoasVindasResponse {
  titulo: string;
  subtitulo: string;
  empresa: string;
  descricao: string;
  acao: string;
  endpoint: string;
}
