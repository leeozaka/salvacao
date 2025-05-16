import {
  CreateMedicamentoDTO,
  UpdateMedicamentoDTO,
} from "@/dto/MedicamentoDTO";
import { MedicamentoBackend } from "@/types/medicamento/medicamento";
import { TipoProduto, UnidadeDeMedida } from "@/types/entities";

export interface MedicamentoFormProps {
  // Pode receber tanto um medicamento existente quanto um novo
  medicamento: MedicamentoBackend | CreateMedicamentoDTO | UpdateMedicamentoDTO;
  tiposProduto: TipoProduto[];
  unidadesMedida: UnidadeDeMedida[];
  // Alterado para aceitar união de tipos em vez de interseção
  onSubmit: (
    medicamento:
      | MedicamentoBackend
      | CreateMedicamentoDTO
      | UpdateMedicamentoDTO,
  ) => Promise<void>;
  onCancel: () => void;
  isEditMode: boolean;
  title: string;
}
