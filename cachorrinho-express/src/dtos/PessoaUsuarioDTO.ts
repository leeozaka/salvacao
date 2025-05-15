import { TipoDocumento, TipoUsuario } from '@prisma/client';

export type PessoaUsuario = {
    id: number;
    nome: string;
    documentoIdentidade?: string | null;
    tipoDocumento?: TipoDocumento | null;
    email?: string | null;
    telefone?: string | null;
    endereco?: string | null;

    usuarioId: number;
    tipoUsuario: TipoUsuario;
    usuarioIsActive: boolean;
    usuarioCreatedAt: Date;
    usuarioUpdatedAt?: Date;
    usuarioDeletedAt?: Date | null;

    pessoaIsActive: boolean;
    pessoaCreatedAt: Date;
    pessoaUpdatedAt?: Date;
    pessoaDeletedAt?: Date | null;
};


export type CreatePessoaUsuarioDTO = {
    nome: string;
    documentoIdentidade?: string | null;
    tipoDocumento?: TipoDocumento | null;
    email?: string | null;
    telefone?: string | null;
    endereco?: string | null;

    tipoUsuario: TipoUsuario;
    senha: string;
};


export type UpdatePessoaUsuarioDTO = Partial<{
    nome: string;
    documentoIdentidade: string | null;
    tipoDocumento: TipoDocumento | null;
    email: string | null;
    telefone: string | null;
    endereco: string | null;
    pessoaIsActive: boolean;

    tipoUsuario: TipoUsuario;
    senha: string;
    usuarioIsActive: boolean;
}>; 