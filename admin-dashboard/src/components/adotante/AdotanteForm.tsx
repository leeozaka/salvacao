"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Adotante, Pessoa } from "@/types/entities";
import { TipoMoradia } from "@/types/enums";
import {
  cadastrarAdotante,
  atualizarAdotante,
  buscarAdotantePorId,
  buscarPessoas, // Assuming a function to fetch a single adopter by ID
} from "@/services/adotanteService";
import { formatCPF, formatPhone } from "@/utils/validationUtils";

interface AdotanteFormProps {
  adotanteId?: string;
}

const AdotanteForm: React.FC<AdotanteFormProps> = ({ adotanteId }) => {
  const router = useRouter();
  const [modoEdicao, setModoEdicao] = useState<boolean>(!!adotanteId);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [formData, setFormData] = useState<Adotante>({
    id: 0,
    idPessoa: 0,
    pessoa: {
      id: 0,
      tipoDocumento: "CPF",
      documentoIdentidade: "",
      nome: "",
      email: "",
      telefone: "",
      endereco: "",
    },
    motivacaoAdocao: "",
    experienciaAnteriorAnimais: "",
    tipoMoradia: "",
    permiteAnimaisMoradia: false,
  });

  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  //   const [loadingPessoas, setLoadingPessoas] = useState<boolean>(false);
  //   const [errorPessoas, setErrorPessoas] = useState<string>("");

  useEffect(() => {
    if (!modoEdicao) {
      const carregarPessoas = async () => {
        // setLoadingPessoas(true);
        try {
          const pessoasData = await buscarPessoas();
          setPessoas(pessoasData);
        } catch (err) {
          // setErrorPessoas("Erro ao carregar pessoas.");
          console.error("Erro ao carregar pessoas:", err);
        } finally {
          // setLoadingPessoas(false);
        }
      };
      carregarPessoas();
    }
  }, [modoEdicao]);

  useEffect(() => {
    if (adotanteId) {
      const carregarAdotante = async () => {
        setLoading(true);
        try {
          const adotante = await buscarAdotantePorId(adotanteId);
          if (adotante) {
            setFormData(adotante);
            setModoEdicao(true);
          } else {
            setError("Adotante não encontrado.");
          }
        } catch (err) {
          setError("Erro ao carregar dados do adotante.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      carregarAdotante();
    } else {
      setFormData({
        id: 0,
        idPessoa: 0,
        pessoa: {
          id: 0,
          tipoDocumento: "CPF",
          documentoIdentidade: "",
          nome: "",
          email: "",
          telefone: "",
          endereco: "",
        },
        motivacaoAdocao: "",
        experienciaAnteriorAnimais: "",
        tipoMoradia: "",
        permiteAnimaisMoradia: false,
      });
      setModoEdicao(false);
    }
  }, [adotanteId]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked; // For checkboxes

    if (name === "idPessoa") {
      const selectedPessoaId = parseInt(value, 10);
      const selectedPessoa = pessoas.find((p) => p.id === selectedPessoaId);
      if (selectedPessoa) {
        setFormData((prev) => ({
          ...prev,
          idPessoa: selectedPessoa.id,
          pessoa: { ...selectedPessoa },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          idPessoa: 0,
          pessoa: {
            id: 0,
            tipoDocumento: "CPF",
            documentoIdentidade: "",
            nome: "",
            email: "",
            telefone: "",
            endereco: "",
          },
        }));
      }
    } else if (name.startsWith("pessoa.")) {
      const pessoaField = name.split(".")[1];
      let processedValue = value;
      if (pessoaField === "documentoIdentidade") {
        processedValue = formatCPF(value);
      } else if (pessoaField === "telefone") {
        processedValue = formatPhone(value);
      }
      setFormData((prev) => ({
        ...prev,
        pessoa: {
          ...prev.pessoa,
          [pessoaField]: processedValue,
        },
      }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      if (modoEdicao && formData.id) {
        await atualizarAdotante(formData.id, formData);
      } else {
        await cadastrarAdotante(formData);
      }
      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard/pessoas/adotante");
      }, 1500);
    } catch (err) {
      setError(
        modoEdicao
          ? "Erro ao atualizar adotante."
          : "Erro ao cadastrar adotante.",
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.pessoa.nome && adotanteId) {
    return (
      <div className="flex justify-center items-center h-64">
        <div
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
          style={{ borderColor: "var(--color-secondary-color)" }}
        ></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-100 text-blue-600 mr-3">
          <i className="bi bi-person-plus"></i>
        </div>
        <h2 className="text-xl font-semibold text-gray-800">
          {modoEdicao ? "Editar Adotante" : "Cadastrar Novo Adotante"}
        </h2>
      </div>

      {success && (
        <div className="bg-green-100 border border-green-200 text-green-800 px-4 py-3 rounded mb-4 flex items-center">
          <i className="bi bi-check-circle mr-2"></i>
          <span>
            {modoEdicao
              ? "Adotante atualizado com sucesso!"
              : "Adotante cadastrado com sucesso!"}
          </span>
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
          <div className="col-span-2">
            <h4 className="text-md font-medium text-gray-700 mb-3">
              Dados Pessoais
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CPF{" "}
                  {!modoEdicao ? <span className="text-red-500">*</span> : ""}
                </label>
                {!modoEdicao && (
                  <select
                    name="idPessoa"
                    value={formData.idPessoa || ""}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                    required={!modoEdicao}
                  >
                    <option value="">Selecione uma Pessoa...</option>
                    {pessoas.map((pessoa) => (
                      <option key={pessoa.id} value={pessoa.id}>
                        {pessoa.nome} ({pessoa.documentoIdentidade})
                      </option>
                    ))}
                  </select>
                )}
                <input
                  type="text"
                  name="pessoa.documentoIdentidade"
                  value={formData.pessoa.documentoIdentidade}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={modoEdicao}
                  maxLength={14}
                  placeholder="000.000.000-00"
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo{" "}
                  {!modoEdicao ? <span className="text-red-500">*</span> : ""}
                </label>
                <input
                  type="text"
                  name="pessoa.nome"
                  value={formData.pessoa.nome}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={modoEdicao}
                  placeholder="Nome do adotante"
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email{" "}
                  {!modoEdicao ? <span className="text-red-500">*</span> : ""}
                </label>
                <input
                  type="email"
                  name="pessoa.email"
                  value={formData.pessoa.email}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={modoEdicao}
                  placeholder="exemplo@email.com"
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone{" "}
                  {!modoEdicao ? <span className="text-red-500">*</span> : ""}
                </label>
                <input
                  type="text"
                  name="pessoa.telefone"
                  value={formData.pessoa.telefone}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={modoEdicao}
                  maxLength={15}
                  placeholder="(00) 00000-0000"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Endereço{" "}
                  {!modoEdicao ? <span className="text-red-500">*</span> : ""}
                </label>
                <input
                  type="text"
                  name="pessoa.endereco"
                  value={formData.pessoa.endereco}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={modoEdicao}
                  placeholder="Rua, Número, Bairro, Cidade - UF"
                  disabled
                />
              </div>
            </div>
          </div>

          <div className="col-span-2">
            <h4 className="text-md font-medium text-gray-700 mb-3">
              Informações sobre Adoção
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="motivacaoAdocao"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Motivação para Adoção <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="motivacaoAdocao"
                  name="motivacaoAdocao"
                  value={formData.motivacaoAdocao}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="Descreva brevemente por que deseja adotar"
                />
              </div>
              <div>
                <label
                  htmlFor="experienciaAnteriorAnimais"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Experiência Anterior com Animais{" "}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="experienciaAnteriorAnimais"
                  name="experienciaAnteriorAnimais"
                  value={formData.experienciaAnteriorAnimais}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="Descreva sua experiência anterior com animais de estimação"
                />
              </div>
              <div>
                <label
                  htmlFor="tipoMoradia"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Tipo de Moradia <span className="text-red-500">*</span>
                </label>
                <select
                  id="tipoMoradia"
                  name="tipoMoradia"
                  value={formData.tipoMoradia}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecione...</option>
                  {Object.values(TipoMoradia).map((value) => (
                    <option key={value as string} value={value as string}>
                      {typeof value === "string"
                        ? (value as string).replace(/_/g, " ")
                        : value}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center mt-4 md:mt-8">
                <input
                  id="permiteAnimaisMoradia"
                  name="permiteAnimaisMoradia"
                  type="checkbox"
                  checked={formData.permiteAnimaisMoradia}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="permiteAnimaisMoradia"
                  className="ml-2 block text-sm font-medium text-gray-700"
                >
                  Permite animais na moradia?
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={() => router.push("/dashboard/pessoas/adotante")}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded mr-2"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                Salvando...
              </>
            ) : (
              <>
                <i className="bi bi-check2 mr-2"></i>
                {modoEdicao ? "Atualizar Adotante" : "Cadastrar Adotante"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdotanteForm;
