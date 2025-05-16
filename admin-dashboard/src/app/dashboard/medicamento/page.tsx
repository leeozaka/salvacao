// src/app/dashboard/medicamento/page.tsx
import { redirect } from "next/navigation";
import MedicamentosClient from "@/components/medicamento/MedicamentoClient";
import {
  buscarTiposProduto,
  buscarUnidadesMedida,
} from "@/services/produtoService";
import { buscarMedicamentos } from "@/services/medicamentoService";
import { verifyAuthToken } from "@/services/authService";
import { cookies } from "next/headers";

// Função auxiliar para obter token no ambiente de servidor
async function getServerSideToken() {
  const cookieStore = await cookies();
  return cookieStore.get("authToken")?.value || null;
}

// Componente de página assíncrono para App Router
export default async function MedicamentosPage() {
  console.log("Renderizando MedicamentosPage...");

  // Verificar autenticação no servidor
  const authToken = await getServerSideToken();

  if (!authToken) {
    console.log("Token não encontrado, redirecionando para login");
    redirect("/login");
  }

  console.log("Token obtido com sucesso");

  // Verificar token com o backend
  const isValid = await verifyAuthToken();
  console.log("Token válido?", isValid);

  if (!isValid) {
    console.log("Token inválido, redirecionando para login");
    redirect("/login");
  }

  // Carregar dados iniciais no servidor
  let dadosIniciais = {
    tipos: [],
    unidades: [],
    medicamentos: [],
  };

  try {
    console.log("Iniciando carregamento de dados no servidor...");

    // Passo 1: Buscar tipos
    console.log("Buscando tipos de produto...");
    try {
      const tiposResponse = await buscarTiposProduto();
      if (tiposResponse.success) {
        console.log(
          `Tipos de produto carregados: ${tiposResponse.data.length}`,
        );
        dadosIniciais.tipos = tiposResponse.data;
      } else {
        console.error(
          "Falha ao buscar tipos de produto:",
          tiposResponse.message,
        );
      }
    } catch (error) {
      console.error("Erro ao buscar tipos de produto:", error);
    }

    // Passo 2: Buscar unidades
    console.log("Buscando unidades de medida...");
    try {
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
    } catch (error) {
      console.error("Erro ao buscar unidades de medida:", error);
    }

    // Passo 3: Buscar medicamentos
    console.log("Buscando medicamentos...");
    try {
      const medicamentosResponse = await buscarMedicamentos();
      if (medicamentosResponse.success) {
        console.log(
          `Medicamentos carregados: ${medicamentosResponse.data.length}`,
        );
        dadosIniciais.medicamentos = medicamentosResponse.data;
      } else {
        console.error(
          "Falha ao buscar medicamentos:",
          medicamentosResponse.message,
        );
      }
    } catch (error) {
      console.error("Erro ao buscar medicamentos:", error);
    }

    console.log("Carregamento de dados concluído");
  } catch (error) {
    console.error("Erro geral ao carregar dados iniciais:", error);
  }

  // Renderizar o componente cliente com os dados iniciais
  console.log("Renderizando componente cliente...");
  return <MedicamentosClient dadosIniciais={dadosIniciais} />;
}
