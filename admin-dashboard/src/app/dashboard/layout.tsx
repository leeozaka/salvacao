import React from "react";
import { redirect } from "next/navigation";
import { SidebarProvider } from "@/contexts/SidebarContext";
import SidebarWrapper from "@/components/sidebar/SidebarWrapper";
import Footer from "@/components/dashboard/Footer";
import { getAuthToken, verifyToken } from "@/utils/auth";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

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
      <div className="flex min-h-screen bg-bg-color dark:bg-bg-color-dark">
        <SidebarWrapper />

        <main className="flex-1 transition-all duration-300 flex flex-col lg:ml-64">
          <header className="bg-menu-bg-color dark:bg-menu-bg-dark shadow-sm py-4 px-6">
            <div className="flex items-center justify-end">
              <div className="flex items-center space-x-4">
                <div className="relative text-primary-color">
                  <ThemeSwitcher />
                </div>
                <div className="relative">
                  <button className="p-2 rounded-full hover:bg-amber-100 dark:hover:bg-gray-600">
                    <i className="bi bi-bell text-primary-color"></i>
                  </button>
                </div>
                <div className="relative">
                  <button className="p-2 rounded-full hover:bg-amber-100 dark:hover:bg-gray-600">
                    <i className="bi bi-person-circle text-primary-color"></i>
                  </button>
                </div>
              </div>
            </div>
          </header>

          <div className="p-6 flex-grow">{children}</div>

          <Footer />
        </main>
      </div>
    </SidebarProvider>
  );
}
