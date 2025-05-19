import { PrismaClient, Prisma } from '@prisma/client';
import { MedicamentoDTO, CreateMedicamentoDTO, UpdateMedicamentoDTO } from '../dtos/MedicamentoDTO';

export class MedicamentoRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateMedicamentoDTO): Promise<MedicamentoDTO> {
    try {
      const newMedicamento = await this.prisma.$transaction(
        async (tx: Prisma.TransactionClient) => {
          // Primeiro, criar o Produto
          const produto = await tx.produto.create({
            data: {
              nome: data.nome,
              idTipoProduto: data.idTipoProduto,
              idUnidadeMedidaPadrao: Number(data.idUnidadeMedidaPadrao),
              descricao: data.descricao,
              codigoBarras: new Date().getTime().toString(), // TODO: código de barras
              isActive: true,
            },
          });

          await tx.medicamentoDetalhe.create({
            data: {
              idProduto: produto.id,
              dosagem: data.dosagem,
              principioAtivo: data.principioAtivo,
              fabricante: data.fabricante,
              necessitaReceita: data.necessitaReceita,
            },
          });

          return await tx.produto.findUnique({
            where: { id: produto.id },
            include: {
              medicamentoDetalhe: true,
              tipoProduto: true,
              unidadeMedidaPadrao: true,
            },
          });
        },
      );

      if (!newMedicamento || !newMedicamento.medicamentoDetalhe) {
        throw new Error('Falha ao criar o medicamento com seus detalhes.');
      }

      return this.mapToMedicamento(newMedicamento);
    } catch (error) {
      console.error('Erro ao criar medicamento:', error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          const target = error.meta?.target as string[] | undefined;
          if (target?.includes('codigo_barras')) {
            throw new Error(`Código de barras '${data.codigoBarras}' já existe.`);
          }
          if (target?.includes('nome')) {
            throw new Error(`Já existe um produto com o nome '${data.nome}' na mesma categoria.`);
          }
        }
      }
      throw new Error(
        `Erro ao criar medicamento: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async findOne(id: number): Promise<MedicamentoDTO | null> {
    try {
      const produto = await this.prisma.produto.findUnique({
        where: {
          id: id,
          isActive: true,
          deletedAt: null,
        },
        include: {
          medicamentoDetalhe: true,
          tipoProduto: true,
          unidadeMedidaPadrao: true,
        },
      });

      if (!produto || !produto.medicamentoDetalhe) {
        return null;
      }

      return this.mapToMedicamento(produto);
    } catch (error) {
      console.error(`Erro ao buscar medicamento por ID ${id}:`, error);
      throw error instanceof Error
        ? error
        : new Error(`Erro ao buscar medicamento: ${String(error)}`);
    }
  }

  async findAll(filter?: Partial<MedicamentoDTO>): Promise<MedicamentoDTO[]> {
    try {
      const where: Prisma.ProdutoWhereInput = {
        isActive: true,
        deletedAt: null,
        medicamentoDetalhe: {
          isNot: null,
        },
      };

      if (filter) {
        if (filter.nome) where.nome = { contains: filter.nome, mode: 'insensitive' };
        if (filter.principioAtivo) {
          where.medicamentoDetalhe = {
            ...(where.medicamentoDetalhe as object),
            principioAtivo: { contains: filter.principioAtivo, mode: 'insensitive' },
          };
        }
        if (filter.fabricante) {
          where.medicamentoDetalhe = {
            ...(where.medicamentoDetalhe as object),
            fabricante: { contains: filter.fabricante, mode: 'insensitive' },
          };
        }
      }

      const produtos = await this.prisma.produto.findMany({
        where: where,
        include: {
          medicamentoDetalhe: true,
          tipoProduto: true,
          unidadeMedidaPadrao: true,
        },
        orderBy: {
          nome: 'asc',
        },
      });

      return produtos.filter((p) => p.medicamentoDetalhe).map((p) => this.mapToMedicamento(p));
    } catch (error) {
      console.error('Erro ao buscar todos os medicamentos:', error);
      throw new Error(`Erro ao buscar medicamentos: ${String(error)}`);
    }
  }

  async update(id: number, data: UpdateMedicamentoDTO): Promise<MedicamentoDTO | null> {
    try {
      const updatedMedicamento = await this.prisma.$transaction(
        async (tx: Prisma.TransactionClient) => {
          const existingProduto = await tx.produto.findUnique({
            where: { id: id, isActive: true, deletedAt: null },
            include: { medicamentoDetalhe: true },
          });

          if (!existingProduto || !existingProduto.medicamentoDetalhe) {
            throw new Error(`Medicamento com ID ${id} não encontrado ou está inativo/excluído.`);
          }

          const produtoData: Prisma.ProdutoUpdateInput = {};
          if (data.nome !== undefined) produtoData.nome = data.nome;
          if (data.idTipoProduto !== undefined)
            produtoData.tipoProduto = { connect: { id: data.idTipoProduto } };
          if (data.idUnidadeMedidaPadrao !== undefined)
            produtoData.unidadeMedidaPadrao = { connect: { id: data.idUnidadeMedidaPadrao } };
          if (data.descricao !== undefined) produtoData.descricao = data.descricao;
          if (data.codigoBarras !== undefined) produtoData.codigoBarras = data.codigoBarras;
          if (data.isActive !== undefined) produtoData.isActive = data.isActive;

          if (Object.keys(produtoData).length > 0) {
            await tx.produto.update({
              where: { id: id },
              data: { ...produtoData, updatedAt: new Date() },
            });
          }

          const medicamentoDetalheData: Prisma.MedicamentoDetalheUpdateInput = {};
          if (data.dosagem !== undefined) medicamentoDetalheData.dosagem = data.dosagem;
          if (data.principioAtivo !== undefined)
            medicamentoDetalheData.principioAtivo = data.principioAtivo;
          if (data.fabricante !== undefined) medicamentoDetalheData.fabricante = data.fabricante;
          if (data.necessitaReceita !== undefined)
            medicamentoDetalheData.necessitaReceita = data.necessitaReceita;

          if (Object.keys(medicamentoDetalheData).length > 0) {
            await tx.medicamentoDetalhe.update({
              where: { idProduto: id },
              data: { ...medicamentoDetalheData, updatedAt: new Date() },
            });
          }

          return await tx.produto.findUnique({
            where: { id: id },
            include: {
              medicamentoDetalhe: true,
              tipoProduto: true,
              unidadeMedidaPadrao: true,
            },
          });
        },
      );

      if (!updatedMedicamento || !updatedMedicamento.medicamentoDetalhe) {
        return null;
      }

      return this.mapToMedicamento(updatedMedicamento);
    } catch (error) {
      console.error(`Erro ao atualizar medicamento ${id}:`, error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error(`Registro para atualização não encontrado para Medicamento ID ${id}.`);
        }
        if (error.code === 'P2002') {
          const target = error.meta?.target as string[] | undefined;
          throw new Error(
            `Atualização falhou devido a violação de restrição única nos campos: ${target?.join(', ')}`,
          );
        }
      }
      throw error instanceof Error
        ? error
        : new Error(`Erro ao atualizar medicamento: ${String(error)}`);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const now = new Date();

      const result = await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        // Verificar se o produto existe e é um medicamento
        const existingProduto = await tx.produto.findUnique({
          where: { id: id, isActive: true, deletedAt: null },
          include: { medicamentoDetalhe: true },
        });

        if (!existingProduto || !existingProduto.medicamentoDetalhe) {
          return false;
        }

        const produtoUpdate = await tx.produto.update({
          where: { id: id },
          data: {
            deletedAt: now,
            isActive: false,
            updatedAt: now,
          },
        });

        return !!produtoUpdate;
      });

      return result;
    } catch (error) {
      console.error(`Erro ao excluir medicamento ${id}:`, error);
      throw error instanceof Error
        ? error
        : new Error(`Erro ao excluir medicamento: ${String(error)}`);
    }
  }

  private mapToMedicamento(produto: any): MedicamentoDTO {
    if (!produto || !produto.medicamentoDetalhe) {
      throw new Error('Produto inválido ou medicamentoDetalhe ausente');
    }

    return {
      id: produto.id,
      nome: produto.nome,
      idTipoProduto: produto.idTipoProduto,
      nomeTipoProduto: produto.tipoProduto?.nome,
      idUnidadeMedidaPadrao: produto.idUnidadeMedidaPadrao,
      nomeUnidadeMedida: produto.unidadeMedidaPadrao?.nome,
      siglaUnidadeMedida: produto.unidadeMedidaPadrao?.sigla,
      descricao: produto.descricao,
      codigoBarras: produto.codigoBarras,
      isActive: produto.isActive,
      createdAt: produto.createdAt,
      updatedAt: produto.updatedAt,
      deletedAt: produto.deletedAt,

      dosagem: produto.medicamentoDetalhe.dosagem,
      principioAtivo: produto.medicamentoDetalhe.principioAtivo,
      fabricante: produto.medicamentoDetalhe.fabricante,
      necessitaReceita: produto.medicamentoDetalhe.necessitaReceita || false,
    };
  }
}
