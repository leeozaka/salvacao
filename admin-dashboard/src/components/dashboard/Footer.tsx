"use client";

import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white p-4 shadow-inner mt-auto">
      <div className="text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} PetControl - Todos os direitos
        reservados
      </div>
    </footer>
  );
};

export default Footer;
