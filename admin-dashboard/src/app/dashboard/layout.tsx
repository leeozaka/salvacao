"use client";

import React from "react";
import { SidebarProvider } from "../../components/sidebar/SidebarContext";
import Sidebar from "../../components/sidebar/Sidebar";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Gerenciamento do estado da sidebar diretamente no layout
  const [isOpen, setIsOpen] = useState(true); // Por padrão, aberto em telas grandes

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

        {/* Conteúdo principal */}
        <main
          className={`flex-1 transition-all duration-300 ${
            isOpen ? "lg:ml-64" : "ml-0"
          }`}
        >
          {/* Cabeçalho do dashboard */}
          <header className="bg-white shadow-sm py-4 px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Adicione aqui componentes adicionais de cabeçalho (notificações, perfil, etc) */}
                <div className="relative">
                  <button className="p-2 rounded-full hover:bg-amber-50">
                    <i className="bi bi-bell text-amber-500"></i>
                  </button>
                </div>
                <div className="relative">
                  <button className="p-2 rounded-full hover:bg-amber-50">
                    <i className="bi bi-person-circle text-amber-500"></i>
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Conteúdo da página */}
          <div className="p-6">{children}</div>

          {/* Rodapé do dashboard */}
          <footer className="bg-white p-4 shadow-inner mt-auto">
            <div className="text-center text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} PetControl - Todos os direitos
              reservados
            </div>
          </footer>
        </main>
      </div>
    </SidebarProvider>
  );
}
