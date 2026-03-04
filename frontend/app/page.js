"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 space-y-10 bg-gray-900 text-gray-100">
      {/* Header */}
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-extrabold text-indigo-400 mb-4 drop-shadow-lg">
          Welcome to Rased Platform
        </h1>
        <p className="text-gray-300 text-lg sm:text-xl mb-8">
          An easy and fast platform for reporting power station issues, tracking reports, and viewing reports clearly.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-12">
        <Link 
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-lg shadow-lg transform transition-transform hover:-translate-y-1 hover:scale-105 duration-300"
          href="/auth/login"
        >
          Create New Report
        </Link>
        <Link
          className="border border-indigo-500 text-indigo-400 px-8 py-4 rounded-lg shadow hover:bg-indigo-800 hover:text-white transform transition-transform hover:-translate-y-1 hover:scale-105 duration-300"
           href="/auth/login"
        >
          View My Reports
        </Link>
      </div>

      {/* Footer note */}
      <p className="mt-8 text-gray-400 text-sm text-center max-w-md">
        All reports are recorded and tracked securely and transparently.
      </p>
    </div>
  );
}