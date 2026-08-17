"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  Category,
  Expense,
} from "@/types/finance";
import { useAuth } from "./AuthContext";
import { supabase } from "@/lib/supabase";
import { defaultCategories } from "@/data/defaultCategories";

interface FinanceContextType {
  expenses: Expense[];
  categories: Category[];
  addExpense: (expense: Expense) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  addCategory: (name: string) => Promise<void>;
  loading: boolean;
}

const FinanceContext =
  createContext<FinanceContextType | null>(null);

export function FinanceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories from Supabase
  const fetchCategories = async () => {
    if (!isAuthenticated || !user) return;

    try {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name")
        .eq("user_id", user.id);

      if (error) throw error;

      if (data && data.length > 0) {
        setCategories(data);
      } else {
        // If no categories exist, create default ones
        await initializeDefaultCategories();
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  // Initialize default categories for new users
  const initializeDefaultCategories = async () => {
    if (!user) return;

    try {
      const categoriesToInsert = defaultCategories.map((cat) => ({
        name: cat.name,
        user_id: user.id,
      }));

      const { data, error } = await supabase
        .from("categories")
        .insert(categoriesToInsert)
        .select();

      if (error) throw error;
      if (data) {
        setCategories(data);
      }
    } catch (error) {
      console.error("Error initializing default categories:", error);
    }
  };

  // Fetch expenses from Supabase
  const fetchExpenses = async () => {
    if (!isAuthenticated || !user) return;

    try {
      const { data, error } = await supabase
        .from("expenses")
        .select("id, title, amount, category_id, payment_method, date, type, notes")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedExpenses: Expense[] = data.map((exp: any) => ({
          id: exp.id,
          title: exp.title,
          amount: exp.amount,
          category: exp.category_id,
          paymentMethod: exp.payment_method,
          date: exp.date,
          type: exp.type,
          notes: exp.notes,
        }));
        setExpenses(formattedExpenses);
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
      setExpenses([]);
    }
  };

  // Load data when user authenticates
  useEffect(() => {
    setLoading(true);
    if (isAuthenticated && user) {
      Promise.all([fetchCategories(), fetchExpenses()]).finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
      setExpenses([]);
      setCategories([]);
    }
  }, [isAuthenticated, user]);

  async function addExpense(expense: Expense) {
    if (!user) return;

    try {
      const { error } = await supabase.from("expenses").insert([
        {
          id: expense.id,
          user_id: user.id,
          title: expense.title,
          amount: expense.amount,
          category_id: expense.category,
          payment_method: expense.paymentMethod,
          date: expense.date,
          type: expense.type,
          notes: expense.notes,
        },
      ]);

      if (error) throw error;
      await fetchExpenses();
    } catch (error) {
      console.error("Error adding expense:", error);
      throw error;
    }
  }

  async function deleteExpense(id: string) {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("expenses")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;
      await fetchExpenses();
    } catch (error) {
      console.error("Error deleting expense:", error);
      throw error;
    }
  }

  async function addCategory(name: string) {
    if (!user) return;

    try {
      const { error } = await supabase.from("categories").insert([
        {
          user_id: user.id,
          name,
        },
      ]);

      if (error) throw error;
      await fetchCategories();
    } catch (error) {
      console.error("Error adding category:", error);
      throw error;
    }
  }

  return (
    <FinanceContext.Provider
      value={{
        expenses,
        categories,
        addExpense,
        deleteExpense,
        addCategory,
        loading,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error(
      "FinanceProvider missing"
    );
  }
  return context;
}