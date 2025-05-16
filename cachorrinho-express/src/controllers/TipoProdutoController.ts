import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { TipoProdutoService } from '../services/TipoProdutoService';

export class TipoProdutoController {
  constructor(private readonly tipoProdutoService: TipoProdutoService) {}

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const tipoProduto = await this.tipoProdutoService.create(req.body);
      res.status(StatusCodes.CREATED).json(tipoProduto);
    } catch (error) {
      if (Array.isArray(error)) {
        res.status(StatusCodes.BAD_REQUEST).json({ mensagem: 'Validação falhou', erros: error });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          mensagem: error instanceof Error ? error.message : 'Erro interno do servidor',
        });
      }
    }
  };

  findOne = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id || req.query.id || req.body.id;

      if (!id || isNaN(Number(id))) {
        res.status(StatusCodes.BAD_REQUEST).json({ mensagem: 'Parâmetro ID inválido' });
        return;
      }

      const tipoProduto = await this.tipoProdutoService.findOne(Number(id));
      res.status(StatusCodes.OK).json(tipoProduto);
    } catch (error) {
      if (error instanceof Error && error.message.includes('não encontrado')) {
        res.status(StatusCodes.NOT_FOUND).json({
          mensagem: error.message,
        });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          mensagem: error instanceof Error ? error.message : 'Erro interno do servidor',
        });
      }
    }
  };

  findAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const tiposProduto = await this.tipoProdutoService.findAll(req.query);
      res.status(StatusCodes.OK).json(tiposProduto);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        mensagem: error instanceof Error ? error.message : 'Erro interno do servidor',
      });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id || req.body.id;

      if (!id || isNaN(Number(id))) {
        res.status(StatusCodes.BAD_REQUEST).json({ mensagem: 'Parâmetro ID inválido' });
        return;
      }

      const tipoProduto = await this.tipoProdutoService.update(Number(id), req.body);
      res.status(StatusCodes.OK).json(tipoProduto);
    } catch (error) {
      if (error instanceof Error && error.message.includes('não encontrado')) {
        res.status(StatusCodes.NOT_FOUND).json({
          mensagem: error.message,
        });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          mensagem: error instanceof Error ? error.message : 'Erro interno do servidor',
        });
      }
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id || req.body.id;

      if (!id || isNaN(Number(id))) {
        res.status(StatusCodes.BAD_REQUEST).json({ mensagem: 'Parâmetro ID inválido' });
        return;
      }

      const result = await this.tipoProdutoService.delete(Number(id));

      if (result) {
        res.status(StatusCodes.NO_CONTENT).send();
      } else {
        res.status(StatusCodes.NOT_FOUND).json({
          mensagem: `Tipo de produto com ID ${id} não encontrado ou já está excluído.`,
        });
      }
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        mensagem: error instanceof Error ? error.message : 'Erro interno do servidor',
      });
    }
  };
}
