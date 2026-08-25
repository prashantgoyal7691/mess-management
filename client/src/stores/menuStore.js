import { create } from "zustand";
import {
    fetchWeeklyMenu,
    fetchMyMealPlans,
    saveMealPlan,
    fetchSystemDate,
    fetchAdminWeeklyMenu,
    saveAdminMenu,
} from "../services/menuService";

export const useMenuStore = create((set, get) => ({
    menus: {},
    loading: false,
    error: null,
    loadedMessId: null,
    plans: {},
    plansLoading: false,
    plansError: null,
    loadedPlansUserId: null,
    savingPlan: false,
    adminMenu: {},
    adminMenuLoading: false,
    adminMenuError: null,
    adminMenuLoaded: false,
    serverDate: "",
    lockDate: "",
    adminMenuSaving: false,

    fetchMenu: async (messId, token) => {
        if (!messId || !token) return;

        set({
            loading: true,
            error: null,
        });

        try {
            const data = await fetchWeeklyMenu(messId, token);

            set({
                menus: data,
                loading: false,
                error: null,
                loadedMessId: messId,
            });
        } catch (err) {
            set({
                loading: false,
                error: err.message,
            });
        }
    },

    fetchPlans: async (userId, token) => {
        if (!userId || !token) return;

        if (get().loadedPlansUserId === userId) return;

        set({
            plansLoading: true,
            plansError: null,
        });

        try {
            const plans = await fetchMyMealPlans(userId, token);

            set({
                plans,
                plansLoading: false,
                plansError: null,
                loadedPlansUserId: userId,
            });
        } catch (err) {
            set({
                plansLoading: false,
                plansError: err.message,
            });
        }
    },

    updatePlan: async ({ userId, token, date, meal, status }) => {
        if (!userId || !token) return;

        const key = `${date}-${meal}`;
        const previousStatus = get().plans[key];

        set((state) => ({
            plans: {
                ...state.plans,
                [key]: status,
            },
            savingPlan: true,
            plansError: null,
        }));

        try {
            await saveMealPlan({
                userId,
                token,
                date,
                meal,
                status,
            });

            set({
                savingPlan: false,
            });
        } catch (err) {
            set((state) => {
                const plans = { ...state.plans };

                if (previousStatus === undefined) {
                    delete plans[key];
                } else {
                    plans[key] = previousStatus;
                }

                return {
                    plans,
                    savingPlan: false,
                    plansError: err.message,
                };
            });
        }
    },

    fetchAdminMenu: async (token) => {
        if (!token) return;

        const {
            adminMenuLoaded,
            adminMenuLoading,
        } = get();

        if (adminMenuLoaded || adminMenuLoading) return;

        set({
            adminMenuLoading: true,
            adminMenuError: null,
        });

        try {
            const [dateData, weeklyMenu] = await Promise.all([
                fetchSystemDate(),
                fetchAdminWeeklyMenu(token),
            ]);

            const formattedMenu = {};

            Object.entries(weeklyMenu).forEach(([day, data]) => {
                formattedMenu[day] = {
                    breakfast: data?.breakfast || "",
                    lunch: data?.lunch || "",
                    dinner: data?.dinner || "",
                };
            });

            set({
                serverDate: dateData.today,
                lockDate: dateData.lockDate,
                adminMenu: formattedMenu,
                adminMenuLoading: false,
                adminMenuLoaded: true,
            });
        } catch (err) {
            set({
                adminMenuLoading: false,
                adminMenuError: err.message,
            });
        }
    },

    updateAdminMenu: (day, meal, value) => {
        set((state) => ({
            adminMenu: {
                ...state.adminMenu,
                [day]: {
                    ...state.adminMenu[day],
                    [meal]: value,
                },
            },
        }));
    },

    saveAdminMenu: async (token, dates) => {
        if (!token) return;

        try {
            set({
                adminMenuSaving: true,
                adminMenuError: null,
            });

            const menus = dates
                .map((item) => {
                    const dayMenu = get().adminMenu[item.day];

                    if (!dayMenu) return null;

                    return {
                        day: item.day,
                        breakfast: dayMenu.breakfast || "",
                        lunch: dayMenu.lunch || "",
                        dinner: dayMenu.dinner || "",
                    };
                })
                .filter(Boolean);

            const updatedMenu = await saveAdminMenu(token, menus);

            const formattedMenu = {};

            Object.entries(updatedMenu).forEach(([day, data]) => {
                formattedMenu[day] = {
                    breakfast: data?.breakfast || "",
                    lunch: data?.lunch || "",
                    dinner: data?.dinner || "",
                };
            });

            set({
                adminMenu: formattedMenu,
                adminMenuSaving: false,
                adminMenuLoaded: true,
            });
        } catch (err) {
            set({
                adminMenuSaving: false,
                adminMenuError: err.message,
            });

            throw err;
        }
    },

    clearMenu: () =>
        set({
            menus: {},
            loading: false,
            error: null,
            loadedMessId: null,
            plans: {},
            plansLoading: false,
            plansError: null,
            loadedPlansUserId: null,
            savingPlan: false,
            adminMenu: {},
            adminMenuLoading: false,
            adminMenuError: null,
            adminMenuLoaded: false,
            serverDate: "",
            lockDate: "",
            adminMenuSaving: false,
        }),
}));