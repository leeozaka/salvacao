"use client";

import AdotanteForm from "@/components/adotante/AdotanteForm";
import React, { use } from "react";

interface EditarPaginaAdotanteProps {
  params: Promise<{
    id: string;
  }>;
}

const EditarPaginaAdotante: React.FC<EditarPaginaAdotanteProps> = (props) => {
  const resolvedParams = use(props.params);
  return (
    <div className="container mx-auto p-4">
      <AdotanteForm adotanteId={resolvedParams.id} />
    </div>
  );
};

export default EditarPaginaAdotante; 