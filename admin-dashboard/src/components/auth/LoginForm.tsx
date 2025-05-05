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
          // router.push("/dashboard");
        }, 50);
      } else {
        setError(result.message || "Login failed");
        setIsLoading(false);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md p-6 bg-gray-50 rounded-lg shadow-md">

      <h1 className="text-2xl font-bold text-center mb-4 text-amber-600">
        Salvacão - Dashboard
      </h1>

      {error && (
        <div className="p-3 mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded w-full">
          {error}
        </div>
      )}

      {redirecting && (
        <div className="p-3 mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded w-full">
          Login successful! {dots}
        </div>
      )}

      <form className="space-y-6 w-full" onSubmit={handleLogin}>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
              className="w-full px-3 py-2 mt-1 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full px-3 py-2 mt-1 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
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
              className="h-4 w-4 text-amber-500 focus:ring-amber-500 border-gray-300 rounded"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-900"
            >
              Lembrar-me
            </label>
          </div>

          <div className="text-sm">
            <a
              href="#"
              className="font-medium text-amber-600 hover:text-amber-700"
            >
              Esqueci minha senha
            </a>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading || redirecting}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-amber-500 rounded-md hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:bg-amber-300 transition-colors duration-200"
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
        <p className="text-sm text-gray-600">
          Não tem uma conta?{" "}
          <button
            onClick={onToggleForm}
            className="text-amber-600 hover:text-amber-800 hover:underline focus:outline-none"
          >
            Cadastre-se
          </button>
        </p>
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Salvacão - Todos os direitos
        reservados
      </div>
    </div>
  );
}
