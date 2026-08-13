import { create } from "zustand";
import { getSystemDate } from "../services/systemService";

export const useSystemStore = create((set) => ({
  today: null,
  lockDate: null,
  loading: false,

  fetchSystemDate: async () => {
    set({ loading: true });

    try {
      const data = await getSystemDate();

      set({
        today: data.today,
        lockDate: data.lockDate,
        loading: false,
      });
    } catch (err) {
      console.log(err);

      set({
        loading: false,
      });
    }
  },
}));