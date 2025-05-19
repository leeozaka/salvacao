import { TipoDocumento, TipoUsuario } from '@prisma/client';
import { UsuarioDTO } from './UsuarioDTO';
import { Activable } from './ActivableDTO';

export type PessoaDTO = Activable & {
  id: number;
  nome: string;
  documentoIdentidade?: string | null;
  tipoDocumento?: TipoDocumento | null;
  email?: string | null;
  telefone?: string | null;
  endereco?: string | null;
  usuario?: UsuarioDTO;
};

export type CreatePessoaDTO = {
  nome: string;
  documentoIdentidade?: string | null;
  tipoDocumento?: TipoDocumento | null;
  email?: string | null;
  telefone?: string | null;
  endereco?: string | null;

  tipoUsuario: TipoUsuario;
  senha: string;
};

export type UpdatePessoaDTO = Partial<{
  nome: string;
  documentoIdentidade: string | null;
  tipoDocumento: TipoDocumento | null;
  email: string | null;
  telefone: string | null;
  endereco: string | null;
  isActive: boolean;

  tipoUsuario: TipoUsuario;
  senha: string;
  usuarioIsActive: boolean;
  usuarioCreatedAt: Date;
  usuarioUpdatedAt: Date;
  usuarioDeletedAt: Date | null;
}>;
