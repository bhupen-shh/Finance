"use client";

import { useFinance } from "@/context/FinanceContext";
import { useAuth } from "@/context/AuthContext";
import { Wallet, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { expenses } = useFinance();
  const { logout, user } = useAuth();
  const router = useRouter();
  
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 px-4 py-4 shadow-lg sm:px-5 xl:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-2">
          <Wallet className="h-8 w-8 shrink-0 text-white" />
          <div>
            <h1 className="text-2xl font-bold text-white min-[1200px]:text-3xl">Finance Dashboard</h1>
            <p className="mt-1 text-sm text-blue-100">Track and manage your expenses</p>
          </div>
        </div>
        <div className="flex w-full flex-wrap items-center justify-between gap-3 sm:w-auto sm:gap-5 min-[1200px]:gap-6">
          <div className="text-left sm:text-right">
            <p className="text-sm text-blue-100">Total Expenses</p>
            <p className="text-2xl font-bold text-white">₹{totalExpenses.toFixed(2)}</p>
          </div>
          <div className="text-right text-sm text-blue-100">
            <p>Welcome, {user?.email?.split('@')[0] || 'User'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-white transition duration-200 hover:bg-red-700 sm:px-4"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
