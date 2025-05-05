import "./globals.css";

export const metadata = {
  title: "PetControl",
  description: "Sistema de gerenciamento para ONGs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Bootstrap Icons CSS */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
