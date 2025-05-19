"use client";

import React, { JSX, useState, useEffect } from "react";
import {
  clientToggleFavorito,
  clientExcluirCompromisso,
  clientToggleConcluido,
} from "@/services/compromissos-client";

import { Compromisso } from "@/types/compromissos";

interface CompromissosClienteProps {
  compromissosIniciais: Compromisso[];
}

const CompromissosCliente: React.FC<CompromissosClienteProps> = ({
  compromissosIniciais,
}) => {
  // Estado local para gerenciar os compromissos recebidos do servidor
  const [compromissos, setCompromissos] =
    useState<Compromisso[]>(compromissosIniciais);
  const [error, setError] = useState<string | null>(null);

  // Estado para os filtros
  const [filtros, setFiltros] = useState({
    status: "",
    tipo: "",
    animal: "",
    busca: "",
  });

  // Compromissos filtrados para exibição
  const [compromissosFiltrados, setCompromissosFiltrados] =
    useState<Compromisso[]>(compromissosIniciais);

  // Aplicar filtros quando os compromissos ou filtros mudarem
  useEffect(() => {
    let resultado = [...compromissos];

    // Filtro por status
    if (filtros.status) {
      switch (filtros.status) {
        case "pendente":
          resultado = resultado.filter((comp) => !comp.concluido);
          break;
        case "concluido":
          resultado = resultado.filter((comp) => comp.concluido);
          break;
        case "favorito":
          resultado = resultado.filter((comp) => comp.favorito);
          break;
      }
    }

    // Filtro por tipo
    if (filtros.tipo) {
      resultado = resultado.filter((comp) => comp.tipo === filtros.tipo);
    }

    // Filtro por animal
    if (filtros.animal) {
      resultado = resultado.filter((comp) => comp.animal === filtros.animal);
    }

    // Filtro por busca (texto no título)
    if (filtros.busca) {
      const termoBusca = filtros.busca.toLowerCase();
      resultado = resultado.filter(
        (comp) =>
          comp.titulo.toLowerCase().includes(termoBusca) ||
          comp.animal.toLowerCase().includes(termoBusca),
      );
    }

    setCompromissosFiltrados(resultado);
  }, [compromissos, filtros]);

  // Função para atualizar filtros
  const handleFiltroChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Função para limpar todos os filtros
  const limparFiltros = () => {
    setFiltros({
      status: "",
      tipo: "",
      animal: "",
      busca: "",
    });
  };

  // Função para alternar o status de favorito
  const handleToggleFavorite = async (id: number): Promise<void> => {
    try {
      // Otimisticamente atualiza a UI
      setCompromissos(
        compromissos.map((compromisso) =>
          compromisso.id === id
            ? { ...compromisso, favorito: !compromisso.favorito }
            : compromisso,
        ),
      );

      // Chama o serviço cliente para API
      const result = await clientToggleFavorito(id);

      if (!result.sucesso) {
        throw new Error("Falha ao atualizar favorito");
      }
    } catch (err) {
      console.error("Erro ao alternar favorito:", err);
      setError("Falha ao atualizar o status de favorito. Tente novamente.");

      // Reverte a mudança em caso de erro
      setCompromissos(
        compromissos.map((compromisso) =>
          compromisso.id === id
            ? { ...compromisso, favorito: !compromisso.favorito }
            : compromisso,
        ),
      );
    }
  };

  // Função para excluir um compromisso
  const handleExcluirCompromisso = async (id: number): Promise<void> => {
    try {
      // Otimisticamente remove da UI
      const compromissosAtualizados = compromissos.filter(
        (compromisso) => compromisso.id !== id,
      );
      setCompromissos(compromissosAtualizados);

      // Chama o serviço cliente para API
      const result = await clientExcluirCompromisso(id);

      if (!result.sucesso) {
        throw new Error("Falha ao excluir compromisso");
      }
    } catch (err) {
      console.error("Erro ao excluir compromisso:", err);
      setError("Falha ao excluir compromisso. Tente novamente.");

      // Em caso de erro, recuperamos os compromissos originais
      setCompromissos(compromissosIniciais);
    }
  };

  // Função para alternar o status de concluído
  const handleToggleConcluido = async (id: number): Promise<void> => {
    try {
      // Otimisticamente atualiza a UI
      setCompromissos(
        compromissos.map((compromisso) =>
          compromisso.id === id
            ? { ...compromisso, concluido: !compromisso.concluido }
            : compromisso,
        ),
      );

      // Chama o serviço cliente para API
      const result = await clientToggleConcluido(id);

      if (!result.sucesso) {
        throw new Error("Falha ao atualizar status concluído");
      }
    } catch (err) {
      console.error("Erro ao alternar status concluído:", err);
      setError("Falha ao atualizar o status de conclusão. Tente novamente.");

      // Reverte a mudança em caso de erro
      setCompromissos(
        compromissos.map((compromisso) =>
          compromisso.id === id
            ? { ...compromisso, concluido: !compromisso.concluido }
            : compromisso,
        ),
      );
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString + 'T00:00:00Z');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
  };

  const getIconForType = (tipo: string): JSX.Element => {
    switch (tipo) {
      case "vacinação":
        return <i className="bi bi-shield-plus text-lg"></i>;
      case "consulta":
        return <i className="bi bi-clipboard2-pulse text-lg"></i>;
      case "exame":
        return <i className="bi bi-file-earmark-medical text-lg"></i>;
      case "medicação":
        return <i className="bi bi-capsule text-lg"></i>;
      default:
        return <i className="bi bi-calendar-event text-lg"></i>;
    }
  };

  const getColorForType = (tipo: string): string => {
    switch (tipo) {
      case "vacinação":
        return "text-blue-600 bg-blue-50";
      case "consulta":
        return "text-green-600 bg-green-50";
      case "exame":
        return "text-purple-600 bg-purple-50";
      case "medicação":
        return "text-pink-600 bg-pink-50";
      default:
        return "text-amber-600 bg-amber-50";
    }
  };

  const getCardClass = (tipo: string): string => {
    switch (tipo) {
      case "vacinação":
        return "border-l-4 border-blue-500";
      case "consulta":
        return "border-l-4 border-green-500";
      case "exame":
        return "border-l-4 border-purple-500";
      case "medicação":
        return "border-l-4 border-pink-500";
      default:
        return "border-l-4 border-amber-500";
    }
  };

  return (
    <div>
      {/* Controles e filtros */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 w-full">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Botão de adicionar */}
          <button className="bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg text-sm px-4 py-2.5 inline-flex items-center transition-colors duration-200">
            <i className="bi bi-plus-lg mr-2"></i>
            Novo Compromisso
          </button>

          {/* Filtros */}
          <div className="flex flex-wrap gap-2">
            {/* Filtro por Status */}
            <select
              name="status"
              value={filtros.status}
              onChange={handleFiltroChange}
              className="bg-white border border-amber-200 text-gray-700 text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 p-2.5"
            >
              <option value="">Status</option>
              <option value="pendente">Pendentes</option>
              <option value="concluido">Concluídos</option>
              <option value="favorito">Favoritos</option>
            </select>

            {/* Filtro por Tipo */}
            <select
              name="tipo"
              value={filtros.tipo}
              onChange={handleFiltroChange}
              className="bg-white border border-amber-200 text-gray-700 text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 p-2.5"
            >
              <option value="">Tipo</option>
              <option value="vacinação">Vacinação</option>
              <option value="consulta">Consulta</option>
              <option value="exame">Exame</option>
              <option value="medicação">Medicação</option>
              <option value="outro">Outro</option>
            </select>

            {/* Filtro por Animal */}
            <select
              name="animal"
              value={filtros.animal}
              onChange={handleFiltroChange}
              className="bg-white border border-amber-200 text-gray-700 text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 p-2.5"
            >
              <option value="">Animal</option>
              <option value="Rex">Rex</option>
              <option value="Miau">Miau</option>
              <option value="Totó">Totó</option>
              <option value="Luna">Luna</option>
              <option value="Bolt">Bolt</option>
              <option value="Nina">Nina</option>
            </select>

            {/* Pesquisar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <i className="bi bi-search text-gray-400"></i>
              </div>
              <input
                type="text"
                name="busca"
                value={filtros.busca}
                onChange={handleFiltroChange}
                className="block w-full p-2.5 pl-10 text-sm text-gray-700 border border-amber-200 rounded-lg focus:ring-amber-500 focus:border-amber-500 bg-white placeholder-gray-400"
                placeholder="Buscar..."
              />
            </div>

            {/* Botão limpar filtros - apenas visível quando algum filtro está ativo */}
            {(filtros.status ||
              filtros.tipo ||
              filtros.animal ||
              filtros.busca) && (
              <button
                onClick={limparFiltros}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg text-sm px-4 py-2.5 inline-flex items-center transition-colors duration-200"
              >
                <i className="bi bi-x-circle mr-2"></i>
                Limpar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Exibir mensagem de erro, se houver */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded shadow-sm">
          <div className="flex items-center">
            <i className="bi bi-exclamation-triangle-fill text-red-500 mr-3 text-xl"></i>
            <p className="text-red-700">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="mt-2 bg-red-100 hover:bg-red-200 text-red-700 font-medium rounded-lg text-sm px-4 py-2"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Mensagem para lista vazia */}
      {compromissosFiltrados.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="bi bi-calendar-x text-amber-500 text-2xl"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Nenhum compromisso encontrado
          </h3>
          <p className="text-gray-600 mb-4">
            {compromissos.length > 0
              ? "Nenhum resultado corresponde aos filtros aplicados."
              : "Você não possui compromissos agendados no momento."}
          </p>
          {compromissos.length > 0 && (
            <button
              onClick={limparFiltros}
              className="bg-amber-100 hover:bg-amber-200 text-amber-800 font-medium rounded-lg text-sm px-4 py-2.5 inline-flex items-center transition-colors duration-200 mr-3"
            >
              <i className="bi bi-x-circle mr-2"></i>
              Limpar filtros
            </button>
          )}
          <button className="bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg text-sm px-4 py-2.5 inline-flex items-center transition-colors duration-200">
            <i className="bi bi-plus-lg mr-2"></i>
            Adicionar novo compromisso
          </button>
        </div>
      )}

      {/* Lista de compromissos */}
      {compromissosFiltrados.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {compromissosFiltrados.map((compromisso) => (
            <div
              key={compromisso.id}
              className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${getCardClass(
                compromisso.tipo,
              )}`}
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center mr-3 ${getColorForType(
                        compromisso.tipo,
                      )}`}
                    >
                      {getIconForType(compromisso.tipo)}
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">
                        {compromisso.titulo}
                      </h2>
                      <p className="text-sm text-amber-600">
                        {formatDate(compromisso.data)}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${getColorForType(
                      compromisso.tipo,
                    )}`}
                  >
                    {getIconForType(compromisso.tipo)}
                    <span className="ml-1.5 capitalize">
                      {compromisso.tipo}
                    </span>
                  </span>
                </div>

                <div className="pl-[60px] mb-4">
                  <div className="flex items-center text-gray-600 mb-3 bg-amber-50 px-3 py-2 rounded-md">
                    <i className="bi bi-emoji-smile mr-2 text-amber-500"></i>
                    <span className="text-sm">
                      Animal:{" "}
                      <span className="font-medium text-gray-800">
                        {compromisso.animal}
                      </span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <button
                      onClick={() => handleToggleConcluido(compromisso.id)}
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${
                        compromisso.concluido
                          ? "bg-green-100 text-green-800"
                          : "bg-amber-100 text-amber-800"
                      } hover:opacity-80 transition-opacity`}
                    >
                      <i
                        className={`bi ${
                          compromisso.concluido
                            ? "bi-check-circle-fill"
                            : "bi-clock-fill"
                        } mr-1.5`}
                      ></i>
                      {compromisso.concluido ? "Concluído" : "Pendente"}
                    </button>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleToggleFavorite(compromisso.id)}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Favoritar"
                      >
                        <i
                          className={`bi ${compromisso.favorito ? "bi-heart-fill text-red-500" : "bi-heart text-gray-400"} text-lg`}
                        ></i>
                      </button>
                      <button
                        onClick={() => handleExcluirCompromisso(compromisso.id)}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Excluir"
                      >
                        <i className="bi bi-trash3 text-gray-400 hover:text-red-500 transition-colors text-lg"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Paginação - exibir apenas se houver compromissos */}
      {compromissosFiltrados.length > 0 && (
        <div className="flex justify-center mt-8">
          <nav
            className="inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <a
              href="#"
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-amber-200 bg-white text-sm font-medium text-amber-500 hover:bg-amber-50"
            >
              <span className="sr-only">Anterior</span>
              <i className="bi bi-chevron-left"></i>
            </a>
            <a
              href="#"
              className="relative inline-flex items-center px-4 py-2 border border-amber-200 bg-amber-50 text-sm font-medium text-amber-700 hover:bg-amber-100"
            >
              1
            </a>
            <a
              href="#"
              className="relative inline-flex items-center px-4 py-2 border border-amber-200 bg-white text-sm font-medium text-gray-700 hover:bg-amber-50"
            >
              2
            </a>
            <a
              href="#"
              className="relative inline-flex items-center px-4 py-2 border border-amber-200 bg-white text-sm font-medium text-gray-700 hover:bg-amber-50"
            >
              3
            </a>
            <span className="relative inline-flex items-center px-4 py-2 border border-amber-200 bg-white text-sm font-medium text-gray-700">
              ...
            </span>
            <a
              href="#"
              className="relative inline-flex items-center px-4 py-2 border border-amber-200 bg-white text-sm font-medium text-gray-700 hover:bg-amber-50"
            >
              8
            </a>
            <a
              href="#"
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-amber-200 bg-white text-sm font-medium text-amber-500 hover:bg-amber-50"
            >
              <span className="sr-only">Próximo</span>
              <i className="bi bi-chevron-right"></i>
            </a>
          </nav>
        </div>
      )}
    </div>
  );
};

export default CompromissosCliente;
