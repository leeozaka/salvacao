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

  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!formData.name) newErrors.push("Name is required");
    if (!formData.email) newErrors.push("Email is required");
    if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.push("Invalid email format");

    if (!formData.password) newErrors.push("Password is required");
    if (!isValidPassword(formData.password)) {
      newErrors.push(
        "Password must have at least 8 characters with uppercase, lowercase, numbers and special characters",
      );
    }
    if (formData.password !== formData.confirmPassword)
      newErrors.push("Passwords do not match");

    if (!formData.cpf) newErrors.push("CPF is required");
    if (!isValidCPF(formData.cpf)) newErrors.push("Invalid CPF format");

    if (!formData.telephone) newErrors.push("Telephone is required");
    if (!isValidPhone(formData.telephone))
      newErrors.push("Invalid phone number format");

    if (!formData.birthday) newErrors.push("Birthday is required");

    setErrors(newErrors);
    return newErrors.length === 0;
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
        setErrors([result.message || "Registration failed"]);
      }
    } catch (error) {
      setErrors(["An unexpected error occurred"]);
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

      {errors.length > 0 && (
        <div className="p-3 mb-4 text-sm text-red-500 bg-red-50 border border-red-200 rounded">
          <ul className="list-disc list-inside">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
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
            }}
            placeholder="000.000.000-00"
            maxLength={14}
            className="w-full px-3 py-2 mt-1 border border-gray-300 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
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
            }}
            placeholder="(00) 00000-0000"
            maxLength={15}
            className="w-full px-3 py-2 mt-1 border text-gray-800 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
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
          <p className="mt-1 text-xs text-gray-500">
            Password must be at least 8 characters with numbers and special
            characters
          </p>
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
