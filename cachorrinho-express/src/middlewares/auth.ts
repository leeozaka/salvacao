import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/secret';
import { PessoaUsuarioService } from 'services/PessoaUsuarioService';
import { EntityAttribute, EntityType } from 'enums/ErrorTypes';
import JwtPayload from 'interfaces/JwtPayloadInterface';

/**
 * Authentication middleware to protect routes
 * Validates JWT token and attaches user to request
 */
export const authenticate =
  (userService: PessoaUsuarioService) =>
  async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({
          errors: [
            {
              type: EntityType.USER,
              attribute: EntityAttribute.TOKEN,
              message: 'Invalid or missing authentication token',
            },
          ],
        });
      }

      if (!JWT_SECRET) {
        return res.status(401).json({
          errors: [
            {
              type: EntityType.USER,
              attribute: EntityAttribute.TOKEN,
              message: 'JWT secret is not configured',
            },
          ],
        });
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

      if (!decoded?.userId) {
        return res.status(401).json({
          errors: [
            {
              type: EntityType.USER,
              attribute: EntityAttribute.TOKEN,
              message: 'Invalid token payload',
            },
          ],
        });
      }

      const user = await userService.findOne(Number(decoded.userId));

      if (!user) {
        return res.status(401).json({
          errors: [
            {
              type: EntityType.USER,
              attribute: EntityAttribute.TOKEN,
              message: 'User not found',
            },
          ],
        });
      }

      if (req.method !== 'POST' && !req.body.id) {
        req.body.id = user.id;
      }

      return next();
    } catch (error) {
      return res.status(401).json({
        errors: [
          {
            type: EntityType.USER,
            attribute: EntityAttribute.TOKEN,
            message: error instanceof Error ? error.message : 'Authentication failed',
          },
        ],
      });
    }
  };

export default authenticate;
