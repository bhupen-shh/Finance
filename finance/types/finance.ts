export type ExpenseType = "one-time" | "recurring";
export type PaymentMethod =

  | "Cash"

  | "UPI"

  | "Card"

  | "Bank";

export interface Category {

  id: string;

  name: string;

}

export interface Expense {

  id: string;

  title: string;

  amount: number;

  category: string;

  paymentMethod: PaymentMethod;

  notes?: string;

  date: string;

  type: ExpenseType;

  nextDueDate?: string;

  reminderDays?: number;
}