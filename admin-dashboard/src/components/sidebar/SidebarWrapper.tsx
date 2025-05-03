"use client";
import { useState } from "react";
import Sidebar from "./Sidebar";

export default function SidebarWrapper() {
  const [isOpen, setIsOpen] = useState(false);

  return <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />;
}
