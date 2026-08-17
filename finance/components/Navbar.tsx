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
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg px-6 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Wallet className="w-8 h-8 text-white" />
          <div>
            <h1 className="text-3xl font-bold text-white">Finance Dashboard</h1>
            <p className="text-blue-100 text-sm mt-1">Track and manage your expenses</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-blue-100 text-sm">Total Expenses</p>
            <p className="text-white text-2xl font-bold">₹{totalExpenses.toFixed(2)}</p>
          </div>
          <div className="text-right text-blue-100 text-sm">
            <p>Welcome, {user?.email?.split('@')[0] || 'User'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-200"
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
