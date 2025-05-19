import { Adotante } from '@prisma/client';

export type CreateAdotanteDTO = Omit<Adotante, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateAdotanteDTO = Partial<CreateAdotanteDTO>;
