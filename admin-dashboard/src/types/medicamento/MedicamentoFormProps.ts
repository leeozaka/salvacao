import {
  CreateMedicamentoDTO,
  UpdateMedicamentoDTO,
} from "@/dto/MedicamentoDTO";
import { MedicamentoBackend } from "@/types/medicamento/medicamento";
import { TipoProduto, UnidadeDeMedida } from "@/types/entities";

export interface MedicamentoFormProps {
  medicamento: MedicamentoBackend | CreateMedicamentoDTO | UpdateMedicamentoDTO;
  tiposProduto: TipoProduto[];
  unidadesMedida: UnidadeDeMedida[];
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
