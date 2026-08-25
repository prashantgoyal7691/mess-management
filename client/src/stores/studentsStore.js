import { create } from "zustand";
import {
    fetchStudents,
    approveStudent,
    rejectStudent,
    deleteStudent,
} from "../services/studentsService";

export const useStudentsStore = create((set, get) => ({
    students: [],
    studentsLoading: false,
    mutationLoading: false,
    error: null,
    studentsLoaded: false,

    fetchStudents: async (token) => {
        if (!token) return;

        const { studentsLoaded, studentsLoading } = get();

        if (studentsLoaded || studentsLoading) {
            return;
        }

        set({
            studentsLoading: true,
            error: null,
        });

        try {
            const data = await fetchStudents(token);

            set({
                students: data,
                studentsLoading: false,
                studentsLoaded: true,
            });
        } catch (err) {
            set({
                studentsLoading: false,
                error: err.message,
            });
        }
    },

    approveStudent: async (token, studentId) => {
        set({
            mutationLoading: true,
            error: null,
        });

        try {
            const data = await approveStudent(token, studentId);

            set((state) => ({
                students: state.students.map((student) =>
                    student._id === studentId
                        ? {
                            ...student,
                            isApproved: true,
                        }
                        : student,
                ),
                mutationLoading: false,
            }));

            return data;
        } catch (err) {
            set({
                mutationLoading: false,
                error: err.message,
            });

            throw err;
        }
    },

    rejectStudent: async (token, studentId) => {
        set({
            mutationLoading: true,
            error: null,
        });

        try {
            const data = await rejectStudent(token, studentId);

            set((state) => ({
                students: state.students.filter(
                    (student) => student._id !== studentId,
                ),
                mutationLoading: false,
            }));

            return data;
        } catch (err) {
            set({
                mutationLoading: false,
                error: err.message,
            });

            throw err;
        }
    },

    deleteStudent: async (token, studentId) => {
        set({
            mutationLoading: true,
            error: null,
        });

        try {
            const data = await deleteStudent(token, studentId);

            set((state) => ({
                students: state.students.filter(
                    (student) => student._id !== studentId,
                ),
                mutationLoading: false,
            }));

            return data;
        } catch (err) {
            set({
                mutationLoading: false,
                error: err.message,
            });

            throw err;
        }
    },

    clearStudents: () =>
        set({
            students: [],
            studentsLoading: false,
            mutationLoading: false,
            error: null,
            studentsLoaded: false,
        }),
}));