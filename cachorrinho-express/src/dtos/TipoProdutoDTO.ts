export type TipoProduto = {
  id: number;
  nome: string;
  descricao?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};

export type TipoProdutoDTO = {
  id: number;
  nome: string;
  descricao?: string | null;
  isActive: boolean;
};

export type CreateTipoProdutoDTO = {
  nome: string;
  descricao?: string | null;
};

export type UpdateTipoProdutoDTO = Partial<{
  nome: string;
  descricao: string | null;
  isActive: boolean;
}>;
