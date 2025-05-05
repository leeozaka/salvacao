"use client";

import React, { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/sidebar/SidebarContext";
import Sidebar from "@/components/sidebar/Sidebar";
import Footer from "@/components/dashboard/Footer";
import { verifyAuthToken, getTokenFromCookie } from "@/services/authService";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const token = getTokenFromCookie();

        if (!token) {
          router.push("/login");
          return;
        }

        const isAuthenticated = verifyAuthToken();

        if (!isAuthenticated) {
          router.push("/login");
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        router.push("/login");
      }
    }

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

        {/* Conteúdo principal */}
        <main
          className={`flex-1 transition-all duration-300 flex flex-col ${
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
          <div className="p-6 flex-grow">{children}</div>

          {/* Usando o componente Footer */}
          <Footer />
        </main>
      </div>
    </SidebarProvider>
  );
}
