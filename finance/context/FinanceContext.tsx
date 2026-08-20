"use client";

import {
  createContext,
  useContext,
  useEffect,
  useCallback,
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
  updateExpense: (expense: Expense) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  addCategory: (name: string) => Promise<void>;
  updateCategory: (id: string, name: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
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
  const initializeDefaultCategories = useCallback(async () => {
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
  }, [user]);

  const fetchCategories = useCallback(async () => {
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
  }, [initializeDefaultCategories, isAuthenticated, user]);

  // Fetch expenses from Supabase
  const fetchExpenses = useCallback(async () => {
    if (!isAuthenticated || !user) return;

    try {
      const { data, error } = await supabase
        .from("expenses")
        .select("id, title, amount, category_id, payment_method, date, type, notes")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedExpenses: Expense[] = data.map((exp) => ({
          id: exp.id,
          title: exp.title,
          amount: Number(exp.amount),
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
  }, [isAuthenticated, user]);

  // Load data when user authenticates
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      if (isAuthenticated && user) {
        await Promise.all([fetchCategories(), fetchExpenses()]);
        setLoading(false);
        return;
      }

      setExpenses([]);
      setCategories([]);
      setLoading(false);
    };

    void loadData();
  }, [fetchCategories, fetchExpenses, isAuthenticated, user]);

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

  async function updateExpense(expense: Expense) {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("expenses")
        .update({
          title: expense.title,
          amount: expense.amount,
          category_id: expense.category,
          payment_method: expense.paymentMethod,
          date: expense.date,
          type: expense.type,
          notes: expense.notes,
        })
        .eq("id", expense.id)
        .eq("user_id", user.id);

      if (error) throw error;
      await fetchExpenses();
    } catch (error) {
      console.error("Error updating expense:", error);
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

  async function updateCategory(id: string, name: string) {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("categories")
        .update({ name })
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;
      await fetchCategories();
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  }

  async function deleteCategory(id: string) {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;
      await fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  }

  return (
    <FinanceContext.Provider
      value={{
        expenses,
        categories,
        addExpense,
        updateExpense,
        deleteExpense,
        addCategory,
        updateCategory,
        deleteCategory,
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