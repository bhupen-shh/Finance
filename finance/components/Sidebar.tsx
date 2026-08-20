"use client";

import { useState } from "react";
import Link from "next/link";
import { useFinance } from "@/context/FinanceContext";
import { BarChart3, Plus, Folder, Pencil, Trash2 } from "lucide-react";

export default function Sidebar() {
  const { categories, addCategory, updateCategory, deleteCategory } = useFinance();
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

  const handleEditCategory = async (id: string, currentName: string) => {
    const nextName = prompt("Enter a new category name:", currentName)?.trim();
    if (!nextName || nextName === currentName) return;

    try {
      await updateCategory(id, nextName);
    } catch (error) {
      console.error("Error updating category:", error);
      alert("Failed to update category. Please try again.");
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Delete the category \"${name}\"? Categories used by expenses cannot be deleted.`)) {
      return;
    }

    try {
      await deleteCategory(id);
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category. It may still be used by an expense.");
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
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-medium"
            >
              <BarChart3 className="w-5 h-5" />
              Dashboard
            </Link>
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
              className="flex items-center justify-between gap-2 px-3 py-2 bg-gray-700 rounded-lg text-sm hover:bg-gray-600 transition"
            >
              <span className="truncate">{category.name}</span>
              <span className="flex shrink-0 gap-1">
                <button
                  onClick={() => handleEditCategory(category.id, category.name)}
                  className="p-1 text-gray-300 hover:text-white"
                  title={`Edit ${category.name}`}
                  aria-label={`Edit ${category.name}`}
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteCategory(category.id, category.name)}
                  className="p-1 text-red-300 hover:text-red-100"
                  title={`Delete ${category.name}`}
                  aria-label={`Delete ${category.name}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </span>
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
