// src/app/dashboard/medicamento/page.tsx
import MedicamentosClient from "@/components/medicamento/MedicamentoClient";
import {
  buscarTiposProduto,
  buscarUnidadesMedida,
} from "@/services/produtoService";
import { buscarMedicamentos } from "@/services/medicamentoService";

// Componente de página assíncrono para App Router
export default async function MedicamentosPage() {
  console.log("Renderizando MedicamentosPage...");

  // Carregar dados iniciais no servidor
  let dadosIniciais = {
    tipos: [],
    unidades: [],
    medicamentos: [],
  };

  try {
    // Passo 1: Buscar tipos
    console.log("Buscando tipos de produto...");
    const tiposResponse = await buscarTiposProduto();
    if (tiposResponse.success) {
      console.log(`Tipos de produto carregados: ${tiposResponse.data.length}`);
      dadosIniciais.tipos = tiposResponse.data;
    } else {
      console.error("Falha ao buscar tipos de produto:", tiposResponse.message);
    }

    // Passo 2: Buscar unidades
    console.log("Buscando unidades de medida...");
    const unidadesResponse = await buscarUnidadesMedida();
    if (unidadesResponse.success) {
      console.log(
        `Unidades de medida carregadas: ${unidadesResponse.data.length}`,
      );
      dadosIniciais.unidades = unidadesResponse.data;
    } else {
      console.error(
        "Falha ao buscar unidades de medida:",
        unidadesResponse.message,
      );
    }

    // Não carregamos todos os medicamentos inicialmente
    // O componente cliente irá buscar medicamentos com filtros do backend

    console.log("Carregamento de dados iniciais concluído");
  } catch (error) {
    console.error("Erro geral ao carregar dados iniciais:", error);
  }

  // Renderizar o componente cliente com os dados iniciais
  console.log("Renderizando componente cliente...");
  return <MedicamentosClient dadosIniciais={dadosIniciais} />;
}
