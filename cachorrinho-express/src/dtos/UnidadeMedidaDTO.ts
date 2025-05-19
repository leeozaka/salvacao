import { Activable } from './ActivableDTO';

export type UnidadeMedidaDTO = Activable & {
  id: number;
  nome: string;
  sigla: string;
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
