import { User } from 'dtos/UserDTO';
import { Role } from '@prisma/client';
import { ActivableEntityMixin } from 'interfaces/ActivableEntityInterface';
import { UserUtils } from 'utils/UserUtils';
import { ValidationError } from 'types/ValidationErrorType';

type UserModelParams = Partial<User>;

export default class UserModel implements User {
  readonly id?: string;
  readonly cpf: string;

  readonly name: string;
  readonly email: string;
  readonly telephone: string;
  readonly birthday: Date;

  password?: string;
  readonly role: Role;

  public isActive: boolean;
  public isDeleted: boolean;

  readonly createdAt: Date;
  updatedAt: Date | undefined;

  constructor(data: UserModelParams = {}) {
    this.id = data.id;
    this.cpf = data.cpf || '';

    this.name = data.name || '';
    this.email = data.email || '';
    this.telephone = data.telephone || '';
    this.birthday = data.birthday || new Date();

    this.password = data.password;
    this.role = data.role || Role.USER;

    this.isActive = data.isActive ?? true;
    this.isDeleted = data.isDeleted ?? false;

    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt;
  }

  async validate(): Promise<boolean | ValidationError[]> {
    const errors: ValidationError[] = [];

    if (!UserUtils.isValidCPF(this.cpf)) {
      errors.push({ field: 'cpf', message: 'Invalid CPF format' });
    }

    if (!UserUtils.isValidEmail(this.email)) {
      errors.push({ field: 'email', message: 'Invalid email format' });
    }

    if (!UserUtils.isValidPhone(this.telephone)) {
      errors.push({ field: 'telephone', message: 'Invalid phone format' });
    }

    if (this.password && !UserUtils.isValidPassword(this.password)) {
      errors.push({ field: 'password', message: 'Invalid password format' });
    }

    return errors.length > 0 ? errors : true;
  }

  inactivate = ActivableEntityMixin.inactivate;
  logicalDelete = ActivableEntityMixin.logicalDelete;
  activate = ActivableEntityMixin.activate;

  public toJSON(): User {
    return {
      id: this.id,
      cpf: this.cpf,
      name: this.name,
      email: this.email,
      telephone: this.telephone,
      birthday: this.birthday,
      role: this.role,
      isActive: this.isActive,
      isDeleted: this.isDeleted,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
