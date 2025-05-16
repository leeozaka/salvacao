"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/services/authService";
import { OpenSubmenus, SidebarProps } from "@/types/sidebar";

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const router = useRouter();
  const [openSubmenus, setOpenSubmenus] = useState<OpenSubmenus>({
    produtos: false,
    medicacao: false,
    pessoas: false,
  });

  const handleSetIsOpen = useCallback(
    (value: boolean) => {
      if (typeof setIsOpen === "function") {
        setIsOpen(value);
      }
    },
    [setIsOpen],
  );

  // Função para fechar o sidebar em telas pequenas quando clica fora
  useEffect(() => {
    const handleResize = () => {
      // Fecha o sidebar automaticamente em telas pequenas
      if (window.innerWidth < 1024 && isOpen) {
        handleSetIsOpen(false);
      }
    };

    // Fecha o sidebar quando clica fora dele em telas pequenas
    const handleClickOutside = (e: MouseEvent) => {
      const sidebar = document.getElementById("sidebar");
      const toggleButton = document.getElementById("toggle-sidebar");

      if (
        sidebar &&
        !sidebar.contains(e.target as Node) &&
        toggleButton &&
        !toggleButton.contains(e.target as Node) &&
        window.innerWidth < 1024 &&
        isOpen
      ) {
        handleSetIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, handleSetIsOpen]);

  const toggleSidebar = (): void => {
    handleSetIsOpen(!isOpen);
  };

  const toggleSubmenu = (menu: string): void => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const navigateTo = (path: string): void => {
    router.push(path);
    // Fecha o sidebar automaticamente após navegação em dispositivos móveis
    if (window.innerWidth < 1024) {
      handleSetIsOpen(false);
    }
  };

  const handleLogout = async (): Promise<void> => {
    try {
      const success = await logoutUser();

      if (success) {
        router.push("/login");
      } else {
        console.error("Erro ao fazer logout");
      }
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      router.push("/login");
    }
  };

  return (
    <>
      <button
        id="toggle-sidebar"
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 text-3xl z-50 hover:text-amber-700 dark:hover:text-amber-400 transition-colors duration-200"
        aria-label="Menu"
      >
        <i className={`bi ${isOpen ? "bi-x" : "bi-filter-left"}`}></i>
      </button>

      {/* Sidebar */}
      <aside
        id="sidebar"
        className={`fixed top-0 left-0 w-64 h-screen shadow-md z-40 transition-transform duration-300 ease-in-out bg-bg-color dark:bg-menu-bg-dark ${
          !isOpen ? "-translate-x-full lg:translate-x-0" : "translate-x-0"
        }`}
      >
        {/* Logo/Título */}
        <div 
          className="font-semibold text-xl py-4 px-4 mx-4 my-4 text-center rounded-lg shadow-sm text-white bg-primary-color dark:bg-primary-color-dark border border-primary-color dark:border-primary-color-dark">
          PetControl
        </div>

        {/* Container de Menu com Rolagem */}
        <div 
          className="mx-4 my-4 p-2 rounded-xl bg-amber-50 dark:bg-gray-600 overflow-y-auto max-h-[calc(100vh-10rem)]">
          {/* Item Home */}
          <div
            className="flex items-center px-4 py-3 my-1 rounded-md cursor-pointer hover:bg-amber-100 dark:hover:bg-gray-500 transition-colors duration-200"
            onClick={() => navigateTo("/")}
          >
            <i className="bi bi-house-door text-lg mr-5"></i>
            <span>Home</span>
          </div>

          {/* Item Animais */}
          <div
            className="flex items-center px-4 py-3 my-1 rounded-md cursor-pointer hover:bg-amber-100 dark:hover:bg-gray-500 transition-colors duration-200"
            onClick={() => navigateTo("/animais")}
          >
            <i className="bi bi-piggy-bank text-lg mr-5"></i>
            <span>Animais</span>
          </div>

          {/* Item Medicação com Submenu */}
          <div
            className="flex items-center px-4 py-3 my-1 rounded-md cursor-pointer hover:bg-amber-100 dark:hover:bg-gray-500 transition-colors duration-200"
            onClick={() => toggleSubmenu("medicacao")}
          >
            <i className="bi bi-capsule text-lg mr-5"></i>
            <span>Medicação</span>
            <i
              className={`bi bi-chevron-down ml-auto text-gray-600 dark:text-gray-300 transition-transform duration-300 ${
                openSubmenus.medicacao ? "rotate-180" : ""
              }`}
            ></i>
          </div>

          {/* Submenu de Medicação */}
          <div
            className={`ml-10 mt-1 mb-2 flex flex-col space-y-1 overflow-hidden transition-all duration-300 ${
              openSubmenus.medicacao
                ? "max-h-40 opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <div
              className="flex items-center p-2 rounded hover:bg-amber-100 dark:hover:bg-gray-500 cursor-pointer transition-colors duration-200"
              onClick={() => navigateTo("/dashboard/medicacao/efetuar")}
            >
              <i className="bi bi-dot"></i>
              <span className="ml-2 text-gray-700 dark:text-gray-200 text-sm">
                Efetuar Medicação
              </span>
            </div>
            <div
              className="flex items-center p-2 rounded hover:bg-amber-100 dark:hover:bg-gray-500 cursor-pointer transition-colors duration-200"
              onClick={() => navigateTo("/dashboard/medicacao/historico")}
            >
              <i className="bi bi-dot"></i>
              <span className="ml-2 text-gray-700 dark:text-gray-200 text-sm">Histórico</span>
            </div>
          </div>

          {/* Item Vacinação */}
          <div
            className="flex items-center px-4 py-3 my-1 rounded-md cursor-pointer hover:bg-amber-100 dark:hover:bg-gray-500 transition-colors duration-200"
            onClick={() => navigateTo("/vacinacao")}
          >
            <i className="bi bi-shield-plus text-lg mr-5"></i>
            <span>Vacinação</span>
          </div>

          {/* Item Pessoas com Submenu */}
          <div
            className="flex items-center px-4 py-3 my-1 rounded-md cursor-pointer hover:bg-amber-100 dark:hover:bg-gray-500 transition-colors duration-200"
            onClick={() => toggleSubmenu("pessoas")}
          >
            <i className="bi bi-people text-lg mr-5"></i>
            <span>Pessoas</span>
            <i
              className={`bi bi-chevron-down ml-auto text-gray-600 dark:text-gray-300 transition-transform duration-300 ${
                openSubmenus.pessoas ? "rotate-180" : ""
              }`}
            ></i>
          </div>

          {/* Submenu de Pessoas */}
          <div
            className={`ml-10 mt-1 mb-2 flex flex-col space-y-1 overflow-hidden transition-all duration-300 ${
              openSubmenus.pessoas
                ? "max-h-52 opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <div
              className="flex items-center p-2 rounded hover:bg-amber-100 dark:hover:bg-gray-500 cursor-pointer transition-colors duration-200"
              onClick={() => navigateTo("/dashboard/pessoas/adotante")}
            >
              <i className="bi bi-dot"></i>
              <span className="ml-2 text-gray-700 dark:text-gray-200 text-sm">
                Gerenciar adotantes
              </span>
            </div>

            <div
              className="flex items-center p-2 rounded hover:bg-amber-100 dark:hover:bg-gray-500 cursor-pointer transition-colors duration-200"
              onClick={() => navigateTo("/dashboard/pessoas/doacao")}
            >
              <i className="bi bi-dot"></i>
              <span className="ml-2 text-gray-700 dark:text-gray-200 text-sm">
                Efetuar doacao
              </span>
            </div>
          </div>

          {/* Item Produtos com Submenu */}
          <div
            className="flex items-center px-4 py-3 my-1 rounded-md cursor-pointer hover:bg-amber-100 dark:hover:bg-gray-500 transition-colors duration-200"
            onClick={() => toggleSubmenu("produtos")}
          >
            <i className="bi bi-plus-circle text-lg mr-5"></i>
            <span>Produtos</span>
            <i
              className={`bi bi-chevron-down ml-auto text-gray-600 dark:text-gray-300 transition-transform duration-300 ${
                openSubmenus.produtos ? "rotate-180" : ""
              }`}
            ></i>
          </div>

          {/* Submenu de Produtos */}
          <div
            className={`ml-10 mt-1 mb-2 flex flex-col space-y-1 overflow-hidden transition-all duration-300 ${
              openSubmenus.produtos
                ? "max-h-52 opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <div
              className="flex items-center p-2 rounded hover:bg-amber-100 dark:hover:bg-gray-500 cursor-pointer transition-colors duration-200"
              onClick={() => navigateTo("/dashboard/produtos/cadastro")}
            >
              <i className="bi bi-dot"></i>
              <span className="ml-2 text-gray-700 dark:text-gray-200 text-sm">
                Gerenciar Produtos
              </span>
            </div>

            <div
              className="flex items-center p-2 rounded hover:bg-amber-100 dark:hover:bg-gray-500 cursor-pointer transition-colors duration-200"
              onClick={() => navigateTo("/dashboard/produtos/acerto")}
            >
              <i className="bi bi-dot"></i>
              <span className="ml-2 text-gray-700 dark:text-gray-200 text-sm">
                Efetuar Acerto de Estoque
              </span>
            </div>
          </div>

          {/* Item Estoque */}
          <div
            className="flex items-center px-4 py-3 my-1 rounded-md cursor-pointer hover:bg-amber-100 dark:hover:bg-gray-500 transition-colors duration-200"
            onClick={() => navigateTo("/estoque")}
          >
            <i className="bi bi-box text-lg mr-5"></i>
            <span>Estoque</span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-600 cursor-pointer">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full px-4 py-3 rounded-md bg-red-50 dark:bg-red-700 dark:bg-opacity-20 hover:bg-red-100 dark:hover:bg-red-600 dark:hover:bg-opacity-30 transition-colors duration-200"
          >
            <i className="bi bi-box-arrow-right text-red-500 dark:text-red-400 text-lg mr-3"></i>
            <span className="text-red-600 dark:text-red-300 font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
