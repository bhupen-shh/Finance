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
  }, []);

  function logout() {
    localStorage.removeItem("loggedIn");
    router.push("/login");
  }

  return (
    <main className="min-h-screen bg-white">

      <header className="flex items-center justify-between border-b p-6">

        <h1 className="text-3xl font-bold">
          Finance Dashboard
        </h1>

        <button
          onClick={logout}
          className="rounded bg-black px-5 py-2 text-white"
        >
          Logout
        </button>

      </header>

      <section className="grid gap-6 p-8 md:grid-cols-4">

        <div className="rounded-xl border p-6">
          <h2 className="text-sm text-gray-500">
            Total Expenses
          </h2>

          <p className="mt-3 text-3xl font-bold">
            ₹0
          </p>
        </div>

        <div className="rounded-xl border p-6">
          <h2 className="text-sm text-gray-500">
            This Month
          </h2>

          <p className="mt-3 text-3xl font-bold">
            ₹0
          </p>
        </div>

        <div className="rounded-xl border p-6">
          <h2 className="text-sm text-gray-500">
            Categories
          </h2>

          <p className="mt-3 text-3xl font-bold">
            9
          </p>
        </div>

        <div className="rounded-xl border p-6">
          <h2 className="text-sm text-gray-500">
            Upcoming
          </h2>

          <p className="mt-3 text-3xl font-bold">
            0
          </p>
        </div>

      </section>

    </main>
  );
}