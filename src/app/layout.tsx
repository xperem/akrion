import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import  Navbar from '@/components/layout/NavBar';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Akrion • Toolbox DM',
  description: 'Outils de qualification et de conformité pour logiciels médicaux',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-900 antialiased">
        {/* Navbar shadcn */}
        <Navbar />

        {/* Contenu principal */}
        <main className="flex-1 max-w-6xl mx-auto px-4 py-10">
          {children}
        </main>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-500 py-6">
          © {new Date().getFullYear()} Akrion – Tous droits réservés
        </footer>
      </body>
    </html>
  );
}
