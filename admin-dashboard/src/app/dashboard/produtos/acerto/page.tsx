"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Produto, SaidaProduto, TipoSaida, Estoque } from "@/types/entities";
import {
  buscarProdutos,
  buscarTiposSaida,
  registrarSaidaProduto,
  buscarQuantidadeEstoque,
} from "@/services/estoqueService";

const AcertoEstoquePage: React.FC = () => {
  // Estados
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [estoques, setEstoques] = useState<Estoque[]>([]);
  const [tiposSaida, setTiposSaida] = useState<TipoSaida[]>([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(
    null,
  );
  const [quantidadeNova, setQuantidadeNova] = useState<number>(0);
  const [idTipoSaida, setIdTipoSaida] = useState<number>(0);
  const [obs, setObs] = useState<string>("");
  const [pesquisa, setPesquisa] = useState<string>("");
  const [produtosFiltrados, setProdutosFiltrados] = useState<Produto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [erro, setErro] = useState<string>("");
  const [sucesso, setSucesso] = useState<string>("");

  const router = useRouter();

  // Carregar dados iniciais
  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        const [produtosData, tiposSaidaData, estoquesData] = await Promise.all([
          buscarProdutos(),
          buscarTiposSaida(),
          buscarQuantidadeEstoque(),
        ]);

        setProdutos(produtosData);
        setProdutosFiltrados(produtosData);
        setTiposSaida(tiposSaidaData);
        setEstoques(estoquesData);
        setLoading(false);
      } catch (err) {
        setErro("Erro ao carregar dados. Tente novamente mais tarde.");
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  // Efeito para filtrar produtos com base na pesquisa
  useEffect(() => {
    if (pesquisa.trim() === "") {
      setProdutosFiltrados(produtos);
    } else {
      const filtered = produtos.filter(
        (produto) =>
          produto.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
          produto.fabricante.toLowerCase().includes(pesquisa.toLowerCase()),
      );
      setProdutosFiltrados(filtered);
    }
  }, [pesquisa, produtos]);

  // Função para obter a quantidade atual do estoque
  const getQuantidadeAtual = (idproduto: number): number => {
    const estoque = estoques.find((e) => e.idproduto === idproduto);
    return estoque ? estoque.quantidade : 0;
  };

  // Manipulador para selecionar produto
  const handleSelecionarProduto = (produto: Produto) => {
    setProdutoSelecionado(produto);
    setQuantidadeNova(getQuantidadeAtual(produto.idproduto));
    setIdTipoSaida(
      tiposSaida.find((t) => t.descricao === "ACERTO")?.idtiposaida || 0,
    );
    setObs("");
    setErro("");
  };

  // Manipulador para submeter o acerto
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!produtoSelecionado) {
      setErro("Selecione um produto para efetuar o acerto");
      return;
    }

    if (quantidadeNova < 0) {
      setErro("A quantidade não pode ser negativa");
      return;
    }

    if (idTipoSaida === 0) {
      setErro("Selecione o motivo do acerto");
      return;
    }

    try {
      const quantidadeAtual = getQuantidadeAtual(produtoSelecionado.idproduto);
      const quantidadeDelta = quantidadeNova - quantidadeAtual;

      // Criar objeto SaidaProduto
      const saida: SaidaProduto = {
        produto_idproduto: produtoSelecionado.idproduto,
        usuario_pessoa_idpessoa: 1, // Simulado, obter do contexto de autenticação
        data: new Date(),
        quantidade: quantidadeDelta, // Positivo para aumento, negativo para redução
        obs:
          obs ||
          `Acerto de estoque: de ${quantidadeAtual} para ${quantidadeNova}`,
        idtiposaida: idTipoSaida,
      };

      // Enviar para a API
      await registrarSaidaProduto(saida);

      // Atualizar estoque localmente
      const estoquesAtualizados = estoques.map((e) =>
        e.idproduto === produtoSelecionado.idproduto
          ? { ...e, quantidade: quantidadeNova }
          : e,
      );
      setEstoques(estoquesAtualizados);

      // Feedback de sucesso
      setSucesso(
        `Estoque do produto "${produtoSelecionado.nome}" atualizado com sucesso!`,
      );

      // Limpar formulário
      setProdutoSelecionado(null);
      setQuantidadeNova(0);
      setIdTipoSaida(0);
      setObs("");
      setTimeout(() => setSucesso(""), 5000);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao registrar acerto");
    }
  };

  // Manipulador para cancelar
  const handleCancelar = () => {
    setProdutoSelecionado(null);
    setQuantidadeNova(0);
    setIdTipoSaida(0);
    setObs("");
    setErro("");
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-amber-700 mb-2">
          Acerto de Estoque
        </h1>
        <p className="text-gray-600">
          Utilize este formulário para efetuar acertos no estoque de produtos.
        </p>
      </div>

      {/* Mensagens de erro e sucesso */}
      {erro && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{erro}</p>
        </div>
      )}

      {sucesso && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
          <p>{sucesso}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna de Seleção de Produto */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold text-amber-600 mb-4">
            Selecione um Produto
          </h2>

          {/* Campo de pesquisa */}
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar produto..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                value={pesquisa}
                onChange={(e) => setPesquisa(e.target.value)}
              />
              <i className="bi bi-search absolute right-3 top-3 text-gray-400"></i>
            </div>
          </div>

          {/* Lista de produtos */}
          <div className="overflow-y-auto max-h-96 border border-gray-200 rounded-lg">
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                <i className="bi bi-hourglass-split animate-spin mr-2"></i>
                Carregando produtos...
              </div>
            ) : produtosFiltrados.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {produtosFiltrados.map((produto) => (
                  <li
                    key={produto.idproduto}
                    className={`p-3 cursor-pointer hover:bg-amber-50 transition-colors ${
                      produtoSelecionado?.idproduto === produto.idproduto
                        ? "bg-amber-100"
                        : ""
                    }`}
                    onClick={() => handleSelecionarProduto(produto)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{produto.nome}</h3>
                        <p className="text-sm text-gray-500">
                          Fabricante: {produto.fabricante}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold">
                          {getQuantidadeAtual(produto.idproduto)}
                        </span>
                        <span className="text-gray-500 text-sm ml-1">unid</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-center text-gray-500">
                Nenhum produto encontrado.
              </div>
            )}
          </div>
        </div>

        {/* Coluna de Formulário de Acerto */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold text-amber-600 mb-4">
            Efetuar Acerto de Estoque
          </h2>

          {produtoSelecionado ? (
            <form onSubmit={handleSubmit}>
              <div className="bg-amber-50 p-4 rounded-lg mb-4">
                <h3 className="font-medium mb-2">{produtoSelecionado.nome}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Fabricante:</p>
                    <p className="font-medium">
                      {produtoSelecionado.fabricante}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Validade:</p>
                    <p className="font-medium">
                      {produtoSelecionado.dataValidade
                        ? new Date(
                            produtoSelecionado.dataValidade,
                          ).toLocaleDateString("pt-BR")
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Quantidade Atual:</p>
                    <p className="font-medium">
                      {getQuantidadeAtual(produtoSelecionado.idproduto)} unid
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Nova Quantidade:
                </label>
                <div className="flex items-center">
                  <button
                    type="button"
                    className="bg-amber-200 hover:bg-amber-300 text-amber-800 px-3 py-2 rounded-l-lg transition-colors"
                    onClick={() =>
                      setQuantidadeNova((prev) => Math.max(0, prev - 1))
                    }
                  >
                    <i className="bi bi-dash"></i>
                  </button>
                  <input
                    type="number"
                    min="0"
                    value={quantidadeNova}
                    onChange={(e) =>
                      setQuantidadeNova(
                        Math.max(0, parseInt(e.target.value) || 0),
                      )
                    }
                    className="w-full border-y border-gray-300 py-2 px-3 text-center focus:outline-none"
                  />
                  <button
                    type="button"
                    className="bg-amber-200 hover:bg-amber-300 text-amber-800 px-3 py-2 rounded-r-lg transition-colors"
                    onClick={() => setQuantidadeNova((prev) => prev + 1)}
                  >
                    <i className="bi bi-plus"></i>
                  </button>
                </div>
                <div className="mt-1 flex justify-between text-sm">
                  <span className="text-gray-500">
                    Quantidade atual:{" "}
                    {getQuantidadeAtual(produtoSelecionado.idproduto)}
                  </span>
                  <span
                    className={`font-medium ${
                      quantidadeNova >
                      getQuantidadeAtual(produtoSelecionado.idproduto)
                        ? "text-green-600"
                        : quantidadeNova <
                            getQuantidadeAtual(produtoSelecionado.idproduto)
                          ? "text-red-600"
                          : "text-gray-600"
                    }`}
                  >
                    {quantidadeNova >
                      getQuantidadeAtual(produtoSelecionado.idproduto) && "+"}
                    {quantidadeNova -
                      getQuantidadeAtual(produtoSelecionado.idproduto)}{" "}
                    unid
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Motivo do Acerto:
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={idTipoSaida}
                  onChange={(e) => setIdTipoSaida(parseInt(e.target.value))}
                  required
                >
                  <option value={0}>Selecione um motivo</option>
                  {tiposSaida.map((tipo) => (
                    <option key={tipo.idtiposaida} value={tipo.idtiposaida}>
                      {tipo.descricao}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Observações:
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  rows={3}
                  placeholder="Descreva detalhes do acerto..."
                  value={obs}
                  onChange={(e) => setObs(e.target.value)}
                ></textarea>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={handleCancelar}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                >
                  Confirmar Acerto
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <i className="bi bi-box-seam text-6xl mb-4 block"></i>
              <p>Selecione um produto para efetuar o acerto de estoque.</p>
            </div>
          )}
        </div>
      </div>

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

export default AcertoEstoquePage;
