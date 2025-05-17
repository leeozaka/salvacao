export interface CreateMedicamentoDTO {
  nome: string;
  idTipoProduto: number;
  idUnidadeMedidaPadrao: number;
  descricao?: string | null;
  codigoBarras?: string | null;

  dosagem?: string | null;
  principioAtivo?: string | null;
  fabricante?: string | null;
  necessitaReceita?: boolean;
}

export interface UpdateMedicamentoDTO {
  nome?: string;
  idTipoProduto?: number;
  idUnidadeMedidaPadrao?: number;
  descricao?: string | null;
  codigoBarras?: string | null;

  dosagem?: string | null;
  principioAtivo?: string | null;
  fabricante?: string | null;
  necessitaReceita?: boolean;
}
