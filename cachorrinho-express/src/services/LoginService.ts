import { ResultAsync, okAsync, errAsync, Result } from 'neverthrow';
import { compareSync } from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { prismaClient } from '../index';
import { JWT_SECRET } from '../config/secret';
import { LoginRequest, LoginResponse } from '../interfaces/LoginInterface';

export class LoginService {
  /**
   * Authenticates a user with email and password
   * @param loginData Login credentials
   * @returns ResultAsync<LoginResponse, Error>
   */
  authenticate(loginData: LoginRequest): ResultAsync<LoginResponse, Error> {
    return ResultAsync.fromPromise(
      prismaClient.user.findUnique({
        where: { email: loginData.email },
      }),
      (error) => new Error(`Database error: ${error}`),
    ).andThen((user) => {
      if (!user) {
        return errAsync(new Error('Invalid credentials'));
      }

      if (!this.validateCredentials(loginData.password, user.password)) {
        return errAsync(new Error('Invalid credentials'));
      }

      const tokenResult = this.generateToken(user.id);

      if (tokenResult.isErr()) {
        return errAsync(tokenResult.error);
      }
      return okAsync({
        expires: new Date(),
        token: tokenResult.value,
      });
    });
  }

  /**
   * Verifies if a JWT token is valid
   * @param token The JWT token to verify
   * @returns ResultAsync<boolean, Error>
   */
  verifyToken(token: string): ResultAsync<boolean, Error> {
    if (!JWT_SECRET) {
      return errAsync(new Error('JWT secret is not configured'));
    }

    return ResultAsync.fromPromise(
      Promise.resolve().then(() => {
          const decoded = jwt.verify(token, JWT_SECRET!);
          return !!decoded;
      }),
      (error) => {
        if (error instanceof jwt.JsonWebTokenError) {
          return new Error('Invalid token');
        }
        if (error instanceof jwt.TokenExpiredError) {
          return new Error('Token has expired');
        }
        return new Error('Token verification failed');
      }
    );
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
  private generateToken(userId: string): Result<string, Error> {
    return Result.fromThrowable(
      () =>
        jwt.sign({ userId }, JWT_SECRET!, {
          expiresIn: '24h',
        }),
      (e) => (e instanceof Error ? e : new Error('Token generation failed')),
    )();
  }
}
