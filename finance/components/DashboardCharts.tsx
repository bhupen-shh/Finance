"use client";

import { useFinance } from "@/context/FinanceContext";
import { TrendingUp } from "lucide-react";

export default function DashboardCharts() {
  const { expenses, categories } = useFinance();

  const getCategoryBreakdown = () => {
    const breakdown: { [key: string]: number } = {};
    expenses.forEach((exp) => {
      const categoryName = categories.find((cat) => cat.id === exp.category)?.name || "Unknown";
      breakdown[categoryName] = (breakdown[categoryName] || 0) + exp.amount;
    });
    return breakdown;
  };

  const getPaymentMethodBreakdown = () => {
    const breakdown: { [key: string]: number } = {};
    expenses.forEach((exp) => {
      breakdown[exp.paymentMethod] = (breakdown[exp.paymentMethod] || 0) + exp.amount;
    });
    return breakdown;
  };

  const categoryBreakdown = getCategoryBreakdown();
  const paymentBreakdown = getPaymentMethodBreakdown();
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const getBarWidth = (value: number) => {
    if (totalExpenses === 0) return 0;
    return (value / totalExpenses) * 100;
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-bold text-gray-800">Expense Breakdown</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Category Breakdown */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-4">By Category</h4>
          <div className="space-y-3">
            {Object.entries(categoryBreakdown).length === 0 ? (
              <p className="text-gray-500 text-sm">No expenses to display</p>
            ) : (
              Object.entries(categoryBreakdown).map(([category, amount]) => (
                <div key={category}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{category}</span>
                    <span className="text-sm font-semibold text-gray-900">₹{amount.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getBarWidth(amount)}%` }}
                    ></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Payment Method Breakdown */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-4">By Payment Method</h4>
          <div className="space-y-3">
            {Object.entries(paymentBreakdown).length === 0 ? (
              <p className="text-gray-500 text-sm">No expenses to display</p>
            ) : (
              Object.entries(paymentBreakdown).map(([method, amount]) => {
                const colors: { [key: string]: string } = {
                  Cash: "bg-green-600",
                  UPI: "bg-blue-600",
                  Card: "bg-purple-600",
                  Bank: "bg-yellow-600",
                };
                return (
                  <div key={method}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{method}</span>
                      <span className="text-sm font-semibold text-gray-900">₹{amount.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${colors[method] || "bg-gray-600"}`}
                        style={{ width: `${getBarWidth(amount)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-gray-600 text-sm">Total Expenses</p>
            <p className="text-2xl font-bold text-blue-600">₹{totalExpenses.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 text-sm">Total Transactions</p>
            <p className="text-2xl font-bold text-blue-600">{expenses.length}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 text-sm">Average Expense</p>
            <p className="text-2xl font-bold text-blue-600">
              ₹{expenses.length > 0 ? (totalExpenses / expenses.length).toFixed(2) : "0.00"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
