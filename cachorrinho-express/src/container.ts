import { LoginService } from './services/LoginService';
import { PrismaClient } from '@prisma/client';
import { UsuarioRepository } from 'repositories/UsuarioRepository';
import { PessoaService } from 'services/PessoaService';
import { PessoaController } from 'controllers/PessoaController';
import { LoginController } from 'controllers/LoginController';
import { authenticate } from 'middlewares/auth';
import { MedicamentoRepository } from './repositories/MedicamentoRepository';
import { MedicamentoService } from './services/MedicamentoService';
import { MedicamentoController } from './controllers/MedicamentoController';
import { TipoProdutoRepository } from './repositories/TipoProdutoRepository';
import { TipoProdutoService } from './services/TipoProdutoService';
import { TipoProdutoController } from './controllers/TipoProdutoController';
import { UnidadeMedidaRepository } from './repositories/UnidadeMedidaRepository';
import { UnidadeMedidaService } from './services/UnidadeMedidaService';
import { UnidadeMedidaController } from './controllers/UnidadeMedidaController';
import { AdotanteRepository } from './repositories/AdotanteRepository';
import { AdotanteService } from './services/AdotanteService';
import { AdotanteController } from './controllers/AdotanteController';

export class Container {
  private static prisma: PrismaClient;

  private static pessoaRepository: UsuarioRepository;
  private static pessoaService: PessoaService;
  private static pessoaController: PessoaController;

  private static medicamentoRepository: MedicamentoRepository;
  private static medicamentoService: MedicamentoService;
  private static medicamentoController: MedicamentoController;

  // Propriedades para TipoProduto
  private static tipoProdutoRepository: TipoProdutoRepository;
  private static tipoProdutoService: TipoProdutoService;
  private static tipoProdutoController: TipoProdutoController;

  // Propriedades para UnidadeMedida
  private static unidadeMedidaRepository: UnidadeMedidaRepository;
  private static unidadeMedidaService: UnidadeMedidaService;
  private static unidadeMedidaController: UnidadeMedidaController;

  private static adotanteRepository: AdotanteRepository;
  private static adotanteService: AdotanteService;
  private static adotanteController: AdotanteController;

  private static loginController: LoginController;
  private static loginService: LoginService;

  private static authMiddleware: ReturnType<typeof authenticate>;

  static init() {
    this.prisma = new PrismaClient();

    this.pessoaRepository = new UsuarioRepository(this.prisma);
    this.pessoaService = new PessoaService(this.pessoaRepository);
    this.pessoaController = new PessoaController(this.pessoaService);

    this.loginService = new LoginService(this.pessoaRepository);
    this.loginController = new LoginController(this.loginService);

    this.medicamentoRepository = new MedicamentoRepository(this.prisma);
    this.medicamentoService = new MedicamentoService(this.medicamentoRepository);
    this.medicamentoController = new MedicamentoController(this.medicamentoService);

    // Inicialização dos componentes TipoProduto
    this.tipoProdutoRepository = new TipoProdutoRepository(this.prisma);
    this.tipoProdutoService = new TipoProdutoService(this.tipoProdutoRepository);
    this.tipoProdutoController = new TipoProdutoController(this.tipoProdutoService);

    // Inicialização dos componentes UnidadeMedida
    this.unidadeMedidaRepository = new UnidadeMedidaRepository(this.prisma);
    this.unidadeMedidaService = new UnidadeMedidaService(this.unidadeMedidaRepository);
    this.unidadeMedidaController = new UnidadeMedidaController(this.unidadeMedidaService);

    this.adotanteRepository = new AdotanteRepository(this.prisma);
    this.adotanteService = new AdotanteService(this.adotanteRepository);
    this.adotanteController = new AdotanteController(this.adotanteService);

    this.authMiddleware = authenticate(this.pessoaService)  }

  static getPessoaController(): PessoaController {
    if (!this.pessoaController) this.init();
    return this.pessoaController;
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

  // Método para obter o TipoProdutoController
  static getTipoProdutoController(): TipoProdutoController {
    if (!this.tipoProdutoController) this.init();
    return this.tipoProdutoController;
  }

  // Método para obter o UnidadeMedidaController
  static getUnidadeMedidaController(): UnidadeMedidaController {
    if (!this.unidadeMedidaController) this.init();
    return this.unidadeMedidaController;
  }

  static getPessoaService(): PessoaService {
    if (!this.pessoaService) this.init();
    return this.pessoaService;
  }

  static getAdotanteController(): AdotanteController {
    if (!this.adotanteController) this.init();
    return this.adotanteController;
  }

  static async disconnect() {
    await this.prisma?.$disconnect();
  }
}
