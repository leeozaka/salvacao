// src/app/dashboard/medicamento/page.tsx
import MedicamentosClient from "@/components/medicamento/MedicamentoClient";
import {
  buscarTiposProduto,
  buscarUnidadesMedida,
} from "@/services/produtoService";

export default async function MedicamentosPage() {
  const dadosIniciais = {
    tipos: [],
    unidades: [],
    medicamentos: [],
  };

  try {
    const tiposResponse = await buscarTiposProduto();
    if (tiposResponse.success) {
      dadosIniciais.tipos = tiposResponse.data;
    } else {
      console.error("Falha ao buscar tipos de produto:", tiposResponse.message);
    }

    const unidadesResponse = await buscarUnidadesMedida();
    if (unidadesResponse.success) {
      dadosIniciais.unidades = unidadesResponse.data;
    } else {
      console.error(
        "Falha ao buscar unidades de medida:",
        unidadesResponse.message,
      );
    }
  } catch (error) {
    console.error("Erro geral ao carregar dados iniciais:", error);
  }

  return <MedicamentosClient dadosIniciais={dadosIniciais} />;
}
