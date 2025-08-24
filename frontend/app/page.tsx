"use client";

import Dashboard from "../components/Dashboard";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-blue-600 bg-clip-text text-transparent">
                Customer Analytics Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Real-time data visualization and analytics platform
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-500">Live Data</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <Dashboard />
      </main>
    </div>
  );
}
