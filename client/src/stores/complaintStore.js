import { create } from "zustand";
import {
    getMyComplaints,
    createComplaint,
} from "../services/complaintService";

export const useComplaintStore = create((set) => ({
    complaints: [],
    loading: false,
    submitting: false,
    error: null,

    fetchMyComplaints: async (token) => {
        if (!token) {
            set({
                complaints: [],
                error: "Authentication required",
            });
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
            });
        } catch (err) {
            set({
                complaints: [],
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

    clearComplaints: () => {
        set({
            complaints: [],
            loading: false,
            submitting: false,
            error: null,
        });
    },
}));