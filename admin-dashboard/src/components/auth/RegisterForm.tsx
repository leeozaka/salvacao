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
import Image from "next/image";

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
        name: formData.name,
        email: formData.email,
        password: formData.password,
        telephone: formData.telephone.replace(/\D/g, ""),
        cpf: formData.cpf.replace(/\D/g, ""),
        birthday: birthdayDate.toISOString(),
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
    <div className="flex flex-col items-center justify-center w-full max-w-md p-6 bg-gray-50 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-4 text-amber-600">
        Criar uma Conta
      </h1>

      {Object.keys(errors).length > 0 && (
        <div className="p-3 mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded w-full">
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

      <form onSubmit={handleSubmit} className="space-y-4 w-full">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Nome Completo
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 border text-gray-800 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            required
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-500">{errors.name}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 mt-1 border text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
              emailValid === false
                ? "border-red-300 bg-red-50"
                : emailValid === true
                  ? "border-green-300 bg-green-50"
                  : "border-gray-300"
            }`}
            required
          />
          {emailValid === false && (
            <p className="mt-1 text-xs text-red-600">
              Formato de email inválido
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="cpf"
            className="block text-sm font-medium text-gray-700"
          >
            CPF
          </label>
          <input
            id="cpf"
            name="cpf"
            type="text"
            value={formData.cpf}
            onChange={(e) => {
              const formatted = formatCPF(e.target.value);
              setFormData((prev) => ({ ...prev, cpf: formatted }));
              const errorMessage = validateField("cpf", formatted);
              setErrors((prev) => ({ ...prev, cpf: errorMessage }));
            }}
            placeholder="000.000.000-00"
            maxLength={14}
            className={`w-full px-3 py-2 mt-1 border border-gray-300 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
              formData.cpf && !isValidCPF(formData.cpf)
                ? "border-red-300 bg-red-50"
                : formData.cpf && isValidCPF(formData.cpf)
                  ? "border-green-300 bg-green-50"
                  : ""
            }`}
            required
          />
          {formData.cpf && !isValidCPF(formData.cpf) && (
            <p className="mt-1 text-xs text-red-600">CPF inválido</p>
          )}
        </div>

        <div>
          <label
            htmlFor="telephone"
            className="block text-sm font-medium text-gray-700"
          >
            Telefone
          </label>
          <input
            id="telephone"
            name="telephone"
            type="text"
            value={formData.telephone}
            onChange={(e) => {
              const formatted = formatPhone(e.target.value);
              setFormData((prev) => ({ ...prev, telephone: formatted }));
              const errorMessage = validateField("telephone", formatted);
              setErrors((prev) => ({ ...prev, telephone: errorMessage }));
            }}
            placeholder="(00) 00000-0000"
            maxLength={15}
            className={`w-full px-3 py-2 mt-1 border text-gray-800 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
              formData.telephone && !isValidPhone(formData.telephone)
                ? "border-red-300 bg-red-50"
                : formData.telephone && isValidPhone(formData.telephone)
                  ? "border-green-300 bg-green-50"
                  : ""
            }`}
            required
          />
          {formData.telephone && !isValidPhone(formData.telephone) && (
            <p className="mt-1 text-xs text-red-600">
              Formato de telefone inválido
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="birthday"
            className="block text-sm font-medium text-gray-700"
          >
            Data de Nascimento
          </label>
          <input
            id="birthday"
            name="birthday"
            type="date"
            value={formData.birthday}
            onChange={handleChange}
            className={`w-full px-3 py-2 mt-1 border text-gray-800 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
              isAgeValid === false
                ? "border-red-300 bg-red-50"
                : isAgeValid === true
                  ? "border-green-300 bg-green-50"
                  : ""
            }`}
            required
          />
          {isAgeValid === false && (
            <p className="mt-1 text-xs text-red-600">
              Você deve ter pelo menos 18 anos para se cadastrar
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Senha
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 border text-gray-800 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            required
          />
          {formData.password && (
            <>
              <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300`}
                  style={{
                    width: `${(passwordStrength.score / 4) * 100}%`,
                    backgroundColor: passwordStrength.color,
                  }}
                ></div>
              </div>
              <p
                className="mt-1 text-xs"
                style={{ color: passwordStrength.color }}
              >
                Força da senha: {passwordStrength.label}
              </p>
            </>
          )}
          <p className="mt-1 text-xs text-gray-500">
            A senha deve ter pelo menos 8 caracteres com letras maiúsculas,
            minúsculas, números e caracteres especiais
          </p>
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Confirmar Senha
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`w-full px-3 py-2 mt-1 border border-gray-300 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
              formData.confirmPassword &&
              formData.password !== formData.confirmPassword
                ? "border-red-300 bg-red-50"
                : formData.confirmPassword &&
                    formData.password === formData.confirmPassword
                  ? "border-green-300 bg-green-50"
                  : ""
            }`}
            required
          />
          {formData.confirmPassword &&
            formData.password !== formData.confirmPassword && (
              <p className="mt-1 text-xs text-red-600">
                As senhas não coincidem
              </p>
            )}
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-amber-500 rounded-md hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:bg-amber-300 transition-colors duration-200"
          >
            {isLoading ? "Criando conta..." : "Cadastrar"}
          </button>
        </div>
      </form>

      <div className="mt-4 text-center w-full">
        <p className="text-sm text-gray-600">
          Já tem uma conta?{" "}
          <button
            onClick={onToggleForm}
            className="text-amber-600 hover:text-amber-800 hover:underline focus:outline-none"
          >
            Entrar
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
