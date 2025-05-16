import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UnidadeMedidaService } from '../services/UnidadeMedidaService';

export class UnidadeMedidaController {
  constructor(private readonly unidadeMedidaService: UnidadeMedidaService) {}

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const unidadeMedida = await this.unidadeMedidaService.create(req.body);
      res.status(StatusCodes.CREATED).json(unidadeMedida);
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

      const unidadeMedida = await this.unidadeMedidaService.findOne(Number(id));
      res.status(StatusCodes.OK).json(unidadeMedida);
    } catch (error) {
      if (error instanceof Error && error.message.includes('não encontrada')) {
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
      const unidadesMedida = await this.unidadeMedidaService.findAll(req.query);
      res.status(StatusCodes.OK).json(unidadesMedida);
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

      const unidadeMedida = await this.unidadeMedidaService.update(Number(id), req.body);
      res.status(StatusCodes.OK).json(unidadeMedida);
    } catch (error) {
      if (error instanceof Error && error.message.includes('não encontrada')) {
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

      const result = await this.unidadeMedidaService.delete(Number(id));

      if (result) {
        res.status(StatusCodes.NO_CONTENT).send();
      } else {
        res.status(StatusCodes.NOT_FOUND).json({
          mensagem: `Unidade de medida com ID ${id} não encontrada ou já está excluída.`,
        });
      }
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        mensagem: error instanceof Error ? error.message : 'Erro interno do servidor',
      });
    }
  };
}
