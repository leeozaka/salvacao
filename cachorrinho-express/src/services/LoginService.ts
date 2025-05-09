import { compareSync } from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { prismaClient } from '../index';
import { JWT_SECRET } from '../config/secret';
import { LoginRequest, LoginResponse } from '../interfaces/LoginInterface';

export class LoginService {
  /**
   * Authenticates a user with email and password
   * @param loginData Login credentials
   * @returns Promise<LoginResponse>
   */
  async authenticate(loginData: LoginRequest): Promise<LoginResponse> {
    try {
      const user = await prismaClient.user.findUnique({
        where: { email: loginData.email },
      });

      if (!user) {
        throw new Error('Invalid credentials');
      }

      if (!this.validateCredentials(loginData.password, user.password)) {
        throw new Error('Invalid credentials');
      }

      const token = this.generateToken(user.id);

      return {
        expires: new Date(),
        token,
      };
    } catch (error) {
      throw error instanceof Error ? error : new Error('Authentication failed');
    }
  }

  /**
   * Verifies if a JWT token is valid
   * @param token The JWT token to verify
   * @returns Promise<boolean>
   */
  async verifyToken(token: string): Promise<boolean> {
    if (!JWT_SECRET) {
      throw new Error('JWT secret is not configured');
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return !!decoded;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid token');
      }
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token has expired');
      }
      throw new Error('Token verification failed');
    }
  }

  /**
   * Validates user password against stored hash
   */
  private validateCredentials(password: string, hash: string): boolean {
    return compareSync(password, hash);
  }

  /**
   * Generates JWT token for authenticated user
   */
  private generateToken(userId: string): string {
    if (!JWT_SECRET) {
      throw new Error('JWT secret is not configured');
    }

    try {
      return jwt.sign({ userId }, JWT_SECRET, {
        expiresIn: '24h',
      });
    } catch (error) {
      throw error instanceof Error ? error : new Error('Token generation failed');
    }
  }
}
