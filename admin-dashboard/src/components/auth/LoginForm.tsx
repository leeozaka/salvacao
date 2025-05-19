"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/services/authService";

interface LoginFormProps {
  onToggleForm: () => void;
}

export default function LoginForm({ onToggleForm }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [dots, setDots] = useState(".");
  const router = useRouter();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (redirecting) {
      interval = setInterval(() => {
        setDots((prevDots) => {
          if (prevDots === ".") return "..";
          if (prevDots === "..") return "...";
          return ".";
        });
      }, 350);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [redirecting]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await loginUser({ email, password });

      if (result.success) {
        setRedirecting(true);
        setTimeout(() => {
          router.refresh();
        }, 50);
      } else {
        setError(result.message || "Login falhou");
        setIsLoading(false);
      }
    } catch (err) {
      setError("Ocorreu um erro inesperado");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md p-6 rounded-lg shadow-md bg-bg-color text-text-color">
      <h1 className="text-2xl font-bold text-center mb-4">
        Salvacão - Dashboard
      </h1>

      {error && (
        <div className="p-3 mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded w-full">
          {error}
        </div>
      )}

      {redirecting && (
        <div className="p-3 mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded w-full">
          Login realizado com suceso! {dots}
        </div>
      )}

      <form className="space-y-6 w-full" onSubmit={handleLogin}>
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full px-3 py-2 mt-1 bg-primary border border-[var(--color-secondary)] rounded-md focus:outline-none focus:ring-2 focus:border-transparent placeholder-placeholder-color"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
              required
              className="w-full px-3 py-2 mt-1 border text-[var(--color-text)] bg-primary border-[var(--color-secondary)] rounded-md focus:outline-none focus:ring-2 focus:border-transparent placeholder-placeholder-color"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)] border-[var(--color-secondary)] rounded"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-[var(--color-text)]"
            >
              Lembrar-me
            </label>
          </div>

          <div className="text-sm">
            <a
              href="#"
              className="font-medium text-[var(--color-primary)] hover:text-[var(--color-secondary)]"
            >
              Esqueci minha senha
            </a>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading || redirecting}
            className="w-full px-4 py-2 text-sm font-medium text-text-color bg-login-button rounded-md hover:bg-login-button-hover focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 transition-colors duration-200"
          >
            {isLoading
              ? "Entrando..."
              : redirecting
                ? "Redirecionando..."
                : "Entrar"}
          </button>
        </div>
      </form>

      <div className="mt-4 text-center w-full">
        <p className="text-sm text-text-color">
          Não tem uma conta?{" "}
          <button
            onClick={onToggleForm}
            className="hover:text-secondary-color hover:underline focus:outline-none transition-colors duration-200"
          >
            Cadastre-se
          </button>
        </p>
      </div>

      <div className="mt-6 text-center text-sm text-[var(--color-text)] opacity-70">
        &copy; {new Date().getFullYear()} Salvacão - Todos os direitos
        reservados
      </div>
    </div>
  );
}
