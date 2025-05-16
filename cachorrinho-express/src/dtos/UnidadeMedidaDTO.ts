export type UnidadeMedida = {
  id: number;
  nome: string;
  sigla: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};

export type UnidadeMedidaDTO = {
  id: number;
  nome: string;
  sigla: string;
  isActive: boolean;
};

export type CreateUnidadeMedidaDTO = {
  nome: string;
  sigla: string;
};

export type UpdateUnidadeMedidaDTO = Partial<{
  nome: string;
  sigla: string;
  isActive: boolean;
}>;
