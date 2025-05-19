"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/services/authService";
import { OpenSubmenus, SidebarProps, MenuItem } from "@/types/sidebar";
import { menuItems } from "./MenuItems";

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const router = useRouter();
  const [openSubmenus, setOpenSubmenus] = useState<OpenSubmenus>({});

  const handleSetIsOpen = useCallback(
    (value: boolean) => {
      if (typeof setIsOpen === "function") {
        setIsOpen(value);
      }
    },
    [setIsOpen],
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024 && isOpen) {
        handleSetIsOpen(false);
      }
    };

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

  const renderMenuItem = (item: MenuItem) => {
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isSubmenuOpen = openSubmenus[item.title.toLowerCase()];

    return (
      <div key={item.title}>
        <div
          className="flex items-center px-4 py-3 my-1 rounded-md cursor-pointer hover:bg-amber-100 transition-colors duration-200"
          onClick={() => {
            if (hasSubmenu) {
              toggleSubmenu(item.title.toLowerCase());
            } else if (item.path) {
              navigateTo(item.path);
            }
          }}
        >
          <i className={`bi ${item.icon} text-lg mr-5`}></i>
          <span>{item.title}</span>
          {hasSubmenu && (
            <i
              className={`bi bi-chevron-down ml-auto text-gray-600 transition-transform duration-300 ${
                isSubmenuOpen ? "rotate-180" : ""
              }`}
            ></i>
          )}
        </div>

        {hasSubmenu && (
          <div
            className={`ml-10 mt-1 mb-2 flex flex-col space-y-1 overflow-hidden transition-all duration-300 ${
              isSubmenuOpen ? "max-h-52 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            {item.submenu?.map((subItem) => (
              <div
                key={subItem.title}
                className="flex items-center p-2 rounded hover:bg-amber-100 cursor-pointer transition-colors duration-200"
                onClick={() => navigateTo(subItem.path)}
              >
                <i className="bi bi-dot"></i>
                <span className="ml-2 text-gray-700 text-sm">
                  {subItem.title}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <button
        id="toggle-sidebar"
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 text-3xl z-50 hover:text-amber-700 transition-colors duration-200"
        aria-label="Menu"
      >
        <i className={`bi ${isOpen ? "bi-x" : "bi-filter-left"}`}></i>
      </button>

      <aside
        id="sidebar"
        className={`fixed top-0 left-0 w-64 h-screen shadow-md z-40 transition-transform duration-300 ease-in-out bg-bg-color ${
          !isOpen ? "-translate-x-full lg:translate-x-0" : "translate-x-0"
        }`}
      >
        <div className="font-semibold text-xl py-4 px-4 mx-4 my-4 text-center rounded-lg shadow-sm text-white bg-primary-color border border-primary-color">
          PetControl
        </div>

        <div className="mx-4 my-4 p-2 rounded-xl bg-amber-50 overflow-y-auto max-h-[calc(100vh-10rem)]">
          {menuItems.map(renderMenuItem)}
        </div>

        <div className="absolute bottom-0 left-0 w-full p-4 bg-white border-t border-gray-200 cursor-pointer">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full px-4 py-3 rounded-md bg-red-50 hover:bg-red-100 transition-colors duration-200"
          >
            <i className="bi bi-box-arrow-right text-red-500 text-lg mr-3"></i>
            <span className="text-red-600 font-medium">
              Logout
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
