import { create } from "zustand";
import {
  createFeedback,
  getMyFeedbacks,
} from "../services/feedbackService";

export const useFeedbackStore = create((set) => ({
  feedbacks: [],
  loading: false,
  submitting: false,
  error: null,

  fetchMyFeedbacks: async (token) => {
    if (!token) {
      set({
        feedbacks: [],
        error: "Authentication required",
      });
      return;
    }

    try {
      set({
        loading: true,
        error: null,
      });

      const data = await getMyFeedbacks(token);

      set({
        feedbacks: data,
        loading: false,
      });
    } catch (err) {
      set({
        feedbacks: [],
        loading: false,
        error: err.message,
      });
    }
  },

  submitFeedback: async (token, feedbackData) => {
    if (!token) {
      throw new Error("Authentication required");
    }

    try {
      set({
        submitting: true,
        error: null,
      });

      const data = await createFeedback(token, feedbackData);

      set((state) => {
        const updatedFeedback = data.feedback;

        const existingIndex = state.feedbacks.findIndex(
          (item) => item._id === updatedFeedback._id,
        );

        if (existingIndex !== -1) {
          const updated = [...state.feedbacks];
          updated[existingIndex] = updatedFeedback;

          return {
            feedbacks: updated,
            submitting: false,
          };
        }

        return {
          feedbacks: [updatedFeedback, ...state.feedbacks],
          submitting: false,
        };
      });

      return data;
    } catch (err) {
      set({
        submitting: false,
        error: err.message,
      });

      throw err;
    }
  },

  clearFeedbacks: () => {
    set({
      feedbacks: [],
      loading: false,
      submitting: false,
      error: null,
    });
  },
}));