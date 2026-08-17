"use client";

import { useState } from "react";
import { useFinance } from "@/context/FinanceContext";
import { Plus, X } from "lucide-react";

export default function CategoryModal() {
  const { categories, addCategory } = useFinance();
  const [isOpen, setIsOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (categoryName.trim()) {
      addCategory(categoryName.trim());
      setCategoryName("");
      setIsOpen(false);
      alert("Category added successfully!");
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white shadow-lg rounded-lg p-8 w-96">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Add New Category</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleAddCategory}>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Category name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
            autoFocus
          />
          
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 bg-gray-300 text-gray-800 font-medium py-2 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </form>

        <div className="mt-6 pt-6 border-t">
          <h3 className="font-semibold text-gray-700 mb-3">Existing Categories</h3>
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li key={cat.id} className="px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-800">
                {cat.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
