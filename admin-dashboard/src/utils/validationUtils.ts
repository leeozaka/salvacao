import { param } from "framer-motion/client";

/**
 * Validates a Brazilian CPF number
 * @param cpf CPF number to validate
 * @returns boolean indicating if CPF is valid
 */
export function isValidCPF(cpf: string): boolean {
  const cleanCPF = cpf.replace(/\D/g, "");

  if (cleanCPF.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;

  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i)) * (11 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i)) * (12 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;

  return remainder === parseInt(cleanCPF.substring(10, 11));
}

/**
 * Validates a Brazilian phone number
 * @param phone Phone number to validate
 * @returns boolean indicating if phone number is valid
 */
export function isValidPhone(phone: string): boolean {
  const cleanPhone = phone.replace(/\D/g, "");

  if (cleanPhone.length !== 10 && cleanPhone.length !== 11) return false;
  if (/^(\d)\1+$/.test(cleanPhone)) return false;

  const ddd = parseInt(cleanPhone.substring(0, 2));
  if (ddd < 11 || ddd > 99) return false;

  if (cleanPhone.length === 11 && cleanPhone.charAt(2) !== "9") return false;

  return true;
}

/**
 * Validates a password strength
 * Must contain:
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 * @param password Password to validate
 * @returns boolean indicating if password meets requirements
 */
export function isValidPassword(password: string): boolean {
  if (!password) return false;

  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[#?!@$%^&*\-_=+[\]{}|;:,.<>()/"'\\]/.test(password);

  return (
    hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar
  );
}

/**
 * Validates a password strength and returns detailed validation results
 * @param password Password to validate
 * @returns Object with validation status and errors
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!password || password.length < 8) {
    errors.push("A senha deve ter pelo menos 8 caracteres");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("A senha deve conter pelo menos uma letra maiúscula");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("A senha deve conter pelo menos uma letra minúscula");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("A senha deve conter pelo menos um número");
  }

  if (!/[#?!@$%^&*\-_=+[\]{}|;:,.<>()/"'\\]/.test(password)) {
    errors.push("A senha deve conter pelo menos um caractere especial");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Calculates password strength score
 * @param password Password to evaluate
 * @returns Object with score, label and color for UI feedback
 */
export function getPasswordStrength(password: string): {
  score: number; // 0-4
  label: string; // 'Fraca', 'Média', 'Forte', 'Muito forte'
  color: string; // 'red', 'orange', 'yellow', 'green'
} {
  if (!password) {
    return { score: 0, label: "Muito fraca", color: "red" };
  }

  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[#?!@$%^&*\-_=+[\]{}|;:,.<>()/"'\\]/.test(password)) score++;

  // Usar uma abordagem tipo-segura para definir a força
  const finalScore = Math.min(score, 4);

  if (finalScore === 0) return { score: 0, label: "Muito fraca", color: "red" };
  if (finalScore === 1) return { score: 1, label: "Fraca", color: "red" };
  if (finalScore === 2) return { score: 2, label: "Média", color: "orange" };
  if (finalScore === 3) return { score: 3, label: "Forte", color: "green" };
  return { score: 4, label: "Muito forte", color: "green" };
}

/**
 * Format CPF with dots and dash
 * @param cpf CPF string (with or without formatting)
 * @returns Formatted CPF string
 */
export function formatCPF(cpf: string): string {
  const digits = cpf.replace(/\D/g, "");
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9)
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
}

/**
 * Format phone number with parentheses and dash
 * @param phone Phone string (with or without formatting)
 * @returns Formatted phone string
 */
export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

/**
 * Format CEP number with parentheses and dash
 * @param cep CEP string (with or without formatting)
 * @returns Formatted CEP string
 */

export const formatCEP = (cep: string): string => {
  cep = cep.replace(/\D/g, "");

  if (cep.length <= 8) {
    cep = cep.replace(/(\d{5})(\d)/, "$1-$2");
  }

  return cep;
};

/**
 * Validates if email format is correct
 * @param email Email to validate
 * @returns boolean indicating if email format is valid
 */
export function isValidEmail(email: string): boolean {
  // Regex básica para validar formato de email
  const basicEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!basicEmailRegex.test(email)) return false;

  // Verificações adicionais
  const parts = email.split("@");
  const domain = parts[1];

  // Verificar se o domínio tem pelo menos 1 ponto
  if (!domain.includes(".")) return false;

  // Verificar se o domínio principal tem pelo menos 2 caracteres
  const domainParts = domain.split(".");
  const tld = domainParts[domainParts.length - 1];
  if (tld.length < 2) return false;

  return true;
}

/**
 * Validates if the user is of legal age
 * @param birthday Birthday date string in YYYY-MM-DD format
 * @param minAge Minimum age required (default: 18)
 * @returns boolean indicating if user is of legal age
 */
export function isValidBirthday(birthday: string, minAge = 18): boolean {
  try {
    const birthdayDate = new Date(birthday);

    // Verificar se a data é válida
    if (isNaN(birthdayDate.getTime())) return false;

    const today = new Date();

    // Verificar se a data de nascimento não é no futuro
    if (birthdayDate > today) return false;

    let age = today.getFullYear() - birthdayDate.getFullYear();
    const monthDiff = today.getMonth() - birthdayDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthdayDate.getDate())
    ) {
      age--;
    }

    return age >= minAge;
  } catch (error) {
    return false;
  }
}
