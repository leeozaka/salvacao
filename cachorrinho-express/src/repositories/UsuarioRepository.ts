import { PrismaClient, Prisma, Pessoa, Usuario, TipoDocumento, TipoUsuario } from '@prisma/client';
import {
  PessoaUsuario,
  CreatePessoaUsuarioDTO,
  UpdatePessoaUsuarioDTO,
} from '../dtos/PessoaUsuarioDTO';

export class UsuarioRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreatePessoaUsuarioDTO): Promise<PessoaUsuario> {
    try {
      const newPessoa = await this.prisma.pessoa.create({
        data: {
          nome: data.nome,
          documentoIdentidade: data.documentoIdentidade,
          tipoDocumento: data.tipoDocumento,
          email: data.email,
          telefone: data.telefone,
          endereco: data.endereco,
          isActive: true,
          usuario: {
            create: {
              tipoUsuario: data.tipoUsuario,
              senha: data.senha,
              isActive: true,
            },
          },
        },
        include: {
          usuario: true,
        },
      });

      if (!newPessoa.usuario) {
        throw new Error('Failed to create associated Usuario record.');
      }

      return this.mapToPessoaUsuario(newPessoa, newPessoa.usuario);
    } catch (error) {
      console.error('Error creating user:', error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          const target = error.meta?.target as string[] | undefined;
          if (target?.includes('email')) {
            throw new Error(`Email '${data.email}' already exists.`);
          }
          if (target?.includes('documento_identidade')) {
            throw new Error(`Documento '${data.documentoIdentidade}' already exists.`);
          }
        }
      }
      throw new Error(
        `Error creating user: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async findOne(pessoaId: number): Promise<PessoaUsuario | null> {
    try {
      const pessoa = await this.prisma.pessoa.findUnique({
        where: {
          id: pessoaId,
          isActive: true,
          deletedAt: null,
        },
        include: {
          usuario: {
            where: {
              isActive: true,
              deletedAt: null,
            },
          },
        },
      });

      if (!pessoa || !pessoa.usuario) {
        return null;
      }

      return this.mapToPessoaUsuario(pessoa, pessoa.usuario);
    } catch (error) {
      console.error(`Error finding user by ID ${pessoaId}:`, error);
      throw error instanceof Error ? error : new Error(`Error finding user: ${String(error)}`);
    }
  }

  async findAll(buscarPessoas: boolean): Promise<PessoaUsuario[]> {
    try {
      const where: Prisma.PessoaWhereInput = {
        isActive: true,
        deletedAt: null,
        usuario: {
          isActive: true,
          deletedAt: null,
        },
        ...(buscarPessoas && {
          NOT: {
            adotante: {
              deletedAt: null
            }
          }
        })
      };

      const pessoas = await this.prisma.pessoa.findMany({
        where: where,
        include: {
          usuario: true,
        },
        orderBy: {
          nome: 'asc',
        },
      });

      return pessoas
        .filter((p) => p.usuario && p.usuario.isActive && !p.usuario.deletedAt)
        .map((p) => this.mapToPessoaUsuario(p, p.usuario!));
    } catch (error) {
      console.error('Error finding all users:', error);
      throw new Error(`Error finding all users: ${String(error)}`);
    }
  }

  async update(pessoaId: number, data: UpdatePessoaUsuarioDTO): Promise<PessoaUsuario | null> {
    try {
      const pessoaUpdateData: Prisma.PessoaUpdateInput = {};
      const usuarioUpdateData: Prisma.UsuarioUpdateInput = {};

      if (data.nome !== undefined) pessoaUpdateData.nome = data.nome;
      if (data.documentoIdentidade !== undefined)
        pessoaUpdateData.documentoIdentidade = data.documentoIdentidade;
      if (data.tipoDocumento !== undefined) pessoaUpdateData.tipoDocumento = data.tipoDocumento;
      if (data.email !== undefined) pessoaUpdateData.email = data.email;
      if (data.telefone !== undefined) pessoaUpdateData.telefone = data.telefone;
      if (data.endereco !== undefined) pessoaUpdateData.endereco = data.endereco;
      if (data.pessoaIsActive !== undefined) pessoaUpdateData.isActive = data.pessoaIsActive;

      if (data.tipoUsuario !== undefined) usuarioUpdateData.tipoUsuario = data.tipoUsuario;
      if (data.senha !== undefined) usuarioUpdateData.senha = data.senha;
      if (data.usuarioIsActive !== undefined) usuarioUpdateData.isActive = data.usuarioIsActive;

      const hasPessoaUpdates = Object.keys(pessoaUpdateData).length > 0;
      const hasUsuarioUpdates = Object.keys(usuarioUpdateData).length > 0;

      if (!hasPessoaUpdates && !hasUsuarioUpdates) {
        console.warn(`Update called for Pessoa ID ${pessoaId} with no data changes.`);
        return this.findOne(pessoaId);
      }

      const updatedPessoa = await this.prisma.$transaction(async (tx) => {
        const existingPessoa = await tx.pessoa.findUnique({
          where: { id: pessoaId, isActive: true, deletedAt: null },
          include: { usuario: true },
        });

        if (!existingPessoa) {
          throw new Error(`Pessoa with ID ${pessoaId} not found or is inactive/deleted.`);
        }
        if (
          !existingPessoa.usuario ||
          !existingPessoa.usuario.isActive ||
          existingPessoa.usuario.deletedAt
        ) {
          throw new Error(`Associated active Usuario for Pessoa ID ${pessoaId} not found.`);
        }

        let finalPessoa: Pessoa & { usuario?: Usuario | null } = existingPessoa as any;

        if (hasPessoaUpdates) {
          await tx.pessoa.update({
            where: { id: pessoaId },
            data: { ...pessoaUpdateData, updatedAt: new Date() },
          });
        }

        if (hasUsuarioUpdates) {
          await tx.usuario.update({
            where: { idPessoa: pessoaId },
            data: { ...usuarioUpdateData, updatedAt: new Date() },
          });
        }

        finalPessoa = await tx.pessoa.findUniqueOrThrow({
          where: { id: pessoaId },
          include: { usuario: true },
        });

        return finalPessoa;
      });

      if (!updatedPessoa.usuario) {
        throw new Error(`Usuario data missing after update for Pessoa ID ${pessoaId}`);
      }

      return this.mapToPessoaUsuario(updatedPessoa, updatedPessoa.usuario);
    } catch (error) {
      console.error(`Error updating user ${pessoaId}:`, error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error(
            `Record to update not found for Pessoa ID ${pessoaId}. It might have been deleted or deactivated.`,
          );
        }
        if (error.code === 'P2002') {
          const target = error.meta?.target as string[] | undefined;
          throw new Error(
            `Update failed due to unique constraint violation on field(s): ${target?.join(', ')}`,
          );
        }
      }
      throw error instanceof Error ? error : new Error(`Error updating user: ${String(error)}`);
    }
  }

  async delete(pessoaId: number): Promise<boolean> {
    try {
      const now = new Date();

      const result = await this.prisma.$transaction(async (tx) => {
        const usuarioUpdate = await tx.usuario.updateMany({
          where: {
            idPessoa: pessoaId,
            deletedAt: null,
          },
          data: {
            deletedAt: now,
            isActive: false,
            updatedAt: now,
          },
        });

        const pessoaUpdate = await tx.pessoa.updateMany({
          where: {
            id: pessoaId,
            deletedAt: null,
          },
          data: {
            deletedAt: now,
            isActive: false,
            updatedAt: now,
          },
        });

        return usuarioUpdate.count > 0 || pessoaUpdate.count > 0;
      });

      return result;
    } catch (error) {
      console.error(`Error soft deleting user ${pessoaId}:`, error);
      throw error instanceof Error ? error : new Error(`Error deleting user: ${String(error)}`);
    }
  }

  async findByDocumento(documento: string): Promise<PessoaUsuario | null> {
    try {
      const pessoa = await this.prisma.pessoa.findUnique({
        where: {
          documentoIdentidade: documento,
          deletedAt: null,
        },
        include: {
          usuario: {
            where: {
              isActive: true,
              deletedAt: null,
            },
          },
        },
      });

      if (!pessoa || !pessoa.usuario) {
        return null;
      }

      return this.mapToPessoaUsuario(pessoa, pessoa.usuario);
    } catch (error) {
      console.error(`Error finding user by documento ${documento}:`, error);
      throw error instanceof Error
        ? error
        : new Error(`Error finding by documento: ${String(error)}`);
    }
  }

  async findByEmail(email: string): Promise<PessoaUsuario | null> {
    try {
      const pessoa = await this.prisma.pessoa.findUnique({
        where: {
          email: email,
          isActive: true,
          deletedAt: null,
        },
        include: {
          usuario: {
            where: {
              isActive: true,
              deletedAt: null,
            },
          },
        },
      });

      if (!pessoa || !pessoa.usuario) {
        return null;
      }

      return this.mapToPessoaUsuario(pessoa, pessoa.usuario);
    } catch (error) {
      console.error(`Error finding user by email ${email}:`, error);
      throw error instanceof Error ? error : new Error(`Error finding by email: ${String(error)}`);
    }
  }

  async findByEmailForAuth(email: string): Promise<(PessoaUsuario & { senha?: string }) | null> {
    try {
      const pessoa = await this.prisma.pessoa.findUnique({
        where: {
          email: email,
          isActive: true,
          deletedAt: null,
        },
        include: {
          usuario: {
            where: {
              isActive: true,
              deletedAt: null,
            },
          },
        },
      });

      if (!pessoa || !pessoa.usuario) {
        return null;
      }

      const pessoaUsuario = this.mapToPessoaUsuario(pessoa, pessoa.usuario);
      return {
        ...pessoaUsuario,
        senha: pessoa.usuario.senha,
      };
    } catch (error) {
      console.error(`Error finding user by email for auth (${email}):`, error);
      throw new Error('Error during authentication lookup.');
    }
  }

  async isFirstUser(): Promise<boolean> {
    try {
      const count = await this.prisma.usuario.count({
        where: {
          isActive: true,
          deletedAt: null,
        },
      });
      return count === 0;
    } catch (error) {
      console.error('Error checking for first user:', error);
      throw new Error(`Error checking for first user: ${String(error)}`);
    }
  }

  private mapToPessoaUsuario(pessoa: Pessoa, usuario: Usuario): PessoaUsuario {
    return {
      id: pessoa.id,
      nome: pessoa.nome,
      documentoIdentidade: pessoa.documentoIdentidade,
      tipoDocumento: pessoa.tipoDocumento as TipoDocumento | null,
      email: pessoa.email,
      telefone: pessoa.telefone,
      endereco: pessoa.endereco,
      pessoaIsActive: pessoa.isActive,
      pessoaCreatedAt: pessoa.createdAt,
      pessoaUpdatedAt: pessoa.updatedAt,
      pessoaDeletedAt: pessoa.deletedAt,
      usuarioId: usuario.id,
      tipoUsuario: usuario.tipoUsuario as TipoUsuario,
      usuarioIsActive: usuario.isActive,
      usuarioCreatedAt: usuario.createdAt,
      usuarioUpdatedAt: usuario.updatedAt,
      usuarioDeletedAt: usuario.deletedAt,
    };
  }
}
