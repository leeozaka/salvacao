import {
  Compromisso,
  AtividadeRecente,
  DadosDesempenho,
} from "@/types/compromissos";

/**
 * Recupera compromissos para exibição no dashboard
 */
export async function getCompromissos() {
  // Simula atraso de API
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Retorna dados de mock
  return [
    {
      id: 1,
      titulo: "Vacina Antirrábica",
      animal: "Rex",
      data: "2025-04-25",
      tipo: "vacinação",
      categoria: "Principal",
      concluido: false,
      favorito: false,
    },
    {
      id: 2,
      titulo: "Consulta de Rotina",
      animal: "Miau",
      data: "2025-04-25",
      tipo: "consulta",
      categoria: "Principal",
      concluido: true,
      favorito: true,
    },
    {
      id: 3,
      titulo: "Exame de Sangue",
      animal: "Totó",
      data: "2025-04-26",
      tipo: "exame",
      categoria: "Principal",
      concluido: false,
      favorito: false,
    },
    {
      id: 4,
      titulo: "Aplicação de Medicamento",
      animal: "Luna",
      data: "2025-04-27",
      tipo: "medicação",
      categoria: "Principal",
      concluido: true,
      favorito: false,
    },
    {
      id: 5,
      titulo: "Vermífugo Trimestral",
      animal: "Bolt",
      data: "2025-04-28",
      tipo: "medicação",
      categoria: "Preventivo",
      concluido: false,
      favorito: true,
    },
    {
      id: 6,
      titulo: "Ultrassom Abdominal",
      animal: "Nina",
      data: "2025-04-29",
      tipo: "exame",
      categoria: "Especialista",
      concluido: false,
      favorito: false,
    },
  ] as Compromisso[];
}

/**
 * Recupera estatísticas para os cards do topo do dashboard
 */
export async function getCompromissosStats() {
  // Simula atraso de API
  await new Promise((resolve) => setTimeout(resolve, 200));

  // Retorna dados de mock
  return {
    totalCompromissos: 24,
    pendentes: 14,
    concluidos: 10,
    percentualConcluido: 41.7,
    percentualPendente: 58.3,
    crescimentoSemanal: 8.2,
    tendencia: "up" as const,
  };
}

/**
 * Recupera dados de atividade recente relacionada aos compromissos
 */
export async function getAtividadesRecentes() {
  // Simula atraso de API
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Retorna dados de mock
  return [
    {
      id: "1",
      titulo: "Compromisso concluído: Consulta de Rotina",
      tempo: "10 minutos atrás",
      tipo: "consulta",
      animal: "Miau",
    },
    {
      id: "2",
      titulo: "Lembrete de medicação enviado",
      tempo: "1 hora atrás",
      tipo: "sistema",
    },
    {
      id: "3",
      titulo: "Novo compromisso criado: Vacinação V10",
      tempo: "2 horas atrás",
      tipo: "vacinação",
      animal: "Bolt",
    },
    {
      id: "4",
      titulo: "Compromisso remarcado: Exame de Sangue",
      tempo: "5 horas atrás",
      tipo: "exame",
      animal: "Totó",
    },
  ] as AtividadeRecente[];
}

/**
 * Recupera dados para o gráfico de desempenho mensal
 */
export async function getDadosDesempenhoMensal() {
  // Simula atraso de API
  await new Promise((resolve) => setTimeout(resolve, 400));

  // Retorna dados de mock para um gráfico
  return [
    { label: "Jan", compromissosConcluidos: 18, compromissosPendentes: 5 },
    { label: "Fev", compromissosConcluidos: 22, compromissosPendentes: 8 },
    { label: "Mar", compromissosConcluidos: 17, compromissosPendentes: 12 },
    { label: "Abr", compromissosConcluidos: 25, compromissosPendentes: 10 },
    { label: "Mai", compromissosConcluidos: 10, compromissosPendentes: 14 },
  ] as DadosDesempenho[];
}

/**
 * Recupera dados para o gráfico de distribuição por tipo de compromisso
 */
export async function getDistribuicaoPorTipo() {
  // Simula atraso de API
  await new Promise((resolve) => setTimeout(resolve, 250));

  // Retorna dados de mock para um gráfico de pizza ou donut
  return [
    { tipo: "vacinação", quantidade: 12, cor: "#3B82F6" }, // azul
    { tipo: "consulta", quantidade: 8, cor: "#10B981" }, // verde
    { tipo: "exame", quantidade: 6, cor: "#8B5CF6" }, // roxo
    { tipo: "medicação", quantidade: 9, cor: "#EC4899" }, // rosa
    { tipo: "outro", quantidade: 3, cor: "#F59E0B" }, // âmbar
  ];
}

/**
 * Recupera lista de animais para filtros e seletores
 */
export async function getAnimais() {
  // Simula atraso de API
  await new Promise((resolve) => setTimeout(resolve, 150));

  // Retorna dados de mock
  return [
    { id: 1, nome: "Rex", especie: "Cachorro", raca: "Labrador" },
    { id: 2, nome: "Miau", especie: "Gato", raca: "Siamês" },
    { id: 3, nome: "Totó", especie: "Cachorro", raca: "Vira-lata" },
    { id: 4, nome: "Luna", especie: "Gato", raca: "Persa" },
    { id: 5, nome: "Bolt", especie: "Cachorro", raca: "Border Collie" },
    { id: 6, nome: "Nina", especie: "Gato", raca: "Maine Coon" },
  ];
}

/**
 * Função para simular a criação de um novo compromisso
 */
export async function criarCompromisso(compromisso: Omit<Compromisso, "id">) {
  // Simula atraso de API
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Simula criação retornando o objeto com um ID gerado
  return {
    ...compromisso,
    id: Math.floor(Math.random() * 1000) + 10,
  };
}

/**
 * Função para simular a atualização de um compromisso existente
 */
export async function atualizarCompromisso(compromisso: Compromisso) {
  // Simula atraso de API
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Simula atualização retornando o objeto atualizado
  return { ...compromisso };
}

/**
 * Função para simular a exclusão de um compromisso
 */
export async function excluirCompromisso(id: number) {
  // Simula atraso de API
  await new Promise((resolve) => setTimeout(resolve, 400));

  // Simula exclusão retornando sucesso
  return { sucesso: true };
}

/**
 * Função para simular a marcação de um compromisso como concluído
 */
export async function marcarComoConcluido(id: number) {
  // Simula atraso de API
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Simula a marcação retornando um status de sucesso
  return { sucesso: true, id };
}

/**
 * Função para simular a mudança do status de favorito de um compromisso
 */
export async function toggleFavorito(id: number) {
  // Simula atraso de API
  await new Promise((resolve) => setTimeout(resolve, 200));

  // Simula a mudança retornando um status de sucesso
  return { sucesso: true, id };
}
