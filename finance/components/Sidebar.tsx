"use client";

import { useState } from "react";
import { useFinance } from "@/context/FinanceContext";
import { BarChart3, Plus, Folder } from "lucide-react";

export default function Sidebar() {
  const { categories, addCategory } = useFinance();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddCategory = async () => {
    const categoryName = prompt("Enter category name:");
    if (categoryName && categoryName.trim()) {
      setIsAdding(true);
      try {
        await addCategory(categoryName.trim());
      } catch (error) {
        console.error("Error adding category:", error);
        alert("Failed to add category. Please try again.");
      } finally {
        setIsAdding(false);
      }
    }
  };

  return (
    <aside className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 shadow-lg text-white p-6 h-screen overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Menu</h2>
        <p className="text-gray-400 text-sm">Navigate your finances</p>
      </div>

      <nav className="mb-8">
        <ul className="space-y-3">
          <li>
            <a
              href="/"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-medium"
            >
              <BarChart3 className="w-5 h-5" />
              Dashboard
            </a>
          </li>
        </ul>
      </nav>

      <hr className="my-6 border-gray-700" />

      <div>
        <div className="flex items-center gap-2 mb-4">
          <Folder className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Categories</h3>
        </div>
        <ul className="space-y-2 mb-4">
          {categories.map((category) => (
            <li
              key={category.id}
              className="px-3 py-2 bg-gray-700 rounded-lg text-sm hover:bg-gray-600 transition cursor-default"
            >
              {category.name}
            </li>
          ))}
        </ul>
        <button
          onClick={handleAddCategory}
          disabled={isAdding}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-500 text-white rounded-lg font-medium transition text-sm"
        >
          <Plus className="w-4 h-4" />
          {isAdding ? "Adding..." : "Add Category"}
        </button>
      </div>
    </aside>
  );
}
