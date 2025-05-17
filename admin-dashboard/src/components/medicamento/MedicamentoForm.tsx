// components/medicamento/MedicamentoForm.tsx
import React, { useState, useEffect } from "react";
import {
  CreateMedicamentoDTO,
  UpdateMedicamentoDTO,
} from "@/dto/MedicamentoDTO";
import { MedicamentoBackend } from "@/types/medicamento/medicamento";
import { MedicamentoFormProps } from "@/types/medicamento/MedicamentoFormProps";

const MedicamentoForm: React.FC<MedicamentoFormProps> = ({
  medicamento,
  tiposProduto,
  unidadesMedida,
  onSubmit,
  onCancel,
  isEditMode,
  title,
}) => {
  // Estado do formulário para lidar com os três tipos possíveis
  const [formData, setFormData] = useState<
    MedicamentoBackend | CreateMedicamentoDTO | UpdateMedicamentoDTO
  >(medicamento);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>("");
  const [formValidation, setFormValidation] = useState<{
    [key: string]: string;
  }>({});

  // Atualiza o formData se o medicamento mudar
  useEffect(() => {
    setFormData(medicamento);
  }, [medicamento]);

  // Handlers para campos de texto
  const handleTextChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpar erro de validação ao editar campo
    if (formValidation[name]) {
      setFormValidation((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  // Handler para campos numéricos
  const handleNumberChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: parseInt(value),
    }));

    // Limpar erro de validação ao editar campo
    if (formValidation[name]) {
      setFormValidation((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  // Handler para checkbox
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // Validação de formulário no cliente (mínima, o backend fará a validação completa)
  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!formData.nome || !formData.nome.trim()) {
      errors.nome = "Nome do medicamento é obrigatório";
    }

    if (!formData.idTipoProduto || formData.idTipoProduto === 0) {
      errors.idTipoProduto = "Selecione um tipo de produto";
    }

    if (
      !formData.idUnidadeMedidaPadrao ||
      formData.idUnidadeMedidaPadrao === 0
    ) {
      errors.idUnidadeMedidaPadrao = "Selecione uma unidade de medida";
    }

    setFormValidation(errors);
    return Object.keys(errors).length === 0;
  };

  // Handler para envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação no cliente antes de enviar ao backend
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError("");

      // Passamos o formData diretamente como está
      await onSubmit(formData);
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Erro ao processar formulário",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[var(--color-secondary-color-dark)] rounded-xl shadow-lg w-full max-w-2xl overflow-hidden">
      <div className="bg-[var(--color-menu-bg)] dark:bg-[var(--color-menu-bg-dark)] border-b border-[var(--color-primary-color)]/20 dark:border-[var(--color-primary-color-dark)]/20 px-6 py-4">
        <h3 className="text-xl font-semibold text-[var(--color-primary-color)] dark:text-white">
          {isEditMode ? (
            <span className="flex items-center">
              <i className="bi bi-pencil-square mr-2"></i> {title}
            </span>
          ) : (
            <span className="flex items-center">
              <i className="bi bi-plus-circle mr-2"></i> {title}
            </span>
          )}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="p-0">
        <div className="p-6">
          {formError && (
            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 mb-6 rounded-r-md animate-fadeIn">
              <div className="flex items-center">
                <i className="bi bi-exclamation-circle text-lg mr-3"></i>
                <p>{formError}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* Campo Nome */}
            <div className="md:col-span-2">
              <label
                htmlFor="nome"
                className={`block text-sm font-medium mb-1.5 ${
                  formValidation.nome
                    ? "text-red-600 dark:text-red-400"
                    : "text-[var(--color-text-color)] dark:text-[var(--color-text-color-dark)]"
                }`}
              >
                Nome do Medicamento <span className="text-red-500">*</span>
              </label>
              <input
                id="nome"
                type="text"
                name="nome"
                className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-colors
                ${
                  formValidation.nome
                    ? "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-900/20 focus:border-red-500 focus:ring-red-500/50 dark:focus:ring-red-500/30 text-red-900 dark:text-red-300"
                    : "border-gray-300 dark:border-gray-600 focus:border-[var(--color-primary-color)] focus:ring-[var(--color-primary-color)]/50 dark:focus:border-[var(--color-primary-color-dark)] dark:focus:ring-[var(--color-primary-color-dark)]/30 dark:bg-gray-700 text-[var(--color-text-color)] dark:text-[var(--color-text-color-dark)]"
                }`}
                placeholder="Nome completo do medicamento"
                value={formData.nome || ""}
                onChange={handleTextChange}
                required
              />
              {formValidation.nome && (
                <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <i className="bi bi-exclamation-triangle-fill mr-1.5"></i>
                  {formValidation.nome}
                </p>
              )}
            </div>

            {/* Código de Barras e Tipo de Produto */}
            <div>
              <label
                htmlFor="codigoBarras"
                className="block text-sm font-medium text-[var(--color-text-color)] dark:text-[var(--color-text-color-dark)] mb-1.5"
              >
                Código de Barras
              </label>
              <input
                id="codigoBarras"
                type="text"
                name="codigoBarras"
                className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-color)]/50 focus:border-[var(--color-primary-color)] dark:focus:ring-[var(--color-primary-color-dark)]/30 dark:focus:border-[var(--color-primary-color-dark)] dark:bg-gray-700 text-[var(--color-text-color)] dark:text-[var(--color-text-color-dark)] transition-colors"
                placeholder="Código de barras (opcional)"
                value={formData.codigoBarras || ""}
                onChange={handleTextChange}
              />
            </div>

            <div>
              <label
                htmlFor="idTipoProduto"
                className={`block text-sm font-medium mb-1.5 ${
                  formValidation.idTipoProduto
                    ? "text-red-600 dark:text-red-400"
                    : "text-[var(--color-text-color)] dark:text-[var(--color-text-color-dark)]"
                }`}
              >
                Tipo de Produto <span className="text-red-500">*</span>
              </label>
              <select
                id="idTipoProduto"
                name="idTipoProduto"
                className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-colors bg-white
                ${
                  formValidation.idTipoProduto
                    ? "border-red-300 dark:border-red-800 focus:border-red-500 focus:ring-red-500/50 dark:focus:ring-red-500/30 dark:bg-red-900/20 text-red-900 dark:text-red-300"
                    : "border-gray-300 dark:border-gray-600 focus:border-[var(--color-primary-color)] focus:ring-[var(--color-primary-color)]/50 dark:focus:border-[var(--color-primary-color-dark)] dark:focus:ring-[var(--color-primary-color-dark)]/30 dark:bg-gray-700 text-[var(--color-text-color)] dark:text-[var(--color-text-color-dark)]"
                }`}
                value={formData.idTipoProduto || 0}
                onChange={handleNumberChange}
                required
              >
                <option value={0} disabled>
                  Selecione um tipo
                </option>
                {tiposProduto.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.descricao}
                  </option>
                ))}
              </select>
              {formValidation.idTipoProduto && (
                <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <i className="bi bi-exclamation-triangle-fill mr-1.5"></i>
                  {formValidation.idTipoProduto}
                </p>
              )}
            </div>

            {/* Unidade de Medida e Dosagem */}
            <div>
              <label
                htmlFor="idUnidadeMedidaPadrao"
                className={`block text-sm font-medium mb-1.5 ${
                  formValidation.idUnidadeMedidaPadrao
                    ? "text-red-600 dark:text-red-400"
                    : "text-[var(--color-text-color)] dark:text-[var(--color-text-color-dark)]"
                }`}
              >
                Unidade de Medida <span className="text-red-500">*</span>
              </label>
              <select
                id="idUnidadeMedidaPadrao"
                name="idUnidadeMedidaPadrao"
                className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-colors bg-white
                ${
                  formValidation.idUnidadeMedidaPadrao
                    ? "border-red-300 dark:border-red-800 focus:border-red-500 focus:ring-red-500/50 dark:focus:ring-red-500/30 dark:bg-red-900/20 text-red-900 dark:text-red-300"
                    : "border-gray-300 dark:border-gray-600 focus:border-[var(--color-primary-color)] focus:ring-[var(--color-primary-color)]/50 dark:focus:border-[var(--color-primary-color-dark)] dark:focus:ring-[var(--color-primary-color-dark)]/30 dark:bg-gray-700 text-[var(--color-text-color)] dark:text-[var(--color-text-color-dark)]"
                }`}
                value={formData.idUnidadeMedidaPadrao || 0}
                onChange={handleTextChange}
                required
              >
                <option value={0} disabled>
                  Selecione uma unidade
                </option>
                {unidadesMedida.map((unidade) => (
                  <option 
                    key={unidade.id}
                    value={unidade.id}
                  >
                    {unidade.nome}
                  </option>
                ))}
              </select>
              {formValidation.idUnidadeMedidaPadrao && (
                <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <i className="bi bi-exclamation-triangle-fill mr-1.5"></i>
                  {formValidation.idUnidadeMedidaPadrao}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="dosagem"
                className="block text-sm font-medium text-[var(--color-text-color)] dark:text-[var(--color-text-color-dark)] mb-1.5"
              >
                Dosagem
              </label>
              <input
                id="dosagem"
                type="text"
                name="dosagem"
                className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-color)]/50 focus:border-[var(--color-primary-color)] dark:focus:ring-[var(--color-primary-color-dark)]/30 dark:focus:border-[var(--color-primary-color-dark)] dark:bg-gray-700 text-[var(--color-text-color)] dark:text-[var(--color-text-color-dark)] transition-colors"
                placeholder="Ex: 500, 10, 250"
                value={formData.dosagem || ""}
                onChange={handleTextChange}
              />
            </div>

            {/* Princípio Ativo e Fabricante */}
            <div>
              <label
                htmlFor="principioAtivo"
                className="block text-sm font-medium text-[var(--color-text-color)] dark:text-[var(--color-text-color-dark)] mb-1.5"
              >
                Princípio Ativo
              </label>
              <input
                id="principioAtivo"
                type="text"
                name="principioAtivo"
                className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-color)]/50 focus:border-[var(--color-primary-color)] dark:focus:ring-[var(--color-primary-color-dark)]/30 dark:focus:border-[var(--color-primary-color-dark)] dark:bg-gray-700 text-[var(--color-text-color)] dark:text-[var(--color-text-color-dark)] transition-colors"
                placeholder="Ex: Paracetamol, Dipirona, etc."
                value={formData.principioAtivo || ""}
                onChange={handleTextChange}
              />
            </div>

            <div>
              <label
                htmlFor="fabricante"
                className="block text-sm font-medium text-[var(--color-text-color)] dark:text-[var(--color-text-color-dark)] mb-1.5"
              >
                Fabricante
              </label>
              <input
                id="fabricante"
                type="text"
                name="fabricante"
                className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-color)]/50 focus:border-[var(--color-primary-color)] dark:focus:ring-[var(--color-primary-color-dark)]/30 dark:focus:border-[var(--color-primary-color-dark)] dark:bg-gray-700 text-[var(--color-text-color)] dark:text-[var(--color-text-color-dark)] transition-colors"
                placeholder="Nome do fabricante"
                value={formData.fabricante || ""}
                onChange={handleTextChange}
              />
            </div>

            {/* Descrição */}
            <div className="md:col-span-2">
              <label
                htmlFor="descricao"
                className="block text-sm font-medium text-[var(--color-text-color)] dark:text-[var(--color-text-color-dark)] mb-1.5"
              >
                Descrição
              </label>
              <textarea
                id="descricao"
                name="descricao"
                className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-color)]/50 focus:border-[var(--color-primary-color)] dark:focus:ring-[var(--color-primary-color-dark)]/30 dark:focus:border-[var(--color-primary-color-dark)] dark:bg-gray-700 text-[var(--color-text-color)] dark:text-[var(--color-text-color-dark)] transition-colors"
                rows={3}
                placeholder="Informações adicionais sobre o medicamento (opcional)"
                value={formData.descricao || ""}
                onChange={handleTextChange}
              />
            </div>

            {/* Necessita Receita */}
            <div className="md:col-span-2 mt-2">
              <div className="bg-[var(--color-menu-bg)] dark:bg-[var(--color-menu-bg-dark)] p-4 rounded-lg border border-[var(--color-primary-color)]/20 dark:border-[var(--color-primary-color-dark)]/20">
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="necessitaReceita"
                      className="sr-only"
                      checked={formData.necessitaReceita || false}
                      onChange={handleCheckboxChange}
                    />
                    <div
                      className={`block w-14 h-8 rounded-full transition-colors ${
                        formData.necessitaReceita
                          ? "bg-[var(--color-primary-color)] dark:bg-[var(--color-primary-color-dark)]"
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    ></div>
                    <div
                      className={`absolute left-1 top-1 bg-white dark:bg-gray-200 w-6 h-6 rounded-full transition-transform ${
                        formData.necessitaReceita
                          ? "transform translate-x-6"
                          : ""
                      }`}
                    ></div>
                  </div>
                  <div className="ml-3">
                    <span className="font-medium text-[var(--color-secondary-color)] dark:text-[var(--color-text-color-dark)]">
                      Necessita de Receita Médica
                    </span>
                    <p className="text-xs text-[var(--color-secondary-color)]/80 dark:text-[var(--color-text-color-dark)]/80 mt-0.5">
                      {formData.necessitaReceita
                        ? "Este medicamento só pode ser vendido mediante apresentação de receita."
                        : "Este medicamento pode ser vendido sem necessidade de receita."}
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[var(--color-menu-bg)]/50 dark:bg-[var(--color-menu-bg-dark)]/50 border-t border-[var(--color-primary-color)]/10 dark:border-[var(--color-primary-color-dark)]/10 px-6 py-4 flex justify-end gap-3">
          <button
            type="button"
            className="px-4 py-2.5 bg-white dark:bg-gray-700 text-[var(--color-text-color)] dark:text-[var(--color-text-color-dark)] border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-650 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500/30 dark:focus:ring-gray-400/30"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className={`px-5 py-2.5 bg-[var(--color-primary-color)] hover:bg-[var(--color-secondary-color)] dark:bg-[var(--color-primary-color-dark)] dark:hover:bg-[var(--color-primary-color-dark)]/80 text-white dark:text-[var(--color-text-color-dark)] rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-color)]/50 dark:focus:ring-[var(--color-primary-color-dark)]/50 flex items-center justify-center min-w-[100px] ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white dark:text-[var(--color-text-color-dark)]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Salvando...
              </>
            ) : (
              <>
                <i className="bi bi-check-lg mr-1.5"></i>
                Salvar
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MedicamentoForm;
