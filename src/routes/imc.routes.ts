import { Router, Request, Response, NextFunction } from 'express';
import { calcularImcSchema } from '../schemas/imc.schema';
import {
  EMPRESA,
  obterFaixasAbeso,
  processarCalculoImc,
} from '../services/imc.service';
import type { BoasVindasResponse } from '../types/imc.types';

const router = Router();

router.get('/boas-vindas', (_req: Request, res: Response) => {
  const resposta: BoasVindasResponse = {
    titulo: 'IMC',
    subtitulo: 'Calculadora',
    empresa: EMPRESA,
    descricao:
      'Bem-vindo à Calculadora de IMC da NutriVitta, sua ferramenta para acompanhar o Índice de Massa Corporal e monitorar sua saúde nutricional.',
    acao: 'START',
    endpoint: 'POST /api/v1/imc/calcular',
  };

  res.json(resposta);
});

router.get('/tabela', (_req: Request, res: Response) => {
  res.json({
    empresa: EMPRESA,
    fonte: 'Abeso (2017)',
    faixas: obterFaixasAbeso(),
  });
});

router.post('/calcular', (req: Request, res: Response, next: NextFunction) => {
  try {
    const dados = calcularImcSchema.parse(req.body);
    const resultado = processarCalculoImc(dados);
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
});

export default router;
