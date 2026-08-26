import { create } from "zustand";
import {
  createProfileUpdateRequest,
} from "../services/profileUpdateService.js";

export const useProfileUpdateStore = create((set) => ({
  loading: false,
  error: null,
  requestStatus: null,

  createRequest: async (token, updateData) => {
    set({
      loading: true,
      error: null,
    });

    try {
      const data = await createProfileUpdateRequest(
        token,
        updateData,
      );

      set({
        loading: false,
        requestStatus: "pending",
      });

      return data;
    } catch (err) {
      set({
        loading: false,
        error: err.message,
      });

      throw err;
    }
  },

  clearRequestState: () =>
    set({
      loading: false,
      error: null,
      requestStatus: null,
    }),
}));