"use client";

import React, { JSX, useState } from "react";

// Definição de tipos
interface Compromisso {
  id: number;
  titulo: string;
  animal: string;
  data: string;
  tipo: "vacinação" | "consulta" | "exame" | "medicação" | string;
  categoria: string;
  concluido: boolean;
  favorito: boolean;
}

const CardsCompromisso: React.FC = () => {
  // Dados estáticos com tipo definido
  const [compromissos, setCompromissos] = useState<Compromisso[]>([
    {
      id: 1,
      titulo: "Vacina Antirrábica",
      animal: "Rex",
      data: "2025-04-25",
      tipo: "vacinação",
      categoria: "Principal",
      concluido: false,
      favorito: false,
    },
    {
      id: 2,
      titulo: "Consulta de Rotina",
      animal: "Miau",
      data: "2025-04-25",
      tipo: "consulta",
      categoria: "Principal",
      concluido: true,
      favorito: true,
    },
    {
      id: 3,
      titulo: "Exame de Sangue",
      animal: "Totó",
      data: "2025-04-26",
      tipo: "exame",
      categoria: "Principal",
      concluido: false,
      favorito: false,
    },
    {
      id: 4,
      titulo: "Aplicação de Medicamento",
      animal: "Luna",
      data: "2025-04-27",
      tipo: "medicação",
      categoria: "Principal",
      concluido: true,
      favorito: false,
    },
  ]);

  const toggleFavorite = (id: number): void => {
    setCompromissos(
      compromissos.map((compromisso) =>
        compromisso.id === id
          ? { ...compromisso, favorito: !compromisso.favorito }
          : compromisso,
      ),
    );
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Função para obter o ícone com base no tipo de compromisso
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

  // Função para obter a cor com base no tipo de compromisso
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

  // Função para obter a classe do cartão baseado no tipo
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
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-2xl font-bold text-amber-700 flex items-center">
            <i className="bi bi-calendar2-check text-amber-500 mr-3 text-2xl"></i>
            Compromissos
            <span className="ml-2 bg-amber-100 text-amber-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
              {compromissos.length}
            </span>
          </h1>

          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex bg-white rounded-lg p-1 shadow-sm border border-amber-100">
              <button className="p-2 text-amber-600 bg-amber-50 rounded-md">
                <i className="bi bi-list"></i>
              </button>
              <button className="p-2 text-gray-500 hover:bg-amber-50 rounded-md">
                <i className="bi bi-grid-3x3-gap-fill"></i>
              </button>
            </div>

            <div className="relative">
              <select className="bg-white shadow-sm border border-amber-200 rounded-lg pl-4 pr-10 py-2.5 text-sm text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500">
                <option>Ordenar por</option>
                <option>Data</option>
                <option>Animal</option>
                <option>Status</option>
                <option>Tipo</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-amber-600">
                <i className="bi bi-chevron-down text-xs"></i>
              </div>
            </div>

            <button className="bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg text-sm px-4 py-2.5 flex items-center transition-colors duration-200">
              <i className="bi bi-plus-lg mr-2"></i>
              Novo Compromisso
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {compromissos.map((compromisso) => (
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
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800 whitespace-nowrap">
                    {compromisso.categoria}
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
                    <span
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${
                        compromisso.concluido
                          ? "bg-green-100 text-green-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      <i
                        className={`bi ${
                          compromisso.concluido
                            ? "bi-check-circle-fill"
                            : "bi-clock-fill"
                        } mr-1.5`}
                      ></i>
                      {compromisso.concluido ? "Concluído" : "Pendente"}
                    </span>
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
                </div>

                <div className="flex justify-between items-center mt-5 pt-3 border-t border-amber-100">
                  <div>
                    <button className="text-sm text-amber-600 hover:text-amber-800 font-medium">
                      <i className="bi bi-pencil-square mr-1"></i> Editar
                    </button>
                  </div>

                  <div className="flex space-x-1">
                    <button
                      onClick={() => toggleFavorite(compromisso.id)}
                      className={`p-2 rounded-full hover:bg-amber-50 ${
                        compromisso.favorito
                          ? "text-amber-500"
                          : "text-gray-400"
                      } transition-colors duration-200`}
                      title="Favoritar"
                    >
                      {compromisso.favorito ? (
                        <i className="bi bi-star-fill"></i>
                      ) : (
                        <i className="bi bi-star"></i>
                      )}
                    </button>
                    <button
                      className="p-2 rounded-full hover:bg-amber-50 text-gray-400 hover:text-red-500 transition-colors duration-200"
                      title="Excluir"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                    <button
                      className="p-2 rounded-full hover:bg-amber-50 text-gray-400 transition-colors duration-200"
                      title="Mais opções"
                    >
                      <i className="bi bi-three-dots-vertical"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Paginação */}
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
      </div>
    </div>
  );
};

export default CardsCompromisso;
