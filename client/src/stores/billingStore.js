import { create } from "zustand";
import {
  setDailyExpense,
  fetchExpenseHistory,
} from "../services/billingService";

export const useBillingStore = create((set, get) => ({
  expenseHistory: [],
  expenseHistoryLoading: false,
  expenseHistoryLoaded: false,
  expenseHistoryError: null,

  settingExpense: false,
  setExpenseError: null,

  fetchExpenseHistory: async (token) => {
    if (!token) return;

    const {
      expenseHistoryLoaded,
      expenseHistoryLoading,
    } = get();

    if (expenseHistoryLoaded || expenseHistoryLoading) {
      return;
    }

    set({
      expenseHistoryLoading: true,
      expenseHistoryError: null,
    });

    try {
      const data = await fetchExpenseHistory(token);

      set({
        expenseHistory: data,
        expenseHistoryLoading: false,
        expenseHistoryLoaded: true,
      });
    } catch (err) {
      set({
        expenseHistoryLoading: false,
        expenseHistoryError: err.message,
      });
    }
  },

  setExpense: async (
    token,
    breakfastCost,
    lunchCost,
    dinnerCost,
  ) => {
    if (!token) {
      throw new Error("Authentication required");
    }

    set({
      settingExpense: true,
      setExpenseError: null,
    });

    try {
      const data = await setDailyExpense({
        token,
        breakfastCost,
        lunchCost,
        dinnerCost,
      });

      set({
        settingExpense: false,
      });

      return data;
    } catch (err) {
      set({
        settingExpense: false,
        setExpenseError: err.message,
      });

      throw err;
    }
  },

  clearBilling: () =>
    set({
      expenseHistory: [],
      expenseHistoryLoading: false,
      expenseHistoryLoaded: false,
      expenseHistoryError: null,
      settingExpense: false,
      setExpenseError: null,
    }),
}));