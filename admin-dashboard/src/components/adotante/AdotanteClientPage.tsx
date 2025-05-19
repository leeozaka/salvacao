"use client"

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Adotante } from "@/types/entities";
import {
  buscarAdotantes,
  cadastrarAdotante,
  atualizarAdotante,
  // excluirAdotante, // Uncomment if you implement the delete function
} from "@/services/adotanteService";
import {
  formatCPF,
  formatPhone,
  // formatCEP, // Removed as it's no longer used
} from "@/utils/validationUtils";
// import { buscarCEP } from "@/services/cepService"; // Removed as it's no longer used

const AdotanteClientPage: React.FC = () => {
  // Estado para armazenar a lista de adotantes
  const [adotantes, setAdotantes] = useState<Adotante[]>([]);
  
  // Estado para controlar se está em modo de edição
  const [modoEdicao, setModoEdicao] = useState<boolean>(false);
  
  // Estado para controlar carregamento, sucesso e erro
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  
  // TODO: CEP state 
  // const [cep, setCep] = useState('');
  
  // Estado para controlar se a lista está sendo exibida ou o formulário
  const [mostrarFormulario, setMostrarFormulario] = useState<boolean>(false);
  
  // Estado para armazenar os dados do formulário
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

  // Função para carregar os adotantes ao montar o componente
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

  // Função para lidar com mudanças nos campos do formulário
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === "documentoIdentidade") {
      setFormData(prev => ({
        ...prev,
        [name]: formatCPF(value)
      }));
    } else if (name === "telefone") {
      setFormData(prev => ({
        ...prev,
        [name]: formatPhone(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Função para lidar com o envio do formulário
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
      
      // Recarrega a lista de adotantes
      const dadosAdotantes = await buscarAdotantes();
      setAdotantes(dadosAdotantes);
      
      // Limpa o formulário
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
      
      setSuccess(true);
      setMostrarFormulario(false);
    } catch (error) {
      setError("Erro ao salvar dados do adotante");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Função para iniciar a edição de um adotante
  //mecher depois no back
  /* const editarAdotante = (adotante: formularioAdotante) => {
    setFormData({
      id: adotante.id,
      idPessoa: adotante.idPessoa,
      pessoa: {
        id: adotante.pessoa.id,
        tipoDocumento: adotante.pessoa.tipoDocumento,
        documentoIdentidade: adotante.pessoa.documentoIdentidade,
        nome: adotante.pessoa.nome,
        email: adotante.pessoa.email,
        telefone: adotante.pessoa.telefone,
        endereco: adotante.pessoa.endereco
      },
      /* endereco: {
        logradouro: adotante.endereco.logradouro,
        numero: adotante.endereco.numero,
        complemento: adotante.endereco.complemento || "",
        bairro: adotante.endereco.bairro,
        cidade: adotante.endereco.cidade,
        estado: adotante.endereco.estado,
        cep: adotante.endereco.cep
      } 
    });
    
    setModoEdicao(true);
    setMostrarFormulario(true);
  }; */

  // Função para iniciar um novo cadastro
  const novoAdotante = () => {
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
    setMostrarFormulario(true);
  };

  // Função para excluir um adotante
  //nao entendi a parte do DTO
  const excluirAdotante = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja excluir este adotante?")) {
      return;
    }
    setLoading(true);
    setError("");
    try {
      await excluirAdotante(id);
      // Recarrega a lista de adotantes
      const dadosAdotantes = await buscarAdotantes();
      setAdotantes(dadosAdotantes);
      setSuccess(true);
    } catch (error) {
      setError("Erro ao excluir adotante");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-100 text-blue-600 mr-3">
          <i className="bi bi-person"></i>
        </div>
        <h2 className="text-xl font-semibold text-gray-800">
          Gerenciamento de Adotantes
        </h2>
      </div>

      {success && (
        <div className="bg-green-100 border border-green-200 text-green-800 px-4 py-3 rounded mb-4 flex items-center">
          <i className="bi bi-check-circle mr-2"></i>
          <span>{modoEdicao ? "Adotante atualizado com sucesso!" : "Adotante cadastrado com sucesso!"}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-200 text-red-800 px-4 py-3 rounded mb-4 flex items-center">
          <i className="bi bi-exclamation-circle mr-2"></i>
          <span>{error}</span>
        </div>
      )}

      {!mostrarFormulario ? (
        <div>
        <div className="flex justify-between mb-4">
          <h3
            className="text-lg font-medium"
            style={{ color: 'var(--color-text-color)' }}
          >
            Lista de Adotantes
          </h3>
          <button
            onClick={novoAdotante}
            className="text-white px-4 py-2 rounded flex items-center"
            style={{
              backgroundColor: 'var(--color-login-button)',
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = 'var(--color-login-button-hover)')
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = 'var(--color-login-button)')
            }
          >
            <i className="bi bi-plus-circle mr-2"></i>
            Novo Adotante
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div
              className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
              style={{ borderColor: 'var(--color-secondary-color)' }}
            ></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table
              className="min-w-full border"
              style={{ backgroundColor: 'var(--color-bg-color)', borderColor: '#e5e7eb' }}
            >
              <thead>
                <tr style={{ backgroundColor: 'var(--color-menu-bg)' }}>
                  {['Nome', 'CPF', 'Email', 'Telefone', 'Cidade/UF', 'Ações'].map((label) => (
                    <th
                      key={label}
                      className="py-2 px-4 border-b text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: 'var(--color-placeholder-color)' }}
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {adotantes.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-4 px-4 border-b text-center"
                      style={{ color: 'var(--color-placeholder-color)' }}
                    >
                      Nenhum adotante cadastrado
                    </td>
                  </tr>
                ) : (
                  adotantes.map((adotante) => (
                    <tr key={adotante.id} className="transition-colors" style={{ transition: 'background-color 0.3s' }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-menu-hover)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <td className="py-2 px-4 border-b" style={{ color: 'var(--color-text-color)' }}>
                        {adotante.pessoa.nome}
                      </td>
                      <td className="py-2 px-4 border-b" style={{ color: 'var(--color-text-color)' }}>
                        {adotante.pessoa.documentoIdentidade}
                      </td>
                      <td className="py-2 px-4 border-b" style={{ color: 'var(--color-text-color)' }}>
                        {adotante.pessoa.email}
                      </td>
                      <td className="py-2 px-4 border-b" style={{ color: 'var(--color-text-color)' }}>
                        {adotante.pessoa.telefone}
                      </td>
                      <td className="py-2 px-4 border-b" style={{ color: 'var(--color-text-color)' }}>
                        {adotante.pessoa.endereco}
                      </td>
                      <td className="py-2 px-4 border-b">
                            <button
                            onClick={() => excluirAdotante(adotante.id)}
                            className="text-red-500 hover:bg-red-500 hover:text-white cursor-pointer transition-colors duration-300"
                            title="Excluir"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                      </td>
                      {/* <td className="py-2 px-4 border-b">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => editarAdotante(adotante)}
                            style={{ color: 'var(--color-primary-color)' }}
                            title="Editar"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          {/*  }
                        </div>
                      </td> */}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
        </div>
      ) : (
        <div>
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-700">
              {modoEdicao ? "Editar Adotante" : "Cadastrar Adotante"}
            </h3>
            <button
              onClick={() => setMostrarFormulario(false)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded flex items-center"
            >
              <i className="bi bi-arrow-left mr-2"></i>
              Voltar
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dados pessoais */}
              <div className="col-span-2">
                <h4 className="text-md font-medium text-gray-700 mb-3">Dados Pessoais</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CPF <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="pessoa.documentoIdentidade"
                      value={formData.pessoa.documentoIdentidade}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      maxLength={14}
                      placeholder="000.000.000-00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome Completo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="pessoa.nome"
                      value={formData.pessoa.nome}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      placeholder="Nome do adotante"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="pessoa.email"
                      value={formData.pessoa.email}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      placeholder="exemplo@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="pessoa.telefone"
                      value={formData.pessoa.telefone}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      maxLength={15}
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>
              </div>

              {/* Endereço */}
              {/* <div className="col-span-2">
                <h4 className="text-md font-medium text-gray-700 mb-3">Endereço</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CEP <span className="text-red-500">*</span>
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        name="endereco.cep"
                        value={formData.endereco.cep}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        maxLength={9}
                        placeholder="00000-000"
                      />
                      <button
                        type="button"
                        // TODO: Cep
                        onClick={() => buscarCEP(formData.endereco.cep)}
                        // TODO: Alternative if using the separate 'cep' state:
                        // onClick={() => buscarCEP(cep)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 rounded-r-md"
                      >
                        <i className="bi bi-search"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Logradouro <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="endereco.logradouro"
                      value={formData.endereco.logradouro}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      placeholder="Rua, Avenida, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="endereco.numero"
                      value={formData.endereco.numero}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      placeholder="123"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Complemento
                    </label>
                    <input
                      type="text"
                      name="endereco.complemento"
                      value={formData.endereco.complemento}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Apto, Bloco, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bairro <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="endereco.bairro"
                      value={formData.endereco.bairro}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      placeholder="Bairro"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cidade <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="endereco.cidade"
                      value={formData.endereco.cidade}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      placeholder="Cidade"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      UF <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="endereco.estado"
                      value={formData.endereco.estado}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Selecione</option>
                      <option value="AC">AC</option>
                      <option value="AL">AL</option>
                      <option value="AP">AP</option>
                      <option value="AM">AM</option>
                      <option value="BA">BA</option>
                      <option value="CE">CE</option>
                      <option value="DF">DF</option>
                      <option value="ES">ES</option>
                      <option value="GO">GO</option>
                      <option value="MA">MA</option>
                      <option value="MT">MT</option>
                      <option value="MS">MS</option>
                      <option value="MG">MG</option>
                      <option value="PA">PA</option>
                      <option value="PB">PB</option>
                      <option value="PR">PR</option>
                      <option value="PE">PE</option>
                      <option value="PI">PI</option>
                      <option value="RJ">RJ</option>
                      <option value="RN">RN</option>
                      <option value="RS">RS</option>
                      <option value="RO">RO</option>
                      <option value="RR">RR</option>
                      <option value="SC">SC</option>
                      <option value="SP">SP</option>
                      <option value="SE">SE</option>
                      <option value="TO">TO</option>
                    </select>
                  </div>
                </div>
              </div> */}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => setMostrarFormulario(false)}
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
                    {modoEdicao ? "Atualizar" : "Cadastrar"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdotanteClientPage; 