import {
  TipoDocumento,
  TipoUsuario,
  SexoAnimal,
  PorteAnimal,
  StatusAnimal,
  StatusAdocao,
  TipoMoradia,
  StatusAgendamento,
  TipoCompromisso,
  TipoDoacao,
  TipoInteracao,
  ViaAdministracaoMedicamento,
} from "./enums";

export interface ActivableEntity {
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface Pessoa extends ActivableEntity {
  id: number;
  nome: string;
  documentoIdentidade?: string;
  tipoDocumento?: TipoDocumento;
  email?: string;
  telefone?: string;
  endereco?: string;
}

export interface Usuario extends ActivableEntity {
  id: number;
  idPessoa: number;
  tipoUsuario: TipoUsuario;
  senha: string;
  pessoa: Pessoa;
}

export interface Adotante extends ActivableEntity {
  id: number;
  idPessoa: number;
  motivacaoAdocao?: string;
  experienciaAnteriorAnimais?: string;
  tipoMoradia?: TipoMoradia;
  permiteAnimaisMoradia?: boolean;
  pessoa: Pessoa;
  adocoes?: Adocao[];
}

export interface TipoProduto extends ActivableEntity {
  id: number;
  nome: string;
  descricao?: string;
}

export interface UnidadeMedida extends ActivableEntity {
  id: number;
  nome: string;
  sigla: string;
}

// Forward declare the Produto type
export type Produto = {
  id: number;
  nome: string;
  idTipoProduto: number;
  idUnidadeMedidaPadrao: number;
  descricao?: string;
  codigoBarras?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  tipoProduto: TipoProduto;
  unidadeMedidaPadrao: UnidadeMedida;
  medicamentoDetalhe?: MedicamentoDetalhe;
  vacinaDetalhe?: VacinaDetalhe;
};

export interface MedicamentoDetalhe extends ActivableEntity {
  idProduto: number;
  dosagem?: string;
  principioAtivo?: string;
  fabricante?: string;
  necessitaReceita?: boolean;
  produto: Produto;
}

export interface VacinaDetalhe extends ActivableEntity {
  idProduto: number;
  tipoVacina: string;
  fabricante?: string;
  numeroDosesSerie?: number;
  intervaloEntreDosesDias?: number;
  produto: Produto;
}

export interface Vacina extends Produto {
  lote: string;
  validade: Date;
}

export interface Estoque extends ActivableEntity {
  id: number;
  idProduto: number;
  quantidade: number;
  idUnidadeMedida: number;
  lote?: string;
  dataValidade?: Date;
  dataEntradaEstoque: Date;
  precoCusto?: number;
  produto: Produto;
  unidadeMedida: UnidadeMedida;
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

export interface Animal extends ActivableEntity {
  id: number;
  nome?: string;
  raca?: string;
  dataNascimentoEstimada?: Date;
  sexo?: SexoAnimal;
  cor?: string;
  pelagem?: string;
  porte?: PorteAnimal;
  microchipId?: string;
  esterilizado?: boolean;
  dataEsterilizacao?: Date;
  statusAnimal: StatusAnimal;
  dataResgate?: Date;
  localResgate?: string;
  descricaoComportamental?: string;
  observacoesSaudeEntrada?: string;
  fotoPrincipalUrl?: string;
}

export interface HistoricoAnimal {
  id: number;
  idAnimal: number;
  dataEvento: Date;
  tipoEvento: string;
  descricaoDetalhada: string;
  idUsuarioResponsavel?: number;
  animal: Animal;
  usuarioResponsavel?: Usuario;
}

export interface Adocao extends ActivableEntity {
  id: number;
  idAdotante: number;
  idAnimal: number;
  dataSolicitacaoAdocao: Date;
  dataEfetivacaoAdocao?: Date;
  statusAdocao: StatusAdocao;
  observacoesProcesso?: string;
  idUsuarioResponsavel?: number;
  adotante: Adotante;
  animal: Animal;
  usuarioResponsavel?: Usuario;
}

export interface Posologia extends ActivableEntity {
  id: number;
  descricaoPosologia: string;
  dose: string;
  frequenciaHoras?: number;
  duracaoDias?: number;
}

export interface Receita extends ActivableEntity {
  id: number;
  idAnimal: number;
  idVeterinarioUsuario: number;
  dataEmissao: Date;
  instrucoesAdicionais?: string;
  validadeReceita?: Date;
  animal: Animal;
  veterinarioUsuario: Usuario;
  itens: ReceitaItem[];
}

export interface ReceitaItem extends ActivableEntity {
  id: number;
  idReceita: number;
  idMedicamentoProduto: number;
  idPosologia?: number;
  posologiaCustomizadaInstrucoes?: string;
  quantidadePrescrita?: string;
  observacoes?: string;
  receita: Receita;
  medicamentoProduto: Produto;
  posologia?: Posologia;
}

export interface AdministracaoMedicamento extends ActivableEntity {
  id: number;
  idAnimal: number;
  idMedicamentoProduto: number;
  idReceitaItem?: number;
  dataAdministracao: Date;
  doseAdministrada: string;
  viaAdministracao?: ViaAdministracaoMedicamento;
  idUsuarioAdministrador: number;
  idEstoqueUtilizado?: number;
  observacoes?: string;
  animal: Animal;
  medicamentoProduto: Produto;
  receitaItem?: ReceitaItem;
  usuarioAdministrador: Usuario;
  estoqueUtilizado?: Estoque;
}

export interface RegistroVacinacao extends ActivableEntity {
  id: number;
  idAnimal: number;
  idVacinaProduto: number;
  idEstoqueUtilizado?: number;
  dataVacinacao: Date;
  doseAplicada?: string;
  proximaDoseDataPrevista?: Date;
  idProfissionalResponsavelUsuario: number;
  localAplicacao?: string;
  observacoes?: string;
  animal: Animal;
  vacinaProduto: Produto;
  estoqueUtilizado?: Estoque;
  profissionalResponsavelUsuario: Usuario;
}

export interface AgendamentoCompromisso extends ActivableEntity {
  id: number;
  idAnimal: number;
  tipoCompromisso: TipoCompromisso;
  idProdutoAssociado?: number;
  dataHoraAgendada: Date;
  statusAgendamento: StatusAgendamento;
  idUsuarioResponsavelAgendamento?: number;
  idUsuarioProfissionalDesignado?: number;
  observacoes?: string;
  animal: Animal;
  produtoAssociado?: Produto;
  usuarioResponsavelAgendamento?: Usuario;
  usuarioProfissionalDesignado?: Usuario;
}

export interface LarTemporario extends ActivableEntity {
  id: number;
  idAnimal: number;
  idPessoaResponsavel: number;
  dataInicio: Date;
  dataFimPrevista?: Date;
  dataFimReal?: Date;
  condicoesAcordadas?: string;
  observacoes?: string;
  animal: Animal;
  pessoaResponsavel: Pessoa;
}

export interface Doacao extends ActivableEntity {
  id: number;
  idPessoaDoador?: number;
  nomeDoadorAnonimo?: string;
  dataDoacao: Date;
  tipoDoacao: TipoDoacao;
  descricaoDoacao?: string;
  valorMonetario?: number;
  idProdutoDoado?: number;
  idEstoqueDoado?: number;
  quantidadeProdutoDoado?: number;
  idUnidadeMedidaProdutoDoado?: number;
  idUsuarioRecebedor: number;
  pessoaDoador?: Pessoa;
  produtoDoado?: Produto;
  estoqueDoado?: Estoque;
  unidadeMedidaProdutoDoado?: UnidadeMedida;
  usuarioRecebedor: Usuario;
}

export interface TipoDespesa extends ActivableEntity {
  id: number;
  nome: string;
  descricao?: string;
}

export interface Despesa extends ActivableEntity {
  id: number;
  dataDespesa: Date;
  descricao: string;
  valor: number;
  idTipoDespesa: number;
  idAnimalAssociado?: number;
  idFornecedorPessoa?: number;
  comprovanteUrl?: string;
  idUsuarioRegistrou: number;
  tipoDespesa: TipoDespesa;
  animalAssociado?: Animal;
  fornecedorPessoa?: Pessoa;
  usuarioRegistrou: Usuario;
}

export interface FotoAnimal extends ActivableEntity {
  id: number;
  idAnimal: number;
  urlFoto: string;
  legenda?: string;
  dataUpload: Date;
  isPrincipal?: boolean;
  animal: Animal;
}

export interface InteracaoAcompanhamento extends ActivableEntity {
  id: number;
  idAnimal: number;
  idAdocao?: number;
  idLarTemporario?: number;
  dataInteracao: Date;
  tipoInteracao: TipoInteracao;
  resumoInteracao: string;
  idUsuarioResponsavel: number;
  animal: Animal;
  adocao?: Adocao;
  larTemporario?: LarTemporario;
  usuarioResponsavel: Usuario;
}

// Interface para representar um endereço, no banco esta como string
/* interface Endereco {
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
} */
