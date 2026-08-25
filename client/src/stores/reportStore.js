import { create } from "zustand";
import { fetchTodayReport, fetchReportServerDate, fetchStudentHistory, downloadStudentHistoryPDF } from "../services/reportService";

export const useReportStore = create((set, get) => ({
    report: [],
    reportLoading: false,
    reportError: null,
    reportLoaded: false,
    history: [],
    historyLoading: false,
    historyLoadingKey: null,
    historyError: null,
    historyCache: {},
    historyStudent: null,

    fetchReport: async (token) => {
        if (!token) {
            set({
                reportError: "Authentication required",
            });
            return;
        }

        const { reportLoaded, reportLoading } = get();

        if (reportLoaded || reportLoading) {
            return;
        }

        set({
            reportLoading: true,
            reportError: null,
        });

        try {
            const data = await fetchTodayReport(token);

            set({
                report: data,
                reportLoading: false,
                reportLoaded: true,
            });
        } catch (err) {
            set({
                reportLoading: false,
                reportError: err.message,
            });
        }
    },

    fetchHistory: async (token, studentId, month) => {
        if (!token || !studentId || !month) {
            return;
        }

        const key = `${studentId}-${month}`;

        const {
            historyCache,
            historyLoadingKey,
        } = get();

        if (historyCache[key]) {
            set({
                history: historyCache[key].meals,
                historyStudent: historyCache[key].student,
                historyLoading: false,
                historyError: null,
            });

            return;
        }

        if (historyLoadingKey === key) {
            return;
        }

        set({
            history: [],
            historyLoading: true,
            historyLoadingKey: key,
            historyError: null,
        });

        try {
            const data = await fetchStudentHistory(
                token,
                studentId,
                month,
            );

            const student = data.student;
            const meals = data.meals || [];

            set((state) => ({
                history: meals,
                historyStudent: student,
                historyLoading: false,
                historyLoadingKey: null,
                historyCache: {
                    ...state.historyCache,
                    [key]: {
                        meals,
                        student,
                    },
                },
            }));
        } catch (err) {
            set({
                history: [],
                historyLoading: false,
                historyLoadingKey: null,
                historyError: err.message,
            });
        }
    },

    reportServerDate: null,
    reportServerDateLoading: false,

    fetchReportServerDate: async () => {
        const {
            reportServerDate,
            reportServerDateLoading,
        } = get();

        if (reportServerDate || reportServerDateLoading) {
            return reportServerDate;
        }

        set({
            reportServerDateLoading: true,
        });

        try {
            const data = await fetchReportServerDate();

            set({
                reportServerDate: data.today,
                reportServerDateLoading: false,
            });

            return data.today;
        } catch (err) {
            set({
                reportServerDateLoading: false,
                historyError: err.message,
            });

            return null;
        }
    },

    downloadHistoryPDF: async (token, studentId, month) => {
        try {
            const blob = await downloadStudentHistoryPDF(
                token,
                studentId,
                month,
            );

            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `report-${month}.pdf`;
            a.click();

            window.URL.revokeObjectURL(url);
        } catch (err) {
            set({
                historyError: err.message,
            });
        }
    },

    clearReport: () => {
        set({
            report: [],
            reportLoading: false,
            reportError: null,
            reportLoaded: false,

            history: [],
            historyLoading: false,
            historyLoadingKey: null,
            historyError: null,
            historyCache: {},
            historyStudent: null,

            reportServerDate: null,
            reportServerDateLoading: false,
        });
    },
}));