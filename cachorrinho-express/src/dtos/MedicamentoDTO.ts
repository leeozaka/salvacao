import { Activable } from './ActivableDTO';

export type MedicamentoDTO = Activable & {
  id: number;
  nome: string;
  idTipoProduto: number;
  nomeTipoProduto?: string;
  idUnidadeMedidaPadrao: number;
  siglaUnidadeMedida?: string;
  nomeUnidadeMedida?: string;
  descricao?: string | null;
  codigoBarras?: string | null;

  dosagem?: string | null;
  principioAtivo?: string | null;
  fabricante?: string | null;
  necessitaReceita?: boolean;
};

export type CreateMedicamentoDTO = {
  nome: string;
  idTipoProduto: number;
  idUnidadeMedidaPadrao: number;
  descricao?: string | null;
  codigoBarras?: string | null;

  dosagem?: string | null;
  principioAtivo?: string | null;
  fabricante?: string | null;
  necessitaReceita?: boolean;
};

export type UpdateMedicamentoDTO = Partial<{
  nome: string;
  idTipoProduto: number;
  idUnidadeMedidaPadrao: number;
  descricao: string | null;
  codigoBarras: string | null;
  isActive: boolean;

  dosagem: string | null;
  principioAtivo: string | null;
  fabricante: string | null;
  necessitaReceita: boolean;
}>;
