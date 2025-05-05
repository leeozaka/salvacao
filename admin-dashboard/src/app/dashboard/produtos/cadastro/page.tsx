"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  TipoProduto,
  UnidadeDeMedida as UnidadeMedida,
  Produto,
} from "@/types/entities";
import {
  buscarTiposProduto,
  buscarUnidadesMedida,
  buscarProdutos,
  adicionarProduto,
  adicionarTipoProduto,
  excluirTipoProduto,
} from "@/services/produtoService";
import { NovoProdutoDTO } from "@/dto/NovoProdutoDTO";
import { NovoTipoDTO } from "@/dto/NovoTipoDTO";

const CadastroProdutos: React.FC = () => {
  const router = useRouter();

  // Estados para gestão da interface
  const [activeTab, setActiveTab] = useState<"produtos" | "tipos">("produtos");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalTipoOpen, setModalTipoOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // Estados para produtos
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [tiposProduto, setTiposProduto] = useState<TipoProduto[]>([]);
  const [unidadesMedida, setUnidadesMedida] = useState<UnidadeMedida[]>([]);
  const [pesquisaProduto, setPesquisaProduto] = useState<string>("");
  const [produtosFiltrados, setProdutosFiltrados] = useState<Produto[]>([]);

  // Estados para filtros
  const [filtroTipo, setFiltroTipo] = useState<number>(0); // 0 significa todos
  const [filtroValidade, setFiltroValidade] = useState<{
    ativo: boolean;
    dataInicio: string;
    dataFim: string;
  }>({
    ativo: false,
    dataInicio: "",
    dataFim: "",
  });

  // Estado para novo produto
  const [novoProduto, setNovoProduto] = useState<NovoProdutoDTO>({
    nome: "",
    idtipoproduto: 0,
    idunidademedida: 0,
    fabricante: "",
    dataValidade: "",
  });

  // Estado para tipo de produto
  const [pesquisaTipo, setPesquisaTipo] = useState<string>("");
  const [tiposFiltrados, setTiposFiltrados] = useState<TipoProduto[]>([]);
  const [novoTipo, setNovoTipo] = useState<NovoTipoDTO>({
    descricao: "",
    controlaValidade: false,
  });

  const tipoControlaValidade = (idtipo: number): boolean => {
    const tipo = tiposProduto.find((t) => t.idtipoproduto === idtipo);
    return tipo ? tipo.controlaValidade : false;
  };

  // Função para limpar filtros
  const limparFiltros = () => {
    setPesquisaProduto("");
    setFiltroTipo(0);
    setFiltroValidade({
      ativo: false,
      dataInicio: "",
      dataFim: "",
    });
  };

  // Carregar dados iniciais
  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        const [tipos, unidades, produtosData] = await Promise.all([
          buscarTiposProduto(),
          buscarUnidadesMedida(),
          buscarProdutos(),
        ]);

        setTiposProduto(tipos);
        setTiposFiltrados(tipos);
        setUnidadesMedida(unidades);
        setProdutos(produtosData);
        setProdutosFiltrados(produtosData);
        setLoading(false);
      } catch (err) {
        setError("Erro ao carregar dados. Tente novamente mais tarde.");
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  // Efeito para filtrar produtos
  useEffect(() => {
    let filtered = [...produtos];

    // Filtro por texto de busca
    if (pesquisaProduto.trim() !== "") {
      filtered = filtered.filter(
        (produto) =>
          produto.nome.toLowerCase().includes(pesquisaProduto.toLowerCase()) ||
          getTipoProdutoNome(produto.idtipoproduto)
            .toLowerCase()
            .includes(pesquisaProduto.toLowerCase()) ||
          getUnidadeMedidaNome(produto.idunidademedida)
            .toLowerCase()
            .includes(pesquisaProduto.toLowerCase()) ||
          produto.fabricante
            .toLowerCase()
            .includes(pesquisaProduto.toLowerCase()),
      );
    }

    // Filtro por tipo de produto
    if (filtroTipo > 0) {
      filtered = filtered.filter(
        (produto) => produto.idtipoproduto === filtroTipo,
      );
    }

    // Filtro por data de validade
    if (
      filtroValidade.ativo &&
      filtroValidade.dataInicio &&
      filtroValidade.dataFim
    ) {
      filtered = filtered.filter(
        (produto) =>
          produto.dataValidade &&
          produto.dataValidade >= new Date(filtroValidade.dataInicio) &&
          produto.dataValidade <= new Date(filtroValidade.dataFim),
      );
    }

    setProdutosFiltrados(filtered);
  }, [pesquisaProduto, produtos, filtroTipo, filtroValidade]);

  // Efeito para filtrar tipos
  useEffect(() => {
    if (pesquisaTipo.trim() === "") {
      setTiposFiltrados(tiposProduto);
    } else {
      const filtered = tiposProduto.filter((tipo) =>
        tipo.descricao.toLowerCase().includes(pesquisaTipo.toLowerCase()),
      );
      setTiposFiltrados(filtered);
    }
  }, [pesquisaTipo, tiposProduto]);

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

  // Manipuladores para produtos
  const handleNovoProduto = () => {
    setNovoProduto({
      nome: "",
      idtipoproduto:
        tiposProduto.length > 0 ? tiposProduto[0].idtipoproduto : 0,
      idunidademedida:
        unidadesMedida.length > 0 ? unidadesMedida[0].idunidademedida : 0,
      fabricante: "",
      dataValidade: "",
    });
    setModalOpen(true);
  };

  const handleSalvarProduto = async () => {
    try {
      const produtoAdicionado = await adicionarProduto(novoProduto);
      setProdutos([...produtos, produtoAdicionado]);
      setModalOpen(false);
      setSuccess("Produto cadastrado com sucesso!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar produto");
      setTimeout(() => setError(""), 5000);
    }
  };

  // Manipuladores para tipos de produto
  const handleNovoTipo = () => {
    setNovoTipo({
      descricao: "",
      controlaValidade: false,
    });
    setModalTipoOpen(true);
  };

  const handleSalvarTipo = async () => {
    try {
      const tipoAdicionado = await adicionarTipoProduto(novoTipo);
      setTiposProduto([...tiposProduto, tipoAdicionado]);
      setModalTipoOpen(false);
      setSuccess("Tipo de produto cadastrado com sucesso!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao salvar tipo de produto",
      );
      setTimeout(() => setError(""), 5000);
    }
  };

  const handleExcluirTipo = async (id: number) => {
    try {
      await excluirTipoProduto(id);
      setTiposProduto(tiposProduto.filter((tipo) => tipo.idtipoproduto !== id));
      setSuccess("Tipo de produto excluído com sucesso!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao excluir tipo de produto",
      );
      setTimeout(() => setError(""), 5000);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-amber-700 mb-2">
          Gerenciamento de Produtos
        </h1>
        <p className="text-gray-600">
          Cadastre e gerencie produtos e suas categorias.
        </p>
      </div>

      {/* Mensagens */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
          <p>{success}</p>
        </div>
      )}

      {/* Abas */}
      <div className="border-b border-gray-200 mb-6">
        <ul className="flex flex-wrap -mb-px">
          <li className="mr-2">
            <button
              className={`inline-block py-4 px-6 border-b-2 rounded-t-lg ${
                activeTab === "produtos"
                  ? "text-amber-600 border-amber-600"
                  : "border-transparent hover:text-amber-600 hover:border-amber-600"
              }`}
              onClick={() => setActiveTab("produtos")}
            >
              <i className="bi bi-box mr-2"></i>
              Produtos
            </button>
          </li>
          <li className="mr-2">
            <button
              className={`inline-block py-4 px-6 border-b-2 rounded-t-lg ${
                activeTab === "tipos"
                  ? "text-amber-600 border-amber-600"
                  : "border-transparent hover:text-amber-600 hover:border-amber-600"
              }`}
              onClick={() => setActiveTab("tipos")}
            >
              <i className="bi bi-tags mr-2"></i>
              Tipos de Produtos
            </button>
          </li>
        </ul>
      </div>

      {/* Conteúdo das abas */}
      {activeTab === "produtos" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="relative max-w-md w-full">
              <input
                type="text"
                placeholder="Buscar produtos..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                value={pesquisaProduto}
                onChange={(e) => setPesquisaProduto(e.target.value)}
              />
              <i className="bi bi-search absolute right-3 top-3 text-gray-400"></i>
            </div>
            <button
              className="bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-lg flex items-center"
              onClick={handleNovoProduto}
            >
              <i className="bi bi-plus-lg mr-2"></i>
              Novo Produto
            </button>
          </div>

          {/* Barra de filtros */}
          <div className="bg-amber-50 p-4 rounded-lg mb-4 border border-amber-100">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-amber-800 text-sm font-medium mb-1">
                  Filtrar por Tipo:
                </label>
                <select
                  className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                <div className="flex items-center mb-1">
                  <input
                    type="checkbox"
                    id="filtroValidadeCheck"
                    className="rounded text-amber-600 focus:ring-amber-500 h-4 w-4 mr-2"
                    checked={filtroValidade.ativo}
                    onChange={(e) =>
                      setFiltroValidade({
                        ...filtroValidade,
                        ativo: e.target.checked,
                      })
                    }
                  />
                  <label
                    htmlFor="filtroValidadeCheck"
                    className="text-amber-800 text-sm font-medium"
                  >
                    Filtrar por Validade:
                  </label>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <input
                      type="date"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        filtroValidade.ativo
                          ? "border-amber-200 bg-white"
                          : "border-gray-200 bg-gray-100"
                      }`}
                      placeholder="De"
                      value={filtroValidade.dataInicio}
                      onChange={(e) =>
                        setFiltroValidade({
                          ...filtroValidade,
                          dataInicio: e.target.value,
                        })
                      }
                      disabled={!filtroValidade.ativo}
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="date"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        filtroValidade.ativo
                          ? "border-amber-200 bg-white"
                          : "border-gray-200 bg-gray-100"
                      }`}
                      placeholder="Até"
                      value={filtroValidade.dataFim}
                      onChange={(e) =>
                        setFiltroValidade({
                          ...filtroValidade,
                          dataFim: e.target.value,
                        })
                      }
                      disabled={!filtroValidade.ativo}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-end">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
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
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-600 mb-2"></div>
              <p className="text-gray-600">Carregando produtos...</p>
            </div>
          ) : produtosFiltrados.length > 0 ? (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-amber-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider"
                    >
                      Nome
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider"
                    >
                      Tipo
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider"
                    >
                      Unidade
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider"
                    >
                      Fabricante
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider"
                    >
                      Validade
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-amber-800 uppercase tracking-wider"
                    >
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {produtosFiltrados.map((produto) => (
                    <tr key={produto.idproduto} className="hover:bg-amber-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {produto.nome}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-700">
                          {getTipoProdutoNome(produto.idtipoproduto)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-700">
                          {getUnidadeMedidaNome(produto.idunidademedida)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-700">
                          {produto.fabricante}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-700">
                          {produto.dataValidade ? (
                            <span
                              className={`inline-flex items-center ${
                                new Date(produto.dataValidade) < new Date()
                                  ? "text-red-600"
                                  : new Date(produto.dataValidade) <
                                      new Date(
                                        Date.now() + 30 * 24 * 60 * 60 * 1000,
                                      )
                                    ? "text-amber-600"
                                    : "text-green-600"
                              }`}
                            >
                              {new Date(
                                produto.dataValidade,
                              ).toLocaleDateString("pt-BR")}
                              {new Date(produto.dataValidade) < new Date() && (
                                <span className="ml-1 bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">
                                  Vencido
                                </span>
                              )}
                              {new Date(produto.dataValidade) >= new Date() &&
                                new Date(produto.dataValidade) <
                                  new Date(
                                    Date.now() + 30 * 24 * 60 * 60 * 1000,
                                  ) && (
                                  <span className="ml-1 bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full">
                                    Próximo
                                  </span>
                                )}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-amber-600 hover:text-amber-900 mx-1">
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button className="text-red-600 hover:text-red-900 mx-1">
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-lg shadow">
              <i className="bi bi-box2 text-amber-400 text-5xl mb-3"></i>
              <p className="text-gray-500">Nenhum produto encontrado.</p>
              <button
                className="mt-4 text-amber-600 hover:text-amber-800 border border-amber-600 hover:border-amber-800 rounded-lg px-4 py-2"
                onClick={handleNovoProduto}
              >
                Adicionar um produto
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === "tipos" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="relative max-w-md w-full">
              <input
                type="text"
                placeholder="Buscar tipos de produtos..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                value={pesquisaTipo}
                onChange={(e) => setPesquisaTipo(e.target.value)}
              />
              <i className="bi bi-search absolute right-3 top-3 text-gray-400"></i>
            </div>
            <button
              className="bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-lg flex items-center"
              onClick={handleNovoTipo}
            >
              <i className="bi bi-plus-lg mr-2"></i>
              Novo Tipo
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-600 mb-2"></div>
              <p className="text-gray-600">Carregando tipos de produtos...</p>
            </div>
          ) : tiposFiltrados.length > 0 ? (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-amber-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider"
                    >
                      ID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider"
                    >
                      Descrição
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider"
                    >
                      Controla Validade
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-amber-800 uppercase tracking-wider"
                    >
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tiposFiltrados.map((tipo) => (
                    <tr key={tipo.idtipoproduto} className="hover:bg-amber-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-700">
                          {tipo.idtipoproduto}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {tipo.descricao}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-700">
                          {tipo.controlaValidade ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <i className="bi bi-check-circle mr-1"></i> Sim
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              <i className="bi bi-x-circle mr-1"></i> Não
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-amber-600 hover:text-amber-900 mx-1">
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900 mx-1"
                          onClick={() => handleExcluirTipo(tipo.idtipoproduto)}
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
            <div className="text-center py-8 bg-white rounded-lg shadow">
              <i className="bi bi-tags text-amber-400 text-5xl mb-3"></i>
              <p className="text-gray-500">
                Nenhum tipo de produto encontrado.
              </p>
              <button
                className="mt-4 text-amber-600 hover:text-amber-800 border border-amber-600 hover:border-amber-800 rounded-lg px-4 py-2"
                onClick={handleNovoTipo}
              >
                Adicionar um tipo de produto
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal para Novo Produto (Sem background escuro) */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg mx-4">
            <div className="border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-amber-700">
                Novo Produto
              </h3>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Nome:
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Nome do produto"
                  value={novoProduto.nome}
                  onChange={(e) =>
                    setNovoProduto({ ...novoProduto, nome: e.target.value })
                  }
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Tipo de Produto:
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={novoProduto.idtipoproduto}
                  onChange={(e) =>
                    setNovoProduto({
                      ...novoProduto,
                      idtipoproduto: parseInt(e.target.value),
                    })
                  }
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
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Unidade de Medida:
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={novoProduto.idunidademedida}
                  onChange={(e) =>
                    setNovoProduto({
                      ...novoProduto,
                      idunidademedida: parseInt(e.target.value),
                    })
                  }
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
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Fabricante:
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Nome do fabricante"
                  value={novoProduto.fabricante}
                  onChange={(e) =>
                    setNovoProduto({
                      ...novoProduto,
                      fabricante: e.target.value,
                    })
                  }
                />
              </div>

              {tipoControlaValidade(novoProduto.idtipoproduto) && (
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Data de Validade:
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      value={novoProduto.dataValidade || ""}
                      onChange={(e) =>
                        setNovoProduto({
                          ...novoProduto,
                          dataValidade: e.target.value,
                        })
                      }
                      required
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <i className="bi bi-calendar text-gray-400"></i>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Este tipo de produto requer controle de validade
                  </p>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 px-6 py-4 flex justify-end">
              <button
                className="mr-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                onClick={() => setModalOpen(false)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                onClick={handleSalvarProduto}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Novo Tipo de Produto (Sem background escuro) */}
      {modalTipoOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
            <div className="border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-amber-700">
                Novo Tipo de Produto
              </h3>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Descrição:
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Descrição do tipo de produto"
                  value={novoTipo.descricao}
                  onChange={(e) =>
                    setNovoTipo({ ...novoTipo, descricao: e.target.value })
                  }
                />
              </div>

              <div className="mb-4">
                <label className="flex items-center text-gray-700 text-sm font-semibold">
                  <input
                    type="checkbox"
                    className="rounded text-amber-600 focus:ring-amber-500 h-4 w-4 mr-2"
                    checked={novoTipo.controlaValidade}
                    onChange={(e) =>
                      setNovoTipo({
                        ...novoTipo,
                        controlaValidade: e.target.checked,
                      })
                    }
                  />
                  Controla Validade
                </label>
                <p className="text-xs text-gray-500 mt-1 ml-6">
                  Marque esta opção se produtos deste tipo devem ter data de
                  validade controlada
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 px-6 py-4 flex justify-end">
              <button
                className="mr-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                onClick={() => setModalTipoOpen(false)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                onClick={handleSalvarTipo}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Botão de voltar */}
      <div className="mt-6">
        <button
          onClick={() => router.push("/")}
          className="flex items-center text-amber-600 hover:text-amber-800 transition-colors"
        >
          <i className="bi bi-arrow-left mr-2"></i>
          Voltar para Home
        </button>
      </div>
    </div>
  );
};

export default CadastroProdutos;
