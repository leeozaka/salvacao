export interface Compromisso {
  id: number;
  titulo: string;
  animal: string;
  data: string;
  tipo: "vacinação" | "consulta" | "exame" | "medicação" | string;
  categoria: string;
  concluido: boolean;
  favorito: boolean;
}

export interface CompromissoStats {
  totalCompromissos: number;
  pendentes: number;
  concluidos: number;
  percentualConcluido: number;
  percentualPendente: number;
  crescimentoSemanal: number;
  tendencia: "up" | "down" | "stable";
}

export interface AtividadeRecente {
  id: string;
  titulo: string;
  tempo: string;
  tipo: "vacinação" | "consulta" | "exame" | "medicação" | "sistema" | string;
  animal?: string;
}

export interface DadosDesempenho {
  label: string;
  compromissosConcluidos: number;
  compromissosPendentes: number;
}
