import { z } from 'zod';

// Schema compartido entre el form (cliente) y el endpoint (server).
// Si cambia algo acá, se aplica en ambos lados sin drift.

export const contactSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(2, 'Tu nombre debe tener al menos 2 caracteres.')
    .max(120, 'Tu nombre no puede superar los 120 caracteres.'),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Ingresá un email válido (ej. tu@dominio.com).')
    .max(200, 'El email no puede superar los 200 caracteres.'),

  telefono: z
    .string()
    .trim()
    .max(30, 'El teléfono no puede superar los 30 caracteres.')
    .regex(/^[0-9+\-()\s]*$/, 'Solo se permiten números, espacios, +, -, ( y ).')
    .optional()
    .or(z.literal('')),

  mensaje: z
    .string()
    .trim()
    .min(10, 'Contame un poco más sobre tu caso (mínimo 10 caracteres).')
    .max(4000, 'Mantené el mensaje en menos de 4000 caracteres.'),

  // Honeypot: tiene que llegar vacío. Si viene con algo, es bot.
  // El input está oculto visualmente en el form.
  website: z.string().max(0).optional().or(z.literal('')),
});

export type ContactInput = z.infer<typeof contactSchema>;
