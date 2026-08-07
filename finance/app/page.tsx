"use client";

import { useFinance } from "@/context/FinanceContext";

export default function DashboardPage() {
  const { expenses, categories } = useFinance();

  const totalSpent = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  return (
    <>
      <h1 className="mb-8 text-3xl font-bold">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border bg-white p-6">
          <p className="text-zinc-500">Total Spent</p>
          <h2 className="mt-3 text-3xl font-bold">
            ₹{totalSpent}
          </h2>
        </div>

        <div className="rounded-2xl border bg-white p-6">
          <p className="text-zinc-500">Categories</p>
          <h2 className="mt-3 text-3xl font-bold">
            {categories.length}
          </h2>
        </div>
      </div>
    </>
  );
}