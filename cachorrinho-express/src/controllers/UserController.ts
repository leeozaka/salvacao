import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { PessoaUsuarioService } from 'services/PessoaUsuarioService';

/**
 * Controller handling HTTP requests for User operations
 * Manages user-related endpoints and coordinates with UserService
 */
export class PessoaUsuarioController {
  constructor(private readonly userService: PessoaUsuarioService) {}

  /**
   * Creates a new user
   * @param req - Express request with user data in body
   * @param res - Express response object
   */
  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await this.userService.create(req.body);
      res.status(StatusCodes.CREATED).json(user);
    } catch (error) {
      if (Array.isArray(error)) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: 'Validation failed', errors: error });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: error instanceof Error ? error.message : 'Internal server error',
        });
      }
    }
  };

  /**
   * Retrieves a single user by ID
   * @param req - Express request with user ID in params or body
   * @param res - Express response object
   */
  findOne = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.query.id || req.body.id;

      if (typeof id !== 'string') {
        res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid ID parameter' });
        return;
      }

      const user = await this.userService.findOne(Number(id));
      res.status(StatusCodes.OK).json(user);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  };

  /**
   * Retrieves all users with optional filtering
   * @param req - Express request with optional filter in body
   * @param res - Express response object
   */
  findAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await this.userService.findAll(req.body.userId);
      res.status(StatusCodes.OK).json(users);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  };

  /**
   * Updates an existing user
   * @param req - Express request with user ID and update data in body
   * @param res - Express response object
   */
  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await this.userService.update(req.body.id, req.body);
      res.status(StatusCodes.OK).json(user);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  };

  /**
   * Performs a logical deletion of a user
   * @param req - Express request with user ID in body
   * @param res - Express response object
   */
  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.userService.delete(req.body.userId);
      res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  };
}
