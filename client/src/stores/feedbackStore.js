import { create } from "zustand";
import {
  createFeedback,
  getMyFeedbacks,
  getAdminFeedbacks
} from "../services/feedbackService";

export const useFeedbackStore = create((set, get) => ({
  feedbacks: [],
  loading: false,
  submitting: false,
  error: null,
  hasFetched: false,

  adminFeedbacks: [],
  adminFeedbacksLoading: false,
  adminFeedbacksError: null,
  adminFeedbacksLoaded: false,

  fetchMyFeedbacks: async (token) => {
    if (!token) {
      set({
        feedbacks: [],
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

      const data = await getMyFeedbacks(token);

      set({
        feedbacks: data,
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
          const updatedFeedbacks = [...state.feedbacks];

          updatedFeedbacks[existingIndex] = updatedFeedback;

          return {
            feedbacks: updatedFeedbacks,
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

  fetchAdminFeedbacks: async (token) => {
    if (!token) {
      set({
        adminFeedbacks: [],
        adminFeedbacksError: "Authentication required",
      });
      return;
    }

    const {
      adminFeedbacksLoaded,
      adminFeedbacksLoading,
    } = get();

    if (adminFeedbacksLoaded || adminFeedbacksLoading) {
      return;
    }

    try {
      set({
        adminFeedbacksLoading: true,
        adminFeedbacksError: null,
      });

      const data = await getAdminFeedbacks(token);

      set({
        adminFeedbacks: data,
        adminFeedbacksLoading: false,
        adminFeedbacksLoaded: true,
      });
    } catch (err) {
      set({
        adminFeedbacksLoading: false,
        adminFeedbacksError: err.message,
      });
    }
  },

  clearFeedbacks: () => {
    set({
      feedbacks: [],
      loading: false,
      submitting: false,
      error: null,
      hasFetched: false,

      adminFeedbacks: [],
      adminFeedbacksLoading: false,
      adminFeedbacksError: null,
      adminFeedbacksLoaded: false,
    });
  },
}));