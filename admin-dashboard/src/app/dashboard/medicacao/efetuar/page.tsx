"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";

// Definição das interfaces
interface Animal {
  id: number;
  nome: string;
  especie: string;
  porte: string;
  peso: string;
}

interface Medicamento {
  id: number;
  nome: string;
  categoria: string;
}

interface FormDataType {
  animalId: string;
  medicamentoId: string;
  dose: string;
  unidade: string;
  data: string;
  hora: string;
  observacoes: string;
  viaAdministracao: string;
  responsavel: string;
}

type UnidadeType = "ml" | "mg" | "comprimido" | "gota" | "aplicação";
type ViaAdministracaoType =
  | "oral"
  | "injetável"
  | "tópica"
  | "ocular"
  | "auricular";

const RegistroMedicacao: React.FC = () => {
  // Estados para controlar os dados do formulário
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Estado para armazenar os dados do formulário
  const [formData, setFormData] = useState<FormDataType>({
    animalId: "",
    medicamentoId: "",
    dose: "",
    unidade: "ml",
    data: new Date().toISOString().split("T")[0],
    hora: new Date().toTimeString().slice(0, 5),
    observacoes: "",
    viaAdministracao: "oral",
    responsavel: "",
  });

  // Efeito para carregar os dados iniciais (simulado)
  useEffect(() => {
    // Simulando carregamento de dados do backend
    setAnimais([
      { id: 1, nome: "Rex", especie: "Cachorro", porte: "Médio", peso: "12kg" },
      { id: 2, nome: "Miau", especie: "Gato", porte: "Pequeno", peso: "3.5kg" },
      {
        id: 3,
        nome: "Totó",
        especie: "Cachorro",
        porte: "Grande",
        peso: "25kg",
      },
      { id: 4, nome: "Luna", especie: "Gato", porte: "Médio", peso: "4kg" },
    ]);

    setMedicamentos([
      { id: 1, nome: "Amoxicilina", categoria: "Antibiótico" },
      { id: 2, nome: "Dipirona", categoria: "Analgésico" },
      { id: 3, nome: "Vermífugo", categoria: "Antiparasitário" },
      { id: 4, nome: "Prednisolona", categoria: "Anti-inflamatório" },
    ]);
  }, []);

  // Função para lidar com mudanças nos campos do formulário
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    // Validação básica
    if (!formData.animalId || !formData.medicamentoId || !formData.dose) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      setLoading(false);
      return;
    }

    // Simulando uma chamada API
    setTimeout(() => {
      console.log("Dados enviados:", formData);

      // Simulando sucesso
      setSuccess(true);
      setLoading(false);

      // Resetar o formulário após sucesso
      setFormData({
        animalId: "",
        medicamentoId: "",
        dose: "",
        unidade: "ml",
        data: new Date().toISOString().split("T")[0],
        hora: new Date().toTimeString().slice(0, 5),
        observacoes: "",
        viaAdministracao: "oral",
        responsavel: "",
      });
    }, 1500);
  };

  // Encontrar os detalhes do animal selecionado
  const animalSelecionado = formData.animalId
    ? animais.find((animal) => animal.id === parseInt(formData.animalId))
    : null;

  // Encontrar os detalhes do medicamento selecionado
  const medicamentoSelecionado = formData.medicamentoId
    ? medicamentos.find((med) => med.id === parseInt(formData.medicamentoId))
    : null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-amber-100 text-amber-600 mr-3">
          <i className="bi bi-capsule"></i>
        </div>
        <h2 className="text-xl font-semibold text-gray-800">
          Registro de Medicação
        </h2>
      </div>

      {success && (
        <div className="bg-green-100 border border-green-200 text-green-800 px-4 py-3 rounded mb-4 flex items-center">
          <i className="bi bi-check-circle mr-2"></i>
          <span>Medicação registrada com sucesso!</span>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-200 text-red-800 px-4 py-3 rounded mb-4 flex items-center">
          <i className="bi bi-exclamation-circle mr-2"></i>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Seleção do Animal */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="animalId"
            >
              Animal <span className="text-red-500">*</span>
            </label>
            <select
              id="animalId"
              name="animalId"
              value={formData.animalId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            >
              <option value="">Selecione o animal</option>
              {animais.map((animal) => (
                <option key={animal.id} value={animal.id}>
                  {animal.nome} ({animal.especie}, {animal.peso})
                </option>
              ))}
            </select>
          </div>

          {/* Seleção do Medicamento */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="medicamentoId"
            >
              Medicamento <span className="text-red-500">*</span>
            </label>
            <select
              id="medicamentoId"
              name="medicamentoId"
              value={formData.medicamentoId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            >
              <option value="">Selecione o medicamento</option>
              {medicamentos.map((med) => (
                <option key={med.id} value={med.id}>
                  {med.nome} ({med.categoria})
                </option>
              ))}
            </select>
          </div>

          {/* Dose e Unidade */}
          <div className="flex space-x-3">
            <div className="flex-1">
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="dose"
              >
                Dose <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="dose"
                name="dose"
                value={formData.dose}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                min="0"
                step="0.1"
                required
              />
            </div>
            <div className="w-24">
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="unidade"
              >
                Unidade
              </label>
              <select
                id="unidade"
                name="unidade"
                value={formData.unidade}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="ml">ml</option>
                <option value="mg">mg</option>
                <option value="comprimido">comprimido</option>
                <option value="gota">gotas</option>
                <option value="aplicação">aplicação</option>
              </select>
            </div>
          </div>

          {/* Via de Administração */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="viaAdministracao"
            >
              Via de Administração
            </label>
            <select
              id="viaAdministracao"
              name="viaAdministracao"
              value={formData.viaAdministracao}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="oral">Oral</option>
              <option value="injetável">Injetável</option>
              <option value="tópica">Tópica</option>
              <option value="ocular">Ocular</option>
              <option value="auricular">Auricular</option>
            </select>
          </div>

          {/* Data e Hora */}
          <div className="flex space-x-3">
            <div className="flex-1">
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="data"
              >
                Data <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="data"
                name="data"
                value={formData.data}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
            <div className="flex-1">
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="hora"
              >
                Hora <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                id="hora"
                name="hora"
                value={formData.hora}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
          </div>

          {/* Responsável */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="responsavel"
            >
              Responsável pela Aplicação
            </label>
            <input
              type="text"
              id="responsavel"
              name="responsavel"
              value={formData.responsavel}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Nome do responsável"
            />
          </div>

          {/* Observações */}
          <div className="md:col-span-2">
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="observacoes"
            >
              Observações
            </label>
            <textarea
              id="observacoes"
              name="observacoes"
              value={formData.observacoes}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Informações adicionais sobre a medicação..."
            ></textarea>
          </div>
        </div>

        {/* Resumo da medicação */}
        {animalSelecionado && medicamentoSelecionado && formData.dose && (
          <div className="mt-6 p-4 bg-amber-50 rounded-md border border-amber-100">
            <h3 className="font-medium text-amber-800 mb-2">
              Resumo da medicação
            </h3>
            <p className="text-gray-700">
              Aplicar{" "}
              <span className="font-medium">
                {formData.dose} {formData.unidade}
              </span>{" "}
              de{" "}
              <span className="font-medium">{medicamentoSelecionado.nome}</span>{" "}
              via{" "}
              <span className="font-medium">{formData.viaAdministracao}</span>{" "}
              no animal{" "}
              <span className="font-medium">{animalSelecionado.nome}</span> (
              {animalSelecionado.especie}, {animalSelecionado.peso}).
            </p>
          </div>
        )}

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            onClick={() => window.history.back()}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <i className="bi bi-arrow-repeat animate-spin mr-2"></i>
                Registrando...
              </span>
            ) : (
              "Registrar Medicação"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistroMedicacao;
