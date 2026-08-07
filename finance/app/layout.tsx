import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { FinanceProvider } from "@/context/FinanceContext";

export const metadata: Metadata = {
  title: "Finance Tracker",
  description: "Personal finance tracking dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-50 text-zinc-900 antialiased">
        <FinanceProvider>
          <div className="flex min-h-screen">
            <Sidebar />

            <div className="flex-1 flex flex-col bg-zinc-50">
              <Navbar />

              <main className="flex-1 p-8">
                {children}
              </main>
            </div>
          </div>
        </FinanceProvider>
      </body>
    </html>
  );
}