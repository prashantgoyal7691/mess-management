import { create } from "zustand";
import { getMealCount } from "../services/admin_meal_student_service";

export const useMealStore = create((set, get) => ({
  data: {
    today: {
      breakfast: 0,
      lunch: 0,
      dinner: 0,
    },
    tomorrow: {
      breakfast: 0,
      lunch: 0,
      dinner: 0,
    },
  },

  loading: false,
  error: null,
  hasFetched: false,

  fetchMealCount: async (token) => {
    if (!token) {
      set({
        error: "Authentication required",
      });
      return;
    }

    const { hasFetched, loading } = get();

    if (hasFetched || loading) {
      return;
    }

    try {
      set({
        loading: true,
        error: null,
      });

      const data = await getMealCount(token);

      set({
        data,
        loading: false,
        hasFetched: true,
      });
    } catch (err) {
      set({
        loading: false,
        error: err.message,
      });
    }
  },

  clearMealData: () => {
    set({
      data: {
        today: {
          breakfast: 0,
          lunch: 0,
          dinner: 0,
        },
        tomorrow: {
          breakfast: 0,
          lunch: 0,
          dinner: 0,
        },
      },
      loading: false,
      error: null,
      hasFetched: false,
    });
  },
}));