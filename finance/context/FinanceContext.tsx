"use client";

import {

  createContext,

  useContext,

} from "react";

import {

  Category,

  Expense,

} from "@/types/finance";

import { useLocalStorage } from "@/hooks/useLocalStorage";

import { defaultCategories } from "@/data/defaultCategories";

interface FinanceContextType {

  expenses: Expense[];

  categories: Category[];

  addExpense: (expense: Expense) => void;

  deleteExpense: (id: string) => void;

  addCategory: (name: string) => void;

}

const FinanceContext =

  createContext<FinanceContextType | null>(null);

export function FinanceProvider({

  children,

}: {

  children: React.ReactNode;

}) {

  const [expenses, setExpenses] =

    useLocalStorage<Expense[]>("expenses", []);
     const [categories, setCategories] =

    useLocalStorage<Category[]>(

      "categories",

      defaultCategories

    );

  function addExpense(expense: Expense) {

    setExpenses((prev) => [...prev, expense]);

  }

  function deleteExpense(id: string) {

    setExpenses((prev) =>

      prev.filter((item) => item.id !== id)

    );

  }

  function addCategory(name: string) {

    setCategories((prev) => [

      ...prev,

      {

        id: crypto.randomUUID(),

        name,

      },

    ]);

  }

  return (

    <FinanceContext.Provider

      value={{

        expenses,

        categories,

        addExpense,

        deleteExpense,

        addCategory,

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