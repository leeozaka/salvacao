interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  token?: string;
  message?: string;
}

interface RegisterCredentials {
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  documentoIdentidade: string;
  tipoDocumento: string;
  dataNascimento: string;
  endereco: string;
  tipoUsuario: string;
}

interface RegisterResponse {
  success: boolean;
  message?: string;
  user?: unknown;
}
