import { Adotante } from '@prisma/client';

export type AdotanteDTO = Adotante;

export type CreateAdotanteDTO = Omit<Adotante, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateAdotanteDTO = Partial<CreateAdotanteDTO>;
