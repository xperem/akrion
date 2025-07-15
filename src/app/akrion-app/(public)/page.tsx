'use client';

import Link from 'next/link';

export default function AkrionAppHome() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 text-center space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-indigo-700 mb-2">Akrion App</h1>
          <p className="text-gray-600">
            Le copilote pour votre parcours de certification dispositif&nbsp;médical logiciel.
          </p>
        </div>

        <div className="text-6xl">🚀</div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/akrion-app/register"
            className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
          >
            Créer un compte
          </Link>

          <Link
            href="/akrion-app/login"
            className="flex-1 border border-indigo-600 text-indigo-600 py-3 rounded-lg font-medium hover:bg-indigo-50 transition"
          >
            Se connecter
          </Link>
        </div>

        <p className="text-xs text-gray-400">🚧 Version bêta – plus de fonctionnalités à venir</p>
      </div>
    </main>
  );
}
