// Props do componente
import {
  CreateMedicamentoDTO,
  UpdateMedicamentoDTO,
} from "@/dto/MedicamentoDTO";
import { MedicamentoBackend } from "@/types/medicamento/medicamento";
import { TipoProduto, UnidadeDeMedida } from "@/types/entities";

export interface MedicamentoFormProps {
  // Pode receber tanto um medicamento existente quanto um novo
  medicamento: CreateMedicamentoDTO | MedicamentoBackend;
  tiposProduto: TipoProduto[];
  unidadesMedida: UnidadeDeMedida[];
  onSubmit: (
    medicamento: CreateMedicamentoDTO | UpdateMedicamentoDTO,
  ) => Promise<void>;
  onCancel: () => void;
  isEditMode: boolean;
  title: string;
}
