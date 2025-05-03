"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Interfaces para tipagem
interface Produto {
  id: number;
  nome: string;
  codigo: string;
  quantidadeAtual: number;
  unidade: string;
  categoria: string;
}

interface AcertoEstoque {
  produtoId: number;
  quantidadeAnterior: number;
  quantidadeNova: number;
  motivo: string;
  data: string;
  responsavel: string;
}

const AcertoEstoquePage: React.FC = () => {
  // Estados
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(
    null,
  );
  const [quantidadeNova, setQuantidadeNova] = useState<number>(0);
  const [motivo, setMotivo] = useState<string>("");
  const [responsavel, setResponsavel] = useState<string>("");
  const [pesquisa, setPesquisa] = useState<string>("");
  const [produtosFiltrados, setProdutosFiltrados] = useState<Produto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [erro, setErro] = useState<string>("");
  const [sucesso, setSucesso] = useState<string>("");

  const router = useRouter();

  // Simulação de carregamento de dados (substitua por chamada à API real)
  useEffect(() => {
    // Simulando um atraso de carregamento
    const timeoutId = setTimeout(() => {
      // Dados de exemplo
      const produtosExemplo: Produto[] = [
        {
          id: 1,
          nome: "Ração Premium Cães",
          codigo: "RAC001",
          quantidadeAtual: 25,
          unidade: "kg",
          categoria: "Alimentos",
        },
        {
          id: 2,
          nome: "Antipulgas Gatos",
          codigo: "APG002",
          quantidadeAtual: 15,
          unidade: "unid",
          categoria: "Medicamentos",
        },
        {
          id: 3,
          nome: "Shampoo Hipoalergênico",
          codigo: "SHP003",
          quantidadeAtual: 8,
          unidade: "litros",
          categoria: "Higiene",
        },
        {
          id: 4,
          nome: "Coleira Ajustável P",
          codigo: "COL004",
          quantidadeAtual: 12,
          unidade: "unid",
          categoria: "Acessórios",
        },
        {
          id: 5,
          nome: "Vitamina C para Aves",
          codigo: "VIT005",
          quantidadeAtual: 6,
          unidade: "frascos",
          categoria: "Suplementos",
        },
      ];

      setProdutos(produtosExemplo);
      setProdutosFiltrados(produtosExemplo);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, []);

  // Efeito para filtrar produtos com base na pesquisa
  useEffect(() => {
    if (pesquisa.trim() === "") {
      setProdutosFiltrados(produtos);
    } else {
      const filtered = produtos.filter(
        (produto) =>
          produto.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
          produto.codigo.toLowerCase().includes(pesquisa.toLowerCase()) ||
          produto.categoria.toLowerCase().includes(pesquisa.toLowerCase()),
      );
      setProdutosFiltrados(filtered);
    }
  }, [pesquisa, produtos]);

  // Manipuladores de eventos
  const handleSelecionarProduto = (produto: Produto) => {
    setProdutoSelecionado(produto);
    setQuantidadeNova(produto.quantidadeAtual);
    setErro("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!produtoSelecionado) {
      setErro("Selecione um produto para efetuar o acerto");
      return;
    }

    if (quantidadeNova < 0) {
      setErro("A quantidade não pode ser negativa");
      return;
    }

    if (!motivo) {
      setErro("Informe o motivo do acerto de estoque");
      return;
    }

    if (!responsavel) {
      setErro("Informe o responsável pelo acerto");
      return;
    }

    // Criar objeto de acerto de estoque
    const acerto: AcertoEstoque = {
      produtoId: produtoSelecionado.id,
      quantidadeAnterior: produtoSelecionado.quantidadeAtual,
      quantidadeNova: quantidadeNova,
      motivo: motivo,
      data: new Date().toISOString(),
      responsavel: responsavel,
    };

    // Aqui você enviaria o acerto para a API
    console.log("Acerto de estoque a ser enviado:", acerto);

    // Atualizar o estoque localmente (simulando resposta bem-sucedida da API)
    const produtosAtualizados = produtos.map((p) =>
      p.id === produtoSelecionado.id
        ? { ...p, quantidadeAtual: quantidadeNova }
        : p,
    );

    setProdutos(produtosAtualizados);
    setProdutosFiltrados(produtosAtualizados);

    // Feedback de sucesso
    setSucesso(
      `Estoque do produto "${produtoSelecionado.nome}" atualizado com sucesso!`,
    );

    // Limpar formulário
    setProdutoSelecionado(null);
    setQuantidadeNova(0);
    setMotivo("");
    setResponsavel("");

    // Limpar mensagem de sucesso após 5 segundos
    setTimeout(() => setSucesso(""), 5000);
  };

  const handleCancelar = () => {
    setProdutoSelecionado(null);
    setQuantidadeNova(0);
    setMotivo("");
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
                    key={produto.id}
                    className={`p-3 cursor-pointer hover:bg-amber-50 transition-colors ${
                      produtoSelecionado?.id === produto.id
                        ? "bg-amber-100"
                        : ""
                    }`}
                    onClick={() => handleSelecionarProduto(produto)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{produto.nome}</h3>
                        <p className="text-sm text-gray-500">
                          Código: {produto.codigo} | Categoria:{" "}
                          {produto.categoria}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold">
                          {produto.quantidadeAtual}
                        </span>
                        <span className="text-gray-500 text-sm ml-1">
                          {produto.unidade}
                        </span>
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
                    <p className="text-sm text-gray-600">Código:</p>
                    <p className="font-medium">{produtoSelecionado.codigo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Categoria:</p>
                    <p className="font-medium">
                      {produtoSelecionado.categoria}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Quantidade Atual:</p>
                    <p className="font-medium">
                      {produtoSelecionado.quantidadeAtual}{" "}
                      {produtoSelecionado.unidade}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Unidade:</p>
                    <p className="font-medium">{produtoSelecionado.unidade}</p>
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
                    Quantidade atual: {produtoSelecionado.quantidadeAtual}
                  </span>
                  <span
                    className={`font-medium ${
                      quantidadeNova > produtoSelecionado.quantidadeAtual
                        ? "text-green-600"
                        : quantidadeNova < produtoSelecionado.quantidadeAtual
                          ? "text-red-600"
                          : "text-gray-600"
                    }`}
                  >
                    {quantidadeNova > produtoSelecionado.quantidadeAtual && "+"}
                    {quantidadeNova - produtoSelecionado.quantidadeAtual}{" "}
                    {produtoSelecionado.unidade}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Motivo do Acerto:
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  required
                >
                  <option value="">Selecione um motivo</option>
                  <option value="Inventário físico">Inventário físico</option>
                  <option value="Produto danificado">Produto danificado</option>
                  <option value="Produto vencido">Produto vencido</option>
                  <option value="Erro de lançamento">Erro de lançamento</option>
                  <option value="Devolução">Devolução</option>
                  <option value="Entrada manual">Entrada manual</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              {motivo === "Outro" && (
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Especifique o motivo:
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    rows={3}
                    placeholder="Descreva o motivo do acerto..."
                    required
                  ></textarea>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Responsável:
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Nome do responsável"
                  value={responsavel}
                  onChange={(e) => setResponsavel(e.target.value)}
                  required
                />
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
