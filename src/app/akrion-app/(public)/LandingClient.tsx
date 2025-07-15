'use client';

import Link from 'next/link';

export default function LandingClient() {
  return (
    <main className="flex min-h-screen items-start justify-center bg-gradient-to-br from-indigo-50 to-blue-100 px-4 pt-[12vh]">
      <div className="relative z-10 w-full max-w-lg space-y-8 rounded-2xl bg-white/80 p-10 shadow-xl backdrop-blur-lg">
        <header className="space-y-2 text-center">
          <h1 className="text-4xl font-extrabold text-indigo-700">Akrion App</h1>
          <p className="text-gray-600">
            Le copilote pour votre parcours de certification
            dispositif&nbsp;médical logiciel.
          </p>
        </header>

        <div className="flex justify-center text-6xl">🚀</div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            href="/akrion-app/register"
            className="flex-1 rounded-lg bg-indigo-600 py-3 text-center font-medium text-white ring-indigo-500 ring-offset-2 transition hover:bg-indigo-700 focus:outline-none focus:ring-2"
          >
            Créer un compte
          </Link>
          <Link
            href="/akrion-app/login"
            className="flex-1 rounded-lg border border-indigo-600 py-3 text-center font-medium text-indigo-600 ring-indigo-500 ring-offset-2 transition hover:bg-indigo-50 focus:outline-none focus:ring-2"
          >
            Se connecter
          </Link>
        </div>

        <p className="text-center text-sm text-gray-400">
          🚧 Version bêta – plus de fonctionnalités à venir
        </p>
      </div>
    </main>
  );
}
