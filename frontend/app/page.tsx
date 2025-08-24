"use client";

import Dashboard from "../components/Dashboard";

export default function Home() {
  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-[#070707]">
      <header className="max-w-6xl mx-auto mb-6">
        <h1 className="text-2xl font-semibold">Higo — Mock Dashboard</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Frontend using mock data shaped like the provided CSV.
        </p>
      </header>

      <main className="max-w-6xl mx-auto">
        <Dashboard />
      </main>
    </div>
  );
}
