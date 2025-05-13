import { Pessoa } from './Pessoa';
import { TipoUsuario } from '@prisma/client';

export interface Usuario {
  id: number;
  tipoUsuario: TipoUsuario;
  senha: string;
  pessoa?: Pessoa;
}

export type UsuarioPublicData = Omit<Usuario, 'senha'>; 