export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-white dark:bg-bg-color-dark">
      {children}
    </div>
  );
}
