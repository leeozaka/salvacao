import {} from '@prisma/client';

export type Medicamento = {
  id: number;
  nome: string;
  idTipoProduto: number;
  nomeTipoProduto?: string;
  idUnidadeMedidaPadrao: number;
  siglaUnidadeMedida?: string;
  nomeUnidadeMedida?: string;
  descricao?: string | null;
  codigoBarras?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;

  // Dados de MedicamentoDetalhe
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

  // Dados de MedicamentoDetalhe
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

  // Dados de MedicamentoDetalhe
  dosagem: string | null;
  principioAtivo: string | null;
  fabricante: string | null;
  necessitaReceita: boolean;
}>;
