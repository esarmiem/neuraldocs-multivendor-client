import type { Metadata } from "next";
import { AuthProvider } from "@/components/AuthProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "DELIA - Asistente experto en EDSL",
  description: "DELIA (Deliver + IA): Asistente experto en EDSL (Experian Domain Specific Language)",
  icons: {
    icon: '/experianlogo.webp',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
