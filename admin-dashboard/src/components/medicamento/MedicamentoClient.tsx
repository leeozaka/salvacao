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
import {
  buscarTiposProduto,
  buscarUnidadesMedida,
} from "@/services/produtoService";
import { MedicamentoBackend } from "@/types/medicamento/medicamento";
import {
  CreateMedicamentoDTO,
  UpdateMedicamentoDTO,
} from "@/dto/MedicamentoDTO";
import { TipoProduto, UnidadeDeMedida } from "@/types/entities";
import { MedicamentosClientProps } from "@/types/medicamento/MedicamentosClientProps";

const MedicamentosClient: React.FC<MedicamentosClientProps> = ({
  dadosIniciais = { medicamentos: [], tipos: [], unidades: [] }, // Valores padrão
}) => {
  const router = useRouter();

  // Estados para gestão da interface
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalEditOpen, setModalEditOpen] = useState<boolean>(false);
  // Se temos dados iniciais, não precisamos mostrar o loading
  const [loading, setLoading] = useState<boolean>(
    !dadosIniciais.medicamentos?.length,
  );
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // Estados para medicamentos - use dados iniciais se disponíveis
  const [medicamentos, setMedicamentos] = useState<MedicamentoBackend[]>(
    dadosIniciais.medicamentos || [],
  );
  const [tiposProduto, setTiposProduto] = useState<TipoProduto[]>(
    dadosIniciais.tipos || [],
  );
  const [unidadesMedida, setUnidadesMedida] = useState<UnidadeDeMedida[]>(
    dadosIniciais.unidades || [],
  );
  const [pesquisaMedicamento, setPesquisaMedicamento] = useState<string>("");
  const [medicamentosFiltrados, setMedicamentosFiltrados] = useState<
    MedicamentoBackend[]
  >(dadosIniciais.medicamentos || []);
  const [medicamentoEmEdicao, setMedicamentoEmEdicao] =
    useState<MedicamentoBackend | null>(null);

  // Estados para filtros (permanecem iguais)
  const [filtroTipo, setFiltroTipo] = useState<number>(0);
  const [filtroPrincipioAtivo, setFiltroPrincipioAtivo] = useState<string>("");
  const [filtroNecessitaReceita, setFiltroNecessitaReceita] =
    useState<string>("todos");

  // Estado para novo medicamento - use o primeiro tipo e unidade se disponíveis
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

  // Função para limpar filtros (permanece igual)
  const limparFiltros = () => {
    setPesquisaMedicamento("");
    setFiltroTipo(0);
    setFiltroPrincipioAtivo("");
    setFiltroNecessitaReceita("todos");
  };

  // Carregar dados iniciais - só carrega se não tiver recebido via props
  useEffect(() => {
    // Se já temos dados iniciais, não precisamos carregar novamente
    if (
      dadosIniciais.medicamentos?.length &&
      dadosIniciais.tipos?.length &&
      dadosIniciais.unidades?.length
    ) {
      return;
    }

    const carregarDados = async () => {
      try {
        setLoading(true);
        const [tipos, unidades, medicamentosData] = await Promise.all([
          buscarTiposProduto(),
          buscarUnidadesMedida(),
          buscarMedicamentos(),
        ]);

        setTiposProduto(tipos);
        setUnidadesMedida(unidades);
        setMedicamentos(medicamentosData);
        setMedicamentosFiltrados(medicamentosData);
        setLoading(false);
      } catch (err) {
        setError("Erro ao carregar dados. Tente novamente mais tarde.");
        setLoading(false);
      }
    };

    carregarDados();
  }, [dadosIniciais]);

  // Efeito para filtrar medicamentos
  useEffect(() => {
    let filtered = [...medicamentos];

    // Filtro por texto de busca
    if (pesquisaMedicamento.trim() !== "") {
      filtered = filtered.filter(
        (medicamento) =>
          medicamento.nome
            .toLowerCase()
            .includes(pesquisaMedicamento.toLowerCase()) ||
          (medicamento.principioAtivo &&
            medicamento.principioAtivo
              .toLowerCase()
              .includes(pesquisaMedicamento.toLowerCase())) ||
          (medicamento.fabricante &&
            medicamento.fabricante
              .toLowerCase()
              .includes(pesquisaMedicamento.toLowerCase())) ||
          (medicamento.codigoBarras &&
            medicamento.codigoBarras
              .toLowerCase()
              .includes(pesquisaMedicamento.toLowerCase())),
      );
    }

    // Filtro por tipo de produto
    if (filtroTipo > 0) {
      filtered = filtered.filter(
        (medicamento) => medicamento.idTipoProduto === filtroTipo,
      );
    }

    // Filtro por princípio ativo
    if (filtroPrincipioAtivo.trim() !== "") {
      filtered = filtered.filter(
        (medicamento) =>
          medicamento.principioAtivo &&
          medicamento.principioAtivo
            .toLowerCase()
            .includes(filtroPrincipioAtivo.toLowerCase()),
      );
    }

    // Filtro por necessidade de receita
    if (filtroNecessitaReceita !== "todos") {
      filtered = filtered.filter(
        (medicamento) =>
          medicamento.necessitaReceita === (filtroNecessitaReceita === "sim"),
      );
    }

    setMedicamentosFiltrados(filtered);
  }, [
    pesquisaMedicamento,
    medicamentos,
    filtroTipo,
    filtroPrincipioAtivo,
    filtroNecessitaReceita,
  ]);

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

  const handleSalvarMedicamento = async () => {
    try {
      const medicamentoAdicionado = await adicionarMedicamento(novoMedicamento);
      setMedicamentos([...medicamentos, medicamentoAdicionado]);
      setModalOpen(false);
      setSuccess("Medicamento cadastrado com sucesso!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao salvar medicamento",
      );
      setTimeout(() => setError(""), 5000);
    }
  };

  const handleEditarMedicamento = (medicamento: MedicamentoBackend) => {
    setMedicamentoEmEdicao(medicamento);
    setModalEditOpen(true);
  };

  const handleSalvarEdicao = async () => {
    if (!medicamentoEmEdicao) return;

    try {
      const dadosAtualizacao: UpdateMedicamentoDTO = {
        nome: medicamentoEmEdicao.nome,
        idTipoProduto: medicamentoEmEdicao.idTipoProduto,
        idUnidadeMedidaPadrao: medicamentoEmEdicao.idUnidadeMedidaPadrao,
        descricao: medicamentoEmEdicao.descricao,
        codigoBarras: medicamentoEmEdicao.codigoBarras,
        dosagem: medicamentoEmEdicao.dosagem,
        principioAtivo: medicamentoEmEdicao.principioAtivo,
        fabricante: medicamentoEmEdicao.fabricante,
        necessitaReceita: medicamentoEmEdicao.necessitaReceita,
      };

      const medicamentoAtualizado = await atualizarMedicamento(
        medicamentoEmEdicao.id,
        dadosAtualizacao,
      );

      setMedicamentos(
        medicamentos.map((med) =>
          med.id === medicamentoAtualizado.id ? medicamentoAtualizado : med,
        ),
      );

      setModalEditOpen(false);
      setSuccess("Medicamento atualizado com sucesso!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao atualizar medicamento",
      );
      setTimeout(() => setError(""), 5000);
    }
  };

  const handleExcluirMedicamento = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este medicamento?")) {
      try {
        await excluirMedicamento(id);
        setMedicamentos(medicamentos.filter((med) => med.id !== id));
        setSuccess("Medicamento excluído com sucesso!");
        setTimeout(() => setSuccess(""), 3000);
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
      ) : medicamentosFiltrados.length > 0 ? (
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
              {medicamentosFiltrados.map((medicamento) => (
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
              try {
                const medicamentoAdicionado = await adicionarMedicamento(
                  medicamento as CreateMedicamentoDTO,
                );
                setMedicamentos([...medicamentos, medicamentoAdicionado]);
                setModalOpen(false);
                setSuccess("Medicamento cadastrado com sucesso!");
                setTimeout(() => setSuccess(""), 3000);
              } catch (err) {
                setError(
                  err instanceof Error
                    ? err.message
                    : "Erro ao salvar medicamento",
                );
                setTimeout(() => setError(""), 5000);
                throw err; // Re-throw para que o componente do formulário possa lidar com isso
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
              try {
                if (!medicamentoEmEdicao) return;

                const dadosAtualizacao: UpdateMedicamentoDTO = {
                  nome: medicamento.nome,
                  idTipoProduto: medicamento.idTipoProduto,
                  idUnidadeMedidaPadrao: medicamento.idUnidadeMedidaPadrao,
                  descricao: medicamento.descricao,
                  codigoBarras: medicamento.codigoBarras,
                  dosagem: medicamento.dosagem,
                  principioAtivo: medicamento.principioAtivo,
                  fabricante: medicamento.fabricante,
                  necessitaReceita: medicamento.necessitaReceita,
                };

                const medicamentoAtualizado = await atualizarMedicamento(
                  medicamentoEmEdicao.id,
                  dadosAtualizacao,
                );

                setMedicamentos(
                  medicamentos.map((med) =>
                    med.id === medicamentoAtualizado.id
                      ? medicamentoAtualizado
                      : med,
                  ),
                );

                setModalEditOpen(false);
                setSuccess("Medicamento atualizado com sucesso!");
                setTimeout(() => setSuccess(""), 3000);
              } catch (err) {
                setError(
                  err instanceof Error
                    ? err.message
                    : "Erro ao atualizar medicamento",
                );
                setTimeout(() => setError(""), 5000);
                throw err; // Re-throw para que o componente do formulário possa lidar com isso
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
