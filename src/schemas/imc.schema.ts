import { z } from 'zod';

export const calcularImcSchema = z.object({
  nome: z.string().min(1).max(100).optional(),
  genero: z.enum(['masculino', 'feminino'], {
    errorMap: () => ({ message: 'Gênero deve ser "masculino" ou "feminino".' }),
  }),
  idade: z
    .number({ invalid_type_error: 'Idade deve ser um número.' })
    .int('Idade deve ser um número inteiro.')
    .min(1, 'Idade deve ser no mínimo 1.')
    .max(120, 'Idade deve ser no máximo 120.'),
  peso: z
    .number({ invalid_type_error: 'Peso deve ser um número.' })
    .positive('Peso deve ser maior que zero.'),
  unidadePeso: z.enum(['kg', 'lb']).default('kg'),
  altura: z
    .number({ invalid_type_error: 'Altura deve ser um número.' })
    .positive('Altura deve ser maior que zero.'),
  unidadeAltura: z.enum(['cm', 'm', 'in']).default('cm'),
});

export type CalcularImcBody = z.infer<typeof calcularImcSchema>;
