"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { FinanceProvider } from "@/context/FinanceContext";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseTable from "@/components/ExpenseTable";
import DashboardCharts from "@/components/DashboardCharts";
import Statscard from "@/components/Statscard";

// Skip prerendering for this page since it requires authentication
export const dynamic = "force-dynamic";

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <FinanceProvider>
      <div className="flex h-screen min-w-0 overflow-x-hidden bg-gray-100">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Navbar />
          <main className="min-w-0 flex-1 overflow-auto p-4 sm:p-5 min-[1200px]:p-6">
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 min-[1200px]:grid-cols-3 min-[1200px]:gap-6">
              <Statscard />
            </div>
            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 min-[1200px]:grid-cols-3 min-[1200px]:gap-6">
              <div className="min-w-0 min-[1200px]:col-span-2">
                <DashboardCharts />
              </div>
              <div className="min-w-0">
                <ExpenseForm />
              </div>
            </div>
            <div>
              <ExpenseTable />
            </div>
          </main>
        </div>
      </div>
    </FinanceProvider>
  );
}
