// Este componente não precisa ser client-side, pois é apenas para mostrar o estado de loading

export default function CompromissosLoading() {
  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-8 text-center">
      <div className="flex flex-col items-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-amber-500 border-t-transparent mb-4"></div>
        <p className="text-amber-700 dark:text-amber-500">Carregando compromissos...</p>
      </div>
    </div>
  );
}
