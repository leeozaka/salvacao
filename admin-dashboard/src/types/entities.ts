export interface Pessoa {
  idpessoa: number;
  nome: string;
  cpf: string;
  endereco: string;
  telefone: string;
  email: string;
}

export interface Usuario {
  pessoa_idpessoa: number; // Chave primária e estrangeira
  login: string;
  senha: string;
}

export interface TipoProduto {
  idtipoproduto: number;
  descricao: string;
  controlaValidade: boolean;
}

export interface UnidadeDeMedida {
  idunidademedida: number;
  descricao: string;
}

export interface Produto {
  idproduto: number;
  nome: string;
  idtipoproduto: number; // Chave estrangeira para TipoProduto
  idunidademedida: number; // Chave estrangeira para UnidadeDeMedida
  fabricante: string;
  dataValidade: Date | null;
}

export interface Medicamento extends Produto {
  composicao: string;
}

export interface Vacina extends Produto {
  lote: string;
  validade: Date;
}

export interface Estoque {
  idestoque: number;
  idproduto: number; // Chave estrangeira para Produto
  quantidade: number;
}

export interface EntradaProduto {
  produto_idproduto: number; // Parte da chave primária composta, chave estrangeira para Produto
  usuario_pessoa_idpessoa: number; // Parte da chave primária composta, chave estrangeira para Usuario
  data: Date;
  quantidade: number;
  obs: string;
}

export interface TipoSaida {
  idtiposaida: number;
  descricao: string;
}

export interface SaidaProduto {
  produto_idproduto: number; // Parte da chave primária composta, chave estrangeira para Produto
  usuario_pessoa_idpessoa: number; // Parte da chave primária composta, chave estrangeira para Usuario
  data: Date;
  quantidade: number;
  obs: string;
  idtiposaida: number; // chave estrangeira
}

export interface Animal {
  idanimal: number;
  nome: string;
  especie: string;
  idade: number;
  idhistorico: number; // Chave estrangeira para Historico
  raca: string;
}

export interface Historico {
  idhistorico: number;
  descricao: string;
  data: Date;
  animal_idanimal: number; // Chave estrangeira para Animal
  vacinacao_idvacinacao: number; // Chave estrangeira para Vacinacao
  medicacao_idmedicacao: number; // Chave estrangeira para Medicacao
}

export interface Adocao {
  idadocao: number;
  idadotante: number;
  idanimal: number; // Chave estrangeira para Animal
  dataadocao: Date;
  pessoa_idpessoa: number; // Chave estrangeira para Pessoa
  obs: string;
}

export interface ReceitaMedicamento {
  idreceita: number;
  data: Date;
  medico: string;
  clinica: string;
  animal_idanimal: number; // Chave estrangeira para Animal
}

export interface Posologia {
  medicamento_idproduto: number; // Parte da chave primária composta, chave estrangeira para Medicamento
  receitamedicamento_idreceita: number; // Parte da chave primária composta, chave estrangeira para ReceitaMedicamento
  dose: string;
  quantidadedias: number;
  intervalohoras: number;
}

export interface Medicacao {
  idmedicacao: number;
  idanimal: number; // Chave estrangeira para Animal
  idhistorico: number; // Chave estrangeira para Historico
  posologia_medicamento_idproduto: number; // Parte de chave estrangeira composta para Posologia
  posologia_receitamedicamento_idreceita: number; // Parte de chave estrangeira composta para Posologia
  data: Date;
}

export interface Vacinacao {
  idvacinacao: number;
  idvacina: number; // Chave estrangeira para Vacina
  idanimal: number; // Chave estrangeira para Animal
  idhistorico: number; // Chave estrangeira para Historico
  data: Date;
  local: string;
}

export interface AgendaVacinacao {
  idagendavacinacao: number;
  animal_idanimal: number; // Chave estrangeira para Animal
  vacina_idproduto: number; // Chave estrangeira para Vacina
  data: Date;
  motivo: string;
  usuario_pessoa_idpessoa: number; // Chave estrangeira para Usuario
}

export interface Evento {
  idevento: number;
  descricao: string;
  data: Date;
  foto: string; // Considerei como string para representar um caminho de arquivo ou URL
  animal_idanimal: number; // Chave estrangeira para Animal
  local: string;
}
