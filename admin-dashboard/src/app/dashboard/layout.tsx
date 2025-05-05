import React from "react";
import { redirect } from "next/navigation";
import { SidebarProvider } from "@/components/sidebar/SidebarContext";
import SidebarWrapper from "@/components/sidebar/SidebarWrapper";
import Footer from "@/components/dashboard/Footer";
import { getAuthToken, verifyToken } from "@/utils/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = await getAuthToken();
  
  if (!token) {
    redirect("/login");
  }
  
  const isValid = await verifyToken(token);
  
  if (!isValid) {
    redirect("/login");
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50">
        <SidebarWrapper />

        {/* Conteúdo principal */}
        <main
          className="flex-1 transition-all duration-300 flex flex-col lg:ml-64"
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
          <div className="p-6 flex-grow">{children}</div>

          {/* Usando o componente Footer */}
          <Footer />
        </main>
      </div>
    </SidebarProvider>
  );
}
