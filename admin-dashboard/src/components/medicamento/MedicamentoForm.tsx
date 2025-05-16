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
  // Estado do formulário
  const [formData, setFormData] = useState<
    CreateMedicamentoDTO | MedicamentoBackend
  >(medicamento);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>("");

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
  };

  // Handler para campos numéricos
  const handleNumberChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: parseInt(value),
    }));
  };

  // Handler para checkbox
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // Handler para envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação básica
    if (!formData.nome?.trim()) {
      setFormError("Nome do medicamento é obrigatório");
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError("");
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-lg mx-4 relative z-10">
      <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <h3 className="text-lg font-semibold text-primary-color dark:text-primary-color-dark">
          {title}
        </h3>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="p-6">
          {formError && (
            <div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-4 mb-4">
              <p>{formError}</p>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
              Nome:
            </label>
            <input
              type="text"
              name="nome"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color dark:bg-gray-700 dark:text-white"
              placeholder="Nome do medicamento"
              value={formData.nome}
              onChange={handleTextChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
              Código de Barras:
            </label>
            <input
              type="text"
              name="codigoBarras"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color dark:bg-gray-700 dark:text-white"
              placeholder="Código de barras (opcional)"
              value={formData.codigoBarras || ""}
              onChange={handleTextChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
              Tipo de Produto:
            </label>
            <select
              name="idTipoProduto"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color dark:bg-gray-700 dark:text-white"
              value={formData.idTipoProduto}
              onChange={handleNumberChange}
              required
            >
              <option value={0}>Selecione um tipo</option>
              {tiposProduto.map((tipo) => (
                <option key={tipo.idtipoproduto} value={tipo.idtipoproduto}>
                  {tipo.descricao}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
              Unidade de Medida:
            </label>
            <select
              name="idUnidadeMedidaPadrao"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color dark:bg-gray-700 dark:text-white"
              value={formData.idUnidadeMedidaPadrao}
              onChange={handleNumberChange}
              required
            >
              <option value={0}>Selecione uma unidade</option>
              {unidadesMedida.map((unidade) => (
                <option
                  key={unidade.idunidademedida}
                  value={unidade.idunidademedida}
                >
                  {unidade.descricao}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
              Descrição:
            </label>
            <textarea
              name="descricao"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color dark:bg-gray-700 dark:text-white"
              rows={2}
              placeholder="Descrição do medicamento (opcional)"
              value={formData.descricao || ""}
              onChange={handleTextChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
              Princípio Ativo:
            </label>
            <input
              type="text"
              name="principioAtivo"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color dark:bg-gray-700 dark:text-white"
              placeholder="Princípio ativo do medicamento"
              value={formData.principioAtivo || ""}
              onChange={handleTextChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
              Dosagem:
            </label>
            <input
              type="text"
              name="dosagem"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color dark:bg-gray-700 dark:text-white"
              placeholder="Dosagem do medicamento"
              value={formData.dosagem || ""}
              onChange={handleTextChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
              Fabricante:
            </label>
            <input
              type="text"
              name="fabricante"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color dark:bg-gray-700 dark:text-white"
              placeholder="Nome do fabricante"
              value={formData.fabricante || ""}
              onChange={handleTextChange}
            />
          </div>

          <div className="mb-4">
            <label className="flex items-center text-gray-700 dark:text-gray-300 text-sm font-semibold">
              <input
                type="checkbox"
                name="necessitaReceita"
                className="rounded text-amber-600 focus:ring-amber-500 h-4 w-4 mr-2 dark:bg-gray-700"
                checked={formData.necessitaReceita || false}
                onChange={handleCheckboxChange}
              />
              Necessita Receita
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-6">
              Marque esta opção se o medicamento exige prescrição médica
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end">
          <button
            type="button"
            className="mr-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary-color hover:bg-primary-color-hover text-white rounded-lg disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MedicamentoForm;
