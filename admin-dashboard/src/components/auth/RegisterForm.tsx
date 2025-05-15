"use client";

import { useState, useEffect } from "react";
import { registerUser } from "@/services/authService";
import {
  isValidCPF,
  isValidPhone,
  isValidPassword,
  validatePasswordStrength,
  getPasswordStrength,
  formatCPF,
  formatPhone,
  isValidEmail,
  isValidBirthday,
} from "@/utils/validationUtils";

interface RegisterFormProps {
  onSuccess: () => void;
  onToggleForm: () => void;
}

export default function RegisterForm({
  onSuccess,
  onToggleForm,
}: RegisterFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    telephone: "",
    cpf: "",
    birthday: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "Muito fraca",
    color: "red",
  });
  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  const [isAgeValid, setIsAgeValid] = useState<boolean | null>(null);

  useEffect(() => {
    if (formData.password) {
      setPasswordStrength(getPasswordStrength(formData.password));
    } else {
      setPasswordStrength({ score: 0, label: "Muito fraca", color: "red" });
    }
  }, [formData.password]);

  useEffect(() => {
    if (formData.email) {
      setEmailValid(isValidEmail(formData.email));
    } else {
      setEmailValid(null);
    }
  }, [formData.email]);

  useEffect(() => {
    if (formData.birthday) {
      setIsAgeValid(isValidBirthday(formData.birthday));
    } else {
      setIsAgeValid(null);
    }
  }, [formData.birthday]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const errorMessage = validateField(name, value);

    if (name === "password") {
      const confirmError = validateField(
        "confirmPassword",
        formData.confirmPassword,
      );
      setErrors((prev) => ({
        ...prev,
        [name]: errorMessage,
        confirmPassword: confirmError,
      }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: errorMessage }));
    }
  };

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "name":
        return value ? "" : "Nome é obrigatório";
      case "email":
        if (!value) return "Email é obrigatório";
        return /^\S+@\S+\.\S+$/.test(value) ? "" : "Formato de email inválido";
      case "password":
        if (!value) return "Senha é obrigatória";
        return isValidPassword(value)
          ? ""
          : "A senha deve ter pelo menos 8 caracteres com letras maiúsculas, minúsculas, números e caracteres especiais";
      case "confirmPassword":
        return value === formData.password ? "" : "As senhas não coincidem";
      case "cpf":
        if (!value) return "CPF é obrigatório";
        return isValidCPF(value) ? "" : "CPF inválido";
      case "telephone":
        if (!value) return "Telefone é obrigatório";
        return isValidPhone(value) ? "" : "Formato de telefone inválido";
      case "birthday":
        return value ? "" : "Data de nascimento é obrigatória";
      default:
        return "";
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = "Nome é obrigatório";

    if (!formData.email) newErrors.email = "Email é obrigatório";
    if (formData.email && !isValidEmail(formData.email)) {
      newErrors.email = "Formato de email inválido";
    }

    if (!formData.password) {
      newErrors.password = "Senha é obrigatória";
    } else {
      const passwordValidation = validatePasswordStrength(formData.password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.errors[0];
      }
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem";
    }

    if (!formData.cpf) newErrors.cpf = "CPF é obrigatório";
    if (formData.cpf && !isValidCPF(formData.cpf)) {
      newErrors.cpf = "CPF inválido";
    }

    if (!formData.telephone) newErrors.telephone = "Telefone é obrigatório";
    if (formData.telephone && !isValidPhone(formData.telephone)) {
      newErrors.telephone = "Formato de telefone inválido";
    }

    if (!formData.birthday)
      newErrors.birthday = "Data de nascimento é obrigatória";
    if (formData.birthday && !isValidBirthday(formData.birthday)) {
      newErrors.birthday = "Você deve ter pelo menos 18 anos para se cadastrar";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const birthdayDate = new Date(`${formData.birthday}T00:00:00Z`);

      const result = await registerUser({
        nome: formData.name,
        email: formData.email,
        senha: formData.password,
        telefone: formData.telephone.replace(/\D/g, ""),
        documentoIdentidade: formData.cpf.replace(/\D/g, ""),
        tipoDocumento: 'CPF',
        dataNascimento: birthdayDate.toISOString(),
        tipoUsuario: 'USER',
        endereco: '',
      });

      if (result.success) {
        onSuccess();
      } else {
        setErrors({ general: result.message || "Falha no cadastro" });
      }
    } catch (error) {
      setErrors({ general: "Ocorreu um erro inesperado" });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md p-6 rounded-lg shadow-md bg-bg-color dark:bg-menu-bg-dark text-text-color dark:text-text-color-dark">
      <h1 className="text-2xl font-bold text-center mb-4">
        Criar uma Conta
      </h1>

      {Object.keys(errors).length > 0 && (
        <div className="p-3 mb-4 text-sm text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-800 dark:bg-opacity-30 border border-red-200 dark:border-red-700 rounded w-full">
          <ul className="list-disc list-inside">
            {errors.general && <li>{errors.general}</li>}
            {Object.entries(errors).map(([field, message]) =>
              field !== "general" && message ? (
                <li key={field}>{message}</li>
              ) : null,
            )}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 w-full">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium"
            >
              Nome Completo
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 bg-primary border border-[var(--color-secondary)] rounded-md focus:outline-none focus:ring-2 focus:border-transparent placeholder-placeholder-color dark:placeholder-placeholder-color-dark"
              required
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.name}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent placeholder-placeholder-color dark:placeholder-placeholder-color-dark ${
                emailValid === false
                  ? "border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900 dark:bg-opacity-20"
                  : "border-[var(--color-secondary)] bg-primary"
              }`}
              required
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="cpf"
              className="block text-sm font-medium"
            >
              CPF
            </label>
            <input
              id="cpf"
              name="cpf"
              type="text"
              value={formatCPF(formData.cpf)}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 bg-primary border border-[var(--color-secondary)] rounded-md focus:outline-none focus:ring-2 focus:border-transparent placeholder-placeholder-color dark:placeholder-placeholder-color-dark"
              placeholder="000.000.000-00"
              required
            />
            {errors.cpf && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.cpf}</p>}
          </div>

          <div>
            <label
              htmlFor="telephone"
              className="block text-sm font-medium"
            >
              Telefone
            </label>
            <input
              id="telephone"
              name="telephone"
              type="tel"
              value={formatPhone(formData.telephone)}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 bg-primary border border-[var(--color-secondary)] rounded-md focus:outline-none focus:ring-2 focus:border-transparent placeholder-placeholder-color dark:placeholder-placeholder-color-dark"
              placeholder="(00) 00000-0000"
              required
            />
            {errors.telephone && (
              <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.telephone}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="birthday"
              className="block text-sm font-medium"
            >
              Data de Nascimento
            </label>
            <input
              id="birthday"
              name="birthday"
              type="date"
              value={formData.birthday}
              onChange={handleChange}
              className={`w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent placeholder-placeholder-color dark:placeholder-placeholder-color-dark ${
                isAgeValid === false
                  ? "border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900 dark:bg-opacity-20"
                  : "border-[var(--color-secondary)] bg-primary"
              }`}
              required
            />
            {errors.birthday && (
              <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.birthday}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium"
            >
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 bg-primary border border-[var(--color-secondary)] rounded-md focus:outline-none focus:ring-2 focus:border-transparent placeholder-placeholder-color dark:placeholder-placeholder-color-dark"
              required
            />
            <div className="w-full h-1.5 bg-[var(--color-secondary)] rounded-full mt-1">
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  passwordStrength.color === "red" ? "bg-red-500 dark:bg-red-800 w-1/4" :
                  passwordStrength.color === "orange" ? "bg-orange-500 dark:bg-orange-800 w-2/4" :
                  passwordStrength.color === "yellow" ? "bg-yellow-500 dark:bg-yellow-800 w-3/4" :
                  passwordStrength.color === "green" ? "bg-green-500 dark:bg-green-800 w-full" : "bg-gray-300 dark:bg-gray-700 w-0"
                }`}
              ></div>
            </div>
            <p className={`text-xs font-medium mt-1 ${
              passwordStrength.color === "red" ? "text-red-600 dark:text-red-400" :
              passwordStrength.color === "orange" ? "text-orange-600 dark:text-orange-400" :
              passwordStrength.color === "yellow" ? "text-yellow-600 dark:text-yellow-400" :
              passwordStrength.color === "green" ? "text-green-600 dark:text-green-400" : "text-[var(--color-text)] opacity-70"
            }`}>
              Força da senha: {passwordStrength.label}
            </p>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.password}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium"
            >
              Confirmar Senha
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 bg-primary border border-[var(--color-secondary)] rounded-md focus:outline-none focus:ring-2 focus:border-transparent placeholder-placeholder-color dark:placeholder-placeholder-color-dark"
              required
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.confirmPassword}</p>
            )}
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 text-sm font-medium text-text-color dark:text-text-color-dark bg-login-button dark:bg-login-button-dark rounded-md hover:bg-login-button-hover dark:hover:bg-login-button-hover-dark focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 transition-colors duration-200"
          >
            {isLoading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </div>
      </form>

      <div className="mt-4 text-center w-full">
        <p className="text-sm text-[var(--color-text)]">
          Já tem uma conta?{" "}
          <button
            onClick={onToggleForm}
            className="hover:text-secondary-color dark:hover:text-secondary-color-dark hover:underline focus:outline-none transition-colors duration-200"
          >
            Faça login
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
