import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css"; // Certifique-se que o caminho para globals.css está correto
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CLINICA JHC - Odontologia",
  description: "Agende sua consulta odontológica na CLINICA JHC.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <Header />
        <main className="flex-grow pt-16"> {/* pt-16 para compensar altura do header fixo */}
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
