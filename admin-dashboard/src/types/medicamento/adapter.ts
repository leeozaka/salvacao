import { Medicamento as MedicamentoFrontend } from "./medicamento";
import { Produto } from "../entities";
import { MedicamentoBackend } from "./medicamento";
import {
  CreateMedicamentoDTO,
  UpdateMedicamentoDTO,
} from "../../dto/MedicamentoDTO";

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
    composicao: "",
  };
}

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
