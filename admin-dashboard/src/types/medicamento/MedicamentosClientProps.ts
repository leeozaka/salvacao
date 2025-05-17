import { MedicamentoBackend } from "@/types/medicamento/medicamento";
import { TipoProduto, UnidadeDeMedida } from "@/types/entities";

export interface MedicamentosClientProps {
  dadosIniciais?: {
    medicamentos?: MedicamentoBackend[];
    tipos?: TipoProduto[];
    unidades?: UnidadeDeMedida[];
  };
}
