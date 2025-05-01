"use client";

import { useState } from "react";
import { registerUser } from "@/services/authService";
import {
  isValidCPF,
  isValidPhone,
  isValidPassword,
  formatCPF,
  formatPhone,
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
        return value ? "" : "Name is required";
      case "email":
        if (!value) return "Email is required";
        return /^\S+@\S+\.\S+$/.test(value) ? "" : "Invalid email format";
      case "password":
        if (!value) return "Password is required";
        return isValidPassword(value)
          ? ""
          : "Password must have at least 8 characters with uppercase, lowercase, numbers and special characters";
      case "confirmPassword":
        return value === formData.password ? "" : "Passwords do not match";
      case "cpf":
        if (!value) return "CPF is required";
        return isValidCPF(value) ? "" : "Invalid CPF format";
      case "telephone":
        if (!value) return "Telephone is required";
        return isValidPhone(value) ? "" : "Invalid phone number format";
      case "birthday":
        return value ? "" : "Birthday is required";
      default:
        return "";
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    Object.entries(formData).forEach(([name, value]) => {
      const error = validateField(name, value);
      if (error) newErrors[name] = error;
    });

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
        setErrors({ general: result.message || "Registration failed" });
      }
    } catch (error) {
      setErrors({ general: "An unexpected error occurred" });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <h1 className="text-2xl font-bold text-center mb-4 text-black">
        Create an Account
      </h1>

      {errors.general && (
        <div className="p-3 mb-4 text-sm text-red-500 bg-red-50 border border-red-200 rounded">
          <p>{errors.general}</p>
        </div>
      )}

      {Object.keys(errors).length > 0 && Object.keys(errors).some(key => key !== 'general' && errors[key]) && (
        <div className="p-3 mb-4 text-sm text-red-500 bg-red-50 border border-red-200 rounded">
          <ul className="list-disc list-inside">
            {Object.entries(errors).map(([field, message]) => 
              field !== 'general' && message ? (
                <li key={field}>{message}</li>
              ) : null
            )}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 border text-gray-800 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full px-3 py-2 mt-1 border  text-gray-800 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
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
              setErrors((prev) => ({ ...prev, cpf: errorMessage }))
            }}
            placeholder="000.000.000-00"
            maxLength={14}
            className="w-full px-3 py-2 mt-1 border border-gray-300 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {errors.cpf && (
            <p className="mt-1 text-xs text-red-500">{errors.cpf}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="telephone"
            className="block text-sm font-medium text-gray-700"
          >
            Telephone
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
            className="w-full px-3 py-2 mt-1 border text-gray-800 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {errors.telephone && (
            <p className="mt-1 text-xs text-red-500">{errors.telephone}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="birthday"
            className="block text-sm font-medium text-gray-700"
          >
            Birth Date
          </label>
          <input
            id="birthday"
            name="birthday"
            type="date"
            value={formData.birthday}
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 border text-gray-800 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {errors.birthday && (
            <p className="mt-1 text-xs text-red-500">{errors.birthday}</p>
          )}
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
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 border text-gray-800 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">{errors.password}</p>
          )}
          {/* <p className="mt-1 text-xs text-gray-500">
            Password must be at least 8 characters with numbers and special
            characters
          </p> */}
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 border border-gray-300 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
          )}
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
          >
            {isLoading ? "Creating account..." : "Register"}
          </button>
        </div>
      </form>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <button
            onClick={onToggleForm}
            className="text-blue-600 hover:underline focus:outline-none"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
