"use client";

import React from "react";
import SidebarHeader from "./SidebarHeader";
import SidebarNavigation from "./SidebarNavigation";
import SidebarFooter from "./SidebarFooter";

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-gray-900 text-white flex flex-col">
      <SidebarHeader />
      <SidebarNavigation />
      <SidebarFooter />
    </aside>
  );
};

export default Sidebar;
