import { Activable } from './ActivableDTO';
import { TipoMoradia } from '@prisma/client';
import { PessoaDTO } from './PessoaDTO';

export type AdotanteDTO = Activable & {
  id: number;
  motivacaoAdocao?: string | null;
  experienciaAnteriorAnimais?: string | null;
  tipoMoradia?: TipoMoradia | null;
  permiteAnimaisMoradia?: boolean | null;
  pessoa: PessoaDTO;
};

export type CreateAdotanteDTO = {
  motivacaoAdocao?: string | null;
  experienciaAnteriorAnimais?: string | null;
  tipoMoradia?: TipoMoradia | null;
  permiteAnimaisMoradia?: boolean | null;
  pessoa: {
    nome: string;
    documentoIdentidade?: string | null;
    email?: string | null;
    telefone?: string | null;
    endereco?: string | null;
  };
};

export type UpdateAdotanteDTO = Partial<{
  motivacaoAdocao: string | null;
  experienciaAnteriorAnimais: string | null;
  tipoMoradia: TipoMoradia | null;
  permiteAnimaisMoradia: boolean | null;
  isActive: boolean;
  pessoa: {
    nome: string;
    documentoIdentidade: string | null;
    email: string | null;
    telefone: string | null;
    endereco: string | null;
  };
}>;
