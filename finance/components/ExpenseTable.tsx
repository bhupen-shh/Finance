"use client";

import { useState } from "react";
import { useFinance } from "@/context/FinanceContext";
import { BarChart3, Trash2 } from "lucide-react";

export default function ExpenseTable() {
  const { expenses, categories, deleteExpense } = useFinance();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const getCategoryName = (categoryId: string) => {
    return categories.find((cat) => cat.id === categoryId)?.name || "Unknown";
  };

  const getPaymentMethodColor = (method: string) => {
    const colors: { [key: string]: string } = {
      Cash: "bg-green-100 text-green-800",
      UPI: "bg-blue-100 text-blue-800",
      Card: "bg-purple-100 text-purple-800",
      Bank: "bg-yellow-100 text-yellow-800",
    };
    return colors[method] || "bg-gray-100 text-gray-800";
  };

  const handleDelete = async (expenseId: string) => {
    if (!confirm("Are you sure you want to delete this expense?")) {
      return;
    }

    setDeletingId(expenseId);
    setError("");
    try {
      await deleteExpense(expenseId);
    } catch (err) {
      setError("Failed to delete expense");
      console.error("Error deleting expense:", err);
    } finally {
      setDeletingId(null);
    }
  };

  if (expenses.length === 0) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-800">Recent Expenses</h3>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No expenses yet. Add your first expense!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-bold text-gray-800">Recent Expenses</h3>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Title</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Amount</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Payment</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense, index) => (
              <tr key={expense.id} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                <td className="py-3 px-4 text-gray-800">{expense.title}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {getCategoryName(expense.category)}
                  </span>
                </td>
                <td className="py-3 px-4 text-right font-semibold text-gray-800">
                  ₹{expense.amount.toFixed(2)}
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentMethodColor(expense.paymentMethod)}`}>
                    {expense.paymentMethod}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-600">
                  {new Date(expense.date).toLocaleDateString()}
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => handleDelete(expense.id)}
                    disabled={deletingId === expense.id}
                    className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 hover:bg-red-50 disabled:opacity-50 px-2 py-1 rounded transition"
                    title="Delete expense"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="text-xs font-medium">
                      {deletingId === expense.id ? "Deleting..." : "Delete"}
                    </span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-right border-t pt-4">
        <p className="text-gray-700 font-semibold">
          Total: ₹{expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
        </p>
      </div>
    </div>
  );
}
