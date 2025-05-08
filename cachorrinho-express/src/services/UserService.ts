import { IUserRepository, IUserService } from 'interfaces/UserInterface';
import { hash } from 'bcrypt';
import { CreateUserDTO, User } from 'dtos/UserDTO';
import UserModel from 'models/UserModel';
import { UserMapper } from 'mapper/UserMapper';
import { Role } from '@prisma/client';

export class UserService implements IUserService {
  constructor(private readonly userRepository: IUserRepository) {}

  /**
   * Finds a user by CPF. Returns the user or throws an error if not found.
   * @param {string} cpf - The user's CPF
   * @returns {Promise<User>}
   */
  async findByCpf(cpf: string): Promise<User> {
    return this.userRepository.findByCpf(cpf);
  }

  /**
   * Creates a new user. Returns the created user or throws validation/DB errors.
   * @param {CreateUserDTO} data - The input data for user creation
   * @returns {Promise<User>}
   */
  async create(data: CreateUserDTO): Promise<User> {
    const isFirstUser = await this.userRepository.isFirstUser();

    console.log(isFirstUser, 'isFirstUser');
    
    const userModel = new UserModel({
      ...data,
      role: isFirstUser ? Role.ADMIN : Role.USER
    });

    const validationResult = await userModel.validate();
    if (Array.isArray(validationResult)) {
      throw validationResult;
    }

    const hashedPassword = await hash(data.password!, 12);
    userModel.password = hashedPassword;

    return this.userRepository.create(UserMapper.toEntity(userModel));
  }

  /**
   * Updates a user by ID. Returns the updated user or throws an error if not found.
   * @param {string} id - The user's unique ID
   * @param {Partial<User>} data - Fields to update
   * @returns {Promise<User>}
   */
  async update(id: string, data: Partial<User>): Promise<User> {
    const user = await this.userRepository.update(id, data);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  /**
   * Soft deletes a user. Returns true or throws an error if not found.
   * @param {string} id - The user's unique ID
   * @returns {Promise<boolean>}
   */
  async delete(id: string): Promise<boolean> {
    return this.userRepository.delete(id);
  }

  /**
   * Finds a user by ID. Returns the user or throws an error if not found.
   * @param {string} id - The user's unique ID
   * @returns {Promise<User>}
   */
  async findOne(id: string): Promise<User> {
    return this.userRepository.findOne(id);
  }

  /**
   * Retrieves all users matching an optional filter. Returns an array of users.
   * @param {Partial<User>} [filter] - Optional filtering criteria
   * @returns {Promise<User[]>}
   */
  async findAll(filter?: Partial<User>): Promise<User[]> {
    return this.userRepository.findAll(filter);
  }
}
