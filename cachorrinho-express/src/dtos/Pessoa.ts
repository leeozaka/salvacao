import { Usuario } from './Usuario';
import { TipoDocumento } from '@prisma/client';

export interface Pessoa {
  id: number;
  nome: string;
  documentoIdentidade?: string | null;
  tipoDocumento?: TipoDocumento | null;
  email?: string | null;
  telefone?: string | null;
  endereco?: string | null;

  usuarioId: number;
  usuario?: Usuario;
} 