import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import  Navbar from '@/components/akrion-toolbox/layout/NavBar';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Akrion',
  description: 'Outils de conformité pour logiciels médicaux',
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

        {/* Contenu principal avec padding conditionnel */}
        <main className="flex-1 px-4 bg-transparent [&:has([data-full-height])]:py-0 py-10">
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