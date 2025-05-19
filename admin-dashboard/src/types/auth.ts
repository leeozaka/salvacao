export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  message?: string;
}

export interface RegisterCredentials {
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

export interface RegisterResponse {
  success: boolean;
  message?: string;
  user?: unknown;
}
