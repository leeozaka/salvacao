import { Suspense } from "react";
import CompromissosCliente from "@/components/dashboard/CompromissosCliente";
import CompromissosLoading from "@/components/dashboard/CompromissosLoading";
import { getCompromissos } from "@/services/compromissos-server";

export default async function DashboardPage() {
  const compromissos = await getCompromissos();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-2xl font-bold text-amber-600 flex items-center">
            <i className="bi bi-calendar2-check text-amber-500 mr-3 text-2xl"></i>
            Compromissos
            <span className="ml-2 bg-amber-100 text-amber-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
              {compromissos.length}
            </span>
          </h1>

          <div className="flex flex-wrap gap-3 items-center">{/* ... */}</div>
        </div>

        <Suspense fallback={<CompromissosLoading />}>
          <CompromissosCliente compromissosIniciais={compromissos} />
        </Suspense>
      </div>
    </div>
  );
}
