import { PrismaClient, Prisma, Pessoa, Usuario } from '@prisma/client';
import {
  PessoaDTO,
  CreatePessoaDTO,
  UpdatePessoaDTO,
} from '../dtos/PessoaDTO';

export class UsuarioRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreatePessoaDTO): Promise<PessoaDTO> {
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

      return this.mapToPessoaDTO(newPessoa, newPessoa.usuario);
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

  async findOne(pessoaId: number): Promise<PessoaDTO | null> {
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

      return this.mapToPessoaDTO(pessoa, pessoa.usuario);
    } catch (error) {
      console.error(`Error finding user by ID ${pessoaId}:`, error);
      throw error instanceof Error ? error : new Error(`Error finding user: ${String(error)}`);
    }
  }

  async findAll(buscarPessoas: boolean): Promise<PessoaDTO[]> {
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
        .map((p) => this.mapToPessoaDTO(p, p.usuario!));
    } catch (error) {
      console.error('Error finding all users:', error);
      throw new Error(`Error finding all users: ${String(error)}`);
    }
  }

  async update(pessoaId: number, data: UpdatePessoaDTO): Promise<PessoaDTO | null> {
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
      if (data.isActive !== undefined) pessoaUpdateData.isActive = data.isActive;

      if (data.tipoUsuario !== undefined) usuarioUpdateData.tipoUsuario = data.tipoUsuario;
      if (data.senha !== undefined) usuarioUpdateData.senha = data.senha;
      if (data.usuarioIsActive !== undefined) usuarioUpdateData.isActive = data.usuarioIsActive;
      if (data.usuarioCreatedAt !== undefined) usuarioUpdateData.createdAt = data.usuarioCreatedAt;
      if (data.usuarioUpdatedAt !== undefined) usuarioUpdateData.updatedAt = data.usuarioUpdatedAt;
      if (data.usuarioDeletedAt !== undefined) usuarioUpdateData.deletedAt = data.usuarioDeletedAt;

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

        let finalPessoa: Pessoa & { usuario?: Usuario | null } = existingPessoa as Pessoa & { usuario?: Usuario | null };

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

      return this.mapToPessoaDTO(updatedPessoa, updatedPessoa.usuario);
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

  async findByDocumento(documento: string): Promise<PessoaDTO | null> {
    try {
      const pessoa = await this.prisma.pessoa.findFirst({
        where: {
          documentoIdentidade: documento,
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

      return this.mapToPessoaDTO(pessoa, pessoa.usuario);
    } catch (error) {
      console.error(`Error finding user by document ${documento}:`, error);
      throw error instanceof Error ? error : new Error(`Error finding user: ${String(error)}`);
    }
  }

  async findByEmail(email: string): Promise<PessoaDTO | null> {
    try {
      const pessoa = await this.prisma.pessoa.findFirst({
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

      return this.mapToPessoaDTO(pessoa, pessoa.usuario);
    } catch (error) {
      console.error(`Error finding user by email ${email}:`, error);
      throw error instanceof Error ? error : new Error(`Error finding user: ${String(error)}`);
    }
  }

  async findByEmailForAuth(email: string): Promise<(PessoaDTO & { senha?: string }) | null> {
    try {
      const pessoa = await this.prisma.pessoa.findFirst({
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
            select: {
              id: true,
              tipoUsuario: true,
              senha: true,
              isActive: true,
              createdAt: true,
              updatedAt: true,
              deletedAt: true,
            },
          },
        },
      });

      if (!pessoa || !pessoa.usuario) {
        return null;
      }

      const pessoaDTO = this.mapToPessoaDTO(pessoa, { ...pessoa.usuario, idPessoa: pessoa.id });
      return {
        ...pessoaDTO,
        senha: pessoa.usuario.senha,
      };
    } catch (error) {
      console.error(`Error finding user by email ${email} for auth:`, error);
      throw error instanceof Error ? error : new Error(`Error finding user: ${String(error)}`);
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
      console.error('Error checking if first user:', error);
      throw error instanceof Error ? error : new Error(`Error checking first user: ${String(error)}`);
    }
  }

  private mapToPessoaDTO(pessoa: Pessoa, usuario: Usuario): PessoaDTO {
    return {
      id: pessoa.id,
      nome: pessoa.nome,
      documentoIdentidade: pessoa.documentoIdentidade,
      tipoDocumento: pessoa.tipoDocumento,
      email: pessoa.email,
      telefone: pessoa.telefone,
      endereco: pessoa.endereco,
      isActive: pessoa.isActive,
      createdAt: pessoa.createdAt,
      updatedAt: pessoa.updatedAt,
      deletedAt: pessoa.deletedAt,
      usuario: {
        id: usuario.id,
        tipoUsuario: usuario.tipoUsuario,
        senha: usuario.senha,
        isActive: usuario.isActive,
        createdAt: usuario.createdAt,
        updatedAt: usuario.updatedAt,
        deletedAt: usuario.deletedAt,
      },
    };
  }
}
