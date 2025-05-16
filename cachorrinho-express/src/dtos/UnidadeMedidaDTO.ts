export type UnidadeMedida = {
  id: number;
  nome: string;
  sigla: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};

/**
 * DTO também usado para consultas/filtragem
 */
export type UnidadeMedidaDTO = {
  id: number;
  nome: string;
  sigla: string;
  isActive: boolean;
};

/**
 * DTO para criação de uma nova unidade de medida
 */
export type CreateUnidadeMedidaDTO = {
  nome: string;
  sigla: string;
};

/**
 * DTO para atualização de uma unidade de medida existente
 */
export type UpdateUnidadeMedidaDTO = Partial<{
  nome: string;
  sigla: string;
  isActive: boolean;
}>;
