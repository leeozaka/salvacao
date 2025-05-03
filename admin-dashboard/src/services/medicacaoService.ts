import {
  Medicacao,
  Animal,
  Medicamento,
  Pessoa,
  UnidadeDeMedida,
  ReceitaMedicamento,
} from "@/types/entities";

// Interface para representar os dados do formulário
import { FormDataType } from "@/types/formTypes";

/**
 * Registra uma nova medicação
 * @param formData Dados do formulário
 * @returns Promise com a resposta da API
 */
export async function registrarMedicacao(
  formData: FormDataType,
): Promise<{ success: boolean; error?: string }> {
  try {
    // Criar objeto de medicação conforme a interface
    const dataHora = new Date(`${formData.data}T${formData.hora}`);

    // Construir objeto de medicação com a estrutura da entidade
    const novaMedicacao: Partial<Medicacao> = {
      idanimal: Number(formData.animalId),
      // Assumindo que criará um novo histórico
      idhistorico: 0,
      data: dataHora,
    };

    // Se tiver receita selecionada, incluir relação com posologia
    if (formData.receitaId) {
      novaMedicacao.posologia_medicamento_idproduto = Number(
        formData.medicamentoId,
      );
      novaMedicacao.posologia_receitamedicamento_idreceita = Number(
        formData.receitaId,
      );
    }

    // Aqui você faria a chamada real à API
    // const response = await fetch('/api/medicacoes', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     medicacao: novaMedicacao,
    //     formData: formData,
    //   }),
    // });

    // if (!response.ok) {
    //   throw new Error('Erro ao registrar medicação');
    // }

    // const data = await response.json();
    // return { success: true };

    // Simulando resposta de sucesso para desenvolvimento
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Dados enviados:", {
          medicacao: novaMedicacao,
          formData: formData,
        });
        resolve({ success: true });
      }, 1500);
    });
  } catch (error) {
    console.error("Erro ao registrar medicação:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao registrar medicação",
    };
  }
}

/**
 * Busca todos os animais cadastrados
 * @returns Promise com lista de animais
 */
export async function buscarAnimais(): Promise<Animal[]> {
  try {
    // Aqui você faria a chamada real à API
    // const response = await fetch('/api/animais');
    // if (!response.ok) {
    //   throw new Error('Erro ao buscar animais');
    // }
    // return await response.json();

    // Simulando dados para desenvolvimento
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            idanimal: 1,
            nome: "Rex",
            especie: "Cachorro",
            idade: 3,
            idhistorico: 1,
            raca: "Labrador",
          },
          {
            idanimal: 2,
            nome: "Miau",
            especie: "Gato",
            idade: 2,
            idhistorico: 2,
            raca: "Siamês",
          },
          {
            idanimal: 3,
            nome: "Totó",
            especie: "Cachorro",
            idade: 5,
            idhistorico: 3,
            raca: "Pastor Alemão",
          },
          {
            idanimal: 4,
            nome: "Luna",
            especie: "Gato",
            idade: 1,
            idhistorico: 4,
            raca: "Persa",
          },
        ]);
      }, 300);
    });
  } catch (error) {
    console.error("Erro ao buscar animais:", error);
    return [];
  }
}

/**
 * Busca todos os medicamentos cadastrados
 * @returns Promise com lista de medicamentos
 */
export async function buscarMedicamentos(): Promise<Medicamento[]> {
  try {
    // Aqui você faria a chamada real à API
    // const response = await fetch('/api/medicamentos');
    // if (!response.ok) {
    //   throw new Error('Erro ao buscar medicamentos');
    // }
    // return await response.json();

    // Simulando dados para desenvolvimento
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            idproduto: 1,
            nome: "Amoxicilina",
            idtipoproduto: 1,
            idunidademedida: 1,
            fabricante: "FarmaPet",
            composicao: "Amoxicilina 500mg",
            dataValidade: new Date("2025-07-15"), // 15 de julho de 2025
          },
          {
            idproduto: 2,
            nome: "Dipirona",
            idtipoproduto: 2,
            idunidademedida: 2,
            fabricante: "MediPet",
            composicao: "Dipirona sódica 1g/2ml",
            dataValidade: new Date("2024-12-10"), // 10 de dezembro de 2024
          },
          {
            idproduto: 3,
            nome: "Vermífugo",
            idtipoproduto: 3,
            idunidademedida: 3,
            fabricante: "VetPharm",
            composicao: "Praziquantel, pamoato de pirantel",
            dataValidade: new Date("2026-03-20"), // 20 de março de 2026
          },
          {
            idproduto: 4,
            nome: "Prednisolona",
            idtipoproduto: 4,
            idunidademedida: 1,
            fabricante: "PharmaVet",
            composicao: "Prednisolona 20mg",
            dataValidade: new Date("2025-11-30"), // 30 de novembro de 2025
          },
        ]);
      }, 300);
    });
  } catch (error) {
    console.error("Erro ao buscar medicamentos:", error);
    return [];
  }
}

/**
 * Busca todas as unidades de medida
 * @returns Promise com lista de unidades de medida
 */
export async function buscarUnidadesDeMedida(): Promise<UnidadeDeMedida[]> {
  try {
    // Implementação real da API aqui
    // Simulando dados para desenvolvimento
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { idunidademedida: 1, descricao: "ml" },
          { idunidademedida: 2, descricao: "mg" },
          { idunidademedida: 3, descricao: "comprimido" },
          { idunidademedida: 4, descricao: "gota" },
          { idunidademedida: 5, descricao: "aplicação" },
        ]);
      }, 300);
    });
  } catch (error) {
    console.error("Erro ao buscar unidades de medida:", error);
    return [];
  }
}

/**
 * Busca todos os responsáveis
 * @returns Promise com lista de responsáveis
 */
export async function buscarResponsaveis(): Promise<Pessoa[]> {
  try {
    // Implementação real da API aqui
    // Simulando dados para desenvolvimento
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            idpessoa: 1,
            nome: "Dr. Carlos Silva",
            cpf: "123.456.789-00",
            endereco: "Rua das Clínicas, 123",
            telefone: "(11) 98765-4321",
            email: "carlos.silva@vetclinic.com",
          },
          {
            idpessoa: 2,
            nome: "Dra. Ana Souza",
            cpf: "987.654.321-00",
            endereco: "Av. dos Animais, 456",
            telefone: "(11) 91234-5678",
            email: "ana.souza@vetclinic.com",
          },
        ]);
      }, 300);
    });
  } catch (error) {
    console.error("Erro ao buscar responsáveis:", error);
    return [];
  }
}

/**
 * Busca todas as receitas
 * @returns Promise com lista de receitas
 */
export async function buscarReceitas(): Promise<ReceitaMedicamento[]> {
  try {
    // Implementação real da API aqui
    // Simulando dados para desenvolvimento
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            idreceita: 1,
            data: new Date("2025-04-25"),
            medico: "Dr. Carlos Silva",
            clinica: "VetCare",
            animal_idanimal: 1,
          },
          {
            idreceita: 2,
            data: new Date("2025-04-28"),
            medico: "Dra. Ana Souza",
            clinica: "PetSaúde",
            animal_idanimal: 2,
          },
        ]);
      }, 300);
    });
  } catch (error) {
    console.error("Erro ao buscar receitas:", error);
    return [];
  }
}
