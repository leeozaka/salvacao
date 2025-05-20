import { TipoDocumento, TipoUsuario } from "@/types/enums";

export interface CreatePessoaDTO {
  nome: string;
  documentoIdentidade?: string;
  tipoDocumento?: TipoDocumento;
  email: string;
  telefone?: string;
  endereco?: string;
  tipoUsuario: TipoUsuario;
  senha?: string;
}

export interface UpdatePessoaDTO {
  nome?: string;
  documentoIdentidade?: string;
  tipoDocumento?: TipoDocumento;
  email?: string;
  telefone?: string;
  endereco?: string;
  tipoUsuario?: TipoUsuario;
  senha?: string;
  isActive?: boolean;
  usuarioIsActive?: boolean;
} 