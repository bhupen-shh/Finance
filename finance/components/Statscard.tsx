"use client";

import { useFinance } from "@/context/FinanceContext";
import { Wallet, Calendar, BarChart3, TrendingUp } from "lucide-react";

export default function Statscard() {
  const { expenses, categories } = useFinance();

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalExpenseCount = expenses.length;
  const averageExpense = totalExpenseCount > 0 ? totalExpenses / totalExpenseCount : 0;
  
  const thisMonthExpenses = expenses.filter((exp) => {
    const expDate = new Date(exp.date);
    const today = new Date();
    return (
      expDate.getMonth() === today.getMonth() &&
      expDate.getFullYear() === today.getFullYear()
    );
  });
  const thisMonthTotal = thisMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const stats = [
    {
      label: "Total Expenses",
      value: `₹${totalExpenses.toFixed(2)}`,
      Icon: Wallet,
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      iconColor: "text-blue-600",
    },
    {
      label: "This Month",
      value: `₹${thisMonthTotal.toFixed(2)}`,
      Icon: Calendar,
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      iconColor: "text-green-600",
    },
    {
      label: "Total Transactions",
      value: totalExpenseCount.toString(),
      Icon: BarChart3,
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
      iconColor: "text-purple-600",
    },
    {
      label: "Average Expense",
      value: `₹${averageExpense.toFixed(2)}`,
      Icon: TrendingUp,
      bgColor: "bg-orange-50",
      textColor: "text-orange-700",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <>
      {stats.map((stat, index) => {
        const IconComponent = stat.Icon;
        return (
          <div key={index} className={`${stat.bgColor} shadow-lg rounded-lg p-6 border-l-4 border-blue-500`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                <p className={`text-3xl font-bold ${stat.textColor} mt-2`}>{stat.value}</p>
              </div>
              <IconComponent className={`w-12 h-12 ${stat.iconColor} opacity-30`} />
            </div>
          </div>
        );
      })}
    </>
  );
}
