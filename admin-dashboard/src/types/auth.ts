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
  name: string;
  email: string;
  password: string;
  telephone: string;
  cpf: string;
  birthday: string;
}

interface RegisterResponse {
  success: boolean;
  message?: string;
  user?: unknown;
}
