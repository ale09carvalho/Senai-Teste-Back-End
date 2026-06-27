import { ZodError } from 'zod';
import { Router, Request, Response, NextFunction } from 'express';
import imcRoutes from './routes/imc.routes';
import { EMPRESA } from './services/imc.service';

const app = Router();

app.get('/api', (_req: Request, res: Response) => {
  res.json({
    nome: 'NutriVitta IMC API',
    empresa: EMPRESA,
    versao: '1.0.0',
    descricao: 'Sistema de cálculo de Índice de Massa Corporal (IMC) - Classificação Abeso 2017',
    interface: 'GET /',
    endpoints: {
      boasVindas: 'GET /api/v1/imc/boas-vindas',
      calcular: 'POST /api/v1/imc/calcular',
      tabela: 'GET /api/v1/imc/tabela',
      saude: 'GET /health',
    },
    exemplo: {
      metodo: 'POST',
      url: '/api/v1/imc/calcular',
      body: {
        nome: 'Elmira',
        genero: 'feminino',
        idade: 22,
        peso: 54,
        unidadePeso: 'kg',
        altura: 165,
        unidadeAltura: 'cm',
      },
    },
  });
});

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', empresa: EMPRESA, timestamp: new Date().toISOString() });
});

app.use('/api/v1/imc', imcRoutes);

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ZodError) {
    res.status(400).json({
      erro: 'Dados inválidos',
      detalhes: err.errors.map((e) => ({
        campo: e.path.join('.'),
        mensagem: e.message,
      })),
    });
    return;
  }

  if (err instanceof Error) {
    res.status(400).json({ erro: err.message });
    return;
  }

  res.status(500).json({ erro: 'Erro interno do servidor.' });
});

export default app;
