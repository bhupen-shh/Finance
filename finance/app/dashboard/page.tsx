"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");

    if (loggedIn !== "true") {
      router.replace("/login");
    }
  }, [router]);

  function logout() {
    localStorage.removeItem("loggedIn");
    router.push("/login");
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <header className="flex items-center justify-between border-b border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Finance Dashboard
        </h1>

        <button
          onClick={logout}
          className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 transition-colors shadow-sm"
        >
          Logout
        </button>
      </header>

      <section className="grid gap-6 p-8 md:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-medium text-gray-600">
            Total Expenses
          </h2>

          <p className="mt-3 text-3xl font-bold text-gray-900">
            ₹0
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-medium text-gray-600">
            This Month
          </h2>

          <p className="mt-3 text-3xl font-bold text-gray-900">
            ₹0
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-medium text-gray-600">
            Categories
          </h2>

          <p className="mt-3 text-3xl font-bold text-gray-900">
            9
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-medium text-gray-600">
            Upcoming
          </h2>

          <p className="mt-3 text-3xl font-bold text-gray-900">
            0
          </p>
        </div>
      </section>
    </main>
  );
}