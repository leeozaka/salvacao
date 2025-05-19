"use client";

import React, { useState, useEffect } from "react";
import { Adotante } from "@/types/entities";
import { buscarAdotantes, excluirAdotante } from "@/services/adotanteService";
import { useRouter } from "next/navigation";

const AdotanteClientPage: React.FC = () => {
  const router = useRouter();
  const [adotantes, setAdotantes] = useState<Adotante[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const carregarAdotantes = async () => {
      setLoading(true);
      try {
        const dadosAdotantes = await buscarAdotantes();
        setAdotantes(dadosAdotantes);
      } catch (error) {
        setError("Erro ao carregar adotantes");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    carregarAdotantes();
  }, []);

  const novoAdotante = () => {
    router.push("/dashboard/pessoas/adotante/novo");
  };

  const editarAdotante = (id: number) => {
    const adotanteToEdit = adotantes.find((adotante) => adotante.id === id);
    if (adotanteToEdit && adotanteToEdit.pessoa) {
      const { nome, documentoIdentidade, email, telefone, endereco } =
        adotanteToEdit.pessoa;
      const queryParams = new URLSearchParams({
        nome: nome || "",
        cpf: documentoIdentidade || "",
        email: email || "",
        telefone: telefone || "",
        endereco: endereco || "",
      }).toString();
      router.push(`/dashboard/pessoas/adotante/${id}?${queryParams}`);
    } else {
      router.push(`/dashboard/pessoas/adotante/${id}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja excluir este adotante?")) {
      return;
    }
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      await excluirAdotante(id.toString());
      const dadosAdotantes = await buscarAdotantes();
      setAdotantes(dadosAdotantes);
      setSuccess(true);
      setError("");
    } catch (error) {
      setError("Erro ao excluir adotante");
      setSuccess(false);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl mx-auto overflow-hidden">
      <div className="bg-color-menu-bg border-b border-color-primary-color/20 px-6 py-4">
        <h3 className="text-xl font-semibold text-color-primary-color flex items-center">
          <i className="bi bi-person-lines-fill mr-3"></i> Gerenciamento de
          Adotantes
        </h3>
      </div>

      <div className="p-6">
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-r-md animate-fadeIn">
            <div className="flex items-center">
              <i className="bi bi-check-circle text-lg mr-3"></i>
              <span>Adotante excluído com sucesso!</span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-md animate-fadeIn">
            <div className="flex items-center">
              <i className="bi bi-exclamation-circle text-lg mr-3"></i>
              <span>{error}</span>
            </div>
          </div>
        )}

        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-color-text-color">
              Lista de Adotantes
            </h3>
            <button
              onClick={novoAdotante}
              className="bg-color-primary-color hover:bg-color-primary-color-dark text-white font-semibold px-4 py-2.5 rounded-lg flex items-center transition-colors duration-150"
            >
              <i className="bi bi-plus-circle mr-2"></i>
              Novo Adotante
            </button>
          </div>

          {loading && !adotantes.length ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-color-secondary-color"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 border-color-bg-color">
                <thead>
                  <tr className="bg-gray-50">
                    {[
                      "Nome",
                      "CPF",
                      "Email",
                      "Telefone",
                      "Endereço",
                      "Ações",
                    ].map((label) => (
                      <th
                        key={label}
                        className="py-3 px-4 border-b border-gray-200 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      >
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {adotantes.length === 0 && !loading ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-4 px-4 text-center text-gray-500"
                      >
                        Nenhum adotante cadastrado
                      </td>
                    </tr>
                  ) : (
                    adotantes.map((adotante) => (
                      <tr
                        key={adotante.id}
                        className="hover:bg-gray-100 transition-colors duration-150"
                      >
                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">
                          {adotante.pessoa.nome}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">
                          {adotante.pessoa.documentoIdentidade}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">
                          {adotante.pessoa.email}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">
                          {adotante.pessoa.telefone}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">
                          {adotante.pessoa.endereco}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-sm">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => editarAdotante(adotante.id)}
                              className="text-color-primary-color hover:text-color-primary-color-dark p-1 rounded-md transition-colors duration-150"
                              title="Editar"
                            >
                              <i className="bi bi-pencil-square"></i>
                            </button>
                            <button
                              onClick={() => handleDelete(adotante.id)}
                              className="text-red-500 hover:text-red-700 p-1 rounded-md transition-colors duration-150"
                              title="Excluir"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdotanteClientPage;
