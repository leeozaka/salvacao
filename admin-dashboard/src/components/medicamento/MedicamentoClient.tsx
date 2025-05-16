// components/medicamento/MedicamentosClient.tsx
"use client";
import MedicamentoForm from "./MedicamentoForm";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  buscarMedicamentos,
  adicionarMedicamento,
  atualizarMedicamento,
  excluirMedicamento,
} from "@/services/medicamentoService";
import { MedicamentoBackend } from "@/types/medicamento/medicamento";
import {
  CreateMedicamentoDTO,
  UpdateMedicamentoDTO,
} from "@/dto/MedicamentoDTO";
import { TipoProduto, UnidadeDeMedida } from "@/types/entities";
import { MedicamentosClientProps } from "@/types/medicamento/MedicamentosClientProps";

const MedicamentosClient: React.FC<MedicamentosClientProps> = ({
  dadosIniciais = { medicamentos: [], tipos: [], unidades: [] },
}) => {
  const router = useRouter();

  // Estados para gestão da interface
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalEditOpen, setModalEditOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // Estados para medicamentos
  const [medicamentos, setMedicamentos] = useState<MedicamentoBackend[]>([]);
  const [tiposProduto, setTiposProduto] = useState<TipoProduto[]>(
    dadosIniciais.tipos || [],
  );
  const [unidadesMedida, setUnidadesMedida] = useState<UnidadeDeMedida[]>(
    dadosIniciais.unidades || [],
  );

  // Filtros - serão usados para requisições ao backend
  const [pesquisaMedicamento, setPesquisaMedicamento] = useState<string>("");
  const [filtroTipo, setFiltroTipo] = useState<number>(0);
  const [filtroPrincipioAtivo, setFiltroPrincipioAtivo] = useState<string>("");
  const [filtroNecessitaReceita, setFiltroNecessitaReceita] =
    useState<string>("todos");

  // Debounce para não executar muitas requisições durante digitação
  const [debouncedPesquisa, setDebouncedPesquisa] = useState<string>("");
  const [debouncedPrincipioAtivo, setDebouncedPrincipioAtivo] =
    useState<string>("");

  const [medicamentoEmEdicao, setMedicamentoEmEdicao] =
    useState<MedicamentoBackend | null>(null);

  // Estado para novo medicamento
  const [novoMedicamento, setNovoMedicamento] = useState<CreateMedicamentoDTO>({
    nome: "",
    idTipoProduto: dadosIniciais.tipos?.length
      ? dadosIniciais.tipos[0].idtipoproduto
      : 0,
    idUnidadeMedidaPadrao: dadosIniciais.unidades?.length
      ? dadosIniciais.unidades[0].idunidademedida
      : 0,
    descricao: "",
    codigoBarras: "",
    dosagem: "",
    principioAtivo: "",
    fabricante: "",
    necessitaReceita: false,
  });

  // Função para limpar filtros
  const limparFiltros = () => {
    setPesquisaMedicamento("");
    setFiltroTipo(0);
    setFiltroPrincipioAtivo("");
    setFiltroNecessitaReceita("todos");
    // Após limpar, buscar sem filtros
    carregarMedicamentos({});
  };

  // Efeito para debounce da pesquisa
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPesquisa(pesquisaMedicamento);
    }, 500);
    return () => clearTimeout(timer);
  }, [pesquisaMedicamento]);

  // Efeito para debounce do princípio ativo
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPrincipioAtivo(filtroPrincipioAtivo);
    }, 500);
    return () => clearTimeout(timer);
  }, [filtroPrincipioAtivo]);

  // Efeito para carregar medicamentos ao mudar filtros
  useEffect(() => {
    const filtros: any = {};

    if (debouncedPesquisa) {
      filtros.termo = debouncedPesquisa;
    }

    if (filtroTipo > 0) {
      filtros.idTipoProduto = filtroTipo;
    }

    if (debouncedPrincipioAtivo) {
      filtros.principioAtivo = debouncedPrincipioAtivo;
    }

    if (filtroNecessitaReceita !== "todos") {
      filtros.necessitaReceita = filtroNecessitaReceita === "sim";
    }

    carregarMedicamentos(filtros);
  }, [
    debouncedPesquisa,
    debouncedPrincipioAtivo,
    filtroTipo,
    filtroNecessitaReceita,
  ]);

  // Função para carregar medicamentos com filtros
  const carregarMedicamentos = async (filtros: any) => {
    try {
      setLoading(true);
      const response = await buscarMedicamentos(filtros);

      if (response.success) {
        setMedicamentos(response.data);
      } else {
        setError("Falha ao carregar medicamentos: " + response.message);
        setTimeout(() => setError(""), 5000);
      }
    } catch (err) {
      setError("Erro ao carregar medicamentos. Tente novamente mais tarde.");
      setTimeout(() => setError(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados iniciais
  useEffect(() => {
    // Carregar medicamentos ao iniciar
    carregarMedicamentos({});
  }, []);

  // Função auxiliar para obter o nome do tipo de produto
  const getTipoProdutoNome = (id: number): string => {
    const tipo = tiposProduto.find((tipo) => tipo.idtipoproduto === id);
    return tipo ? tipo.descricao : "Não especificado";
  };

  // Função auxiliar para obter o nome da unidade de medida
  const getUnidadeMedidaNome = (id: number): string => {
    const unidade = unidadesMedida.find(
      (unidade) => unidade.idunidademedida === id,
    );
    return unidade ? unidade.descricao : "Não especificado";
  };

  // Manipuladores para medicamentos
  const handleNovoMedicamento = () => {
    setNovoMedicamento({
      nome: "",
      idTipoProduto:
        tiposProduto.length > 0 ? tiposProduto[0].idtipoproduto : 0,
      idUnidadeMedidaPadrao:
        unidadesMedida.length > 0 ? unidadesMedida[0].idunidademedida : 0,
      descricao: "",
      codigoBarras: "",
      dosagem: "",
      principioAtivo: "",
      fabricante: "",
      necessitaReceita: false,
    });
    setModalOpen(true);
  };

  const handleSalvarMedicamento = async (medicamento: CreateMedicamentoDTO) => {
    try {
      const response = await adicionarMedicamento(medicamento);
      if (response.success) {
        setModalOpen(false);
        setSuccess("Medicamento cadastrado com sucesso!");
        setTimeout(() => setSuccess(""), 3000);
        // Recarregar lista após adicionar
        carregarMedicamentos({});
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao salvar medicamento",
      );
      setTimeout(() => setError(""), 5000);
      throw err;
    }
  };

  const handleEditarMedicamento = (medicamento: MedicamentoBackend) => {
    setMedicamentoEmEdicao(medicamento);
    setModalEditOpen(true);
  };

  const handleSalvarEdicao = async (medicamento: UpdateMedicamentoDTO) => {
    if (!medicamentoEmEdicao) return;

    try {
      const response = await atualizarMedicamento(
        medicamentoEmEdicao.id,
        medicamento,
      );

      if (response.success) {
        setModalEditOpen(false);
        setSuccess("Medicamento atualizado com sucesso!");
        setTimeout(() => setSuccess(""), 3000);
        // Recarregar lista após atualizar
        carregarMedicamentos({});
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao atualizar medicamento",
      );
      setTimeout(() => setError(""), 5000);
      throw err;
    }
  };

  const handleExcluirMedicamento = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este medicamento?")) {
      try {
        const response = await excluirMedicamento(id);

        if (response.success) {
          setSuccess("Medicamento excluído com sucesso!");
          setTimeout(() => setSuccess(""), 3000);
          // Recarregar lista após excluir
          carregarMedicamentos({});
        } else {
          throw new Error(response.message);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao excluir medicamento",
        );
        setTimeout(() => setError(""), 5000);
      }
    }
  };

  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary-color dark:text-primary-color-dark mb-2">
          Gerenciamento de Medicamentos
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Cadastre e gerencie medicamentos para seu estoque.
        </p>
      </div>

      {/* Mensagens */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-4 mb-4">
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-100 dark:bg-green-900/30 border-l-4 border-green-500 text-green-700 dark:text-green-400 p-4 mb-4">
          <p>{success}</p>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <div className="relative max-w-md w-full">
          <input
            type="text"
            placeholder="Buscar medicamentos..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color dark:bg-gray-800 dark:text-white"
            value={pesquisaMedicamento}
            onChange={(e) => setPesquisaMedicamento(e.target.value)}
          />
          <i className="bi bi-search absolute right-3 top-3 text-gray-400"></i>
        </div>
        <button
          className="bg-primary-color hover:bg-primary-color-hover text-white py-2 px-4 rounded-lg flex items-center"
          onClick={handleNovoMedicamento}
        >
          <i className="bi bi-plus-lg mr-2"></i>
          Novo Medicamento
        </button>
      </div>

      {/* Barra de filtros */}
      <div className="bg-amber-50 dark:bg-gray-800 p-4 rounded-lg mb-4 border border-amber-100 dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-amber-800 dark:text-amber-300 text-sm font-medium mb-1">
              Filtrar por Tipo:
            </label>
            <select
              className="w-full px-3 py-2 border border-amber-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color dark:bg-gray-700 dark:text-white"
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(parseInt(e.target.value))}
            >
              <option value={0}>Todos os tipos</option>
              {tiposProduto.map((tipo) => (
                <option key={tipo.idtipoproduto} value={tipo.idtipoproduto}>
                  {tipo.descricao}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-amber-800 dark:text-amber-300 text-sm font-medium mb-1">
              Princípio Ativo:
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-amber-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color dark:bg-gray-700 dark:text-white"
              placeholder="Filtrar por princípio ativo"
              value={filtroPrincipioAtivo}
              onChange={(e) => setFiltroPrincipioAtivo(e.target.value)}
            />
          </div>

          <div className="flex-1">
            <label className="block text-amber-800 dark:text-amber-300 text-sm font-medium mb-1">
              Necessita Receita:
            </label>
            <select
              className="w-full px-3 py-2 border border-amber-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color dark:bg-gray-700 dark:text-white"
              value={filtroNecessitaReceita}
              onChange={(e) => setFiltroNecessitaReceita(e.target.value)}
            >
              <option value="todos">Todos</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              onClick={limparFiltros}
            >
              <i className="bi bi-x-circle mr-2"></i>
              Limpar Filtros
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-color mb-2"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Carregando medicamentos...
          </p>
        </div>
      ) : medicamentos.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-amber-50 dark:bg-gray-700">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-amber-800 dark:text-amber-300 uppercase tracking-wider"
                >
                  Nome
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-amber-800 dark:text-amber-300 uppercase tracking-wider"
                >
                  Princípio Ativo
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-amber-800 dark:text-amber-300 uppercase tracking-wider"
                >
                  Dosagem
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-amber-800 dark:text-amber-300 uppercase tracking-wider"
                >
                  Fabricante
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-amber-800 dark:text-amber-300 uppercase tracking-wider"
                >
                  Receita
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-amber-800 dark:text-amber-300 uppercase tracking-wider"
                >
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {medicamentos.map((medicamento) => (
                <tr
                  key={medicamento.id}
                  className="hover:bg-amber-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {medicamento.nome}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {medicamento.codigoBarras || "Sem código"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-700 dark:text-gray-300">
                      {medicamento.principioAtivo || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-700 dark:text-gray-300">
                      {medicamento.dosagem
                        ? `${medicamento.dosagem} ${medicamento.siglaUnidadeMedida || ""}`
                        : "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-700 dark:text-gray-300">
                      {medicamento.fabricante || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-700 dark:text-gray-300">
                      {medicamento.necessitaReceita ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300">
                          <i className="bi bi-prescription2 mr-1"></i>{" "}
                          Necessária
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">
                          <i className="bi bi-check-circle mr-1"></i> Dispensada
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      className="text-amber-600 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 mx-1"
                      onClick={() => handleEditarMedicamento(medicamento)}
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 mx-1"
                      onClick={() => handleExcluirMedicamento(medicamento.id)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow">
          <i className="bi bi-capsule text-amber-400 text-5xl mb-3"></i>
          <p className="text-gray-500 dark:text-gray-400">
            Nenhum medicamento encontrado.
          </p>
          <button
            className="mt-4 text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 border border-amber-600 dark:border-amber-400 hover:border-amber-800 dark:hover:border-amber-300 rounded-lg px-4 py-2"
            onClick={handleNovoMedicamento}
          >
            Adicionar um medicamento
          </button>
        </div>
      )}

      {/* Modal para Novo Medicamento */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <MedicamentoForm
            medicamento={novoMedicamento}
            tiposProduto={tiposProduto}
            unidadesMedida={unidadesMedida}
            onSubmit={async (medicamento) => {
              // Usamos type assertion para garantir que estamos passando o tipo correto
              try {
                const createDto = medicamento as CreateMedicamentoDTO;
                await handleSalvarMedicamento(createDto);
              } catch (error) {
                throw error;
              }
            }}
            onCancel={() => setModalOpen(false)}
            isEditMode={false}
            title="Novo Medicamento"
          />
        </div>
      )}

      {/* Modal para Editar Medicamento */}
      {modalEditOpen && medicamentoEmEdicao && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <MedicamentoForm
            medicamento={medicamentoEmEdicao}
            tiposProduto={tiposProduto}
            unidadesMedida={unidadesMedida}
            onSubmit={async (medicamento) => {
              // Usamos type assertion para garantir que estamos passando o tipo correto
              try {
                const updateDto = medicamento as UpdateMedicamentoDTO;
                await handleSalvarEdicao(updateDto);
              } catch (error) {
                throw error;
              }
            }}
            onCancel={() => setModalEditOpen(false)}
            isEditMode={true}
            title="Editar Medicamento"
          />
        </div>
      )}

      {/* Botão de voltar */}
      <div className="mt-6">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center text-primary-color dark:text-primary-color-dark hover:text-primary-color-hover dark:hover:text-primary-color-hover transition-colors"
        >
          <i className="bi bi-arrow-left mr-2"></i>
          Voltar para Dashboard
        </button>
      </div>
    </div>
  );
};

export default MedicamentosClient;
