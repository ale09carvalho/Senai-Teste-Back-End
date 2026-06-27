import { describe, it, expect } from 'vitest';
import {
  calcularImc,
  classificarImc,
  converterAlturaParaMetros,
  converterPesoParaKg,
  processarCalculoImc,
} from '../src/services/imc.service';

describe('NutriVitta IMC Service', () => {
  it('calcula IMC corretamente (54kg, 165cm)', () => {
    const imc = calcularImc(54, 1.65);
    expect(imc).toBe(19.8);
  });

  it('classifica peso normal na faixa Abeso', () => {
    const resultado = classificarImc(22);
    expect(resultado.classificacao).toBe('peso normal');
  });

  it('classifica abaixo do peso', () => {
    expect(classificarImc(18.4).classificacao).toBe('abaixo do peso');
  });

  it('classifica sobrepeso no limite inferior', () => {
    expect(classificarImc(25).classificacao).toBe('sobrepeso');
  });

  it('classifica obesidade Grau III', () => {
    expect(classificarImc(40).classificacao).toBe('obesidade Grau III');
  });

  it('converte unidades corretamente', () => {
    expect(converterPesoParaKg(100, 'lb')).toBeCloseTo(45.36, 1);
    expect(converterAlturaParaMetros(165, 'cm')).toBe(1.65);
  });

  it('retorna resposta completa como no mockup', () => {
    const resposta = processarCalculoImc({
      nome: 'Elmira',
      genero: 'feminino',
      idade: 22,
      peso: 54,
      unidadePeso: 'kg',
      altura: 165,
      unidadeAltura: 'cm',
    });

    expect(resposta.empresa).toBe('NutriVitta');
    expect(resposta.resultado.imc).toBe(19.8);
    expect(resposta.resultado.classificacao).toBe('peso normal');
    expect(resposta.pesoIdeal.minimo).toBe(50.4);
    expect(resposta.pesoIdeal.maximo).toBe(67.8);
    expect(resposta.tabelaClassificacao.some((f) => f.selecionado)).toBe(true);
  });
});
