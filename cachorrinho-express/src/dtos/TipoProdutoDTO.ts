export type TipoProduto = {
  id: number;
  nome: string;
  descricao?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};

/**
 * DTO também usado para consultas/filtragem
 */
export type TipoProdutoDTO = {
  id: number;
  nome: string;
  descricao?: string | null;
  isActive: boolean;
};

/**
 * DTO para criação de um novo tipo de produto
 */
export type CreateTipoProdutoDTO = {
  nome: string;
  descricao?: string | null;
};

/**
 * DTO para atualização de um tipo de produto existente
 */
export type UpdateTipoProdutoDTO = Partial<{
  nome: string;
  descricao: string | null;
  isActive: boolean;
}>;
