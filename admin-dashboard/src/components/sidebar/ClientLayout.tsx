"use client";
import React from "react";
import { useSidebar } from "../../contexts/SidebarContext";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen } = useSidebar();

  return (
    <main
      className={`w-full min-h-screen p-4 transition-all duration-300 ${
        isOpen ? "lg:pl-64" : "pl-0"
      }`}
    >
      {children}
    </main>
  );
}
