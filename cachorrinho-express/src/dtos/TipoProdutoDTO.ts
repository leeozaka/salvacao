import { Activable } from './ActivableDTO';

export type TipoProdutoDTO = Activable & {
  id: number;
  nome: string;
  descricao?: string | null;
};

// export type TipoProdutoDTO = {
//   id: number;
//   nome: string;
//   descricao?: string | null;
//   isActive: boolean;
// };

export type CreateTipoProdutoDTO = {
  nome: string;
  descricao?: string | null;
};

export type UpdateTipoProdutoDTO = Partial<{
  nome: string;
  descricao: string | null;
  isActive: boolean;
}>;
