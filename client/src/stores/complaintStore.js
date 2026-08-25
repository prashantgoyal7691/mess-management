import { create } from "zustand";
import {
  getMyComplaints,
  createComplaint,
  getAdminComplaints,
  updateComplaint,
} from "../services/complaintService";

export const useComplaintStore = create((set, get) => ({
  complaints: [],
  loading: false,
  submitting: false,
  error: null,
  hasFetched: false,

  adminComplaints: [],
  adminComplaintsLoading: false,
  adminComplaintsUpdating: false,
  adminComplaintsError: null,
  adminComplaintsLoaded: false,

  fetchMyComplaints: async (token) => {
    if (!token) {
      set({
        complaints: [],
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

      const data = await getMyComplaints(token);

      set({
        complaints: data,
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

  submitComplaint: async (token, complaintData) => {
    if (!token) {
      throw new Error("Authentication required");
    }

    try {
      set({
        submitting: true,
        error: null,
      });

      const data = await createComplaint(token, complaintData);

      set((state) => ({
        complaints: [data.complaint, ...state.complaints],
        submitting: false,
      }));

      return data;
    } catch (err) {
      set({
        submitting: false,
        error: err.message,
      });

      throw err;
    }
  },


  fetchAdminComplaints: async (token) => {
    if (!token) return;

    const {
      adminComplaintsLoaded,
      adminComplaintsLoading,
    } = get();

    if (adminComplaintsLoaded || adminComplaintsLoading) {
      return;
    }

    set({
      adminComplaintsLoading: true,
      adminComplaintsError: null,
    });

    try {
      const data = await getAdminComplaints(token);

      set({
        adminComplaints: data,
        adminComplaintsLoading: false,
        adminComplaintsLoaded: true,
      });
    } catch (err) {
      set({
        adminComplaintsLoading: false,
        adminComplaintsError: err.message,
      });
    }
  },

  updateAdminComplaint: async (token, id, complaintData) => {
    if (!token) {
      throw new Error("Authentication required");
    }

    set({
      adminComplaintsUpdating: true,
      adminComplaintsError: null,
    });

    try {
      const data = await updateComplaint(
        token,
        id,
        complaintData,
      );

      set((state) => ({
        adminComplaints: state.adminComplaints.map((complaint) =>
          complaint._id === id
            ? data.complaint
            : complaint,
        ),
        adminComplaintsUpdating: false,
      }));

      return data;
    } catch (err) {
      set({
        adminComplaintsUpdating: false,
        adminComplaintsError: err.message,
      });

      throw err;
    }
  },

  clearComplaints: () => {
    set({
      complaints: [],
      loading: false,
      submitting: false,
      error: null,
      hasFetched: false,

      adminComplaints: [],
      adminComplaintsLoading: false,
      adminComplaintsUpdating: false,
      adminComplaintsError: null,
      adminComplaintsLoaded: false,
    });
  },
}));