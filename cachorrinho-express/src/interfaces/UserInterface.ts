import { CreateUserDTO, User } from 'dtos/UserDTO';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface IUserRepository {
  create(data: CreateUserDTO): Promise<User>;
  findOne(id: string): Promise<User>;
  findAll(filter?: Partial<User>): Promise<User[]>;
  update(id: string, data: Partial<User>): Promise<User>;
  delete(id: string): Promise<boolean>;
  findByCpf(cpf: string): Promise<User>;
  isFirstUser(): Promise<boolean>;
}

export interface IUserService {
  create(data: CreateUserDTO): Promise<User>;
  findOne(id: string): Promise<User>;
  findAll(filter?: Partial<User>): Promise<User[]>;
  update(id: string, data: Partial<User>): Promise<User>;
  delete(id: string): Promise<boolean>;
  findByCpf(cpf: string): Promise<User>;
}
