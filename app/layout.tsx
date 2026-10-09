import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Libros Leídos",
  description: "Aplicación personal para registrar libros, organizar una colección y distinguir rápidamente entre lecturas pendientes y completadas.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
