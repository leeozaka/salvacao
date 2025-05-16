// types/medicamento/adapter.ts
import { Medicamento as MedicamentoFrontend } from "./medicamento";
import { Produto } from "../entities";
import { MedicamentoBackend } from "./medicamento";
import {
  CreateMedicamentoDTO,
  UpdateMedicamentoDTO,
} from "../../dto/MedicamentoDTO";

// Converter do backend para o frontend
export function backendToFrontend(
  med: MedicamentoBackend,
): MedicamentoFrontend {
  return {
    idproduto: med.id,
    nome: med.nome,
    idtipoproduto: med.idTipoProduto,
    idunidademedida: med.idUnidadeMedidaPadrao,
    fabricante: med.fabricante || "",
    dataValidade: med.deletedAt ? new Date(med.deletedAt) : null,
    composicao: med.principioAtivo || "",
  };
}

// Converter produto frontend para medicamento
export function produtoToMedicamento(
  produto: Produto,
): Partial<MedicamentoFrontend> {
  return {
    idproduto: produto.idproduto,
    nome: produto.nome,
    idtipoproduto: produto.idtipoproduto,
    idunidademedida: produto.idunidademedida,
    fabricante: produto.fabricante,
    dataValidade: produto.dataValidade,
    composicao: "", // Valor padrão para composição
  };
}

// Converter do frontend para criar no backend
export function frontendToCreateDTO(
  med: Partial<MedicamentoFrontend>,
): CreateMedicamentoDTO {
  return {
    nome: med.nome || "",
    idTipoProduto: med.idtipoproduto || 0,
    idUnidadeMedidaPadrao: med.idunidademedida || 0,
    descricao: "",
    codigoBarras: null,
    principioAtivo: med.composicao || "",
    fabricante: med.fabricante || "",
    dosagem: "",
    necessitaReceita: false,
  };
}

// Converter do frontend para atualizar no backend
export function frontendToUpdateDTO(
  med: Partial<MedicamentoFrontend>,
): UpdateMedicamentoDTO {
  return {
    nome: med.nome,
    idTipoProduto: med.idtipoproduto,
    idUnidadeMedidaPadrao: med.idunidademedida,
    principioAtivo: med.composicao,
    fabricante: med.fabricante,
  };
}
