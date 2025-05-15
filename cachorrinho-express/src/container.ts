import { LoginService } from './services/LoginService';
import { PrismaClient } from '@prisma/client';
import { UsuarioRepository } from 'repositories/UsuarioRepository';
import { PessoaUsuarioService } from 'services/PessoaUsuarioService';
import { PessoaUsuarioController } from 'controllers/UserController';
import { LoginController } from 'controllers/LoginController';
import { authenticate } from 'middlewares/auth';

export class Container {
  private static prisma: PrismaClient;

  private static pessoaUsuarioRepository: UsuarioRepository;
  private static pessoaUsuarioService: PessoaUsuarioService;
  private static pessoaUsuarioController: PessoaUsuarioController;

  private static loginController: LoginController;
  private static loginService: LoginService;

  private static authMiddleware: ReturnType<typeof authenticate>;

  static init() {
    this.prisma = new PrismaClient();

    this.pessoaUsuarioRepository = new UsuarioRepository(this.prisma);
    this.pessoaUsuarioService = new PessoaUsuarioService(this.pessoaUsuarioRepository);
    this.pessoaUsuarioController = new PessoaUsuarioController(this.pessoaUsuarioService);

    this.loginService = new LoginService(this.pessoaUsuarioRepository);
    this.loginController = new LoginController(this.loginService);

    this.authMiddleware = authenticate(this.pessoaUsuarioService);
  }

  static getPessoaUsuarioController(): PessoaUsuarioController {
    if (!this.pessoaUsuarioController) this.init();
    return this.pessoaUsuarioController;
  }

  static getLoginController(): LoginController {
    if (!this.loginController) this.init();
    return this.loginController;
  }

  static getAuthMiddleware() {
    if (!this.authMiddleware) this.init();
    return this.authMiddleware;
  }

  static async disconnect() {
    await this.prisma?.$disconnect();
  }
}
