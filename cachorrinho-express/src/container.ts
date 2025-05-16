import { LoginService } from './services/LoginService';
import { PrismaClient } from '@prisma/client';
import { UsuarioRepository } from 'repositories/UsuarioRepository';
import { PessoaUsuarioService } from 'services/PessoaUsuarioService';
import { PessoaUsuarioController } from 'controllers/UserController';
import { LoginController } from 'controllers/LoginController';
import { authenticate } from 'middlewares/auth';
import { MedicamentoRepository } from './repositories/MedicamentoRepository';
import { MedicamentoService } from './services/MedicamentoService';
import { MedicamentoController } from './controllers/MedicamentoController';

export class Container {
  private static prisma: PrismaClient;

  private static pessoaUsuarioRepository: UsuarioRepository;
  private static pessoaUsuarioService: PessoaUsuarioService;
  private static pessoaUsuarioController: PessoaUsuarioController;

  private static medicamentoRepository: MedicamentoRepository;
  private static medicamentoService: MedicamentoService;
  private static medicamentoController: MedicamentoController;

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

    this.medicamentoRepository = new MedicamentoRepository(this.prisma);
    this.medicamentoService = new MedicamentoService(this.medicamentoRepository);
    this.medicamentoController = new MedicamentoController(this.medicamentoService);

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

  static getMedicamentoController(): MedicamentoController {
    if (!this.medicamentoController) this.init();
    return this.medicamentoController;
  }

  static getPessoaUsuarioService(): PessoaUsuarioService {
    if (!this.pessoaUsuarioService) this.init();
    return this.pessoaUsuarioService;
  }


  static async disconnect() {
    await this.prisma?.$disconnect();
  }
}
