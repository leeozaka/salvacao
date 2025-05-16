// src/app/dashboard/medicamento/page.tsx
import { redirect } from "next/navigation";
import MedicamentosClient from "@/components/medicamento/MedicamentoClient";
import {
  buscarTiposProduto,
  buscarUnidadesMedida,
} from "@/services/produtoService";
import { buscarMedicamentos } from "@/services/medicamentoService";
import { getAuthToken, verifyToken, isAuthenticated } from "@/utils/auth";

// Componente de página assíncrono para App Router
export default async function MedicamentosPage() {
  console.log("Renderizando MedicamentosPage...");

  // Verificar autenticação
  const isAuth = await isAuthenticated();
  console.log("Autenticado?", isAuth);

  if (!isAuth) {
    redirect("/login");
  }

  // Obter token
  const token = await getAuthToken();

  if (!token) {
    redirect("/login");
  }
  console.log("Token obtido com sucesso");

  // Verificar token com o backend
  const isValid = await verifyToken(token);
  console.log("Token válido?", isValid);

  if (!isValid) {
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

    // Para identificar qual chamada está falhando, vamos tentar uma a uma
    // Passo 1: Buscar tipos
    console.log("Buscando tipos de produto...");
    try {
      const tipos = await buscarTiposProduto(undefined, token);
      console.log(`Tipos de produto carregados: ${tipos.length}`);
      dadosIniciais.tipos = tipos;
    } catch (error) {
      console.error("Erro ao buscar tipos de produto:", error);
    }

    // Passo 2: Buscar unidades
    console.log("Buscando unidades de medida...");
    try {
      const unidades = await buscarUnidadesMedida(undefined, token);
      console.log(`Unidades de medida carregadas: ${unidades.length}`);
      dadosIniciais.unidades = unidades;
    } catch (error) {
      console.error("Erro ao buscar unidades de medida:", error);
    }

    // Passo 3: Buscar medicamentos
    console.log("Buscando medicamentos...");
    try {
      const medicamentos = await buscarMedicamentos(undefined, token);
      console.log(`Medicamentos carregados: ${medicamentos.length}`);
      dadosIniciais.medicamentos = medicamentos;
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
