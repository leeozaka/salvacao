import { Activable } from './ActivableDTO';
import { TipoUsuario } from '@prisma/client';
import { PessoaDTO } from './PessoaDTO';

export type UsuarioDTO = Activable & {
  id: number;
  tipoUsuario: TipoUsuario;
  senha: string;
  pessoa?: PessoaDTO;
};

export type UsuarioPublicData = Omit<UsuarioDTO, 'senha'>;
