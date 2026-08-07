"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ReceiptIndianRupee,
  FolderOpen,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

const menu = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Expenses",
    href: "/dashboard/expenses",
    icon: ReceiptIndianRupee,
  },
  {
    name: "Categories",
    href: "/dashboard/categories",
    icon: FolderOpen,
  },
  {
    name: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  function logout() {
    localStorage.removeItem("loggedIn");
    router.push("/login");
  }

  return (
    <aside className="w-64 h-screen bg-black text-white flex flex-col">

      <div className="border-b border-zinc-800 p-6">

        <h1 className="text-2xl font-bold">
          Finance Tracker
        </h1>

      </div>

      <nav className="flex-1 p-4">

        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 mb-2 transition

              ${
                pathname === item.href
                  ? "bg-white text-black"
                  : "hover:bg-zinc-900"
              }`}
            >
              <Icon size={20} />

              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4">

        <button
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-black font-semibold hover:bg-zinc-200"
        >
          <LogOut size={18} />

          Logout
        </button>

      </div>

    </aside>
  );
}