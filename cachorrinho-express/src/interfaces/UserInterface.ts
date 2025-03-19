import { User } from 'dtos/UserDTO';
import { ValidationError } from 'types/ValidationErrorType';

export interface CreateUserRequest {
  cpf: string;
  password: string;
  email: string;
  telephone: string;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface IUserRepository {
  create(data: User): Promise<User>;
  findOne(id: string): Promise<User>;
  findAll(filter?: Partial<User>): Promise<User[]>;
  update(id: string, data: Partial<User>): Promise<User>;
  delete(id: string): Promise<boolean>;
  findByCpf(cpf: string): Promise<User>;
}

export interface IUserService {
  create(data: CreateUserRequest): Promise<User>;
  findOne(id: string): Promise<User>;
  findAll(filter?: Partial<User>): Promise<User[]>;
  update(id: string, data: Partial<User>): Promise<User>;
  delete(id: string): Promise<boolean>;
  findByCpf(cpf: string): Promise<User>;
}
