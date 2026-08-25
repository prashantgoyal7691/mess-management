import { create } from "zustand";
import { fetchMonthlyAttendance } from "../services/attendanceService";
import { fetchMonthlyBill } from "../services/billingService";

const emptyBill = {
    foodBill: 0,
    managementFee: 0,
    totalBill: 0,
    status: "",
};

export const useAttendanceStore = create((set, get) => ({
    attendance: [],
    bill: emptyBill,

    attendanceLoading: false,
    billingLoading: false,

    attendanceError: null,
    billingError: null,

    loadedMonths: {},

    fetchMonth: async ({
        userId,
        token,
        month,
        selectedYear,
        selectedMonth,
        serverToday,
    }) => {
        if (!userId || !token || !month) return;

        const cacheKey = `${userId}-${month}`;
        const cached = get().loadedMonths[cacheKey];

        if (cached) {
            set({
                attendance: cached.attendance,
                bill: cached.bill,
            });

            return;
        }

        set({
            attendanceLoading: true,
            billingLoading: true,
            attendanceError: null,
            billingError: null,
        });

        try {
            const [attendanceData, billingData] =
                await Promise.all([
                    fetchMonthlyAttendance({
                        userId,
                        month,
                        token,
                    }),

                    fetchMonthlyBill({
                        month,
                        token,
                    }),
                ]);

            const daysMap = {};

            attendanceData.forEach((item) => {
                const day = parseInt(
                    item.date.split("-")[2],
                    10,
                );

                if (!daysMap[day]) {
                    daysMap[day] = {
                        day,
                        breakfast: false,
                        lunch: false,
                        dinner: false,
                    };
                }

                daysMap[day][item.meal] =
                    item.status === "eat";
            });

            const daysInMonth = new Date(
                selectedYear,
                selectedMonth + 1,
                0,
            ).getDate();

            const isCurrentMonth =
                selectedMonth === serverToday.getMonth() &&
                selectedYear === serverToday.getFullYear();

            const fullMonth = [];

            for (let day = 1; day <= daysInMonth; day++) {
                const isFuture =
                    isCurrentMonth &&
                    day >= serverToday.getDate();

                fullMonth.push({
                    day,
                    isFuture,
                    breakfast:
                        !isFuture &&
                        (daysMap[day]?.breakfast || false),

                    lunch:
                        !isFuture &&
                        (daysMap[day]?.lunch || false),

                    dinner:
                        !isFuture &&
                        (daysMap[day]?.dinner || false),
                });
            }

            const summary =
                billingData?.month === month
                    ? billingData
                    : {
                        ...emptyBill,
                        status: "No Meals",
                    };

            set((state) => ({
                attendance: fullMonth,
                bill: summary,

                attendanceLoading: false,
                billingLoading: false,

                loadedMonths: {
                    ...state.loadedMonths,
                    [cacheKey]: {
                        attendance: fullMonth,
                        bill: summary,
                    },
                },
            }));
        } catch (err) {
            set({
                attendanceLoading: false,
                billingLoading: false,
                attendanceError: err.message,
                billingError: err.message,
            });
        }
    },

    clearAttendance: () =>
        set({
            attendance: [],
            bill: emptyBill,
            attendanceLoading: false,
            billingLoading: false,
            attendanceError: null,
            billingError: null,
            loadedMonths: {},
        }),
}));
