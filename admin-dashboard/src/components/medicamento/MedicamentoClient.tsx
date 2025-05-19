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
        setMedicamentoEmEdicao(null);
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
    <div className="bg-[var(--color-bg-color)] min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[var(--color-primary-color)] mb-2">
              Gerenciamento de Medicamentos
            </h1>
            <p className="text-[var(--color-text-color)]">
              Cadastre e gerencie medicamentos para seu estoque.
            </p>
          </div>

          {/* Mensagens de feedback */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-md animate-fadeIn">
              <div className="flex items-center">
                <i className="bi bi-exclamation-circle text-xl mr-3"></i>
                <p>{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-r-md animate-fadeIn">
              <div className="flex items-center">
                <i className="bi bi-check-circle text-xl mr-3"></i>
                <p>{success}</p>
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div className="relative w-full md:max-w-md">
              <input
                type="text"
                placeholder="Buscar medicamentos..."
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-color)] focus:border-[var(--color-primary-color)] transition-colors"
                value={pesquisaMedicamento}
                onChange={(e) => setPesquisaMedicamento(e.target.value)}
              />
              <i className="bi bi-search absolute left-3 top-3.5 text-[var(--color-placeholder-color)]"></i>
            </div>
            <button
              className="w-full md:w-auto bg-[var(--color-primary-color)] hover:bg-[var(--color-secondary-color)] text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center transition-colors shadow-md hover:shadow-lg"
              onClick={handleNovoMedicamento}
            >
              <i className="bi bi-plus-lg mr-2"></i>
              Novo Medicamento
            </button>
          </div>

          {/* Barra de filtros */}
          <div className="bg-[var(--color-menu-bg)] p-5 rounded-xl mb-6 border border-[var(--color-primary-color)]/20 shadow-sm">
            <h2 className="text-lg font-semibold text-[var(--color-secondary-color)] mb-4">
              Filtros Avançados
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <div>
                <label className="block text-[var(--color-text-color)] text-sm font-medium mb-2">
                  Filtrar por Tipo:
                </label>
                <select
                  className="w-full px-3 py-2 border border-[var(--color-primary-color)]/20 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-color)] focus:border-[var(--color-primary-color)] transition-colors bg-white text-[var(--color-text-color)]"
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(parseInt(e.target.value))}
                >
                  <option value={0}>Todos os tipos</option>
                  {tiposProduto.map((tipo) => (
                    <option key={tipo.id} value={tipo.id}>
                      {tipo.descricao}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[var(--color-text-color)] text-sm font-medium mb-2">
                  Princípio Ativo:
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-[var(--color-primary-color)]/20 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-color)] focus:border-[var(--color-primary-color)] transition-colors bg-white text-[var(--color-text-color)]"
                  placeholder="Filtrar por princípio ativo"
                  value={filtroPrincipioAtivo}
                  onChange={(e) => setFiltroPrincipioAtivo(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[var(--color-text-color)] text-sm font-medium mb-2">
                  Necessita Receita:
                </label>
                <select
                  className="w-full px-3 py-2 border border-[var(--color-primary-color)]/20 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-color)] focus:border-[var(--color-primary-color)] transition-colors bg-white text-[var(--color-text-color)]"
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
                  className="w-full px-4 py-2 bg-gray-100 text-[var(--color-text-color)] rounded-lg hover:bg-[var(--color-menu-hover)] transition-colors flex items-center justify-center font-medium"
                  onClick={limparFiltros}
                >
                  <i className="bi bi-x-circle mr-2"></i>
                  Limpar Filtros
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 bg-white rounded-xl shadow border border-gray-100">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-3 border-b-3 border-[var(--color-primary-color)] mb-4"></div>
              <p className="text-[var(--color-text-color)] text-lg">
                Carregando medicamentos...
              </p>
            </div>
          ) : medicamentos.length > 0 ? (
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-[var(--color-menu-bg)]">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-xs font-semibold text-[var(--color-secondary-color)] uppercase tracking-wider"
                      >
                        Nome
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-xs font-semibold text-[var(--color-secondary-color)] uppercase tracking-wider"
                      >
                        Princípio Ativo
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-xs font-semibold text-[var(--color-secondary-color)] uppercase tracking-wider"
                      >
                        Dosagem
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-xs font-semibold text-[var(--color-secondary-color)] uppercase tracking-wider"
                      >
                        Fabricante
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-xs font-semibold text-[var(--color-secondary-color)] uppercase tracking-wider"
                      >
                        Receita
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-right text-xs font-semibold text-[var(--color-secondary-color)] uppercase tracking-wider"
                      >
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {medicamentos.map((medicamento) => (
                      <tr
                        key={medicamento.id}
                        className="group transition-colors hover:bg-[var(--color-menu-bg)]/50"
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium text-[var(--color-text-color)]">
                            {medicamento.nome}
                          </div>
                          <div className="text-xs text-[var(--color-placeholder-color)]">
                            {medicamento.codigoBarras || "Sem código"}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-[var(--color-text-color)]">
                            {medicamento.principioAtivo || "-"}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-[var(--color-text-color)]">
                            {medicamento.dosagem
                              ? `${medicamento.dosagem} ${medicamento.siglaUnidadeMedida || ""}`
                              : "-"}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-[var(--color-text-color)]">
                            {medicamento.fabricante || "-"}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-[var(--color-text-color)]">
                            {medicamento.necessitaReceita ? (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                                <i className="bi bi-prescription2 mr-1"></i>{" "}
                                Necessária
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                <i className="bi bi-check-circle mr-1"></i>{" "}
                                Dispensada
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-1">
                            <button
                              className="p-2 text-[var(--color-primary-color)] hover:text-[var(--color-secondary-color)] hover:bg-[var(--color-primary-color)]/10 rounded-full transition-colors opacity-70 group-hover:opacity-100"
                              onClick={() =>
                                handleEditarMedicamento(medicamento)
                              }
                              title="Editar"
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-colors opacity-70 group-hover:opacity-100"
                              onClick={() =>
                                handleExcluirMedicamento(medicamento.id)
                              }
                              title="Excluir"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl shadow-md border border-gray-100">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-primary-color)]/20 text-[var(--color-primary-color)] mb-4">
                <i className="bi bi-capsule text-3xl"></i>
              </div>
              <h3 className="text-xl font-medium text-[var(--color-text-color)] mb-2">
                Nenhum medicamento encontrado
              </h3>
              <p className="text-[var(--color-placeholder-color)] mb-6 max-w-md mx-auto">
                Não foram encontrados medicamentos com os filtros selecionados.
              </p>
              <button
                className="px-6 py-3 text-[var(--color-primary-color)] bg-[var(--color-menu-bg)]/50 hover:bg-[var(--color-menu-hover)] border border-[var(--color-primary-color)]/30 rounded-lg font-medium transition-colors"
                onClick={handleNovoMedicamento}
              >
                <i className="bi bi-plus-circle mr-2"></i>
                Adicionar medicamento
              </button>
            </div>
          )}

          {/* Botão de voltar */}
          <div className="mt-8">
            <button
              onClick={() => router.push("/dashboard")}
              className="group flex items-center text-[var(--color-primary-color)] hover:text-[var(--color-secondary-color)] transition-colors font-medium"
            >
              <i className="bi bi-arrow-left mr-2 group-hover:-translate-x-1 transition-transform"></i>
              Voltar para Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Modal para Novo Medicamento */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"></div>
          <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-xl shadow-2xl flex flex-col transform transition-all animate-modalFadeIn">
            <div className="flex-1 overflow-y-auto">
              <MedicamentoForm
                medicamento={novoMedicamento}
                tiposProduto={tiposProduto}
                unidadesMedida={unidadesMedida}
                onSubmit={async (medicamento) => {
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
          </div>
        </div>
      )}

      {/* Modal para Editar Medicamento */}
      {modalEditOpen && medicamentoEmEdicao && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"></div>
          <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-xl shadow-2xl flex flex-col transform transition-all animate-modalFadeIn">
            <div className="flex-1 overflow-y-auto">
              <MedicamentoForm
                medicamento={medicamentoEmEdicao}
                tiposProduto={tiposProduto}
                unidadesMedida={unidadesMedida}
                onSubmit={async (medicamento) => {
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
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicamentosClient;
